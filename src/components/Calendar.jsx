import PropTypes from 'prop-types';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import _ from 'lodash';

function Calendar({ theme, tasks, onDateSelect, selectedDate }) {
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

  const isSelected = (date) => {
    if (!date || date.empty) return false;
    return selectedDate?.toDateString() === date.toDateString();
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentMonth(newDate);
  };

  const getDateCellClass = (date) => {
    if (!date || date.empty) return 'bg-transparent';
    
    const baseClasses = 'border border-white/10 rounded-lg transition-all duration-200';
    
    if (isSelected(date)) {
      return `${baseClasses} ${themeBase} bg-opacity-20`;
    }
    if (isToday(date)) {
      return `${baseClasses} bg-white/20 hover:bg-white/30`;
    }
    return `${baseClasses} bg-white/10 hover:bg-white/20`;
  };

  const getDateTextClass = (date) => {
    if (isSelected(date)) return 'text-white font-bold';
    if (isToday(date)) return 'text-white';
    return 'text-white/90';
  };

  const handleDateKeyPress = (e, date) => {
    if (date && !date.empty && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onDateSelect(date);
    }
  };

  const generateWeekKey = (week, index) => {
    const validDate = week.find(date => date && !date.empty);
    if (validDate) {
      const firstDay = validDate.getDate();
      return `week-${validDate.getFullYear()}-${validDate.getMonth() + 1}-${firstDay}`;
    }
    return `empty-week-${currentMonth.getFullYear()}-${currentMonth.getMonth()}-${index}`;
  };

  const getDateAriaLabel = (date, taskCount) => {
    const dateString = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    if (taskCount) {
      return `Select ${dateString}, ${taskCount} tasks`;
    }
    return `Select ${dateString}`;
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthDays = getDaysInMonth();
  const weeks = _.chunk(monthDays, 7);
  
  const currentMonthString = currentMonth.toLocaleDateString('en-US', { 
    month: 'long',
    year: 'numeric'
  });
  return (
    <section className={`${theme.colors} bg-opacity-10 backdrop-blur-sm rounded-lg shadow-xl p-6`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          Calendar View {theme.emoji}
        </h2>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-lg font-medium text-white min-w-[150px] text-center">
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
      </div>

      <table className="w-full table-fixed border-separate border-spacing-2">
        <thead>
          <tr>
            {weekDays.map(day => (
              <th 
                key={day} 
                className="text-center font-medium text-white/70 text-sm p-2 w-[14.28%]"
                scope="col"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr key={generateWeekKey(week, weekIndex)} className="h-24">
              {week.map((date, dayIndex) => {
                const dayTasks = getTasksForDate(date);
                const hasHighPriority = dayTasks.some(task => task.priority === 'high');

                return (
                  <td
                    key={`${weekIndex}-${dayIndex}`}
                    className={`${getDateCellClass(date)} align-top`}
                  >
                    {date && !date.empty && (
                      <button
                        onClick={() => onDateSelect(date)}
                        onKeyDown={(e) => handleDateKeyPress(e, date)}
                        className="w-full h-full text-left p-2"
                        aria-label={getDateAriaLabel(date, dayTasks.length)}
                      >
                        <span className={`text-sm font-medium ${getDateTextClass(date)}`}>
                          {date.getDate()}
                        </span>
                        
                        {dayTasks.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
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
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

Calendar.propTypes = {
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
  selectedDate: PropTypes.instanceOf(Date)
};

export default Calendar;