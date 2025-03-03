import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Bell, X, Calendar } from 'lucide-react';

function NotificationBell({ count, tasks, onTaskSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Get high priority tasks and upcoming tasks (due in next 48 hours)
  const now = new Date();
  const twoDaysFromNow = new Date(now);
  twoDaysFromNow.setDate(now.getDate() + 2);
  
  const importantTasks = tasks && tasks.length > 0
    ? tasks
        .filter(task => 
          !task.completed && (
            task.priority === 'high' || 
            (new Date(task.createdAt) >= now && new Date(task.createdAt) <= twoDaysFromNow)
          )
        )
        .slice(0, 5) // Limit to 5 tasks
    : [];
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getPriorityColorClass = (priority) => {
    if (priority === 'high') {
      return 'bg-red-500';
    } 
    if (priority === 'medium') {
      return 'bg-yellow-500';
    }
    return 'bg-green-500';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg 
                  transition-colors duration-200 relative"
        aria-label={`Notifications ${count > 0 ? count : 'none'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={20} />
        {count > 0 && (
          <span 
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs 
                      rounded-full w-4 h-4 flex items-center justify-center"
            aria-hidden="true"
          >
            {count}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div 
          className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl z-50 
                    border border-gray-100 overflow-hidden"
          style={{ maxHeight: '80vh', overflow: 'auto' }}
          role="menu"
        >
          <div className="flex items-center justify-between p-3 border-b border-gray-100">
            <h3 className="font-medium text-gray-700">Notifications</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close notifications"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {importantTasks.length > 0 ? (
              importantTasks.map(task => (
                <button
                  key={task.id}
                  className="p-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer w-full text-left"
                  onClick={() => {
                    onTaskSelect(task.id);
                    setIsOpen(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      onTaskSelect(task.id);
                      setIsOpen(false);
                    }
                  }}
                  role="menuitem"
                >
                  <div className="flex items-start">
                    <div 
                      className={`w-2 h-2 mt-1.5 rounded-full mr-2 ${getPriorityColorClass(task.priority)}`}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-800 font-medium truncate">{task.text}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Calendar size={12} className="mr-1" />
                        {new Date(task.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                <p>No notifications at this time</p>
              </div>
            )}
          </div>
          
          {importantTasks.length > 0 && (
            <div className="p-2 border-t border-gray-100">
              <button 
                onClick={() => setIsOpen(false)}
                className="w-full py-2 text-sm text-center text-blue-500 hover:text-blue-700"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

NotificationBell.propTypes = {
  count: PropTypes.number.isRequired,
  tasks: PropTypes.array,
  onTaskSelect: PropTypes.func
};

export default NotificationBell;