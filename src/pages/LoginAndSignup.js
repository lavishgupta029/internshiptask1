import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { authenticate } from "../auth/token";
import { useHistory } from "react-router-dom";
import { showError, showSuccess } from "../utils";

import "./LoginAndSignup.css";
import "react-toastify/dist/ReactToastify.css";

function LoginAndSignup() {
  const [value, setValue] = useState(false);
  const [signupvalues, setsignupvalues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmpassword: "",
    photo: "",
  });
  const [signinvalues, setsigninvalues] = useState({
    signemail: "",
    signpassword: "",
  });
  const { firstName, lastName, email, password, confirmpassword } =
    signupvalues;
  const { signemail, signpassword } = signinvalues;
  const handleChange = (name) => (event) => {
    setsignupvalues({ ...signupvalues, [name]: event.target.value });
  };
  const handleChangesignin = (name) => (event) => {
    setsigninvalues({ ...signinvalues, [name]: event.target.value });
  };

  const history = useHistory();

  const Signupuser = (user) => {
    return fetch(`http://localhost:3001/api/signup`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const clickSubmit = (event) => {
    event.preventDefault();
    Signupuser({ firstName, lastName, email, password, confirmpassword }).then(
      (data) => {
        if (data?.message) {
          showError(data.message);
        } else {
          authenticate(data);
          showSuccess(
            "Succesfully signed up,you will be redirected to your Details"
          );
          setTimeout(function () {
            history.push("/userdetails");
          }, 2500);
        }
      }
    );
  };
  const Signinuser = (user) => {
    return fetch(`http://localhost:3001/api/signin`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const clickSubmitSigninButton = (event) => {
    event.preventDefault();
    Signinuser({ signemail, signpassword }).then((data) => {
      console.log(data);
      if (data?.message) {
        showError(data.message);
      } else {
        authenticate(data);
        showSuccess(
          "Succesfully signin up,you will be redirected to your Details"
        );
        setTimeout(function () {
          history.push("/userdetails");
        }, 2500);
      }
    });
  };

  return (
    <div className="login">
      <div
        className={`login__container ${value ? "login__rightPanelActive" : ""}`}
        id="container"
      >
        <div className="login__formContainer login__signUpContainer">
          <form>
            <h1 className="login__h1Text">Create Account</h1>
            <input
              className="login__inputField"
              type="text"
              placeholder="FirstName"
              value={firstName}
              onChange={handleChange("firstName")}
              required
            />
            <input
              className="login__inputField"
              type="text"
              placeholder="LastName"
              value={lastName}
              onChange={handleChange("lastName")}
              required
            />
            <input
              className="login__inputField"
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleChange("email")}
              required
            />
            <input
              className="login__inputField"
              type="password"
              placeholder="Password"
              value={password}
              onChange={handleChange("password")}
              required
            />
            <input
              className="login__inputField"
              type="password"
              placeholder="Confirm Password"
              value={confirmpassword}
              onChange={handleChange("confirmpassword")}
              required
            />

            <button onClick={clickSubmit} className="login__signButton">
              Sign Up
            </button>
          </form>
        </div>
        <div className="login__formContainer login__signInContainer">
          <form>
            <h1 className="login__h1Text">Sign in</h1>
            <input
              className="login__inputField"
              type="email"
              placeholder="Email"
              value={signinvalues.signemail}
              onChange={handleChangesignin("signemail")}
            />
            <input
              className="login__inputField"
              type="password"
              placeholder="Password"
              value={signinvalues.signpassword}
              onChange={handleChangesignin("signpassword")}
            />
            <button
              onClick={clickSubmitSigninButton}
              className="login__signButton"
            >
              Sign In
            </button>
          </form>
        </div>
        <div className="login__overlayContainer">
          <div className="login__overlay">
            <div className="login__overlayPanel login__overlayLeft">
              <h1 className="login__h1Text">Welcome Back!</h1>
              <p className="login__paraText">
                To keep connected with us please login with your personal info
              </p>
              <button
                className="login__overlayButton login__ghost"
                onClick={(e) => {
                  setValue(false);
                }}
              >
                Sign In
              </button>
            </div>
            <div className="login__overlayPanel login__overlayRight">
              <h1 className="login__h1Text">Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>

              <button
                className="login__overlayButton login__ghost "
                onClick={(e) => {
                  setValue(true);
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default LoginAndSignup;
