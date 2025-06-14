import React from 'react';
import { BookOpen } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 shadow-inner">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#38BDF8] to-[#027BF9] flex items-center justify-center mr-2">
              <BookOpen size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-gray-800 dark:text-white">StudyTrack</span>
          </div>


          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">

            <div className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} StudyTrack. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;