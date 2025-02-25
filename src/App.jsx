import { useState } from 'react';
import TaskList from './components/TaskList';
import Calendar from './components/Calendar';
import Navbar from './components/Navbar';
import ThemeDecorations from './components/ThemeDecorations';
import ErrorBoundary from './components/ErrorBoundary';
import { themes } from './constants/themes';

function App() {
  const [currentTheme, setCurrentTheme] = useState('ocean');
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleThemeChange = (newTheme) => {
    setCurrentTheme(newTheme);
  };

  const handleAddTask = (text, priority = 'none', dueDate = null) => {
    setTasks([...tasks, {
      id: Date.now(),
      text,
      completed: false,
      createdAt: dueDate || selectedDate,
      priority
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

  const handleEditTask = (taskId, newText, newPriority, newDueDate) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            text: newText,
            priority: newPriority,
            createdAt: newDueDate || task.createdAt
          }
        : task
    ));
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  return (
    <ErrorBoundary theme={themes[currentTheme]}>
      <div className={`min-h-screen ${themes[currentTheme].background} ${themes[currentTheme].text} relative overflow-hidden`}>
        <Navbar 
          currentTheme={currentTheme}
          onThemeChange={handleThemeChange}
          taskCount={tasks.length}
        />

        <main className="container mx-auto px-4 py-8 relative z-10 mb-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <TaskList
                theme={themes[currentTheme]}
                tasks={tasks}
                onAddTask={handleAddTask}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                onEditTask={handleEditTask}
                selectedDate={selectedDate}
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
      </div>
    </ErrorBoundary>
  );
}

export default App;