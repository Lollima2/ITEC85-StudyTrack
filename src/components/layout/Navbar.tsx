import React from 'react';
import { Button } from "@heroui/react";
import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link as HeroLink,

  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { BookOpen, Moon, Sun, User, LogOut } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useThemeStore from '../../store/useThemeStore';
import Logo from '../icons/StudyTrack_Logo.png';

export const StudyTrackLogo = () => (
  <div className="flex items-center gap-1">
    <span className="h-10 w-10 flex items-center justify-center ">
      <img src={Logo} alt="IskoTasks Logo" className="h-8 w-8 rounded-full object-cover" />
    </span>
    <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#38BDF8] to-[#027BF9]">
      IskoTasks
    </p>
  </div>
);

const hoverBox =
  'transition-colors rounded-lg px-2 py-1 text-gray-700 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-700';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleThemeToggle = () => {
    toggleTheme();
    const newTheme = useThemeStore.getState().theme;
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <HeroNavbar
      maxWidth="xl"
      className="fixed top-0 left-0 w-full z-[9999] bg-white shadow-xl dark:bg-gray-800 dark:border-b dark:border-gray-700"
    >
      <NavbarBrand>
        <RouterLink to="/">
          <StudyTrackLogo />
        </RouterLink>
      </NavbarBrand>


      <NavbarContent justify="end">
        {isAuthenticated && (
            <NavbarItem>
            <Button
              as={RouterLink}
              to="/"
              variant="light"
              size="sm"
              className={
              hoverBox +
              ' text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
              }
            >
              Tasks
            </Button>
            </NavbarItem>
        )}
        <NavbarItem>
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onClick={handleThemeToggle}
            className={
              'text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 ' +
              'hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
            }
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        </NavbarItem>

        {isAuthenticated ? (
          <NavbarItem>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  variant="light"
                  size="sm"
                  className={hoverBox + ' gap-2 font-medium'}
                >
                  <User size={18} />
                  {user?.name}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="User Menu">
                <DropdownItem
                  key="profile"
                  as={() => (
                    <RouterLink
                      to="/profile"
                      className={'flex items-center w-full h-full ' + hoverBox}
                    >
                      <User size={16} className="mr-2" />
                      Profile
                    </RouterLink>
                  )}
                />
                <DropdownItem
                  key="logout"
                  onClick={handleLogout}
                  startContent={<LogOut size={16} />}
                  className="text-danger"
                >
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        ) : (
          <>
            <NavbarItem className="hidden sm:flex">
              <HeroLink
                as={RouterLink}
                to="/login"
                className={hoverBox}
              >
                Login
              </HeroLink>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={RouterLink}
                to="/signup"
                className="bg-gradient-to-tr from-circle1 to-circle2 text-white shadow-lg text-sm font-medium"
                radius="full"
                size="sm"
              >
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </HeroNavbar>
  );
};

export default Navbar;
