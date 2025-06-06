import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, ClipboardList, Filter, Plus } from 'lucide-react';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import useTaskStore from '../store/useTaskStore';
import useAuthStore from '../store/useAuthStore';
import { Task } from '../types';

const HomePage: React.FC = () => {
  const { user } = useAuthStore();
  const { tasks, categories, getUpcomingTasks } = useTaskStore();
  
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming' | 'completed' | 'overdue'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Task['priority'] | 'all'>('all');
  
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  
  useEffect(() => {
    if (!user) return;
    
    let result = tasks.filter((task) => task.userId === user.id);
    
    // Apply filter
    if (filter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      result = result.filter(
        (task) => {
          const taskDate = new Date(task.deadline);
          return taskDate.getDate() === today.getDate() && 
                 taskDate.getMonth() === today.getMonth() && 
                 taskDate.getFullYear() === today.getFullYear();
        }
      );
    } else if (filter === 'upcoming') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Get incomplete tasks dated before today (overdue tasks)
      const overdueTasks = result.filter(task => 
        !task.completed && new Date(task.deadline) < today
      );
      
      // Get upcoming tasks for the next 7 days
      const upcomingTasks = getUpcomingTasks(7).filter(task => 
        task.userId === user.id && new Date(task.deadline) >= today
      );
      
      // Combine overdue and upcoming tasks
      result = [...overdueTasks, ...upcomingTasks];
    } else if (filter === 'overdue') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      result = result.filter((task) => !task.completed && new Date(task.deadline) < today);
    } else if (filter === 'completed') {
      result = result.filter((task) => task.completed);
    }
    
    // Apply priority filter
    if (priorityFilter !== 'all') {
      result = result.filter((task) => task.priority === priorityFilter);
    }
    
    // Sort by deadline (closest first)
    result.sort((a, b) => 
      new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    );
    
    setFilteredTasks(result);
  }, [tasks, filter, priorityFilter, user, getUpcomingTasks]);
  
  const handleAddTask = () => {
    setIsAddingTask(true);
  };
  
  const incompleteTasks = filteredTasks.filter((task) => !task.completed);
  const completedTasks = filteredTasks.filter((task) => task.completed);
  
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Tasks</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Track and manage your academic assignments
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button
            onClick={handleAddTask}
            icon={<Plus size={18} />}
          >
            Add New Task
          </Button>
        </div>
      </div>
      
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center">
          <Filter size={18} className="text-gray-500 dark:text-gray-400 mr-2" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {(['all', 'today', 'upcoming', 'overdue', 'completed'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === option
                  ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="flex items-center ml-0 sm:ml-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as Task['priority'] | 'all')}
            className="text-sm rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
      
      <AnimatePresence>
        {isAddingTask && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Create New Task</h2>
              <TaskForm
                onSubmit={() => setIsAddingTask(false)}
                onCancel={() => setIsAddingTask(false)}
              />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      {filter !== 'completed' && (
        <TaskList
          title="Incomplete Tasks"
          tasks={incompleteTasks}
          emptyMessage="No incomplete tasks. Great job!"
        />
      )}
      
      {filter !== 'upcoming' && filter !== 'overdue' && (
        <TaskList
          title="Completed Tasks"
          tasks={completedTasks}
          emptyMessage="You haven't completed any tasks yet."
        />
      )}
    </div>
  );
};

export default HomePage;