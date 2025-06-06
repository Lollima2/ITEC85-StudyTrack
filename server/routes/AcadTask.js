// server/routes/AcadTasks.js
const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// Initialize AcadTasks collection
router.use(async (req, res, next) => {
  try {
    const db = req.db;
    console.log('Database connection for AcadTasks:', db ? 'Available' : 'Not available');
    
    if (!db) {
      console.log('No database connection available');
      return next();
    }
    
    // Check if AcadTasks collection exists
    const collections = await db.listCollections({ name: 'AcadTasks' }).toArray();
    console.log('Collection check result:', collections.length ? 'Collection exists' : 'Collection does not exist');
    
    if (collections.length === 0) {
      console.log('Creating AcadTasks collection...');
      await db.createCollection('AcadTasks');
      console.log('AcadTasks collection created successfully');
    }
    next();
  } catch (err) {
    console.error('Error initializing AcadTasks collection:', err.message);
    next();
  }
});

// Get all academic tasks
router.get('/', async (req, res) => {
  try {
    const db = req.db;
    console.log('GET request received for all tasks');
    
    const acadTasksCollection = db.collection('AcadTasks');
    const tasks = await acadTasksCollection.find({}).toArray();
    
    // Transform MongoDB _id to id for frontend compatibility
    const transformedTasks = tasks.map(task => ({
      id: task._id.toString(),
      userId: task.userId,
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      deadline: task.deadline,
      subject: task.subject,
      completed: task.completed || false,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    }));
    
    console.log(`Retrieved ${tasks.length} academic tasks`);
    res.json(transformedTasks);
  } catch (err) {
    console.error('Error fetching academic tasks:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get tasks by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const db = req.db;
    console.log(`GET request received for user tasks: ${req.params.userId}`);
    
    const acadTasksCollection = db.collection('AcadTasks');
    const tasks = await acadTasksCollection.find({ userId: req.params.userId }).toArray();
    
    // Transform MongoDB _id to id for frontend compatibility
    const transformedTasks = tasks.map(task => ({
      id: task._id.toString(),
      userId: task.userId,
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      deadline: task.deadline,
      subject: task.subject,
      completed: task.completed || false,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    }));
    
    console.log(`Retrieved ${tasks.length} academic tasks for user ${req.params.userId}`);
    res.json(transformedTasks);
  } catch (err) {
    console.error('Error fetching user academic tasks:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new academic task
router.post('/', async (req, res) => {
  console.log('POST request received to create a new task');
  console.log('Request body:', req.body);
  
  const { userId, title, description, priority, deadline, subject, completed } = req.body;
  
  // Validate input
  if (!userId || !title) {
    console.log('Validation failed: Missing userId or title');
    return res.status(400).json({ message: 'User ID and title are required' });
  }
  
  try {
    const db = req.db;
    
    const acadTasksCollection = db.collection('AcadTasks');
    
    // Create new academic task
    const newTask = {
      userId,
      title,
      description: description || '',
      priority: priority || 'medium',
      deadline: deadline ? new Date(deadline) : new Date(),
      subject: subject || '',
      completed: completed || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('Creating new task:', newTask);
    const result = await acadTasksCollection.insertOne(newTask);
    console.log(`Task added to database: ${title} (ID: ${result.insertedId})`);
    
    res.status(201).json({
      id: result.insertedId.toString(),
      ...newTask,
      deadline: newTask.deadline,
      createdAt: newTask.createdAt,
      updatedAt: newTask.updatedAt
    });
  } catch (err) {
    console.error('Error creating academic task:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an academic task
router.put('/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    console.log(`PUT request received to update task: ${taskId}`);
    console.log('Update data:', req.body);
    
    const db = req.db;
    const acadTasksCollection = db.collection('AcadTasks');
    
    // Convert string ID to ObjectId
    let id;
    try {
      id = new ObjectId(taskId);
    } catch (err) {
      console.log('Invalid task ID format:', taskId);
      return res.status(400).json({ message: 'Invalid task ID format' });
    }
    
    // Get original task for logging
    const originalTask = await acadTasksCollection.findOne({ _id: id });
    if (!originalTask) {
      console.log('Task not found:', taskId);
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Prepare update data
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };
    
    // If deadline is provided, convert it to Date object
    if (updateData.deadline) {
      updateData.deadline = new Date(updateData.deadline);
    }
    
    // Update task in database
    const result = await acadTasksCollection.updateOne(
      { _id: id },
      { $set: updateData }
    );
    
    console.log(`Task updated in database: ${originalTask.title} → ${updateData.title || originalTask.title} (ID: ${taskId})`);
    
    res.status(200).json({ 
      message: 'Task updated successfully',
      id: taskId
    });
  } catch (err) {
    console.error('Error updating academic task:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an academic task
router.delete('/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    console.log(`DELETE request received for task: ${taskId}`);
    
    const db = req.db;
    const acadTasksCollection = db.collection('AcadTasks');
    
    // Convert string ID to ObjectId
    let id;
    try {
      id = new ObjectId(taskId);
    } catch (err) {
      console.log('Invalid task ID format:', taskId);
      return res.status(400).json({ message: 'Invalid task ID format' });
    }
    
    // Get task details for logging before deletion
    const taskToDelete = await acadTasksCollection.findOne({ _id: id });
    if (!taskToDelete) {
      console.log('Task not found:', taskId);
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Delete task from database
    const result = await acadTasksCollection.deleteOne({ _id: id });
    
    console.log(`Task deleted from database: ${taskToDelete.title} (ID: ${taskId})`);
    
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting academic task:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle task completion
router.patch('/:id/toggle', async (req, res) => {
  try {
    const taskId = req.params.id;
    console.log(`PATCH request received to toggle completion for task: ${taskId}`);
    
    const db = req.db;
    const acadTasksCollection = db.collection('AcadTasks');
    
    // Convert string ID to ObjectId
    let id;
    try {
      id = new ObjectId(taskId);
    } catch (err) {
      console.log('Invalid task ID format:', taskId);
      return res.status(400).json({ message: 'Invalid task ID format' });
    }
    
    // Find the task first to get current completion status
    const task = await acadTasksCollection.findOne({ _id: id });
    
    if (!task) {
      console.log('Task not found:', taskId);
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Toggle completion status
    const newCompletionStatus = !task.completed;
    const result = await acadTasksCollection.updateOne(
      { _id: id },
      { $set: { 
        completed: newCompletionStatus,
        updatedAt: new Date()
      }}
    );
    
    console.log(`Task completion toggled: ${task.title} (ID: ${taskId}) - ${task.completed ? 'Completed' : 'Not completed'} → ${newCompletionStatus ? 'Completed' : 'Not completed'}`);
    
    res.status(200).json({ 
      message: 'Task completion toggled successfully',
      completed: newCompletionStatus
    });
  } catch (err) {
    console.error('Error toggling academic task completion:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Test route to verify server connection
router.get('/test', (req, res) => {
  console.log('Test route accessed');
  res.json({ message: 'AcadTasks route is working!' });
});

// In server/routes/AcadTask.js, update or add this route:

// Toggle task completion
router.patch('/:id/toggle', async (req, res) => {
  try {
    const taskId = req.params.id;
    console.log(`PATCH request received to toggle completion for task: ${taskId}`);
    
    const db = req.db;
    const acadTasksCollection = db.collection('AcadTasks');
    
    // Convert string ID to ObjectId
    let id;
    try {
      id = new ObjectId(taskId);
    } catch (err) {
      console.log('Invalid task ID format:', taskId);
      return res.status(400).json({ message: 'Invalid task ID format' });
    }
    
    // Find the task first to get current completion status
    const task = await acadTasksCollection.findOne({ _id: id });
    
    if (!task) {
      console.log('Task not found:', taskId);
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Toggle completion status
    const newCompletionStatus = !task.completed;
    const result = await acadTasksCollection.updateOne(
      { _id: id },
      { $set: { 
        completed: newCompletionStatus,
        updatedAt: new Date()
      }}
    );
    
    console.log(`Task completion toggled: ${task.title} (ID: ${taskId}) - ${task.completed ? 'Completed' : 'Not completed'} → ${newCompletionStatus ? 'Completed' : 'Not completed'}`);
    
    res.status(200).json({ 
      message: 'Task completion toggled successfully',
      completed: newCompletionStatus
    });
  } catch (err) {
    console.error('Error toggling task completion:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Test route to create a sample task
router.get('/test-create', async (req, res) => {
  try {
    const db = req.db;
    console.log('Database connection for test:', db ? 'Available' : 'Not available');
    
    if (!db) {
      return res.status(503).json({ message: 'Database unavailable' });
    }
    
    const acadTasksCollection = db.collection('AcadTasks');
    
    const sampleTask = {
      userId: "test-user-123",
      title: "Sample Task " + new Date().toISOString(),
      description: "This is a test task",
      priority: "medium",
      deadline: new Date(),
      subject: "Test Subject",
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('Creating sample task:', sampleTask);
    const result = await acadTasksCollection.insertOne(sampleTask);
    console.log('Sample task created with ID:', result.insertedId);
    
    res.status(201).json({
      message: "Sample task created successfully",
      taskId: result.insertedId,
      task: {
        id: result.insertedId,
        ...sampleTask
      }
    });
  } catch (err) {
    console.error('Error creating sample task:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
