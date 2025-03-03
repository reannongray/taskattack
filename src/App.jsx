import { useState } from 'react';
import TaskList from './components/TaskList';
import Calendar from './components/Calendar';
import Navbar from './components/Navbar';
import ThemeDecorations from './components/ThemeDecorations';
import ErrorBoundary from './components/ErrorBoundary';
import TimelineView from './components/TimelineView';
import WeatherWidget from './components/WeatherWidget';
import WeatherRecommendations from './components/WeatherRecommendations';
import { themes } from './constants/themes';

function App() {
  const [currentTheme, setCurrentTheme] = useState('ocean');
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [weatherData, setWeatherData] = useState(null);

  const handleThemeChange = (newTheme) => {
    setCurrentTheme(newTheme);
  };

  const handleToggleTimeline = () => {
    setIsTimelineOpen(!isTimelineOpen);
  };

  const handleWeatherUpdate = (data) => {
    setWeatherData(data);
  };

  const handleAddTask = (text, priority = 'none', dueDate = null, stickers = [], location = 'any') => {
    setTasks([...tasks, {
      id: Date.now(),
      text,
      completed: false,
      createdAt: dueDate || selectedDate,
      priority,
      stickers: stickers || [],
      location
    }]);
  };

  const handleToggleTask = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleEditTask = (taskId, newText, newPriority, newDueDate, newStickers, newLocation) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            text: newText || task.text,
            priority: newPriority || task.priority,
            createdAt: newDueDate || task.createdAt,
            stickers: newStickers !== undefined ? newStickers : task.stickers,
            location: newLocation || task.location
          }
        : task
    ));
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleTaskSelect = (taskId) => {
    setSelectedTaskId(taskId);
    // Find the task and set the selected date to that task's date
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedDate(new Date(task.createdAt));
    }
  };

  const handleAddSticker = (taskId, sticker) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const newStickers = [...(task.stickers || []), sticker];
      handleEditTask(taskId, task.text, task.priority, task.createdAt, newStickers);
    }
  };

  const handleRemoveSticker = (taskId, stickerIndex) => {
    const task = tasks.find(t => t.id === taskId);
    // Fix the linting error by using optional chaining
    if (task?.stickers) {
      const newStickers = [...task.stickers];
      newStickers.splice(stickerIndex, 1);
      handleEditTask(taskId, task.text, task.priority, task.createdAt, newStickers);
    }
  };

  return (
    <ErrorBoundary theme={themes[currentTheme]}>
      <div className={`min-h-screen ${themes[currentTheme].background} ${themes[currentTheme].text} relative overflow-hidden`}>
        <Navbar 
          currentTheme={currentTheme}
          onThemeChange={handleThemeChange}
          taskCount={tasks.length}
          tasks={tasks}
          onTaskSelect={handleTaskSelect}
          onToggleTimeline={handleToggleTimeline}
          weatherWidget={
            <WeatherWidget 
              currentTheme={currentTheme} 
              onWeatherUpdate={handleWeatherUpdate} 
            />
          }
        />

        <main className="container mx-auto px-4 py-8 relative z-10 mb-16">
          <div className="max-w-7xl mx-auto">
            {weatherData && (
              <WeatherRecommendations
                weather={weatherData}
                tasks={tasks}
                theme={themes[currentTheme]}
                onTaskSelect={handleTaskSelect}
              />
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <TaskList
                theme={themes[currentTheme]}
                currentTheme={currentTheme}
                tasks={tasks}
                onAddTask={handleAddTask}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                onEditTask={handleEditTask}
                onAddSticker={handleAddSticker}
                onRemoveSticker={handleRemoveSticker}
                selectedDate={selectedDate}
                selectedTaskId={selectedTaskId}
              />

              <Calendar 
                theme={themes[currentTheme]}
                tasks={tasks}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
              />
            </div>
          </div>
        </main>

        <ThemeDecorations currentTheme={currentTheme} />
        
        {isTimelineOpen && (
          <TimelineView
            isOpen={isTimelineOpen}
            onClose={() => setIsTimelineOpen(false)}
            tasks={tasks}
            theme={themes[currentTheme]}
            currentTheme={currentTheme}
            onTaskUpdate={handleEditTask}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;