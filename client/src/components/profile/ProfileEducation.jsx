import React from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";

const ProfileEducation = ({
  education: { current, school, from, to, degree, fieldofstudy, description }
}) => {
  console.log(from);

  return (
    <div>
      <h3>{school}</h3>
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

      <p>
        <strong>Degree: </strong>
        {degree}
      </p>
      <p>
        <strong>Field Of Study: </strong>
        {fieldofstudy}
      </p>
      <p>
        <strong>Description: </strong>
        {description}
      </p>
    </div>
  );
};

ProfileEducation.propTypes = {
  education: PropTypes.object.isRequired
};

export default ProfileEducation;
