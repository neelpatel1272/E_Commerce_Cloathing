import React from "react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ title, parent = "Home", parentLink = "/" }) => {
  return (
    <section className="collection-breadcrumb">
      <div className="container">
        <div className="collection-breadcrumb-content">

          <div className="collection-breadcrumb-nav">
            <Link to={parentLink}>
              {parent}
            </Link>

            <span>›</span>

            <strong>
              {title}
            </strong>
          </div>

          <h1>
            {title}
          </h1>

        </div>
      </div>
    </section>
  );
};

export default Breadcrumb;