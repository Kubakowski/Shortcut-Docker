// PinnedShortcutsContext.tsx

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define the shape of a shortcut
interface Shortcut {
  execute(): void;
  id: string;
  action: string;
  Keys: string;
}

// Define the shape of the context state
interface PinnedShortcutsContextType {
  pinnedShortcuts: Shortcut[];
  addPinnedShortcut: (shortcut: Shortcut) => void;
  removePinnedShortcut: (shortcutId: string) => void;
}

// Create the context with an initial default value
const PinnedShortcutsContext = createContext<PinnedShortcutsContextType | null>(null);

// Define the props for the provider component
interface PinnedShortcutsProviderProps {
  children: ReactNode;
}

// Create the provider component
export const PinnedShortcutsProvider: React.FC<PinnedShortcutsProviderProps> = ({ children }) => {
  const [pinnedShortcuts, setPinnedShortcuts] = useState<Shortcut[]>([]);

  // Function to add a shortcut to the pinned list
  const addPinnedShortcut = (shortcut: Shortcut) => {
    setPinnedShortcuts(prevShortcuts => [...prevShortcuts, shortcut]);
  };

  // Function to remove a shortcut from the pinned list
  const removePinnedShortcut = (shortcutId: string) => {
    setPinnedShortcuts(prevShortcuts => prevShortcuts.filter(s => s.id !== shortcutId));
  };

  // Context value that will be provided to the components
  const contextValue: PinnedShortcutsContextType = {
    pinnedShortcuts,
    addPinnedShortcut,
    removePinnedShortcut,
  };

  // Optionally, sync state with local storage or other persistence method
  useEffect(() => {
    // Load initial state from local storage or other source
    const savedPinnedShortcuts = localStorage.getItem('pinnedShortcuts');
    if (savedPinnedShortcuts) {
      setPinnedShortcuts(JSON.parse(savedPinnedShortcuts));
    }
  }, []);

  useEffect(() => {
    // Save state to local storage or other destination when it changes
    localStorage.setItem('pinnedShortcuts', JSON.stringify(pinnedShortcuts));
  }, [pinnedShortcuts]);

  return (
    <PinnedShortcutsContext.Provider value={contextValue}>
      {children}
    </PinnedShortcutsContext.Provider>
  );
};

// Custom hook to use the context
export const usePinnedShortcuts = () => {
  const context = useContext(PinnedShortcutsContext);
  if (!context) {
    throw new Error('usePinnedShortcuts must be used within a PinnedShortcutsProvider');
  }
  return context;
};
