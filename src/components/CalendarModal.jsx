import PropTypes from 'prop-types';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "./ui/dialog";
import _ from 'lodash';

function CalendarModal({ theme, tasks, onDateSelect, isOpen, onClose }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get base colors from theme string
  const themeBase = theme.colors.split(' ')[2] || 'bg-blue-600';
  const themeColor = themeBase.split('-')[1];
  const themeNumber = parseInt(themeBase.split('-')[2]);

  const priorityColors = {
    low: `bg-${themeColor}-${themeNumber - 200}`,
    medium: `bg-${themeColor}-${themeNumber - 100}`,
    high: themeBase,
    none: 'bg-white/30'
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Add empty spaces for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push({ empty: true, index: i });
    }
    
    // Add all days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getTasksForDate = (date) => {
    if (!date || date.empty) return [];
    return tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const isToday = (date) => {
    if (!date || date.empty) return false;
    return new Date().toDateString() === date.toDateString();
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentMonth(newDate);
  };

  const getDateCellClass = (date) => {
    if (!date || date.empty) return 'bg-transparent';
    
    const baseClasses = 'w-full h-24 p-2 text-left border border-white/10 rounded-lg transition-all duration-200';
    
    if (isToday(date)) {
      return `${baseClasses} bg-white/20 hover:bg-white/30`;
    }
    
    return `${baseClasses} bg-white/10 hover:bg-white/20`;
  };

  const getDateTextClass = (date) => {
    if (isToday(date)) {
      return 'text-white';
    }
    return 'text-white/90';
  };

  const generateDateKey = (date, weekIndex, dayIndex) => {
    if (!date || date.empty) {
      return `empty-${weekIndex}-${dayIndex}`;
    }
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthDays = getDaysInMonth();
  const weeks = _.chunk(monthDays, 7);

  const currentMonthString = currentMonth.toLocaleDateString('en-US', { 
    month: 'long',
    year: 'numeric'
  });

  return (
    <Dialog defaultOpen={false} open={isOpen} onOpenChange={onClose}>
  <DialogContent 
    className={`${theme.colors} bg-opacity-10 backdrop-blur-md border-0 max-w-4xl`}
  >
    <DialogHeader className="mb-4">
      <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
        Calendar View {theme.emoji}
      </DialogTitle>
      <DialogDescription className="text-white/70">
        {`Calendar view for ${currentMonthString}`}
      </DialogDescription>
    </DialogHeader>

        <div className="flex items-center justify-end gap-4 px-2 mb-4">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-lg font-medium text-white">
            {currentMonthString}
          </span>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-7 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center font-medium text-white/70 text-sm p-1">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weeks.map((week, weekIndex) => (
              week.map((date, dayIndex) => {
                const dayTasks = getTasksForDate(date);
                const hasHighPriority = dayTasks.some(task => task.priority === 'high');
                const dateKey = generateDateKey(date, weekIndex, dayIndex);

                return (
                  <div key={dateKey} className={getDateCellClass(date)}>
                    {date && !date.empty && (
                      <button
                        onClick={() => {
                          onDateSelect(date);
                          onClose();
                        }}
                        className="w-full h-full text-left"
                      >
                        <span className={`text-sm font-medium ${getDateTextClass(date)}`}>
                          {date.getDate()}
                        </span>
                        
                        {dayTasks.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {Object.entries(
                              _.groupBy(dayTasks, 'priority')
                            ).map(([priority, tasks]) => (
                              <div 
                                key={priority}
                                className={`flex items-center ${
                                  hasHighPriority && priority === 'high' ? 'animate-pulse' : ''
                                }`}
                              >
                                <span 
                                  className={`w-2 h-2 rounded-full ${priorityColors[priority]}`}
                                  title={`${tasks.length} ${priority} priority task${tasks.length === 1 ? '' : 's'}`}
                                />
                                {tasks.length > 1 && (
                                  <span className="text-xs text-white/70 ml-1">
                                    {tasks.length}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </button>
                    )}
                  </div>
                );
              })
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

CalendarModal.propTypes = {
  theme: PropTypes.shape({
    emoji: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    colors: PropTypes.string.isRequired
  }).isRequired,
  tasks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    createdAt: PropTypes.instanceOf(Date).isRequired,
    priority: PropTypes.oneOf(['none', 'low', 'medium', 'high']).isRequired
  })).isRequired,
  onDateSelect: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default CalendarModal;