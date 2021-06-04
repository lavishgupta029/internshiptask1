import { Avatar, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { isAuthenticate, signout } from "../auth/token";
import { showError, showSuccess } from "../utils";
import "./Userdetails.css";

function Userdetails() {
  const [values, Setvalues] = useState({
    newPassword: "",
    confirmPassword: "",
    oldPassword: "",
  });
  const [data, Setdata] = useState({});
  const { token } = isAuthenticate();
  const { newPassword, confirmPassword, oldPassword } = values;
  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      "& > *": {
        margin: theme.spacing(1),
      },
    },
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
    large: {
      width: theme.spacing(25),
      height: theme.spacing(25),
    },
  }));
  const classes = useStyles();
  useEffect(() => {
    const sample = async () => {
      await fetch(`http://localhost:3001/api/getuser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((existingUser) => {
          Setdata(existingUser);
          // Setvalues({
          //   ...values,
          //   firstName:
          //     existingUser.firstName === null ? "" : existingUser.firstName,
          //   lastName:
          //     existingUser.lastName === null ? "" : existingUser.lastName,
          //   photo:
          //     existingUser.photo === null
          //       ? ""
          //       : `http://localhost:3001/${existingUser.photo}`,
          //   email: existingUser.email,
          //   gender: existingUser.gender === null ? "" : existingUser.gender,
          //   dateOfBirth:
          //     existingUser.dateOfBirth === null
          //       ? ""
          //       : existingUser.dateOfBirth.substring(0, 10),
          //   createdAt: existingUser.createdAt.substring(0, 10),
          // });
        })
        .catch((error) => {
          console.log(error);
        });
    };
    sample();
  }, []);
  console.log(data);
  const handleChange = (event) => {
    Setvalues({ ...values, [event.target.name]: event.target.value });
  };
  // const handleChangephoto = (event) => {
  //   Setvalues({ ...values, photo: event.target.files[0] });
  // };
  const Updateprofile = () => {
    data.firstName = data.firstName === undefined || null ? "" : data.firstName;
    data.lastName = data.lastName === undefined || null ? "" : data.lastName;
    data.gender = data.gender === undefined || null ? "" : data.gender;
    data.dateOfBirth =
      data.dateOfBirth === undefined || null ? "" : data.dateOfBirth;

    const userdata = new FormData();
    userdata.append("firstName", data.firstName);
    userdata.append("lastName", data.lastName);
    userdata.append("email", data.email);
    userdata.append("gender", data.gender);
    userdata.append("dateOfBirth", data.dateOfBirth);
    userdata.append("photo", data.photo);
    console.log(userdata);
    return fetch(`http://localhost:3001/api/updateuser`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: userdata,
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
    Updateprofile().then((data) => {
      if (data?.message) {
        showError(data.message);
      } else {
        showSuccess("profile successfully updated");
      }
    });
  };
  const Updatepassword = (data) => {
    return fetch(`http://localhost:3001/api/updatepassword`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const clickSubmitPassword = (event) => {
    event.preventDefault();
    Updatepassword({ oldPassword, newPassword, confirmPassword }).then(
      (data) => {
        if (data?.message) {
          showError(data.message);
        } else {
          showSuccess("password successfully updated");
          Setvalues({
            ...values,
            newPassword: "",
            confirmPassword: "",
            oldPassword: "",
          });
        }
      }
    );
  };
  return (
    <div className="userdetails">
      <div className="userdetails__left">
        <div className="userdetails__leftProfile">
          <Avatar
            className={classes.large}
            src={`http://localhost:3001/${data.photo}`}
          />
          <input
            name="photo"
            onChange={(event) => {
              Setdata({ ...data, photo: event.target.files[0] });
            }}
            type="file"
          />
        </div>

        <div className="userdetails__leftPassword">
          <div className="userdetails__leftInputDiv">
            <label>Old Password</label>
            <input
              className="userdetails__leftInput"
              name="oldPassword"
              onChange={handleChange}
              type="text"
              value={oldPassword}
            />
          </div>
          <div className="userdetails__rightInputDiv">
            <label>New Password</label>
            <input
              className="userdetails__leftInput"
              name="newPassword"
              onChange={handleChange}
              type="text"
              value={newPassword}
            />
          </div>
          <div className="userdetails__rightInputDiv">
            <label>Confirm Password</label>
            <input
              className="userdetails__leftInput"
              name="confirmPassword"
              onChange={handleChange}
              type="text"
              value={confirmPassword}
            />
          </div>
          <div>
            <button
              style={{ backgroundColor: "#008cba" }}
              className="userdetails__Button"
              onClick={clickSubmitPassword}
            >
              Update password
            </button>
          </div>
        </div>
      </div>
      <div className="userdetails__right">
        <NavLink
          className="userdetails__logout"
          onClick={() => signout()}
          to="/"
        >
          Logout
        </NavLink>
        <div className="userdetails__rightInputDiv">
          <label>First Name</label>
          <input
            className="userdetails__rightInput"
            onChange={(event) => {
              Setdata({ ...data, firstName: event.target.value });
            }}
            type="text"
            name="firstName"
            value={data.firstName}
            placeholder="First Name"
          />
        </div>
        <div className="userdetails__rightInputDiv">
          <label>Last Name</label>

          <input
            className="userdetails__rightInput"
            name="lastName"
            onChange={(event) => {
              Setdata({ ...data, lastName: event.target.value });
            }}
            type="text"
            value={data.lastName}
          />
        </div>
        <div className="userdetails__rightInputDiv">
          <label>Date of Birth</label>
          <input
            className="userdetails__rightInput"
            name="dateOfBirth"
            onChange={(event) => {
              Setdata({ ...data, dateOfBirth: event.target.value });
            }}
            type="date"
            value={String(data.dateOfBirth).substring(0, 10)}
          />
        </div>
        <div className="userdetails__rightInputDiv">
          <label>Email</label>
          <input
            className="userdetails__rightInput"
            name="email"
            onChange={(event) => {
              Setdata({ ...data, email: event.target.value });
            }}
            type="text"
            value={data.email}
          />
        </div>
        <div className="userdetails__rightInputDiv">
          <label>Gender</label>

          <select
            className="userdetails__rightInput"
            name="gender"
            onChange={(event) => {
              Setdata({ ...data, gender: event.target.value });
            }}
            value={data.gender}
          >
            <option value="Gender" selected>
              Gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div className="userdetails__rightInputDiv">
          <label>Created at</label>

          <input
            className="userdetails__rightInput"
            name="createdAt"
            onChange={(event) => {
              Setdata({ ...data, createdAt: event.target.value });
            }}
            type="text"
            value={String(data.createdAt).substring(0, 10)}
            disabled
          />
        </div>
        <button
          style={{ backgroundColor: "#4CAF50" }}
          className="userdetails__Button"
          onClick={clickSubmit}
        >
          Submit changes
        </button>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Userdetails;
