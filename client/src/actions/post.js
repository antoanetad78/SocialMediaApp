import axios from "axios";
import { setAlert } from "./alert";
import { BASE_URL, GET_POST, GET_POSTS, POST_ERROR } from "../constants";

export const getPosts = () => async dispatch => {
  try {
    const res = await axios.get(`${BASE_URL}api/posts`);
    console.log(res);

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
