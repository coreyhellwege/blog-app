import { useState, useEffect } from "react";
import Layout from "../../../../components/Layout";
import { withRouter } from "next/router";
import { signup } from "../../../../actions/auth";
import jwt from "jsonwebtoken";

// grab token from the router and send it to the signup endpoint to create new user

const ActivateAccount = ({ router }) => {
  const [values, setValues] = useState({
    name: "",
    token: "",
    error: "",
    loading: false,
    success: false,
    showButton: true
  });

  const { name, token, error, loading, success, showButton } = values;

  // decode the token, just so we can access the user's name in the state
  // will run whenever the router changes
  useEffect(() => {
    let token = router.query.id; // must match the filename (id)
    if (token) {
      const { name } = jwt.decode(token);
      setValues({ ...values, name, token });
    }
  }, [router]);

  const clickSubmit = e => {
    e.preventDefault();
    setValues({ ...values, loading: true, error: false });
    // make request to the endpoint
    signup({ token }).then(data => {
      if (data.error) {
        setValues({
          ...values,
          error: data.error,
          loading: false,
          showButton: false
        });
      } else {
        setValues({
          ...values,
          loading: false,
          success: true,
          showButton: false
        });
      }
    });
  };

  const showLoading = () => (loading ? <h2>Loading...</h2> : "");

  return (
    <Layout>
      <div className="container">
        <h3 className="pb-4">Hey {name}, ready to activate your account?</h3>
        {showLoading()}
        {error && <div className="alert alert-danger">{error}</div>}
        {success && (
          <div className="alert alert-success">
            You have successfully activated your account. Please sign in.
          </div>
        )}
        {showButton && (
          <button className="btn btn-outline-primary" onClick={clickSubmit}>
            Activate Account
          </button>
        )}
      </div>
    </Layout>
  );
};

export default withRouter(ActivateAccount);
