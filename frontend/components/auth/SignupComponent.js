import { useState } from "react";

const SignupComponent = () => {
  // state
  const [values, setValues] = useState({
    name: "Corey",
    email: "coreyhellwege@gmail.com",
    password: "123456789",
    error: "",
    loading: false,
    message: "",
    showForm: true
  });

  const { name, email, password, error, loading, message, showForm } = values; // destructure

  const handleSubmit = e => {
    e.preventDefault();
    console.table({ name, email, password, error, loading, message, showForm });
  };

  // func which returns a func
  const handleChange = name => e => {
    // keep existing values and set new values
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const signupForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            value={name}
            onChange={handleChange("name")}
            type="text"
            className="form-control"
            placeholder="Type your name"
          />
        </div>

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
          <button className="btn btn-primary">Sign Up</button>
        </div>
      </form>
    );
  };

  return <React.Fragment>{signupForm()}</React.Fragment>;
};

export default SignupComponent;
