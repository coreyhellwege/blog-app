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
import { API } from "../../config";

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

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [checked, setChecked] = useState([]); // categories
  const [checkedTag, setCheckedTag] = useState([]); // tags

  // destructure so that we can access the above variables more easily
  const { error, success, formData, title } = values;

  const token = getCookie("token");

  // get the blog from backend when the component mounts
  useEffect(() => {
    // make form data available
    setValues({ ...values, formData: new FormData() });
    initBlog();
    initCategories();
    initTags();
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
          setCategoriesArray(data.categories);
          setTagsArray(data.tags);
        }
      });
    }
  };

  const setCategoriesArray = blogCategories => {
    let ca = [];
    blogCategories.map((c, i) => {
      ca.push(c._id);
    });
    setChecked(ca);
  };

  const setTagsArray = blogTags => {
    let ta = [];
    blogTags.map((t, i) => {
      ta.push(t._id);
    });
    setCheckedTag(ta);
  };

  const initCategories = () => {
    getCategories().then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setCategories(data);
      }
    });
  };

  const initTags = () => {
    getTags().then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setTags(data);
      }
    });
  };

  const findOutCategory = c => {
    // search the cat id in the array of categories
    const result = checked.indexOf(c); // -1 = not found

    // if it's found, return true
    if (result !== -1) {
      return true;
    } else {
      return false;
    }
  };

  const findOutTag = t => {
    // search the tag id in the array of tags
    const result = checkedTag.indexOf(t); // -1 = not found

    // if it's found, return true
    if (result !== -1) {
      return true;
    } else {
      return false;
    }
  };

  const showCategories = () => {
    return (
      categories &&
      categories.map((c, i) => (
        <li key={i} className="list-unstyled">
          <input
            onChange={handleToggle(c._id)}
            checked={findOutCategory(c._id)}
            type="checkbox"
            className="mr-2"
          />
          <label className="form-check-label">{c.name}</label>
        </li>
      ))
    );
  };

  const showTags = () => {
    return (
      tags &&
      tags.map((t, i) => (
        <li key={i} className="list-unstyled">
          <input
            onChange={handleTagsToggle(t._id)}
            checked={findOutTag(t._id)}
            type="checkbox"
            className="mr-2"
          />
          <label className="form-check-label">{t.name}</label>
        </li>
      ))
    );
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
    e.preventDefault(); // so browser doesn't reload
    // pass the updated blog to our updateBlog method
    updateBlog(formData, token, router.query.slug).then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          title: "",
          success: `"${data.title}" has been successfully updated`
        });
        // then redirect user based on role
        // if (isAuth() && isAuth().role === 1) {
        //   Router.replace(`/admin/crud/${router.query.slug}`);
        // } else if (isAuth() && isAuth().role === 0) {
        //   Router.replace(`/user/crud/${router.query.slug}`);
        // }
      }
    });
  };

  const handleToggle = c => () => {
    setValues({ ...values, error: "" });

    // check if category ID is already in state
    // indexOf will either return the cat, or -1 if null
    const clickedCategory = checked.indexOf(c);
    const all = [...checked];

    // if state is empty, push the cat in
    if (clickedCategory === -1) {
      all.push(c);
      // if cat is in the state, get it out
    } else {
      all.splice(clickedCategory, 1);
    }
    console.log(all);
    setChecked(all);
    // send data to backend
    formData.set("categories", all);
  };

  const handleTagsToggle = t => () => {
    setValues({ ...values, error: "" });

    const clickedTag = checkedTag.indexOf(t);
    const all = [...checkedTag];

    if (clickedTag === -1) {
      all.push(t);
    } else {
      all.splice(clickedTag, 1);
    }
    console.log(all);
    setCheckedTag(all);

    formData.set("tags", all);
  };

  const showError = () => (
    // use css to show error if it's there, or hide it if not
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  const showSuccess = () => (
    <div
      className="alert alert-success"
      style={{ display: success ? "" : "none" }}
    >
      {success}
    </div>
  );

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
            {showSuccess()}
            {showError()}
          </div>
          {/* only show image if the blog is available */}
          {body && (
            <img
              src={`${API}/blog/photo/${router.query.slug}`}
              alt={title}
              style={{ width: "100%" }}
            />
          )}
        </div>
        <div className="col-md-4">
          <div>
            <div className="form-group pb-2">
              <h5>Featured Image</h5>
              <hr />
              <small className="text-muted">Max size: 1mb</small>
              <label className="btn btn-outline-info">
                Upload Featured Image
                <input
                  onChange={handleChange("photo")}
                  type="file"
                  accept="image/*"
                  hidden
                />
              </label>
            </div>
          </div>
          <div>
            <h5>Categories</h5>
            <hr />
            <ul style={{ maxHeight: "100px", overflowY: "scroll" }}>
              {showCategories()}
            </ul>
          </div>
          <div>
            <h5>Tags</h5>
            <hr />
            <ul style={{ maxHeight: "100px", overflowY: "scroll" }}>
              {showTags()}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(BlogUpdate);
