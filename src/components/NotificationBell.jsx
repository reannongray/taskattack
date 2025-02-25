import PropTypes from 'prop-types';
import { Bell } from 'lucide-react';

function NotificationBell({ count }) {
  return (
    <button 
      className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg 
                transition-colors duration-200 relative"
      aria-label={`Notifications ${count > 0 ? count : 'none'}`}
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
  );
}

NotificationBell.propTypes = {
  count: PropTypes.number.isRequired
};

export default NotificationBell;