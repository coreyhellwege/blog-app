import fetch from "isomorphic-fetch";
import cookie from "js-cookie";
import { API } from "../config";
import Router from "next/router";

export const handleResponse = response => {
  if (response.status === 401) {
    // run signout() to remove token & user from LS, and pass a callback
    signout(() => {
      // redirect user to login agin
      Router.push({
        pathname: "/signin",
        query: {
          message: "Session expired. Please sign in."
        }
      });
    });
  } else {
    return;
  }
};

export const preSignup = user => {
  return fetch(`${API}/pre-signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const signup = user => {
  return fetch(`${API}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const signin = user => {
  return fetch(`${API}/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const signout = next => {
  removeCookie("token");
  removeLocalStorage("user");
  next();

  return fetch(`${API}/signout`, {
    method: "GET"
  })
    .then(response => {
      console.log("Successfully signed out");
    })
    .catch(err => console.log(err));
};

export const setCookie = (key, value) => {
  if (process.browser) {
    cookie.set(key, value, {
      expires: 1 // day
    });
  }
};

export const removeCookie = key => {
  if (process.browser) {
    cookie.remove(key, {
      expires: 1 // day
    });
  }
};

export const getCookie = key => {
  if (process.browser) {
    return cookie.get(key);
  }
};

export const setLocalStorage = (key, value) => {
  if (process.browser) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const removeLocalStorage = (key, value) => {
  if (process.browser) {
    localStorage.removeItem(key);
  }
};

// authenticate user by passing data to cookie and localstorage
export const authenticate = (data, next) => {
  setCookie("token", data.token);
  setLocalStorage("user", data.user);
  next();
};

// returns a logged in user
export const isAuth = () => {
  if (process.browser) {
    const cookieChecked = getCookie("token");
    if (cookieChecked) {
      if (localStorage.getItem("user")) {
        return JSON.parse(localStorage.getItem("user")); // parse json object back into js
      } else {
        return false;
      }
    }
  }
};

// update user in localstorage
export const updateUser = (user, next) => {
  if (process.browser) {
    if (localStorage.getItem("user")) {
      // parse user into a JS object
      let auth = JSON.parse(localStorage.getItem("user"));
      auth = user; // auth will now contain the updated user data
      localStorage.setItem("user", JSON.stringify(auth));
      next(); // continue on..
    }
  }
};

export const forgotPassword = email => {
  // send email to the backend
  return fetch(`${API}/forgot-password`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(email)
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const resetPassword = resetInfo => {
  // send reset info to the backend
  return fetch(`${API}/reset-password`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(resetInfo)
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const loginWithGoogle = user => {
  // send user info to the backend
  return fetch(`${API}/google-login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const loginWithFacebook = user => {
  // send user info to the backend
  return fetch(`${API}/facebook-login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
    .then(response => {
      return response.json();  
    })
    .catch(err => console.log(err));
};
