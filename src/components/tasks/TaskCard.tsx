import React from 'react';
import { format, isToday, isTomorrow, differenceInDays } from 'date-fns';
import { CheckCircle, Clock, Edit, Trash2, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { Task } from '../../types';
import Card from '../ui/Card';
import useTaskStore from '../../store/useTaskStore';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onShowModal?: (message: string, type: 'add' | 'edit' | 'delete') => void;
}

const priorityColors = {
  low: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  high: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onShowModal }) => {
  const { toggleTaskCompletion, deleteTask, categories } = useTaskStore();

  const handleDeleteTask = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/acadtasks/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      deleteTask(id);
      onShowModal?.('Task deleted successfully!', 'delete');
    } catch {
      deleteTask(id);
      onShowModal?.('Task deleted!', 'delete');
    }
  };

  const handleToggleCompletion = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/acadtasks/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      toggleTaskCompletion(id);
    } catch {
      toggleTaskCompletion(id);
    }
  };

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
  const isOverdue = deadlineDate < today && !task.completed;

  const getSubjectName = () => {
    const category = categories.find(cat => cat.id === task.subject);
    return category ? category.name : 'Unknown Subject';
  };

  return (
    <Card className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-200">
      <div className="p-6 flex flex-col gap-4">
        {/* Header: Checkbox, Title, Actions */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => handleToggleCompletion(task.id)}
              className="mt-1"
              aria-label="Toggle completion"
            >
              <CheckCircle
                size={28}
                className={`transition-colors drop-shadow-sm ${task.completed
                  ? 'text-green-500'
                  : 'text-gray-300 dark:text-gray-600 hover:text-primary-500 dark:hover:text-primary-400'
                }`}
              />
            </motion.button>
            <div>
              <h3 className={`text-xl font-bold tracking-tight ${task.completed
                ? 'line-through text-gray-400 dark:text-gray-500'
                : 'text-gray-900 dark:text-white'
              }`}>
                {task.title}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  <BookOpen size={13} className="mr-1" />
                  {getSubjectName()}
                </span>
                {task.description && (
                  <span className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">
                    {task.description}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-1.5">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => onEdit(task)}
              className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition"
              aria-label="Edit"
            >
              <Edit size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => handleDeleteTask(task.id)}
              className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition"
              aria-label="Delete"
            >
              <Trash2 size={18} />
            </motion.button>
          </div>
        </div>
        {/* Footer: Priority & Deadline */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-800">
          <span
            className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold tracking-wide ${priorityColors[task.priority]}`}
          >
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
          <span
            className={`inline-flex items-center text-xs font-medium gap-1 ${isOverdue
              ? 'text-red-600 dark:text-red-400'
              : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <Clock size={15} />
            {formatDeadline(task.deadline)}
            {isOverdue && <span className="ml-1 font-semibold">(Overdue)</span>}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
