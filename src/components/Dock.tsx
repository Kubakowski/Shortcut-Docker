import '../App.css';
import { Button } from '@mantine/core';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'; 

function Dock() {
  return (
    <div className='dock-wrapper'>
      <div className='dock-header'>
        <Button size="xs" className='dock-arrow-left'>
          <IoIosArrowBack /> 
        </Button>
        <div className='dock-header-text'>
          Your Dock
        </div>
        <Button size="xs" className='dock-arrow-right'>
          <IoIosArrowForward /> 
        </Button>
      </div>
      <div className='dock-body'>

      </div>
    </div>
  );
}

export default Dock;
