import PropTypes from 'prop-types';

function LoadingSpinner({ size = 'default', theme }) {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex justify-center items-center">
      <output 
        className={`${sizeClasses[size]} border-4 border-t-transparent 
                    rounded-full animate-spin inline-block`}
        style={{
          borderColor: `${theme.name.toLowerCase() === 'ocean' 
            ? '#3b82f6' 
            : 'currentColor'}`
        }}
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </output>
    </div>
  );
}

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'default', 'large']),
  theme: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired
};

export default LoadingSpinner;