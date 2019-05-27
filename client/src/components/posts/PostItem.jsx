import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Moment from "react-moment";

const PostItem = ({
  auth,
  post: { _id, text, name, avatar, likes, comments, date, user }
}) => {
  return (
    <div class="post bg-white p-1 my-1">
      <div>
        <a href="profile.html">
          <img class="round-img" src={avatar} alt="" />
          <h4>{name}</h4>
        </a>
      </div>
      <div>
        <p class="my-1">
          {text} <br />
        </p>
        <p class="post-date">
          Posted on <Moment format="DD / MM / YY" date={date} />
        </p>
        <button type="button" class="btn btn-light">
          <i class="fas fa-thumbs-up" />{" "}
          {likes.length > 0 && <span>{likes.length}</span>}
        </button>
        <button type="button" class="btn btn-light">
          <i class="fas fa-thumbs-down" />
        </button>
        <Link to={`/posts/${_id}`} class="btn btn-primary">
          Discussion{" "}
          {comments.length > 0 && (
            <span class="comment-count">{comments.length}</span>
          )}
        </Link>
        {!auth.loading && auth.user._id === user && (
          <button type="button" class="btn btn-danger">
            <i class="fas fa-times" />
          </button>
        )}
      </div>
    </div>
  );
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps,
  {}
)(PostItem);
