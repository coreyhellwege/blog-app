import Link from "next/link";
import { useState, useEffect } from "react";
import Router from "next/router";
import FacebookLogin from "react-facebook-login";
import { loginWithFacebook, authenticate, isAuth } from "../../actions/auth";
import { FACEBOOK_APP_ID } from "../../config";

const LoginFacebook = () => {
  const responseFacebook = response => {

    const tokenId = response.accessToken;
    const email = response.email;
    const name = response.name;
    const user = { tokenId, email, name };
    // console.log(user);

    loginWithFacebook(user).then(data => {
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

  // const componentClicked = () => {
  //   console.log("clicked");
  //   responseFacebook();
  // };

  // todo: save fb photo for our profile image
  return (
    <div>
      <FacebookLogin
        appId={`${FACEBOOK_APP_ID}`}
        autoLoad={false}
        fields="name,email,picture"
        // onClick={responseFacebook}
        callback={responseFacebook}
      />
    </div>
  );
};

export default LoginFacebook;
