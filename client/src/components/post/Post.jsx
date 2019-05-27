import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { getPost } from "../../actions/post";
import PostItem from "../posts/PostItem";

const Post = ({ post: { post, loading }, getPost, match }) => {
  useEffect(() => {
    getPost(match.params.id);
  }, [getPost, match]);

  return loading || !post ? (
    <Spinner />
  ) : (
    <Fragment>
      <Link to="/posts" className="btn btn-light">
        Back to posts
      </Link>
      <PostItem post={post} showActions={false} />
    </Fragment>
  );
};

Post.propTypes = {
  getPost: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  post: state.post
});
export default connect(
  mapStateToProps,
  { getPost }
)(Post);
