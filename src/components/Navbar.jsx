import PropTypes from 'prop-types';
import { Palette, Calendar } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { themes } from '../constants/themes';
import NotificationBell from './NotificationBell';

function Navbar({ 
  currentTheme, 
  onThemeChange, 
  taskCount, 
  tasks, 
  onTaskSelect,
  onToggleTimeline,
  weatherWidget
}) {
  const theme = themes[currentTheme];
  
  const getNavStyles = () => ({
    nav: `${theme.colors.split(' ')[2] || 'bg-blue-600'} p-8 shadow-xl sticky top-0 z-50`,
    button: `flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white
           px-6 py-3 rounded-lg transition-colors text-lg font-medium shadow-md`,
    dropdownContent: `bg-white p-2 shadow-xl rounded-lg border-2 border-gray-200 w-56 z-[100]`,
    dropdownItem: (isSelected) => `
      flex items-center gap-3 p-3 my-1 text-lg rounded-lg cursor-pointer
      ${isSelected
         ? `${theme.colors.split(' ')[2] || 'bg-blue-600'} text-white`
         : `text-gray-800 hover:bg-gray-100`
      }
    `
  });

  const styles = getNavStyles();

  return (
    <nav className={styles.nav}>
      <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{theme.emoji}</span>
          <h1 className="text-white text-2xl md:text-3xl font-bold">Task Attack</h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          {/* Weather Widget */}
          {weatherWidget}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className={styles.button}
                aria-label="Change Theme"
              >
                <Palette size={24} />
                <span className="hidden md:inline">Theme</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className={styles.dropdownContent}
            >
              {Object.entries(themes).map(([key, themeOption]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => onThemeChange(key)}
                  className={styles.dropdownItem(currentTheme === key)}
                >
                  <span className="text-2xl">{themeOption.emoji}</span>
                  <span className="font-medium">{themeOption.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Timeline Button */}
          <button 
            className={styles.button}
            onClick={onToggleTimeline}
            aria-label="Toggle Timeline View"
          >
            <Calendar size={24} />
            <span className="hidden md:inline">Timeline</span>
          </button>
          
          {/* Notification Bell */}
          <NotificationBell count={taskCount} tasks={tasks} onTaskSelect={onTaskSelect} />
        </div>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  currentTheme: PropTypes.oneOf(Object.keys(themes)).isRequired,
  onThemeChange: PropTypes.func.isRequired,
  taskCount: PropTypes.number.isRequired,
  tasks: PropTypes.array,
  onTaskSelect: PropTypes.func,
  onToggleTimeline: PropTypes.func.isRequired,
  weatherWidget: PropTypes.node
};

export default Navbar;