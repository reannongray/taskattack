# Task Attack 🌊

Task Attack is a visually appealing, theme-based task management application built with React, Tailwind CSS, and Vite. It features a beautiful, responsive interface with various ocean and nature-inspired themes.

![Task Attack Screenshot](screenshot.png)

## Features

- 📝 Create, complete, and delete tasks
- 📅 Calendar view for task planning and organization
- 🎨 Multiple themes (Ocean, Forest, Sunset, Moonlight, Aurora)
- 🔍 Filter tasks by priority and completion status
- 📱 Responsive design for all screen sizes
- 🔔 Task count notifications

## Tech Stack

- React
- Tailwind CSS
- Vite
- Lucide React Icons
- Lodash

## Installation

1. Clone the repository:
```bash
git clone https://github.com/reannongray/taskattack.git
cd taskattack
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Project Structure

```
taskattack/
├── src/
│   ├── App.jsx              # Main application component
│   ├── components/
│   │   ├── Calendar.jsx     # Calendar display component
│   │   ├── Navbar.jsx       # Navigation bar with theme switcher
│   │   ├── TaskList.jsx     # Task management component
│   │   └── ThemeDecorations.jsx # Theme-specific visual elements
│   ├── constants/
│   │   └── themes.js        # Theme definitions
│   └── main.jsx             # Application entry point
└── public/
    └── wave.svg             # Task Attack logo
```

## Usage

- Add tasks with the input field at the top of the task list
- Select a priority level for each task
- Click on a calendar date to filter tasks for that day
- Use the theme switcher in the navbar to change the visual theme
- Toggle task completion by clicking the checkbox
- Delete tasks with the trash icon

## Themes

- 🌊 Ocean - Calming blue tones with wave decorations
- 🌲 Forest - Refreshing green tones inspired by forests
- 🌅 Sunset - Warm orange and pink tones 
- 🌙 Moonlight - Elegant indigo and purple night theme
- ✨ Aurora - Ethereal teal and emerald theme

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request


## Acknowledgments

- Inspired by modern task management apps with a fresh ocean-themed twist
- Created with a focus on visual appeal and user experience
- Special thanks to the React and Tailwind CSS communities