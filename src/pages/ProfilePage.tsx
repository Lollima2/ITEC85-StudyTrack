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
import Button1 from '../components/ui/Button1';
import { Button } from "@heroui/react";
import Input from '../components/ui/Input';
import useAuthStore from '../store/useAuthStore';
import useTaskStore from '../store/useTaskStore';

const colorMap = {
  green: {
    bg: 'bg-green-100 dark:bg-green-700/60',
    icon: 'text-green-600 dark:text-green-200',
    bar: 'bg-green-500'
  },
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-700/60',
    icon: 'text-blue-600 dark:text-blue-200',
    bar: 'bg-blue-500'
  },
  amber: {
    bg: 'bg-amber-100 dark:bg-yellow-700/60',
    icon: 'text-amber-600 dark:text-yellow-200',
    bar: 'bg-amber-500'
  },
  red: {
    bg: 'bg-red-100 dark:bg-red-700/60',
    icon: 'text-red-600 dark:text-red-200',
    bar: 'bg-red-500'
  }
};

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  const { tasks } = useTaskStore();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [isLoading, setIsLoading] = useState(false);

  if (!user) return null;

  const userTasks = tasks.filter(task => task.userId === user.id);
  const completedTasks = userTasks.filter(task => task.completed);
  const completionRate = userTasks.length > 0
    ? Math.round((completedTasks.length / userTasks.length) * 100)
    : 0;
  const overdueTasks = userTasks.filter(task =>
    !task.completed && new Date(task.deadline) < new Date()
  );
  const highPriorityTasks = userTasks.filter(task => task.priority === 'high');
  const mediumPriorityTasks = userTasks.filter(task => task.priority === 'medium');
  const lowPriorityTasks = userTasks.filter(task => task.priority === 'low');

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      await axios.post('http://localhost:3000/auth/update-profile', {
        userId: user.id,
        name: name
      });

      updateProfile({ name });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-24 pb-16">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Profile Card */}
        <div className="md:w-1/3">
          <Card className="p-8 bg-white dark:bg-gray-900/90 backdrop-blur-md shadow-2xl border border-gray-200 dark:border-gray-800 rounded-3xl transition hover:scale-[1.01]">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-primary-500 to-purple-600 dark:from-primary-800 dark:to-purple-500 flex items-center justify-center text-white shadow-lg text-4xl">
                  <UserIcon size={40} />
                </div>
                {!isEditing && (
                  <Button1
                    variant="ghost"
                    className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 rounded-full shadow"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit size={18} />
                  </Button1>
                )}
              </div>
              <div className="mt-6 w-full">
                {isEditing ? (
                  <div className="space-y-4">
                    <Input
                      label="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      icon={<UserIcon size={18} className="text-gray-400" />}
                      fullWidth
                    />
                    <div className="flex items-center gap-2">
                      <Mail size={18} className="text-gray-400" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>

                    {/* Button Group */}
                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        type="button"
                        variant="bordered"
                        radius="full"
                        className="mt-1"
                        onPress={() => {
                          setIsEditing(false);
                          setName(user.name);
                        }}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onPress={handleSaveProfile}
                        className="bg-gradient-to-tr from-circle1 to-circle2 text-white shadow-lg font-medium mt-1"
                        radius="full"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Saving...' : 'Save'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user.email}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Joined on {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Overview and Priority Cards */}
        <div className="md:w-2/3 flex flex-col gap-10">
          {/* Task Overview */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Task Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[{
                title: 'Completed',
                count: completedTasks.length,
                icon: <CheckCircle size={32} />,
                color: 'green'
              },
              {
                title: 'Completion Rate',
                count: `${completionRate}%`,
                icon: <Activity size={32} />,
                color: 'blue'
              },
              {
                title: 'Active',
                count: userTasks.length - completedTasks.length,
                icon: <Clock size={32} />,
                color: 'amber'
              },
              {
                title: 'Overdue',
                count: overdueTasks.length,
                icon: <AlertTriangle size={32} />,
                color: 'red'
              }].map(({ title, count, icon, color }) => (
                <Card
                  key={title}
                  className={`p-6 flex items-center gap-4 ${colorMap[color as keyof typeof colorMap].bg} border-0 shadow-md dark:shadow-lg rounded-2xl hover:scale-[1.01] transition`}
                >
                  <div className={`p-4 rounded-full ${colorMap[color as keyof typeof colorMap].icon} bg-white/70 dark:bg-gray-900/80`}>
                    {icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{count}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Priority Distribution */}
          <Card className="p-8 bg-white dark:bg-gray-900/90 backdrop-blur border border-gray-200 dark:border-gray-800 rounded-3xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Priority Distribution</h3>
            <div className="space-y-5">
              {[{ label: 'High', count: highPriorityTasks.length, color: 'red' },
              { label: 'Medium', count: mediumPriorityTasks.length, color: 'amber' },
              { label: 'Low', count: lowPriorityTasks.length, color: 'green' }].map(({ label, count, color }) => (
                <div key={label}>
                  <div className="flex justify-between mb-1">
                    <span className={`text-sm font-medium ${colorMap[color as keyof typeof colorMap].icon}`}>
                      {label} Priority
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{count} task{count !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / Math.max(userTasks.length, 1)) * 100}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className={`h-full ${colorMap[color as keyof typeof colorMap].bar} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
