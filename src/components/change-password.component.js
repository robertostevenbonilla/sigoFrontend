import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import { UserAuth } from "../actions/auth";
import { usuarioForm } from "../helpers/forms";
import { TextField } from "@mui/material";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        ¡Este campo es requerido!
      </div>
    );
  }
};

const ChangePassword = (props) => {
  const { logout } = UserAuth();
  const { resetPassword } = UserAuth();

  let navigate = useNavigate();
  const checkBtn = useRef();
  const [formUsuario, setForm] = useState(usuarioForm);
  const [loading, setLoading] = useState(false);

  const { auth: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log(currentUser);
    if (!currentUser?.isLoggedIn) {
      navigate("/login");
    } else {
      setForm({ ...formUsuario, ...currentUser.auth });
      console.log("ChangePassword", currentUser);
    }
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("handleChangePassword");
    resetPassword({ ...formUsuario })
      .then((res) => {
        console.log("data", res);
        logout().then((respose) => {
          navigate("/login");
        });
      })
      .catch((res) => {
        console.log("catch", res);
        setLoading(false);
      });
  };

  const onChange = (e, name = null, value = null) => {
    const inputName = name !== null ? name : e.target.name;
    const inputValue = value !== null ? value : e.target.value;
    console.log(inputName, inputValue, formUsuario);
    setForm({ ...formUsuario, [inputName]: inputValue });
  };

  return (
    <div className="col-md-12">
      <div className="card card-container">

        <Form onSubmit={handleChangePassword} sx={{ padding: "20px" }}>
          <div className="form-group">
            <TextField
              type="text"
              className="form-control"
              name="username"
              label="Usuario"
              value={formUsuario?.username}
              validations={[required]}
              disabled
              readOnly
              sx={{ marginBottom: "20px" }}
            />
          </div>

          <div className="form-group">
            <TextField
              type="password"
              className="form-control"
              name="password"
              label="Contraseña actual"
              value={formUsuario?.password}
              onChange={onChange}
              validations={[required]}
              sx={{ marginBottom: "20px" }}
            />
          </div>

          <div className="form-group">
            <TextField
              type="password"
              className="form-control"
              name="newPassword"
              label="Contraseña Nueva"
              value={formUsuario?.newPassword}
              onChange={onChange}
              validations={[required]}
              sx={{ marginBottom: "20px" }}
            />
          </div>

          <div className="form-group">
            <button className="btn btn-primary btn-block" disabled={loading}>
              {loading && (
                <span className="spinner-border spinner-border-sm"></span>
              )}
              <span>Cambiar contraseña</span>
            </button>
          </div>
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>
      </div>
    </div>
  );
};

export default ChangePassword;
