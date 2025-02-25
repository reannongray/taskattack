import PropTypes from 'prop-types';

function ThemeDecorations({ currentTheme }) {
  const renderDecorations = () => {
    switch (currentTheme) {
      case 'ocean':
        return (
          <>
            <div className="absolute bottom-0 left-0 right-0 h-32 
                          bg-gradient-to-t from-blue-200/30 to-transparent" />
            <div className="bubble-animation">
              {Array.from({ length: 5 }, () => ({
                id: Math.random().toString(36).slice(2, 11),
                size: Math.random() * 30 + 10,
                left: Math.random() * 100,
                duration: Math.random() * 3 + 2,
                delay: Math.random() * 2
              })).map((bubble) => (
                <div
                  key={bubble.id}
                  className="absolute rounded-full bg-white/20"
                  style={{
                    width: `${bubble.size}px`,
                    height: `${bubble.size}px`,
                    left: `${bubble.left}%`,
                    bottom: '-20px',
                    animation: `float ${bubble.duration}s infinite ease-in-out ${bubble.delay}s`
                  }}
                />
              ))}
            </div>
          </>
        );
      
      case 'forest':
        return (
          <div className="absolute bottom-0 left-0 right-0 h-32 
                        bg-gradient-to-t from-green-200/30 to-transparent" />
        );
      
      case 'sunset':
        return (
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-300/20 
                          rounded-full blur-xl transform -translate-y-1/2 -translate-x-1/2" />
            <div className="absolute bottom-0 left-0 right-0 h-32 
                          bg-gradient-to-t from-orange-200/30 to-transparent" />
          </div>
        );
      
      case 'moonlight':
        return (
          <div className="absolute inset-0">
            <div className="absolute top-10 right-10 w-20 h-20 bg-indigo-200/30 
                          rounded-full blur-md" />
            <div className="absolute bottom-0 left-0 right-0 h-32 
                          bg-gradient-to-t from-indigo-200/20 to-transparent" />
          </div>
        );
      
      case 'aurora':
        return (
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 right-0 h-64 
                          bg-gradient-to-b from-teal-200/20 via-emerald-200/10 to-transparent 
                          animate-aurora" />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {renderDecorations()}
    </div>
  );
}

ThemeDecorations.propTypes = {
  currentTheme: PropTypes.oneOf(['ocean', 'forest', 'sunset', 'moonlight', 'aurora']).isRequired
};

export default ThemeDecorations;