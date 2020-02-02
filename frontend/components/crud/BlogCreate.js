import Link from "next/link";
import Router from "next/router";
import dynamic from "next/dynamic";
import { withRouter } from "next/Router";
import { useState, useEffect } from "react";
import { isAuth, getCookie } from "../../actions/auth";
import { getCategories } from "../../actions/category";
import { getTags } from "../../actions/tag";
import { createBlog } from "../../actions/blog";
const ReactQuill = dynamic(() => import("react-quill", { ssr: false })); // dynamic import

const CreateBlog = ({ router }) => {
  return (
    <div>
      <h2>Create Blog Form</h2>
      {JSON.stringify(router)}; // see what the router is
    </div>
  );
};

export default withRouter(CreateBlog); // withRouter allows us to export router props
