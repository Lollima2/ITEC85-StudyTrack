import React from 'react';
import Logo from '../icons/StudyTrack_Logo.png';
import { Github, Twitter } from 'lucide-react'; // ✅ Make sure lucide-react is installed

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/',
    icon: <Github className="w-6 h-6" />,
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/',
    icon: <Twitter className="w-6 h-6" />,
  },
];

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-inner">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Logo and Brand */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="StudyTrack Logo" className="h-20 w-20 object-cover " />
            <span className="text-3xl font-bold bg-gradient-to-tr from-[#38BDF8] to-[#027BF9] bg-clip-text text-transparent">
              StudyTrack
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-left">
            Elevate your academic journey.
          </p>
        </div>

        {/* Follow Us Section */}
        <div className="flex flex-col items-center md:items-end justify-center gap-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
            Follow Us
          </h3>
          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors"
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 pb-4 text-center text-xs text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} StudyTrack. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
