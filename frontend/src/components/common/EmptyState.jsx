import React from 'react';
import PropTypes from 'prop-types';

function EmptyState({ message = "No data available" }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 text-center" role="status">
      <h2 className="text-xl font-semibold text-gray-600">
        {message}
      </h2>
    </div>
  );
}

EmptyState.propTypes = {
  message: PropTypes.string,
};

export default EmptyState;