import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/signup.css";
import { useForm } from "react-hook-form";
import HandlerError from "../Utils/HandlerError";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);
  const handleRegistration = (data) => {
    fetch(process.env.BACKEND_URL + "/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(async (res) => {
        if (!res.ok) {
          const { message } = await res.json();
          HandlerError(message, "error");
        }
        return res.json();
      })
      .then((data) => {
        localStorage.setItem("token", data.token);
        const { message } = data;
        HandlerError(message, "success");
        navigate("/private");
      });
  };

  return (
    <div className="container signup">
      <form onSubmit={handleSubmit(handleRegistration)}>
        <div className="mb-3 row">
          <h2>Log in</h2>
          <label htmlFor="staticEmail" className="col-sm-2 col-form-label">
            Email:
          </label>
          <div
            className="col-sm-10 d-flex"
            style={{ flexDirection: "column", color: "red", fontSize: "10px" }}
          >
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">
                @
              </span>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Username"
                {...register("email", { required: "El correo es requerido" })}
              />
            </div>
            {errors?.email && errors.email.message}
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="inputPassword" className="col-sm-2 col-form-label">
            Password:
          </label>
          <div
            className="col-sm-10 d-flex"
            style={{ flexDirection: "column", color: "red", fontSize: "10px" }}
          >
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">
                @
              </span>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Password"
                {...register("password", {
                  required: "Este campo es requerido",
                })}
              />
            </div>
            {errors?.password && errors.password.message}
          </div>
        </div>
        <div className="mb-3 d-flex justify-content-evenly">
          <button type="button" className="btn btn-light">
            Clean up
          </button>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};
