import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, ClipboardList, Filter, Plus } from 'lucide-react';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import Card from '../components/ui/Card';
import Card2 from '../components/ui/Card2';
import StudyTipPopup from '../components/ui/StudyTipPopup';
import NotificationModal from "../components/ui/NotificationModal";
import { useLocation } from 'react-router-dom';
import useToast from '../store/useToast';
import useTaskStore from '../store/useTaskStore';
import useAuthStore from '../store/useAuthStore';
import { Task } from '../types';
import WeatherWidget from '../components/widgets/WeatherWidget';
import SpotifyWidget from '../components/widgets/SpotifyWidget';
import ClockWidget from '../components/widgets/ClockWidget';
import { Button } from "@heroui/react";
import { Select, SelectItem } from "@heroui/select";

const HomePage: React.FC = () => {
  const { user } = useAuthStore();
  const { tasks, categories, getUpcomingTasks } = useTaskStore();

  const location = useLocation();
  const { showToast } = useToast();

  useEffect(() => {
    if (location.state?.showToast && location.state?.toastMessage) {
      showToast(location.state.toastMessage, "success");
      window.history.replaceState({}, document.title);
    }
  }, [location.state, showToast]);

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming' | 'completed' | 'overdue'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Task['priority'] | 'all'>('all');
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"add" | "edit" | "delete">("add");

  const showModal = (message: string, type: "add" | "edit" | "delete") => {
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);

    setTimeout(() => setModalVisible(false), 3000); // Hide after 3 seconds
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    if (!user) return;

    let result = tasks.filter((task) => task.userId === user.id);

    if (filter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      result = result.filter((task) => {
        const taskDate = new Date(task.deadline);
        return (
          taskDate.getDate() === today.getDate() &&
          taskDate.getMonth() === today.getMonth() &&
          taskDate.getFullYear() === today.getFullYear()
        );
      });
    } else if (filter === 'upcoming') {
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today
      result = result.filter(
        (task) => !task.completed && new Date(task.deadline) > today
      );
    } else if (filter === 'overdue') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      result = result.filter((task) => !task.completed && new Date(task.deadline) < today);
    } else if (filter === 'completed') {
      result = result.filter((task) => task.completed);
    }

    if (priorityFilter !== 'all') {
      result = result.filter((task) => task.priority === priorityFilter);
    }

    result.sort(
      (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    );

    setFilteredTasks(result);
  }, [tasks, filter, priorityFilter, user, getUpcomingTasks]);

  const handleAddTask = () => {
    setIsAddingTask(true);
    showNotification("Let's add something productive!");
  };

  const incompleteTasks = filteredTasks.filter((task) => !task.completed);
  const completedTasks = filteredTasks.filter((task) => task.completed);

  return (

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
      <div className="flex flex-col justify-center lg:flex-row gap-6">

        <StudyTipPopup />

        <NotificationModal
          message={modalMessage}
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          type={modalType}
        />

        <div className="p-6 flex-1">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}'s Tasks</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Track and manage your academic assignments
              </p>
            </div>

            <div className="mt-4 md:mt-0">
              <div className="flex gap-2">
                <Button
                  onClick={handleAddTask}
                  className="bg-gradient-to-tr from-circle1 to-circle2 text-white shadow-lg text-sm font-medium flex items-center gap-2"
                  radius="full"
                  size="sm"
                >
                  <Plus size={18} className="inline-block" />
                  Add New Task
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center">
              <Filter size={18} className="text-gray-500 dark:text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {(['all', 'today', 'upcoming', 'overdue', 'completed'] as const).map((option) => (
                <Button
                  key={option}
                  onClick={() => setFilter(option)}
                  variant="light"
                  size="sm"
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === option
                    ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                    : 'bg-gray-100 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-blue-400 hover:text-blue-600'
                    }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Button>
              ))}
            </div>

            <div className="flex items-center ml-0 sm:ml-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Priority:</span>
              <Select
                selectedKeys={[priorityFilter]}
                onSelectionChange={(keys) => {
                  const key = Array.from(keys)[0] as string;
                  setPriorityFilter(key as Task['priority'] | 'all');
                }}
                className="text-sm min-w-[110px]"
                aria-label="Priority Filter"
                variant="flat"
                size="sm"
                radius="full"
              >
                <SelectItem key="all">All</SelectItem>
                <SelectItem key="low">Low</SelectItem>
                <SelectItem key="medium">Medium</SelectItem>
                <SelectItem key="high">High</SelectItem>
              </Select>
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
                    onSubmit={() => {
                      showModal("Task added successfully!", "add");
                      setIsAddingTask(false);
                    }}
                    onCancel={() => setIsAddingTask(false)}
                    showNotification={showNotification}
                  />

                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {filter !== 'completed' && (
            <TaskList
              title="Incomplete Tasks"
              tasks={incompleteTasks}
              emptyMessage="No incomplete tasks. You're crushing it!"
              onShowModal={showModal}
            />
          )}

          {filter !== 'upcoming' && filter !== 'overdue' && (
            <TaskList
              title="Completed Tasks"
              tasks={completedTasks}
              emptyMessage="No completed tasks yet. Keep going, you're almost there!"
              onShowModal={showModal}
            />
          )}
        </div>

        <div className="lg:w-[25%] flex flex-col gap-4">
          <Card2 className="flex flex-col">
            <div className="flex-1 flex items-center justify-center ">
              <SpotifyWidget />
            </div>
          </Card2>

          <Card2 className="flex flex-col">
            <div className="flex-1 flex items-center justify-center ">
              <ClockWidget />
            </div>
          </Card2>

          <div className="flex flex-col">
            <div className="flex-1 flex items-center justify-center ">
              <WeatherWidget />
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default HomePage;