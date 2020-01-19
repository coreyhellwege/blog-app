import { useState } from "react";
import { signin, authenticate } from "../../actions/auth";
import Router from "next/router";

const SigninComponent = () => {
  // state
  const [values, setValues] = useState({
    email: "coreyhellwege@gmail.com",
    password: "password",
    error: "",
    loading: false,
    message: "",
    showForm: true
  });

  const { email, password, error, loading, message, showForm } = values; // destructure

  const handleSubmit = e => {
    e.preventDefault();
    setValues({ ...values, loading: true, error: false });
    const user = { email, password };

    signin(user).then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        // save users token to cookies
        // save users info to localstorage
        // authenticate user
        authenticate(data, () => {
          Router.push(`/`); // redirect user to specific page
        });
      }
    });
  };

  // func which returns a func
  const handleChange = name => e => {
    // keep existing values and set new values
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const showLoading = () =>
    loading ? <div className="alert alert-info">Loading...</div> : "";

  const showError = () =>
    error ? <div className="alert alert-danger">{error}</div> : "";

  const showMessage = () =>
    message ? <div className="alert alert-info">{message}</div> : "";

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
      {showForm && signinForm()}
    </React.Fragment>
  );
};

export default SigninComponent;
