import fetch from "isomorphic-fetch";
import { API } from "../config";

// endpoints
export const emailContactForm = data => {
  let emailEndpoint;

  // dynamically assign endpoint based on user role
  if (data.authorEmail) {
    emailEndpoint = `${API}/contact-blog-author`;
  } else {
    emailEndpoint = `${API}/contact`;
  }

  return fetch(`${emailEndpoint}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const listBlogsWithCategoriesAndTags = (skip, limit) => {
  const data = {
    limit,
    skip
  };
  return fetch(`${API}/blogs-categories-tags`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const singleBlog = slug => {
  return fetch(`${API}/blog/${slug}`, {
    method: "GET"
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const listRelated = blog => {
  return fetch(`${API}/blogs/related`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(blog)
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const list = username => {
  let listBlogEndpoint;
  // dynamically assign endpoint based on if a username is given
  if (username) {
    listBlogEndpoint = `${API}/${username}/blogs`;
  } else {
    listBlogEndpoint = `${API}/blogs`;
  }

  return fetch(`${listBlogEndpoint}`, {
    method: "GET"
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

export const removeBlog = (slug, token) => {
  let deleteBlogEndpoint;
  // dynamically assign endpoint based on user role
  if (isAuth() && isAuth().role === 1) {
    deleteBlogEndpoint = `${API}/blog/${slug}`;
  } else if (isAuth() && isAuth().role === 0) {
    deleteBlogEndpoint = `${API}/user/blog/${slug}`;
  }

  return fetch(`${deleteBlogEndpoint}`, {
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

export const updateBlog = (blog, token, slug) => {
  let updateBlogEndpoint;
  // dynamically assign endpoint based on user role
  if (isAuth() && isAuth().role === 1) {
    updateBlogEndpoint = `${API}/blog/${slug}`;
  } else if (isAuth() && isAuth().role === 0) {
    updateBlogEndpoint = `${API}/user/blog/${slug}`;
  }

  return fetch(`${updateBlogEndpoint}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    body: blog // send form data
  })
    .then(response => {
      // before we return the response, pass it to handleResponse() to check if token is valid
      handleResponse(response);
      return response.json();
    })
    .catch(err => console.log(err));
};

export const listSearch = params => {
  console.log("search params:", params); // before

  // create query
  let query = queryString.stringify(params);
  console.log("query params:", query); // after

  // instead of passing query params (like you would for a post method)
  // we're using a get method and passing a query string:
  return fetch(`${API}/blogs/search?${query}`, {
    method: "GET"
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};
