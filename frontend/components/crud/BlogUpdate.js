import Link from "next/link";
import Router from "next/router";
import dynamic from "next/dynamic";
import { withRouter } from "next/router";
import { useState, useEffect } from "react";
import { isAuth, getCookie } from "../../actions/auth";
import { getCategories } from "../../actions/category";
import { getTags } from "../../actions/tag";
import { singleBlog, updateBlog } from "../../actions/blog";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import { QuillModules, QuillFormats } from "../../helpers/quill";

const BlogUpdate = ({ router }) => {
  // state
  const [body, setBody] = useState("");
  const [values, setValues] = useState({
    title: "",
    error: "",
    success: "",
    formData: "",
    body: ""
  });

  // destructure so that we can access the above variables more easily
  const { error, success, formData, title } = values;

  // get the blog from backend when the component mounts
  useEffect(() => {
    // make form data available
    setValues({ ...values, formData: new FormData() });
    initBlog();
  }, [router]); // trigger useEffect whenever the router changes

  const initBlog = () => {
    // get slug from the router props using the singleBlog method
    if (router.query.slug) {
      singleBlog(router.query.slug).then(data => {
        if (data.error) {
          console.log(data.error);
        } else {
          // make the blog available in the state
          setValues({ ...values, title: data.title });
          setBody(data.body);
        }
      });
    }
  };

  // event handlers

  const handleChange = name => e => {
    // console.log(e.target.value);
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    // populate form data with values (name = title, photo etc..)
    formData.set(name, value);
    // update state
    setValues({ ...values, [name]: value, formData, error: "" });
  };

  const handleBody = e => {
    // set body with the event
    setBody(e);
    // update form data
    formData.set("body", e);
  };

  const editBlog = e => {
    console.log("updated blog");
  };

  const updateBlogForm = () => {
    return (
      <form onSubmit={editBlog}>
        <div className="form-group">
          <label className="text-muted">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={handleChange("title")}
          />
        </div>
        <div className="form-group">
          <ReactQuill
            modules={QuillModules}
            formats={QuillFormats}
            value={body}
            placeholder="Write something amazing..."
            onChange={handleBody}
          />
        </div>
        <div>
          <button type="submit" className="btn btn-primary">
            Update
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="container-fluid pb-5">
      <div className="row">
        <div className="col-md-8">
          {updateBlogForm()}
          <div className="pt-3">
            <p>show success and error</p>
          </div>
        </div>
        <div className="col-md-4">
          <div>
            <div className="form-group pb-2">
              <h5>Featured Image</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(BlogUpdate);
