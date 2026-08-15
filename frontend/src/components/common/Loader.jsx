import React from "react";

const Loader = () => {
  return (
    <div className="text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>

      <p className="text-muted mt-3 mb-0">
        Loading...
      </p>
    </div>
  );
};

export default Loader;