import { useState } from 'react';
import PropTypes from 'prop-types';

const STICKER_CATEGORIES = {
  events: {
    name: 'Events',
    stickers: {
      birthday: { emoji: '🎂', label: 'Birthday' },
      meeting: { emoji: '📊', label: 'Meeting' },
      deadline: { emoji: '⏰', label: 'Deadline' },
      party: { emoji: '🎉', label: 'Party' },
      travel: { emoji: '✈️', label: 'Travel' }
    }
  },
  general: {
    name: 'General',
    stickers: {
      important: { emoji: '⭐', label: 'Important' },
      urgent: { emoji: '🔥', label: 'Urgent' },
      idea: { emoji: '💡', label: 'Idea' },
      question: { emoji: '❓', label: 'Question' },
      note: { emoji: '📝', label: 'Note' }
    }
  },
  ocean: {
    name: 'Ocean',
    stickers: {
      fish: { emoji: '🐠', label: 'Fish' },
      dolphin: { emoji: '🐬', label: 'Dolphin' },
      whale: { emoji: '🐋', label: 'Whale' },
      octopus: { emoji: '🐙', label: 'Octopus' },
      shell: { emoji: '🐚', label: 'Shell' },
      wave: { emoji: '🌊', label: 'Wave' }
    }
  },
  forest: {
    name: 'Forest',
    stickers: {
      tree: { emoji: '🌲', label: 'Tree' },
      leaf: { emoji: '🍃', label: 'Leaf' },
      mushroom: { emoji: '🍄', label: 'Mushroom' },
      flower: { emoji: '🌸', label: 'Flower' },
      squirrel: { emoji: '🐿️', label: 'Squirrel' }
    }
  },
  weather: {
    name: 'Weather',
    stickers: {
      sun: { emoji: '☀️', label: 'Sun' },
      moon: { emoji: '🌙', label: 'Moon' },
      cloud: { emoji: '☁️', label: 'Cloud' },
      rain: { emoji: '🌧️', label: 'Rain' },
      snow: { emoji: '❄️', label: 'Snow' },
      rainbow: { emoji: '🌈', label: 'Rainbow' }
    }
  }
};

function StickersPanel({ onSelectSticker, currentTheme }) {
  const [activeCategory, setActiveCategory] = useState('events');

  const getThemeStyles = () => {
    const baseStyles = "rounded-lg shadow-lg p-4 backdrop-blur-sm";
    
    switch (currentTheme) {
      case 'ocean':
        return `${baseStyles} bg-blue-500/20`;
      case 'forest':
        return `${baseStyles} bg-green-500/20`;
      case 'sunset':
        return `${baseStyles} bg-orange-500/20`;
      case 'moonlight':
        return `${baseStyles} bg-indigo-500/20`;
      case 'aurora':
        return `${baseStyles} bg-teal-500/20`;
      default:
        return `${baseStyles} bg-gray-500/20`;
    }
  };

  const getCategoryButtonStyles = (category) => {
    const baseStyles = "px-3 py-1 rounded-full text-sm transition-colors duration-200";
    const isActive = category === activeCategory;

    switch (currentTheme) {
      case 'ocean':
        return `${baseStyles} ${isActive ? 'bg-blue-600 text-white' : 'bg-blue-300/20 text-white hover:bg-blue-300/40'}`;
      case 'forest':
        return `${baseStyles} ${isActive ? 'bg-green-600 text-white' : 'bg-green-300/20 text-white hover:bg-green-300/40'}`;
      case 'sunset':
        return `${baseStyles} ${isActive ? 'bg-orange-600 text-white' : 'bg-orange-300/20 text-white hover:bg-orange-300/40'}`;
      case 'moonlight':
        return `${baseStyles} ${isActive ? 'bg-indigo-600 text-white' : 'bg-indigo-300/20 text-white hover:bg-indigo-300/40'}`;
      case 'aurora':
        return `${baseStyles} ${isActive ? 'bg-teal-600 text-white' : 'bg-teal-300/20 text-white hover:bg-teal-300/40'}`;
      default:
        return `${baseStyles} ${isActive ? 'bg-gray-600 text-white' : 'bg-gray-300/20 text-white hover:bg-gray-300/40'}`;
    }
  };

  const getStickerButtonStyles = () => {
    const baseStyles = "p-2 rounded-lg transition-transform hover:scale-110 text-2xl";
    
    switch (currentTheme) {
      case 'ocean':
        return `${baseStyles} hover:bg-blue-300/20`;
      case 'forest':
        return `${baseStyles} hover:bg-green-300/20`;
      case 'sunset':
        return `${baseStyles} hover:bg-orange-300/20`;
      case 'moonlight':
        return `${baseStyles} hover:bg-indigo-300/20`;
      case 'aurora':
        return `${baseStyles} hover:bg-teal-300/20`;
      default:
        return `${baseStyles} hover:bg-gray-300/20`;
    }
  };

  return (
    <div className={getThemeStyles()}>
      <div className="mb-4">
        <h3 className="text-white text-lg mb-2">Add Sticker</h3>
        <div className="flex flex-wrap gap-2">
          {Object.keys(STICKER_CATEGORIES).map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={getCategoryButtonStyles(category)}
            >
              {STICKER_CATEGORIES[category].name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {Object.entries(STICKER_CATEGORIES[activeCategory].stickers).map(([key, { emoji, label }]) => (
          <button
            key={key}
            onClick={() => onSelectSticker({ key, emoji, label })}
            className={getStickerButtonStyles()}
            title={label}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

StickersPanel.propTypes = {
  onSelectSticker: PropTypes.func.isRequired,
  currentTheme: PropTypes.oneOf(['ocean', 'forest', 'sunset', 'moonlight', 'aurora']).isRequired
};

export default StickersPanel;