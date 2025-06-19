import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, ClipboardList, Filter, Plus } from 'lucide-react';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Card2 from '../components/ui/Card2';
import StudyTipPopup from '../components/ui/StudyTipPopup';
import useTaskStore from '../store/useTaskStore';
import useAuthStore from '../store/useAuthStore';
import { Task } from '../types';

import NotificationModal from "../components/ui/NotificationModal";
import { useLocation } from 'react-router-dom';
import useToast from '../store/useToast';
import WeatherWidget from '../components/widgets/WeatherWidget';
import SpotifyWidget from '../components/widgets/SpotifyWidget';
import ClockWidget from '../components/widgets/ClockWidget';


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
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"add" | "edit" | "delete">("add");

  const showModal = (message: string, type: "add" | "edit" | "delete") => {
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);

    setTimeout(() => setModalVisible(false), 3000); // Hide after 3 seconds
  };

  useEffect(() => {
    if (!user) return;

    let result = tasks.filter((task) => task.userId === user.id);

    // Apply filter
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
      today.setHours(0, 0, 0, 0);

      const overdueTasks = result.filter(
        (task) => !task.completed && new Date(task.deadline) < today
      );

      const upcomingTasks = getUpcomingTasks(7).filter(
        (task) => task.userId === user.id && new Date(task.deadline) >= today
      );

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

    // Sort by deadline
    result.sort(
      (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    );

    setFilteredTasks(result);
  }, [tasks, filter, priorityFilter, user, getUpcomingTasks]);

  const handleAddTask = () => setIsAddingTask(true);

  const incompleteTasks = filteredTasks.filter((task) => !task.completed);
  const completedTasks = filteredTasks.filter((task) => task.completed);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
      <div className="flex flex-col justify-center lg:flex-row gap-6">

        <StudyTipPopup />

        {/* Left Column: Task Container */}
        <div className="p-6 flex-1">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Tasks</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Track and manage your academic assignments
              </p>
            </div>

            <div className="mt-4 md:mt-0">
              <Button onClick={handleAddTask} icon={<Plus size={18} />}>
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
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${filter === option
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


        {/* Right Column:*/}
        <div className="lg:w-[25%] flex flex-col gap-4">
          {/* Spotify Container */}
          <Card2 className="flex flex-col">
            <div className="flex-1 flex items-center justify-center ">
              <SpotifyWidget />
            </div>
          </Card2>

          {/* Clock Container */}
          <Card2 className="flex flex-col">
            <div className="flex-1 flex items-center justify-center ">
              <ClockWidget />
            </div>
          </Card2>


          {/* Weather Container */}
          <div className="flex flex-col">
            <div className="flex-1 flex items-center justify-center ">
              <WeatherWidget />
            </div>
          </div>
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
          onShowModal={showModal}
        />
      )}

      {filter !== 'upcoming' && filter !== 'overdue' && (
        <TaskList
          title="Completed Tasks"
          tasks={completedTasks}
          emptyMessage="You haven't completed any tasks yet."
          onShowModal={showModal}
        />
      )}

      <NotificationModal
        message={modalMessage}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        type={modalType}
      />

    </div>
  );


};

export default HomePage;
