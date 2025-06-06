import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Category } from '../types';
import { format } from 'date-fns';

interface TaskState {
  tasks: Task[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: (userId: string) => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, taskData: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => Category;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getTasksByCategory: (categoryId: string) => Task[];
  getTasksByPriority: (priority: Task['priority']) => Task[];
  getUpcomingTasks: (days: number) => Task[];
}

// Helper functions
const generateId = () => Math.random().toString(36).substring(2, 15);

const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      categories: [],
      isLoading: false,
      error: null,
      
      fetchTasks: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          console.log('Fetching tasks for user:', userId);
          const response = await fetch(`http://localhost:3000/acadtasks/user/${userId}`);
          
          if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
          }
          
          const tasks = await response.json();
          console.log('Tasks fetched:', tasks);
          set({ tasks, isLoading: false });
        } catch (error) {
          console.error('Error fetching tasks:', error);
          set({ error: 'Failed to fetch tasks', isLoading: false });
        }
      },
      
      addTask: (taskData) => {
        const newTask: Task = {
          id: generateId(),
          ...taskData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));
      },
      
      updateTask: (id, taskData) => {
        set((state) => ({
          tasks: state.tasks.map((task) => 
            task.id === id 
              ? { ...task, ...taskData, updatedAt: new Date() } 
              : task
          ),
        }));
      },
      
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },
      
      toggleTaskCompletion: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, completed: !task.completed, updatedAt: new Date() }
              : task
          ),
        }));
      },
      
      addCategory: (categoryData) => {
        const newCategory: Category = {
          id: generateId(),
          ...categoryData,
        };
        
        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
        
        return newCategory;
      },
      
      updateCategory: (id, data) => {
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id ? { ...category, ...data } : category
          ),
        }));
      },
      
      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
        }));
      },
      
      getTasksByCategory: (categoryId) => {
        return get().tasks.filter((task) => task.subject === categoryId);
      },
      
      getTasksByPriority: (priority) => {
        return get().tasks.filter((task) => task.priority === priority);
      },
      
      getUpcomingTasks: (days) => {
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + days);
        
        return get().tasks.filter(
          (task) => !task.completed && new Date(task.deadline) <= futureDate
        );
      },
    }),
    {
      name: 'task-storage',
    }
  )
);

export default useTaskStore;
