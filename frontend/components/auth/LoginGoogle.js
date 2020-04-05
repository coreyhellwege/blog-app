import Link from "next/link";
import { useState, useEffect } from "react";
import Router from "next/router";
import { loginWithGoogle, authenticate, isAuth } from "../../actions/auth";
import { GOOGLE_CLIENT_ID } from "../../config";
import GoogleLogin from "react-google-login";

const LoginGoogle = () => {
  const responseGoogle = response => {
    // console.log(response);
    const tokenId = response.tokenId;
    const user = { tokenId };

    loginWithGoogle(user).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        // save user's token to cookies
        // save user's info to localstorage
        // authenticate user
        authenticate(data, () => {
          // redirect user to specific page based on their role
          if (isAuth() && isAuth().role === 1) {
            Router.push(`/admin`);
          } else {
            Router.push(`/user`);
          }
        });
      }
    });
  };
  return (
    <div className="pb-3">
      <GoogleLogin
        clientId={`${GOOGLE_CLIENT_ID}`}
        buttonText="Login with Google"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        theme="dark"
      />
    </div>
  );
};

export default LoginGoogle;
