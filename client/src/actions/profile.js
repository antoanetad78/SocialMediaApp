import axios from "axios";
import { setAlert } from "./alert";

import {
  config,
  BASE_URL,
  GET_PROFILE,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  DELETE_ACCOUNT,
  CLEAR_PROFILE
} from "../constants";

// Get the current users profile

export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get(`${BASE_URL}api/profile/me`);
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status
      }
    });
  }
};

export const createProfile = (
  formData,
  history,
  edit = false
) => async dispatch => {
  try {
    const res = await axios.post(`${BASE_URL}api/profile`, formData, config);
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
    dispatch(setAlert(edit ? "Profile Updated" : "Profile Created", "success"));
    history.push("/dashboard");
  } catch (error) {
    const errors = error.response.data.errors;
    errors.forEach(error => dispatch(setAlert(error.msg, "danger")));

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status
      }
    });
  }
};

//Update profile with experience

export const addExperience = (formData, history) => async dispatch => {
  try {
    const res = await axios.put(
      `${BASE_URL}api/profile/experience`,
      formData,
      config
    );
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    history.push("/dashboard");
  } catch (error) {
    const errors = error.response.data.errors;
    errors.forEach(error => dispatch(setAlert(error.msg, "danger")));

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status
      }
    });
  }
};

export const addEducation = (formData, history) => async dispatch => {
  try {
    const res = await axios.put(
      `${BASE_URL}api/profile/education`,
      formData,
      config
    );
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    history.push("/dashboard");
  } catch (error) {
    const errors = error.response.data.errors;
    errors.forEach(error => dispatch(setAlert(error.msg, "danger")));

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status
      }
    });
  }
};

export const deleteExp = id => async dispatch => {
  try {
    const res = await axios.delete(`${BASE_URL}api/profile/experience/${id}`);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });
    dispatch(setAlert("Experience removed", "success"));
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status
      }
    });
  }
};

export const deleteEdu = id => async dispatch => {
  try {
    const res = await axios.delete(`${BASE_URL}api/profile/education/${id}`);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });
    dispatch(setAlert("Education removed", "success"));
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status
      }
    });
  }
};

export const deleteAccount = history => async dispatch => {
  if (window.confirm(" Are you sure? this can NOT be undone")) {
    try {
      await axios.delete(`${BASE_URL}api/profile`);
      dispatch({
        type: CLEAR_PROFILE
      });
      dispatch({
        type: DELETE_ACCOUNT
      });
      dispatch(setAlert("Account was permanently deleted", "success"));
      history.push("/");
    } catch (error) {
      console.log(error);

      dispatch({
        type: PROFILE_ERROR,
        payload: {
          msg: error.response.statusText,
          status: error.response.status
        }
      });
    }
  }
};
