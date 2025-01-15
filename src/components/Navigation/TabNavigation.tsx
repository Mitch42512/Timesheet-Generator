import React, { useState } from 'react';
import { Home, CalendarDays, ClipboardList, BarChart, Briefcase, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const [isCareerDropdownOpen, setIsCareerDropdownOpen] = useState(false);

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'accounts', label: 'Accounts', icon: ClipboardList },
    { id: 'timesheet', label: 'Timesheet', icon: CalendarDays },
    { id: 'statistics', label: 'Statistics', icon: BarChart },
  ];

  const careerDropdownItems = [
    { id: 'career-tracker', label: 'Career Tracker' },
    { id: 'traffic-light', label: 'Traffic Light' },
    { id: 'smart-goals', label: 'Smart Goals' },
    { id: 'resources', label: 'Resources' },
  ];

  return (
    <div className="bg-[#4F81BD] dark:bg-[#2C4B70] text-white">
      <div className="max-w-[1920px] mx-auto px-[10px] flex justify-between items-center">
        <nav className="flex space-x-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`
                flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors
                ${activeTab === id
                  ? 'bg-[#385D8A] dark:bg-[#1E3247]'
                  : 'hover:bg-[#385D8A] hover:bg-opacity-50 dark:hover:bg-[#1E3247] dark:hover:bg-opacity-50'}
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}

          {/* Career Dropdown */}
          <div className="relative">
            <button
              onMouseEnter={() => setIsCareerDropdownOpen(true)}
              onMouseLeave={() => setIsCareerDropdownOpen(false)}
              className={`
                flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors
                ${careerDropdownItems.some(item => activeTab === item.id)
                  ? 'bg-[#385D8A] dark:bg-[#1E3247]'
                  : 'hover:bg-[#385D8A] hover:bg-opacity-50 dark:hover:bg-[#1E3247] dark:hover:bg-opacity-50'}
              `}
            >
              <Briefcase className="w-4 h-4" />
              <span>Career</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {isCareerDropdownOpen && (
              <div
                onMouseEnter={() => setIsCareerDropdownOpen(true)}
                onMouseLeave={() => setIsCareerDropdownOpen(false)}
                className="absolute top-full left-0 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-b-lg overflow-hidden z-50"
              >
                {careerDropdownItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setIsCareerDropdownOpen(false);
                    }}
                    className={`
                      w-full text-left px-4 py-2 text-sm transition-colors
                      ${activeTab === item.id
                        ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}
                    `}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>
        <div className="py-1">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};