// Import necessary icons and components
import React, { useState } from 'react';
import '../App.css';
import { Button } from '@mantine/core';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'; 
import ShortcutComponent from '../components/Shortcut'; 
import { Shortcut } from '../types/types.ts'; 

interface DockProps {
  pinnedShortcuts: Shortcut[];
  onUnpin: (shortcutId: string) => void; 
}

function Dock({ pinnedShortcuts, onUnpin }: DockProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const shortcutsPerPage = 10;

  const totalPages = Math.ceil(pinnedShortcuts.length / shortcutsPerPage);

  const displayedShortcuts = pinnedShortcuts.slice(
    currentPage * shortcutsPerPage,
    (currentPage + 1) * shortcutsPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className='dock-wrapper'>
      <div className='dock-header'>
        {currentPage > 0 ? (
          <Button size="xs" className='dock-arrow-left' onClick={prevPage}>
            <IoIosArrowBack />
          </Button>
        ) : (
          <div className="dock-arrow-placeholder"></div> 
        )}
        
        <div className='dock-header-text'>Your Dock</div>
        
        {currentPage < totalPages - 1 ? (
          <Button size="xs" className='dock-arrow-right' onClick={nextPage}>
            <IoIosArrowForward />
          </Button>
        ) : (
          <div className="dock-arrow-placeholder"></div>
        )}
      </div>
      <div className='dock-body'>
        {displayedShortcuts.map((shortcut) => (
          <ShortcutComponent
            key={shortcut.id}
            action={shortcut.action}
            Keys={shortcut.Keys}
            onPin={() => {}}
            onUnpin={() => onUnpin(shortcut.id)}
            isPinned={true}
            onClick={() => shortcut.execute()}
            isInDock={true}
          />
        ))}
      </div>
    </div>
  );
};

export default Dock;