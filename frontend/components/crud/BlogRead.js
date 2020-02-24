import Link from "next/link";
import Router from "next/router";
import { useState, useEffect } from "react";
import { isAuth, getCookie } from "../../actions/auth";
import { list, removeBlog } from "../../actions/blog";
import moment from "moment";

const BlogRead = () => {
  // state
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState("");
  const token = getCookie("token");

  // load all blogs
  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = () => {
    // get the data with list() action
    list().then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        setBlogs(data);
      }
    });
  };

  const deleteBlog = slug => {
    // use removeBlog method from actions to send request to backend
    removeBlog(slug, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        setMessage(data.message); // message from backend
        loadBlogs(); // refresh list
      }
    });
  };

  const deleteConfirm = slug => {
    let answer = window.confirm("Are you sure you want to delete this blog?");
    if (answer) {
      deleteBlog(slug);
    }
  };

  const showAllBlogs = () => {
    return blogs.map((blog, i) => {
      return (
        <div key={i} className="pb-5">
          <h3>{blog.title}</h3>
          <p className="mark">
            Written by {blog.postedBy.name} | Published on
            {moment(blog.updatedAt).fromNow()}
          </p>
          <buttn
            className="btn btn-sm btn-danger"
            onClick={() => deleteConfirm(blog.slug)}
          >
            Delete
          </buttn>
        </div>
      );
    });
  };

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-md-12">
          {message && <div className="alert alert-warning">{message}</div>}
          {showAllBlogs()}
        </div>
      </div>
    </React.Fragment>
  );
};

export default BlogRead;
