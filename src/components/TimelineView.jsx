import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Calendar, ArrowLeft, ArrowRight, X, GripVertical } from 'lucide-react';

function TimelineView({ 
  isOpen, 
  onClose, 
  tasks, 
  theme, 
  currentTheme, 
  onTaskUpdate 
}) {
  const [visibleDays, setVisibleDays] = useState(3);
  const [startDate, setStartDate] = useState(new Date());
  const containerRef = useRef(null);
  const [draggingTask, setDraggingTask] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);

  // Adjust visible days based on screen width
  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleDays(2);
      } else if (width < 1024) {
        setVisibleDays(3);
      } else {
        setVisibleDays(5);
      }
    }
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isOpen) return null;

  // Generate dates for the timeline
  const dates = Array.from({ length: visibleDays }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return date;
  });

  // Format date for display
  const formatDate = (date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return new Intl.DateTimeFormat('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }).format(date);
    }
  };

  // Navigate to previous/next dates
  const navigateDates = (direction) => {
    const newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() + (direction === 'next' ? visibleDays : -visibleDays));
    setStartDate(newDate);
  };

  // Group tasks by date and priority
  const getTasksForDateAndPriority = (date, priority) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      return (
        taskDate.toDateString() === date.toDateString() &&
        task.priority === priority &&
        !task.completed
      );
    });
  };

  // Handle starting drag operation
  const handleDragStart = (task, event) => {
    setDraggingTask(task);
    if (event.currentTarget) {
      event.currentTarget.classList.add('dragging');
    }
  };

  // Handle dropping a task
  const handleDrop = (date, priority, event) => {
    event.preventDefault();
    if (draggingTask) {
      const updatedTask = {
        ...draggingTask,
        createdAt: date,
        priority: priority || draggingTask.priority
      };
      onTaskUpdate(draggingTask.id, updatedTask.text, updatedTask.priority, updatedTask.createdAt);
      
      // Reset drag state
      setDraggingTask(null);
      setDropTarget(null);
      
      // Remove any lingering drag classes
      const draggingElements = document.querySelectorAll('.dragging');
      draggingElements.forEach(el => el.classList.remove('dragging'));
    }
  };

  // Allow dropping on elements
  const handleDragOver = (date, priority, event) => {
    event.preventDefault();
    setDropTarget({ date, priority });
  };

  // Reset drop target when leaving a droppable zone
  const handleDragLeave = () => {
    setDropTarget(null);
  };

  // Get theme-specific styles
  const themeStyles = (() => {
    switch(currentTheme) {
      case 'ocean':
        return { 
          bgPattern: 'bg-blue-100/20',
          decoration: '🌊',
          accent: 'border-blue-400'
        };
      case 'forest':
        return { 
          bgPattern: 'bg-green-100/20',
          decoration: '🌲',
          accent: 'border-green-400'
        };
      case 'sunset':
        return { 
          bgPattern: 'bg-orange-100/20', 
          decoration: '🌅',
          accent: 'border-orange-400'
        };
      case 'moonlight':
        return { 
          bgPattern: 'bg-indigo-100/20',
          decoration: '🌙',
          accent: 'border-indigo-400'
        };
      case 'aurora':
        return { 
          bgPattern: 'bg-teal-100/20',
          decoration: '✨',
          accent: 'border-teal-400'
        };
      default:
        return { 
          bgPattern: 'bg-blue-100/20',
          decoration: '📅',
          accent: 'border-blue-400'
        };
    }
  })();

  // Get priority color
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high':
        return 'bg-red-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-300 text-gray-700';
    }
  };

  // Render task card
  const renderTaskCard = (task) => (
    <button
      key={task.id}
      draggable="true"
      onDragStart={(e) => handleDragStart(task, e)}
      className={`${theme.colors} bg-opacity-80 backdrop-blur-sm p-3 rounded-lg 
                mb-2 shadow-md cursor-grab text-white border border-white/20
                hover:shadow-lg transition-shadow relative group w-full text-left`}
      aria-label={`Task: ${task.text}. Drag to reschedule.`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleDragStart(task, e);
        }
      }}
    >
      <div className="absolute -left-1 -top-1 text-white/70 cursor-grab p-1">
        <GripVertical className="h-4 w-4" />
      </div>
      <div className="text-sm font-medium ml-4">{task.text}</div>
      
      {/* Stickers */}
      {task.stickers?.length > 0 && (
        <div className="flex mt-2 gap-1">
          {task.stickers.map((sticker, i) => (
            <span key={`${task.id}-sticker-${i}`} className="text-lg" title={sticker.label}>
              {sticker.emoji}
            </span>
          ))}
        </div>
      )}
    </button>
  );
  
  // Render date cell
  const renderDateCell = (date, priority) => {
    const isTargeted = dropTarget && 
      dropTarget.date.toDateString() === date.toDateString() && 
      dropTarget.priority === priority;
      
    return (
      <section 
        key={date.toISOString()}
        className={`min-h-36 p-2 border-l ${themeStyles.accent} relative min-w-[200px]
                  ${isTargeted ? 'bg-white/20' : ''}`}
        onDragOver={(e) => handleDragOver(date, priority, e)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(date, priority, e)}
        aria-label={`${priority} priority tasks for ${formatDate(date)}`}
      >
        {getTasksForDateAndPriority(date, priority).map(renderTaskCard)}
      </section>
    );
  };

  // Render theme-specific decoration
  const renderThemeDecoration = () => {
    const decorationMap = {
      ocean: Array.from({length: 30}, (_, i) => (
        <span key={i} className="inline-block mx-1" style={{fontSize: `${Math.random() * 10 + 10}px`}}>🌊</span>
      )),
      forest: Array.from({length: 20}, (_, i) => (
        <span key={i} className="inline-block mx-1" style={{fontSize: `${Math.random() * 10 + 15}px`}}>🌲</span>
      )),
      sunset: Array.from({length: 15}, (_, i) => {
        const chars = ['🌅', '🏜️', '🌵'];
        return (
          <span key={i} className="inline-block mx-2" style={{fontSize: `${Math.random() * 10 + 12}px`}}>
            {chars[i % chars.length]}
          </span>
        );
      }),
      moonlight: Array.from({length: 25}, (_, i) => {
        const chars = ['🌙', '⭐', '✨'];
        return (
          <span key={i} className="inline-block mx-1" style={{fontSize: `${Math.random() * 8 + 8}px`}}>
            {chars[i % chars.length]}
          </span>
        );
      }),
      aurora: Array.from({length: 20}, (_, i) => {
        const chars = ['✨', '❄️'];
        return (
          <span key={i} className="inline-block mx-1" style={{fontSize: `${Math.random() * 10 + 10}px`}}>
            {chars[i % chars.length]}
          </span>
        );
      })
    };
    
    const decorations = decorationMap[currentTheme] || decorationMap.ocean;
    
    return (
      <div className={`${currentTheme}-decoration absolute bottom-0 left-0 right-0 h-full`}>
        {decorations}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div 
        ref={containerRef}
        className={`relative w-[95%] max-w-6xl max-h-[90vh] rounded-xl shadow-2xl 
                  ${theme.colors} bg-opacity-95 overflow-hidden`}
      >
        {/* Header */}
        <div className="sticky top-0 flex justify-between items-center p-4 border-b border-white/20 backdrop-blur-md z-10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="h-6 w-6" /> Timeline View {themeStyles.decoration}
          </h2>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigateDates('prev')}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Previous dates"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={() => navigateDates('next')}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Next dates"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close timeline"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="overflow-x-auto p-4">
          <div className="min-w-max">
            {/* Date Headers */}
            <div className="grid grid-flow-col gap-4 mb-4">
              <div className="w-28 flex-shrink-0"></div> {/* Priority column */}
              {dates.map((date) => (
                <div key={date.toISOString()} className="min-w-[200px]">
                  <h3 className="text-white font-bold mb-1">{formatDate(date)}</h3>
                  <div className="text-white/70 text-sm">
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>

            {/* Priority Rows */}
            {['high', 'medium', 'low'].map(priority => (
              <div 
                key={priority}
                className={`grid grid-flow-col gap-4 mb-6 ${themeStyles.bgPattern} rounded-lg overflow-hidden`}
              >
                {/* Priority Label */}
                <div className="w-28 p-2 flex-shrink-0">
                  <div className={`${getPriorityColor(priority)} px-3 py-1 rounded-full text-sm inline-flex items-center`}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </div>
                </div>

                {/* Date Columns */}
                {dates.map(date => renderDateCell(date, priority))}
              </div>
            ))}
          </div>
        </div>

        {/* Theme Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none overflow-hidden opacity-30">
          {renderThemeDecoration()}
        </div>
      </div>
    </div>
  );
}

TimelineView.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  tasks: PropTypes.array.isRequired,
  theme: PropTypes.object.isRequired,
  currentTheme: PropTypes.string.isRequired,
  onTaskUpdate: PropTypes.func.isRequired
};

export default TimelineView;