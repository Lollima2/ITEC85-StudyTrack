import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  User as UserIcon, 
  Mail, 
  CheckCircle, 
  Clock, 
  Activity,
  AlertTriangle,
  Edit
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import useAuthStore from '../store/useAuthStore';
import useTaskStore from '../store/useTaskStore';

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  const { tasks } = useTaskStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [isLoading, setIsLoading] = useState(false);
  
  if (!user) return null;
  
  // Calculate task statistics
  const userTasks = tasks.filter(task => task.userId === user.id);
  const completedTasks = userTasks.filter(task => task.completed);
  const completionRate = userTasks.length > 0 
    ? Math.round((completedTasks.length / userTasks.length) * 100) 
    : 0;
  
  // Count overdue tasks
  const overdueTasks = userTasks.filter(task => 
    !task.completed && new Date(task.deadline) < new Date()
  );
  
  // Priority distribution
  const highPriorityTasks = userTasks.filter(task => task.priority === 'high');
  const mediumPriorityTasks = userTasks.filter(task => task.priority === 'medium');
  const lowPriorityTasks = userTasks.filter(task => task.priority === 'low');
  
  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Update in MongoDB Atlas
      await axios.post('http://localhost:3000/auth/update-profile', {
        userId: user.id,
        name: name
      });
      
      // Update local state
      updateProfile({ name });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile card */}
        <div className="md:w-1/3">
          <Card className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile</h2>
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Edit size={16} />}
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              )}
            </div>
            
            {isEditing ? (
              <div className="space-y-4">
                <Input
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon={<UserIcon size={18} className="text-gray-400" />}
                  fullWidth
                />
                
                <div className="flex items-center space-x-3 py-2">
                  <Mail size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditing(false);
                      setName(user.name);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300">
                    <UserIcon size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{user.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Account created on {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
        
        {/* Statistics */}
        <div className="md:w-2/3 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Task Statistics</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
                  <CheckCircle size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed Tasks</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{completedTasks.length}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300">
                  <Activity size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completion Rate</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{completionRate}%</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300">
                  <Clock size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Tasks</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {userTasks.length - completedTasks.length}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300">
                  <AlertTriangle size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Overdue Tasks</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{overdueTasks.length}</p>
                </div>
              </div>
            </Card>
          </div>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Priority Distribution</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-red-600 dark:text-red-400">High Priority</span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {highPriorityTasks.length} tasks
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(highPriorityTasks.length / Math.max(userTasks.length, 1)) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-red-500 h-2 rounded-full"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-amber-600 dark:text-amber-400">Medium Priority</span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {mediumPriorityTasks.length} tasks
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(mediumPriorityTasks.length / Math.max(userTasks.length, 1)) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-amber-500 h-2 rounded-full"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-green-600 dark:text-green-400">Low Priority</span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {lowPriorityTasks.length} tasks
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(lowPriorityTasks.length / Math.max(userTasks.length, 1)) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-green-500 h-2 rounded-full"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;