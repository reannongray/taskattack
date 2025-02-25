import { useState } from 'react';
import PropTypes from 'prop-types';
import { Circle, Trash2, Filter } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "./ui/dialog";

function TaskList({ theme, tasks: propTasks, onAddTask, onToggleTask, selectedDate, onDeleteTask }) {
  const [newTask, setNewTask] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('none');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Get base colors from theme string
  const themeBase = theme.colors.split(' ')[2] || 'bg-blue-600'; // e.g., "bg-blue-600"
  const themeColor = themeBase.split('-')[1]; // e.g., "blue"
  const themeNumber = parseInt(themeBase.split('-')[2]); // e.g., 600

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

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      onAddTask(newTask.trim(), selectedPriority, selectedDate);
      setNewTask('');
      setSelectedPriority('none');
    }
  };

  const getFilteredTasks = () => {
    return propTasks.filter(task => {
      if (!showCompleted && task.completed) {
        return false;
      }
      if (filterPriority !== 'all' && task.priority !== filterPriority) {
        return false;
      }
      if (selectedDate) {
        const taskDate = new Date(task.createdAt);
        return taskDate.toDateString() === selectedDate.toDateString();
      }
      return true;
    });
  };

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
          
          <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DialogTrigger asChild>
              <button 
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <Filter className="h-5 w-5 text-white" />
              </button>
            </DialogTrigger>
            <DialogContent className={`${theme.colors} border-0 bg-opacity-5 backdrop-blur-md`}>
              <DialogHeader>
                <DialogTitle className="text-white">Filter by Priority</DialogTitle>
              </DialogHeader>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setFilterPriority('all');
                    setIsFilterOpen(false);
                  }}
                  className={`px-3 py-1 rounded-lg text-sm
                           ${filterPriority === 'all' ? themeBase + ' text-white' : 'bg-white/30 text-white'}`}
                >
                  All
                </button>
                {Object.entries(priorityColors).map(([priority, { color, text }]) => (
                  <button
                    key={priority}
                    onClick={() => {
                      setFilterPriority(priority);
                      setIsFilterOpen(false);
                    }}
                    className={`px-3 py-1 rounded-lg text-sm
                             ${filterPriority === priority ? color + ' text-white' : 'bg-white/30 text-white'}`}
                  >
                    {text}
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
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

          <div className="flex gap-2 items-center">
            <span className="text-sm text-white/90">Priority:</span>
            {Object.entries(priorityColors).map(([priority, { text }]) => (
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
            ))}
          </div>
        </div>
      </form>

      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-white/80">
            <p>No tasks yet! Add your first task to get started {theme.emoji}</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-lg 
                       hover:bg-white/20 transition-all duration-200
                       border-l-4 ${task.completed ? 'border-white/30' : priorityColors[task.priority].color}`}
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
                <span className={`${task.completed ? 'line-through text-white/50' : 'text-white'}`}>
                  {task.text}
                </span>
                <span className="text-xs text-white/70">
                  {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
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
          ))
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
  tasks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    createdAt: PropTypes.instanceOf(Date).isRequired,
    priority: PropTypes.oneOf(['none', 'low', 'medium', 'high']).isRequired
  })).isRequired,
  onAddTask: PropTypes.func.isRequired,
  onToggleTask: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  selectedDate: PropTypes.instanceOf(Date)
};

export default TaskList;