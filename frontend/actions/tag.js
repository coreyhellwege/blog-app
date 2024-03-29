import fetch from "isomorphic-fetch";
import { API } from "../config";
import { handleResponse } from "./auth";

export const create = (tag, token) => {
  return fetch(`${API}/tag`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(tag)
  })
    .then(response => {
      // before we return the response, pass it to handleResponse() to check if token is valid
      handleResponse(response);
      return response.json();
    })
    .catch(err => console.log(err));
};

export const getTags = () => {
  return fetch(`${API}/tags`, {
    method: "GET"
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const getTag = slug => {
  return fetch(`${API}/tag/${slug}`, {
    method: "GET"
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const removeTag = (slug, token) => {
  return fetch(`${API}/tag/${slug}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      // before we return the response, pass it to handleResponse() to check if token is valid
      handleResponse(response);
      return response.json();
    })
    .catch(err => console.log(err));
};
