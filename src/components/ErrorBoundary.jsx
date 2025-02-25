import { Component } from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error, errorInfo) {
    // You could add error logging here
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state;
    const { theme, children } = this.props;

    if (hasError) {
      return (
        <div className="p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-xl text-center">
          <div className="text-4xl mb-4" aria-hidden="true">
            {theme.emoji}
          </div>
          <h2 className="text-xl font-bold mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">
            {error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 
                     transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      );
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  theme: PropTypes.shape({
    emoji: PropTypes.string.isRequired
  }).isRequired
};

export default ErrorBoundary;