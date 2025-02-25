import PropTypes from 'prop-types';

function DayCard({ date, tasks = [] }) {
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
  const dayNumber = date.getDate();
  const hasTask = tasks.length > 0;

  return (
    <div className="text-center p-2 bg-white/50 rounded-lg hover:bg-white/70 
                    transition-colors duration-200 cursor-pointer group">
      <p className="font-medium">{dayName}</p>
      <p className="text-sm">{dayNumber}</p>
      {hasTask && (
        <div className="mt-1 flex justify-center gap-1">
          <span 
            className="w-2 h-2 bg-blue-500 rounded-full"
            aria-label={`${tasks.length} tasks on this day`}
          />
        </div>
      )}
    </div>
  );
}

DayCard.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  tasks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired
  }))
};

export default DayCard;