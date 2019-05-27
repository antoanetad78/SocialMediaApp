import axios from "axios";
import { setAlert } from "./alert";
import {
  BASE_URL,
  GET_POST,
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES
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
