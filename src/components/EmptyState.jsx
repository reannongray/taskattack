import PropTypes from 'prop-types';

function EmptyState({ type, theme }) {
  const getEmptyStateContent = () => {
    switch (type) {
      case 'tasks':
        return {
          icon: '📝',
          title: 'No Tasks Yet',
          message: 'Add your first task to get started!'
        };
      case 'calendar':
        return {
          icon: '📅',
          title: 'No Events Planned',
          message: 'Your schedule is clear for now.'
        };
      case 'search':
        return {
          icon: '🔍',
          title: 'No Results Found',
          message: 'Try adjusting your search terms.'
        };
      default:
        return {
          icon: theme.emoji,
          title: 'Nothing Here Yet',
          message: 'Get started by adding some content!'
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="text-4xl mb-4" aria-hidden="true">
        {content.icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{content.title}</h3>
      <p className="text-gray-600">{content.message}</p>
    </div>
  );
}

EmptyState.propTypes = {
  type: PropTypes.oneOf(['tasks', 'calendar', 'search', 'default']).isRequired,
  theme: PropTypes.shape({
    emoji: PropTypes.string.isRequired
  }).isRequired
};

export default EmptyState;