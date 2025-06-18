import React, { useState } from 'react';
import { CalendarIcon, ListTodo } from 'lucide-react';
import { Task } from '../../types';
import { Button } from "@heroui/react";
import useTaskStore from '../../store/useTaskStore';
import useAuthStore from '../../store/useAuthStore';
import { Select, SelectItem } from "@heroui/select";


interface TaskFormProps {
  initialTask?: Task;
  onSubmit: () => void;
  onCancel: () => void;
  showNotification?: (message: string) => void; 
}

const TaskForm: React.FC<TaskFormProps> = ({ initialTask, onSubmit, onCancel }) => {
  const { user } = useAuthStore();
  const { addTask, updateTask, categories, addCategory } = useTaskStore();

  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [priority, setPriority] = useState<Task['priority']>(initialTask?.priority || 'medium');
  const [deadline, setDeadline] = useState(
    initialTask?.deadline
      ? new Date(initialTask.deadline).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  );
  const [subject, setSubject] = useState(initialTask?.subject || '');
  const [newSubject, setNewSubject] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showNewSubject, setShowNewSubject] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!deadline) {
      newErrors.deadline = 'Deadline is required';
    }

    if (!subject && !newSubject && !showNewSubject) {
      newErrors.subject = 'Subject is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fix the handleSubmit function to avoid reading response body twice
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !user) return;

    setIsSubmitting(true);

    let subjectId = subject;

    // If creating a new subject
    if (showNewSubject && newSubject) {
      const newSub = addCategory({
        userId: user.id,
        name: newSubject,
        color: getRandomColor(),
      });
      subjectId = newSub.id;
    }

    const taskData = {
      userId: user.id,
      title,
      description,
      priority,
      deadline: new Date(deadline).toISOString(), // Convert to ISO string for consistent format
      subject: subjectId,
      completed: initialTask?.completed || false,
    };

    try {
      console.log('Submitting task data:', taskData);

      // Create/update in database FIRST
      if (initialTask) {
        // Update in database
        console.log(`Sending PUT request to http://localhost:3000/acadtasks/${initialTask.id}`);
        const updateResponse = await fetch(`http://localhost:3000/acadtasks/${initialTask.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskData)
        });

        if (!updateResponse.ok) {
          const errorText = await updateResponse.text();
          throw new Error(`Server returned ${updateResponse.status}: ${errorText}`);
        }

        console.log('Task updated in database successfully');

        // Then update local state
        updateTask(initialTask.id, { ...taskData, deadline: new Date(taskData.deadline) });
      } else {
        // Add to database
        console.log('Sending POST request to http://localhost:3000/acadtasks');
        const createResponse = await fetch('http://localhost:3000/acadtasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskData)
        });

        if (!createResponse.ok) {
          const errorText = await createResponse.text();
          throw new Error(`Server returned ${createResponse.status}: ${errorText}`);
        }

        const responseData = await createResponse.json();
        console.log('Task added to database:', responseData);

        // Then add to local state
        addTask({
          ...taskData,
          deadline: new Date(taskData.deadline),
          // Cast to Task to include 'id'
          id: responseData.id || responseData._id
        } as Task);
      }

      onSubmit();
    } catch (error) {
      // Still proceed with local state changes even if database fails
      if (initialTask) {
        updateTask(initialTask.id, { ...taskData, deadline: new Date(taskData.deadline) });
      } else {
        addTask({ ...taskData, deadline: new Date(taskData.deadline) });
      }
      onSubmit();
      onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };



  // Generate a random color for new categories
  const getRandomColor = () => {
    const colors = [
      '#4F46E5', // indigo
      '#0D9488', // teal
      '#F59E0B', // amber
      '#10B981', // emerald
      '#8B5CF6', // violet
      '#EC4899', // pink
      '#EF4444', // red
      '#3B82F6', // blue
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 ">
      
      {/* Title */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Task Title</label>
        <div className="relative">
          <input
            type="text"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-4 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
          dark:bg-gray-800 dark:border-gray-700 dark:text-white
          ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
          />
          <ListTodo size={18} className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
        </div>
        {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optional)</label>
        <textarea
          placeholder="Add details about your task"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          rows={4}
        />
      </div>

      {/* Priority */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
        <div className="flex gap-4">
          {(['low', 'medium', 'high'] as const).map((p) => (
            <label
              key={p}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer border
            ${priority === p ? 'bg-primary-100 border-primary-500 text-primary-700 dark:bg-primary-500/20' : 'border-gray-300 dark:border-gray-600'}
            hover:border-primary-400`}
            >
              <input
                type="radio"
                name="priority"
                value={p}
                checked={priority === p}
                onChange={() => setPriority(p)}
                className="accent-primary-600 w-4 h-4"
              />
              <span className="text-sm capitalize dark:text-gray-200">{p}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Deadline */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Deadline</label>
        <div className="relative">
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border shadow-sm appearance-none
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
              text-sm transition-colors duration-200
              dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400
              ${errors.deadline ? 'border-red-500' : 'border-gray-300'}`}
          />
        </div>
        {errors.deadline && <p className="text-sm text-red-500 mt-1">{errors.deadline}</p>}
      </div>

      {!showNewSubject ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Subject
          </label>
          <div className="flex space-x-2">
            <Select
              selectedKeys={[subject]} // Wrap subject in an array
              onSelectionChange={(keys) => {
                const key = Array.from(keys)[0];
                setSubject(String(key));
              }}
              className="flex-1"
              placeholder="Select a subject"
              radius="sm"
            >
              {categories.map((cat) => (
                <SelectItem key={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </Select>

            <Button
              type="button"
              variant="bordered"
              onClick={() => setShowNewSubject(true)}
            >
              New
            </Button>
          </div>
          {errors.subject && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subject}</p>
          )}
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 pb-1">
            New Subject
          </label>
          <div className="flex space-x-2">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Enter subject name"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className={`w-full px-4 py-2 rounded-md border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
          dark:bg-gray-800 dark:border-gray-700 dark:text-white
          ${errors.newSubject ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.newSubject && (
                <p className="mt-1 text-sm text-red-500">{errors.newSubject}</p>
              )}
            </div>
            <Button
              type="button"
              variant="bordered"
              onClick={() => setShowNewSubject(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3 mt-6">
        <Button
          type="button"
          variant="bordered"
          onClick={onCancel}
          radius="full"
          className="mt-3"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-tr from-circle1 to-circle2 text-white shadow-lg mt-3 font-medium"
          radius="full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : initialTask ? 'Update Task' : 'Create Task'}
          
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
