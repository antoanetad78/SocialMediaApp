import axios from "axios";
import { setAlert } from "./alert";
import {
  config,
  BASE_URL,
  GET_POST,
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST
} from "../constants";

export const getPosts = () => async dispatch => {
  try {
    const res = await axios.get(`${BASE_URL}api/posts`);
    dispatch({
      type: GET_POSTS,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

export const getPost = (id, history) => async dispatch => {
  try {
    const res = await axios.get(`${BASE_URL}api/posts/${id}`);

    dispatch({
      type: GET_POST,
      payload: res.data
    });
  } catch (error) {
    history.push("/");
    dispatch({
      type: POST_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

export const addLike = (postId, history) => async dispatch => {
  try {
    const res = await axios.put(`${BASE_URL}api/posts/like/${postId}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { postId, likes: res.data }
    });
  } catch (error) {
    if (!error.response) {
      history.push("/login");
    }
    dispatch({
      type: POST_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

export const removeLike = postId => async dispatch => {
  try {
    const res = await axios.put(`${BASE_URL}api/posts/unlike/${postId}`);
    dispatch({
      type: UPDATE_LIKES,
      payload: { postId, likes: res.data }
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

export const deletePost = id => async dispatch => {
  try {
    await axios.delete(`${BASE_URL}api/posts/${id}`);

    dispatch({
      type: DELETE_POST,
      payload: id
    });
    dispatch(setAlert("Post successfully removed", "success"));
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

export const addPost = formData => async dispatch => {
  try {
    const res = await axios.post(`${BASE_URL}api/posts`, formData, config);

    dispatch({
      type: ADD_POST,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};
