import React from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";

const ProfileExperience = ({
  experience: { current, title, company, from, to, description }
}) => {
  return (
    <div>
      <h3 className="text-dark">Company: {company}</h3>
      {current ? (
        <p>
          <Moment format="DD-MM-YYYY" from={from} /> - <span> Current</span>
        </p>
      ) : (
        <p>
          <span>
            <Moment format="DD-MM-YYY" from={from}>
              {" "}
            </Moment>
          </span>{" "}
          -{" "}
          <span>
            <Moment format="DD-MM-YYY" to={to} />
          </span>
        </p>
      )}
      {title && (
        <p>
          <strong>Position: </strong>
          {title}
        </p>
      )}
      {description && (
        <p>
          <strong>Description: </strong>
          {description}
        </p>
      )}
    </div>
  );
};

ProfileExperience.propTypes = {
  experience: PropTypes.object.isRequired
};

export default ProfileExperience;
