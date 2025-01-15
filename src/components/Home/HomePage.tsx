import React from 'react';
import { MonthOverview } from './MonthOverview';
import { HomeLeftSidebar } from './HomeLeftSidebar';

interface HomePageProps {
  onWeekSelect: (date: Date) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onWeekSelect }) => {
  return (
    <div className="flex gap-6">
      <HomeLeftSidebar />
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Calendar Overview</h1>
        </div>
        <MonthOverview onWeekSelect={onWeekSelect} />
      </div>
    </div>
  );
};