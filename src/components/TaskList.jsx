import { useState } from 'react';
import PropTypes from 'prop-types';
import * as React from 'react';
import { Circle, Trash2, Smile, ChevronDown, Home, Sun, Cloud } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator
} from "./ui/dropdown-menu";

function TaskList({ 
  theme, 
  currentTheme,
  tasks: propTasks, 
  onAddTask, 
  onToggleTask, 
  selectedDate, 
  onDeleteTask,
  onEditTask,
  onAddSticker,
  onRemoveSticker,
  selectedTaskId 
}) {
  const [newTask, setNewTask] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('none');
  const [showCompleted, setShowCompleted] = useState(true);
  const [selectedStickers, setSelectedStickers] = useState([]);
  const [taskForSticker, setTaskForSticker] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('any');

  // Get base colors from theme string
  const themeBase = theme.colors.split(' ')[2] || 'bg-blue-600'; 
  const themeColor = themeBase.split('-')[1]; 
  const themeNumber = parseInt(themeBase.split('-')[2]); 

  // Generate priority colors based on theme
  const priorityColors = {
    low: { color: `bg-${themeColor}-${themeNumber - 200}`, hover: `hover:bg-${themeColor}-${themeNumber - 100}`, text: 'Low Priority' },
    medium: { color: `bg-${themeColor}-${themeNumber - 100}`, hover: `hover:bg-${themeColor}-${themeNumber}`, text: 'Medium Priority' },
    high: { color: `bg-${themeColor}-${themeNumber}`, hover: `hover:bg-${themeColor}-${themeNumber + 100}`, text: 'High Priority' },
    none: { 
      color: `bg-${themeColor}-${themeNumber - 300}`, 
      hover: `hover:bg-${themeColor}-${themeNumber - 200}`, 
      text: 'No Priority',
      border: `border border-${themeColor}-${themeNumber - 200}`
    }
  };

  // Sticker categories
  const stickerCategories = {
    events: [
      { key: 'birthday', emoji: '🎂', label: 'Birthday' },
      { key: 'meeting', emoji: '📊', label: 'Meeting' },
      { key: 'deadline', emoji: '⏰', label: 'Deadline' },
      { key: 'party', emoji: '🎉', label: 'Party' },
      { key: 'travel', emoji: '✈️', label: 'Travel' },
      { key: 'call', emoji: '📞', label: 'Call' },
      { key: 'coffee', emoji: '☕', label: 'Coffee' }
    ],
    general: [
      { key: 'important', emoji: '⭐', label: 'Important' },
      { key: 'urgent', emoji: '🔥', label: 'Urgent' },
      { key: 'idea', emoji: '💡', label: 'Idea' },
      { key: 'question', emoji: '❓', label: 'Question' },
      { key: 'note', emoji: '📝', label: 'Note' },
      { key: 'check', emoji: '✅', label: 'Check' },
      { key: 'warning', emoji: '⚠️', label: 'Warning' }
    ],
    ocean: [
      { key: 'fish', emoji: '🐠', label: 'Fish' },
      { key: 'dolphin', emoji: '🐬', label: 'Dolphin' },
      { key: 'whale', emoji: '🐋', label: 'Whale' },
      { key: 'octopus', emoji: '🐙', label: 'Octopus' },
      { key: 'shell', emoji: '🐚', label: 'Shell' },
      { key: 'wave', emoji: '🌊', label: 'Wave' },
      { key: 'shark', emoji: '🦈', label: 'Shark' },
      { key: 'turtle', emoji: '🐢', label: 'Turtle' }
    ],
    forest: [
      { key: 'tree', emoji: '🌲', label: 'Tree' },
      { key: 'leaf', emoji: '🍃', label: 'Leaf' },
      { key: 'mushroom', emoji: '🍄', label: 'Mushroom' },
      { key: 'flower', emoji: '🌸', label: 'Flower' },
      { key: 'squirrel', emoji: '🐿️', label: 'Squirrel' },
      { key: 'deer', emoji: '🦌', label: 'Deer' },
      { key: 'fox', emoji: '🦊', label: 'Fox' },
      { key: 'bear', emoji: '🐻', label: 'Bear' }
    ],
    sunset: [
      { key: 'sunset', emoji: '🌅', label: 'Sunset' },
      { key: 'sun', emoji: '☀️', label: 'Sun' },
      { key: 'cloud', emoji: '☁️', label: 'Cloud' },
      { key: 'desert', emoji: '🏜️', label: 'Desert' },
      { key: 'cactus', emoji: '🌵', label: 'Cactus' },
      { key: 'camel', emoji: '🐪', label: 'Camel' },
      { key: 'palm', emoji: '🌴', label: 'Palm Tree' }
    ],
    moonlight: [
      { key: 'moon', emoji: '🌙', label: 'Moon' },
      { key: 'star', emoji: '⭐', label: 'Star' },
      { key: 'comet', emoji: '☄️', label: 'Comet' },
      { key: 'night', emoji: '🌃', label: 'Night' },
      { key: 'owl', emoji: '🦉', label: 'Owl' },
      { key: 'bat', emoji: '🦇', label: 'Bat' },
      { key: 'wolf', emoji: '🐺', label: 'Wolf' }
    ],
    aurora: [
      { key: 'aurora', emoji: '✨', label: 'Aurora' },
      { key: 'snowflake', emoji: '❄️', label: 'Snowflake' },
      { key: 'polar-bear', emoji: '🐻‍❄️', label: 'Polar Bear' },
      { key: 'mountain', emoji: '🏔️', label: 'Mountain' },
      { key: 'glacier', emoji: '🧊', label: 'Ice' },
      { key: 'reindeer', emoji: '🦌', label: 'Reindeer' },
      { key: 'evergreen', emoji: '🌲', label: 'Evergreen' }
    ]
  };

  // Location options
  const locationOptions = [
    { key: 'any', icon: <Cloud className="h-3 w-3" />, label: 'Any' },
    { key: 'indoor', icon: <Home className="h-3 w-3" />, label: 'Indoor' },
    { key: 'outdoor', icon: <Sun className="h-3 w-3" />, label: 'Outdoor' }
  ];

  // Style helper functions
  const getShowHideButtonClass = (isShowing) => {
    const baseClasses = "px-3 py-1 rounded-lg text-sm transition-colors duration-200 text-white";
    if (isShowing) {
      return `${baseClasses} ${themeBase}`;
    }
    return `${baseClasses} bg-white/20 hover:bg-white/30 border border-${themeColor}-${themeNumber - 200}`;
  };

  const getPriorityButtonClass = (priority, isSelected) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm transition-colors duration-200";
    if (isSelected) {
      return `${baseClasses} ${priorityColors[priority].color} text-white`;
    }
    const nonSelectedClasses = "bg-white/20 text-white hover:bg-white/30";
    if (priority === 'none') {
      return `${baseClasses} ${nonSelectedClasses} ${priorityColors[priority].border}`;
    }
    return `${baseClasses} ${nonSelectedClasses}`;
  };

  const getLocationButtonClass = (location) => {
    const baseClasses = "px-3 py-1 rounded-lg text-sm transition-colors duration-200 flex items-center gap-1";
    return selectedLocation === location 
      ? `${baseClasses} ${themeBase} text-white` 
      : `${baseClasses} bg-white/20 text-white hover:bg-white/30`;
  };

  // Event handlers
  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      onAddTask(newTask.trim(), selectedPriority, selectedDate, selectedStickers, selectedLocation);
      setNewTask('');
      setSelectedPriority('none');
      setSelectedStickers([]);
      setSelectedLocation('any');
    }
  };

  const handleStickerSelect = (sticker) => {
    if (taskForSticker) {
      // Add sticker to existing task
      onAddSticker(taskForSticker, sticker);
      setTaskForSticker(null);
    } else {
      // Add sticker to new task being created
      setSelectedStickers([...selectedStickers, sticker]);
    }
  };

  const removeNewTaskSticker = (stickerToRemove) => {
    const newStickers = selectedStickers.filter(
      sticker => sticker.key !== stickerToRemove.key || sticker.emoji !== stickerToRemove.emoji
    );
    setSelectedStickers(newStickers);
  };

  const handleStickerRemove = (taskId, stickerIndex) => {
    onRemoveSticker(taskId, stickerIndex);
  };

  const getFilteredTasks = () => {
    return propTasks.filter(task => {
      if (!showCompleted && task.completed) {
        return false;
      }
      if (selectedDate) {
        const taskDate = new Date(task.createdAt);
        return taskDate.toDateString() === selectedDate.toDateString();
      }
      return true;
    });
  };
  // Content rendering functions for sticker dropdown items
  const createStickerMenuItem = (sticker, onClickHandler) => (
    <DropdownMenuItem
      key={sticker.key}
      onClick={onClickHandler}
      className="p-1 text-2xl justify-center hover:bg-white/20 cursor-pointer"
    >
      {sticker.emoji}
    </DropdownMenuItem>
  );

  const createStickerCategory = (category, stickers, isTaskSpecific, taskId) => {
    const clickHandlerFactory = (sticker) => {
      if (isTaskSpecific) {
        return () => {
          setTaskForSticker(taskId);
          handleStickerSelect(sticker);
        };
      }
      return () => handleStickerSelect(sticker);
    };

    return (
      <React.Fragment key={category}>
        <DropdownMenuLabel className="text-white/90 capitalize">{category}</DropdownMenuLabel>
        <DropdownMenuGroup className="grid grid-cols-5 gap-1 mb-2">
          {stickers.map(sticker => createStickerMenuItem(sticker, clickHandlerFactory(sticker)))}
        </DropdownMenuGroup>
        {category !== Object.keys(stickerCategories).pop() && (
          <DropdownMenuSeparator className="bg-white/20" />
        )}
      </React.Fragment>
    );
  };
  
  // UI Rendering functions
  const renderStickerDropdown = (taskId) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="p-1.5 text-white/70 hover:text-white hover:bg-white/20
                   rounded-lg transition-colors"
          aria-label="Add sticker to task"
        >
          <Smile className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className={`${theme.colors} border-0 bg-white/20 backdrop-blur-md p-2 z-50`}
        sideOffset={5}
      >
        <DropdownMenuLabel className="text-white font-medium">Add Sticker</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/20" />
        {Object.entries(stickerCategories).map(([category, stickers]) => 
          createStickerCategory(category, stickers, true, taskId)
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderNewTaskDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="ml-auto px-3 py-1 rounded-lg text-sm text-white bg-white/20 hover:bg-white/30 transition-colors duration-200 flex items-center gap-1"
        >
          <Smile className="h-4 w-4" /> 
          Add Sticker <ChevronDown className="h-3 w-3 ml-1" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className={`${theme.colors} border-0 bg-white/20 backdrop-blur-md p-2 z-50`}
        sideOffset={5}
      >
        <DropdownMenuLabel className="text-white font-medium">Add Sticker</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/20" />
        {Object.entries(stickerCategories).map(([category, stickers]) => 
          createStickerCategory(category, stickers, false, null)
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderNewTaskSticker = (sticker) => (
    <div key={`new-sticker-${sticker.key}`} className="relative group z-10">
      <span className="text-xl">{sticker.emoji}</span>
      <button 
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => removeNewTaskSticker(sticker)}
        aria-label={`Remove ${sticker.label} sticker`}
      >
        ×
      </button>
    </div>
  );

  const renderTaskSticker = (task, sticker, index) => (
    <div key={`task-${task.id}-sticker-${sticker.key || sticker.emoji}`} className="relative group z-10">
      <span className="text-xl" title={sticker.label}>{sticker.emoji}</span>
      <button 
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => handleStickerRemove(task.id, index)}
        aria-label={`Remove ${sticker.label} sticker`}
      >
        ×
      </button>
    </div>
  );

  const renderTaskStickers = (task) => {
    if (!task.stickers?.length) return null;
    
    return (
      <div className="flex flex-wrap gap-1 relative z-10">
        {task.stickers.map((sticker, index) => 
          renderTaskSticker(task, sticker, index)
        )}
      </div>
    );
  };

  const renderLocationIcon = (location) => {
    switch(location) {
      case 'indoor':
        return <Home className="h-4 w-4 text-white/70" />;
      case 'outdoor':
        return <Sun className="h-4 w-4 text-yellow-300" />;
      default:
        return null;
    }
  };

  const renderTask = (task) => (
    <div
      key={task.id}
      className={`flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-lg 
               hover:bg-white/20 transition-all duration-200
               border-l-4 ${task.completed ? 'border-white/30' : priorityColors[task.priority].color}
               ${selectedTaskId === task.id ? 'ring-2 ring-white/50' : ''}`}
    >
      <div className="flex-1 flex items-center gap-3">
        <button
          onClick={() => onToggleTask(task.id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
            transition-all duration-200 ${
              task.completed 
                ? themeBase + ' border-transparent text-white' 
                : 'border-white/50 hover:border-white'
            }`}
          aria-label={task.completed ? "Mark task as incomplete" : "Mark task as complete"}
        >
          {task.completed ? '✓' : ''}
        </button>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`${task.completed ? 'line-through text-white/50' : 'text-white'}`}>
              {task.text}
            </span>
            {task.location && task.location !== 'any' && (
              <span className="inline-flex items-center" title={`${task.location === 'indoor' ? 'Indoor' : 'Outdoor'} task`}>
                {renderLocationIcon(task.location)}
              </span>
            )}
          </div>
          <span className="text-xs text-white/70">
            {new Date(task.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        {renderTaskStickers(task)}
      </div>
      
      <div className="flex items-center gap-2">
        {renderStickerDropdown(task.id)}
        <button
          onClick={() => onDeleteTask(task.id)}
          className="p-1.5 text-white/70 hover:text-white hover:bg-white/20
                   rounded-lg transition-colors"
          aria-label="Delete task"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  const renderPriorityButton = (priority, text) => (
    <button
      key={priority}
      type="button"
      onClick={() => setSelectedPriority(priority)}
      className={getPriorityButtonClass(priority, selectedPriority === priority)}
    >
      <span className="flex items-center gap-2">
        <Circle className={`h-3 w-3 ${selectedPriority === priority ? 'fill-white' : ''}`} />
        {text}
      </span>
    </button>
  );

  const renderLocationButton = (option) => (
    <button
      key={option.key}
      type="button"
      onClick={() => setSelectedLocation(option.key)}
      className={getLocationButtonClass(option.key)}
    >
      {option.icon}
      <span>{option.label}</span>
    </button>
  );

  // Main render
  const filteredTasks = getFilteredTasks();

  return (
    <section className={`${theme.colors} bg-opacity-10 backdrop-blur-sm rounded-lg shadow-xl p-6`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          {selectedDate ? (
            `Tasks for ${selectedDate.toLocaleDateString()}` 
          ) : (
            "Today's Tasks"
          )} 
          <span>{theme.emoji}</span>
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className={getShowHideButtonClass(showCompleted)}
          >
            {showCompleted ? 'Hide Completed' : 'Show Completed'}
          </button>
        </div>
      </div>
      <form onSubmit={handleAddTask} className="mb-6">
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task..."
                className={`w-full p-2 bg-white/20 border border-white/30 rounded-lg 
                         ${themeBase.replace('bg-', 'focus:ring-')} focus:ring-2 focus:border-transparent 
                         text-white placeholder-white/70`}
              />
            </div>
            <button
              type="submit"
              className={`${themeBase} text-white px-4 py-2 rounded-lg 
                       hover:bg-opacity-90 transition-colors duration-200`}
            >
              Add Task
            </button>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-white/90">Priority:</span>
            {Object.entries(priorityColors).map(([priority, { text }]) => 
              renderPriorityButton(priority, text)
            )}
            
            {renderNewTaskDropdown()}
          </div>
          
          {/* Location Selection */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-white/90">Location:</span>
            {locationOptions.map(renderLocationButton)}
          </div>
          
          {selectedStickers.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center mt-2">
              <span className="text-sm text-white/90">Stickers:</span>
              {selectedStickers.map(renderNewTaskSticker)}
            </div>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-white/80">
            <p>No tasks yet! Add your first task to get started {theme.emoji}</p>
          </div>
        ) : (
          filteredTasks.map(renderTask)
        )}
      </div>
    </section>
  );
}

TaskList.propTypes = {
  theme: PropTypes.shape({
    emoji: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    colors: PropTypes.string.isRequired
  }).isRequired,
  currentTheme: PropTypes.string.isRequired,
  tasks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    createdAt: PropTypes.instanceOf(Date).isRequired,
    priority: PropTypes.oneOf(['none', 'low', 'medium', 'high']).isRequired,
    stickers: PropTypes.array,
    location: PropTypes.string
  })).isRequired,
  onAddTask: PropTypes.func.isRequired,
  onToggleTask: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  onEditTask: PropTypes.func,
  onAddSticker: PropTypes.func.isRequired,
  onRemoveSticker: PropTypes.func.isRequired,
  selectedDate: PropTypes.instanceOf(Date),
  selectedTaskId: PropTypes.number
};

export default TaskList;