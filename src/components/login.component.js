import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

import { UserAuth } from "../actions/auth";
import { Form } from "react-bootstrap";
import { Input } from "@mui/material";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        ¡Este campo es requerido!
      </div>
    );
  }
};

const Login = (props) => {
  let navigate = useNavigate();
  const { login } = UserAuth();
  const { auth: currentUser } = useSelector((state) => state.auth);

  const form = useRef();
  const checkBtn = useRef();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { isLoggedIn } = useSelector((state) => state.auth);
  const { msg } = useSelector((state) => state.message);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log(currentUser.isLoggedIn, currentUser);
    if (currentUser.isLoggedIn) {
      navigate("/");
    } else if (currentUser.user?.reset_password === 1) {
      navigate("/changepassword");
    }
  }, []);

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    setLoading(true);

    //form.current.validateAll();

    //if (checkBtn.current.context._errors.length === 0) {
      const data = {
        username: username,
        password: password,
      };
      console.log("login", data);
      login(data)
        .then((res) => {
          console.log("data", res);
          navigate("/");
        })
        .catch((res) => {
          console.log("catch",res);
          setLoading(false);
        });
    /* } else {
      setLoading(false);
    } */
  };

  if (isLoggedIn) {
    navigate("/");
  }

  return (
    <div className="container col-md-6">
      <div className="card card-container">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
          width="60px"
          style={{"margin": "0 auto"}}
        />

        <Form onSubmit={handleLogin} ref={form}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <Input
              type="text"
              className="form-control"
              name="username"
              value={username}
              onChange={onChangeUsername}
              validations={[required]}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <Input
              type="password"
              className="form-control"
              name="password"
              value={password}
              onChange={onChangePassword}
              validations={[required]}
            />
          </div>

          <div className="form-group">
            <button className="btn btn-primary btn-block" disabled={loading}>
              {loading && (
                <span className="spinner-border spinner-border-sm"></span>
              )}
              <span>Login</span>
            </button>
          </div>

          {msg && (
            <div className="form-group">
              <div className="alert alert-danger" role="alert">
                Text-{msg}
              </div>
            </div>
          )}
          {/* <CheckButton style={{ display: "none" }} ref={checkBtn} /> */}
        </Form>
      </div>
    </div>
  );
};

export default Login;
