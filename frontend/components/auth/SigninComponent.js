import { useState, useEffect } from "react";
import { signin, authenticate, isAuth } from "../../actions/auth";
import Router from "next/router";
import Link from "next/link";
import LoginGoogle from "./LoginGoogle";
import LoginFacebook from "./LoginFacebook";
import { connect } from "react-redux";
import { setAlert } from "../../redux/actions/alert";
import PropTypes from "prop-types";

const SigninComponent = ({ setAlert }) => {
  // get props from redux and destructure for cleaner syntax

  // state
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    loading: false,
    message: "",
    showForm: true,
  });

  const { email, password, error, loading, message, showForm } = values; // destructuring

  // runs automatically whenever there is a change in state. (replaces older lifecycle methods)
  useEffect(() => {
    isAuth() && Router.push(`/`);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, loading: true, error: false });
    const user = { email, password };

    signin(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        // save users token to cookies
        // save users info to localstorage
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

  // func which returns a func
  const handleChange = (name) => (e) => {
    // keep existing values and set new values
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const showLoading = () =>
    loading ? <div className="alert alert-info">Loading...</div> : "";

  const showError = () => (error ? setAlert(error, "danger") : "");

  const showMessage = () => (message ? setAlert(message, "info") : "");

  const signinForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            value={email}
            onChange={handleChange("email")}
            type="email"
            className="form-control"
            placeholder="Type your email address"
          />
        </div>

        <div className="form-group">
          <input
            value={password}
            onChange={handleChange("password")}
            type="password"
            className="form-control"
            placeholder="Type your password"
          />
        </div>

        <div>
          <button className="btn btn-primary">Sign In</button>
        </div>
      </form>
    );
  };

  return (
    <React.Fragment>
      {showError()}
      {showLoading()}
      {showMessage()}
      <div style={{ display: "flex" }}>
        <LoginGoogle />
        <LoginFacebook />
      </div>
      {showForm && signinForm()}
      <br />
      <Link href="/auth/password/forgot">
        <a className="btn btn-outline-danger btn-sm">Forgot password</a>
      </Link>
    </React.Fragment>
  );
};

SigninComponent.propTypes = {
  setAlert: PropTypes.func.isRequired,
};

// connect takes 2 params: State you wish to import, & object with actions you wish to use
export default connect(null, { setAlert })(SigninComponent);
