// src/components/tasks/TaskCard.tsx
import React from 'react';
import { format, isPast, isToday, isTomorrow, differenceInDays } from 'date-fns';
import { CheckCircle, Clock, Edit, Trash2, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { Task } from '../../types';
import Card from '../ui/Card';
import useTaskStore from '../../store/useTaskStore';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { toggleTaskCompletion, deleteTask, categories } = useTaskStore();

  // Add this function right after the handleToggleCompletion function (around line 40)
const handleDeleteTask = async (id: string) => {
  try {
    console.log(`Sending DELETE request to http://localhost:3000/acadtasks/${id}`);
    const response = await fetch(`http://localhost:3000/acadtasks/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
    
    console.log('Task deleted from database');
    
    // Update local state after server update
    deleteTask(id);
  } catch (error) {
    console.error('Error deleting task:', error);
    // Still update local state even if server request fails
    deleteTask(id);
  }
};

  // Add this function to handle toggling completion with server update
  const handleToggleCompletion = async (id: string) => {
    try {
      console.log(`Sending PATCH request to http://localhost:3000/acadtasks/${id}/toggle`);
      const response = await fetch(`http://localhost:3000/acadtasks/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      
      console.log('Task completion toggled in database');
      
      // Update local state after server update
      toggleTaskCompletion(id);
    } catch (error) {
      console.error('Error toggling task completion:', error);
      // Still update local state even if server request fails
      toggleTaskCompletion(id);
    }
  };

  // Priority color mapping
  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    medium: 'bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-200',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  // Format deadline display
  const formatDeadline = (date: Date) => {
    const deadlineDate = new Date(date);
    if (isToday(deadlineDate)) return 'Today';
    if (isTomorrow(deadlineDate)) return 'Tomorrow';
    
    const daysUntil = differenceInDays(deadlineDate, new Date());
    if (daysUntil > 0 && daysUntil < 7) return `In ${daysUntil} days`;
    
    return format(deadlineDate, 'MMM d, yyyy');
  };

  const deadlineDate = new Date(task.deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Only show as overdue if the deadline is before today (not including today)
  const isOverdue = deadlineDate < today && !task.completed;
  
  // Find the subject name from categories
  const getSubjectName = () => {
    const category = categories.find(cat => cat.id === task.subject);
    return category ? category.name : 'Unknown Subject';
  };

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg dark:border dark:border-gray-700">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleToggleCompletion(task.id)}
              className="transition-colors focus:outline-none"
            >
              <CheckCircle
                size={22}
                className={task.completed 
                  ? 'text-green-500 hover:text-green-600' 
                  : 'text-gray-300 dark:text-gray-600 hover:text-primary-500 dark:hover:text-primary-400'}
              />
            </motion.button>
            <div>
              <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                {task.title}
              </h3>
              <div className="mt-1 mb-1">
                <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                  <BookOpen size={12} className="mr-1" />
                  {getSubjectName()}
                </span>
              </div>
              {task.description && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  {task.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(task)}
              className="text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400"
            >
              <Edit size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleDeleteTask(task.id)}
              className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
            >
              <Trash2 size={18} />
            </motion.button>

          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
            <span className={`inline-flex items-center text-xs font-medium ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
              <Clock size={14} className="mr-1" />
              {formatDeadline(task.deadline)}
              {isOverdue && ' (Overdue)'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
