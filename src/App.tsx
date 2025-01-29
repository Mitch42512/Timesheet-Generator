import React, { useState, useEffect } from 'react';
import { MonthSelector } from './components/Navigation/MonthSelector';
import { WeekView } from './components/WeekView';
import { AccountsPage } from './components/Accounts/AccountsPage';
import { StatsPage } from './components/Statistics/StatsPage';
import { HomePage } from './components/Home/HomePage';
import { CareerTrackerPage } from './components/CareerTracker/CareerTrackerPage';
import { TrafficLightPage } from './components/TrafficLight/TrafficLightPage';
import { SmartGoalsPage } from './components/SmartGoals/SmartGoalsPage';
import { ResourcesPage } from './components/Resources/ResourcesPage';
import { TabNavigation } from './components/Navigation/TabNavigation';
import { initializeDb } from './db/initializeDb';
import { clearZustandStorage } from './utils/clearStorage';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('home');

  const handleWeekSelect = (date: Date) => {
    setCurrentDate(date);
    setActiveTab('timesheet');
  };

  useEffect(() => {
    initializeDb();
  }, []);

  // Make clearZustandStorage available globally
  (window as any).clearZustandStorage = clearZustandStorage;

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onWeekSelect={handleWeekSelect} />;
      case 'accounts':
        return <AccountsPage />;
      case 'statistics':
        return <StatsPage />;
      case 'career-tracker':
        return <CareerTrackerPage onTabChange={setActiveTab} />;
      case 'traffic-light':
        return <TrafficLightPage />;
      case 'smart-goals':
        return <SmartGoalsPage />;
      case 'resources':
        return <ResourcesPage />;
      default:
        return (
          <>
            <div className="bg-white dark:bg-gray-800 shadow-lg border border-gray-300 dark:border-gray-700">
              <MonthSelector
                currentDate={currentDate}
                onMonthChange={setCurrentDate}
              />
              <WeekView selectedWeek={currentDate} />
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="fixed top-0 left-0 right-0 z-50">
        <header className="bg-[#4F81BD] dark:bg-[#2C4B70] text-white">
          <div className="max-w-[1920px] mx-auto py-2 px-[10px]">
            <h1 className="text-xl font-bold">My Timesheet</h1>
          </div>
        </header>
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <main className="max-w-[1920px] mx-auto px-[10px] py-2 mt-[88px]">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;