import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Task } from '../../types';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';

interface TaskListProps {
  title: string;
  tasks: Task[];
  emptyMessage?: string;
}

const TaskList: React.FC<TaskListProps> = ({ 
  title, 
  tasks, 
  emptyMessage = 'No tasks to display' 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };
  
  const handleCancelEdit = () => {
    setEditingTask(null);
  };
  
  const handleSubmitEdit = () => {
    setEditingTask(null);
  };
  
  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
          <span className="ml-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs font-medium">
            {tasks.length}
          </span>
        </div>
        
        <div className="flex space-x-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleToggleCollapse}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
          >
            {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </motion.button>
          
          <Button
            size="sm"
            icon={<Plus size={16} />}
            onClick={() => setIsAddingTask(true)}
          >
            Add Task
          </Button>
        </div>
      </div>
      
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isAddingTask && (
              <Card className="mb-4 p-4">
                <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">Add New Task</h3>
                <TaskForm 
                  onSubmit={() => setIsAddingTask(false)}
                  onCancel={() => setIsAddingTask(false)}
                />
              </Card>
            )}
            
            {editingTask && (
              <Card className="mb-4 p-4">
                <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">Edit Task</h3>
                <TaskForm 
                  initialTask={editingTask}
                  onSubmit={handleSubmitEdit}
                  onCancel={handleCancelEdit}
                />
              </Card>
            )}
            
            <div className="space-y-3">
              <AnimatePresence>
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TaskCard task={task} onEdit={handleEditTask} />
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 text-gray-500 dark:text-gray-400"
                  >
                    {emptyMessage}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;