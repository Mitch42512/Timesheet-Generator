export const clearZustandStorage = () => {
  const zustandKeys = Object.keys(localStorage).filter(key => key.endsWith('-storage'));
  console.log('Found Zustand stores:', zustandKeys);
  
  zustandKeys.forEach(key => {
    localStorage.removeItem(key);
    console.log('Cleared:', key);
  });
};

// Make it available globally
(window as any).clearZustandStorage = clearZustandStorage;

// Also add a simpler direct command for console use
(window as any).clearAllStorage = () => {
  Object.keys(localStorage)
    .filter(key => key.endsWith('-storage'))
    .forEach(key => {
      console.log('Clearing:', key);
      localStorage.removeItem(key);
    });
}; 