import { SET_ALERT, REMOVE_ALERT } from "./types";
const shortId = require("shortid");

export const setAlert = (msg, alertType, timeout = 5000) => (dispatch) => {
  // create a random id
  const id = shortId.generate();
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id },
  });

  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};
