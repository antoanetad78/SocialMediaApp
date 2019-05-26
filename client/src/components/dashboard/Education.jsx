import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Moment from "react-moment";
import { deleteEdu } from "../../actions/profile";

const Education = ({ education, deleteEdu }) => {
  if (education === []) {
    return (
      <Fragment>
        <p>No education added yet</p>
      </Fragment>
    );
  }
  const educations =
    education &&
    education.map(edu => (
      <tr key={edu._id}>
        <td>{edu.school}</td>
        <td className="hide-sm">{edu.degree}</td>
        <td className="hide-sm">
          <Moment format="YYYY/MM/DD">{edu.from}</Moment> -
          {!edu.to ? " Now" : <Moment format="YYYY/MM/DD">{edu.to}</Moment>}
        </td>
        <td>
          <button onClick={() => deleteEdu(edu._id)} className="btn btn-danger">
            Delete
          </button>
        </td>
      </tr>
    ));

  return (
    <Fragment>
      <h2 className="my-2">Education Credentials</h2>
      <table className="table">
        <thead>
          <tr>
            <th>School</th>
            <th className="hide-sm">Degree</th>
            <th className="hide-sm">Years</th>
            <th />
          </tr>
        </thead>

        <tbody>{educations}</tbody>
      </table>
    </Fragment>
  );
};

Education.propTypes = {
  education: PropTypes.array.isRequired,
  deleteEdu: PropTypes.func.isRequired
};

export default connect(
  null,
  { deleteEdu }
)(Education);
