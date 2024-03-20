import '../App.css';
import Shortcut from '../components/Shortcut';
import Dock from '../components/Dock';

function Shortcuts() {

  const triggerComplexShortcut = () => {
    window.electronAPI.send('trigger-shortcut', '^+!#l'); 
  };

  return (
    <div className='shortcuts-page-wrapper'>
      <div className='top-dock-wrapper'>
        <Dock />
      </div>
      <hr className='shortcuts-divider' />
      <div className='individual-shortcuts-wrapper'>
        <Shortcut />
        <Shortcut />
        <Shortcut />
        <Shortcut />
        <Shortcut />
        <Shortcut />
        <Shortcut />
        <Shortcut />
        <Shortcut />
        <Shortcut />
      </div>
    </div>
  );
}

export default Shortcuts;
