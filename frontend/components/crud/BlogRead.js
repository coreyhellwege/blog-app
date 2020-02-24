import Link from "next/link";
import Router from "next/router";
import { useState, useEffect } from "react";
import { isAuth, getCookie } from "../../actions/auth";
import { list, removeBlog } from "../../actions/blog";

const BlogRead = () => {
  return (
    <React.Fragment>
      <p>Update/delete blogs</p>
    </React.Fragment>
  );
};

export default BlogRead;
