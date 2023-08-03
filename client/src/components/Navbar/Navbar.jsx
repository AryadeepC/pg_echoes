import React, { useEffect, useState } from "react";
import "../../styles/Navbar.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import Badge from "@mui/material/Badge";
import CloseIcon from '@mui/icons-material/Close';
import { optUserName } from "../../utils/TruncateOptions";
import { setNoUser } from "../../app/features/authSlice";
import MenuIcon from '@mui/icons-material/Menu';
import axios from "axios";
import SearchIcon from '@mui/icons-material/Search';

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  // const [navToggle, setNavToggle] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const username = _.truncate(
    useSelector((state) => state.auth.user),
    optUserName
  );

  function showAlert() {
    document.getElementById("logout_dialog_box").style.display = "block";
  }

  function showMenu() {
    document.getElementById("ham_dialog_box").style.display = "block";
  }


  function closeMenu() {
    document.getElementById("ham_dialog_box").style.display = "none";
  }

  function closeAlert() {
    document.getElementById("logout_dialog_box").style.display = "none";
  }

  const clickLogout = () => {
    closeAlert();
    closeMenu();
    logout();
  };

  const logout = async () => {
    try {
      const all_data = await axios.get("https://echoes-api.onrender.com/user/logout", {
        withCredentials: true,
      });
      console.log(all_data);
      const { data } = all_data;
      if (data.status === "ok") {
        dispatch(setNoUser());
        navigate("/");
      }
    } catch (error) {
      console.log("Err in logout", error.message);
    }
  };


  // useEffect(() => {
  //   const wid = window.innerWidth;
  //   console.log("Wid: " + wid)
  //   if (wid >= 650) {
  //     closeMenu();
  //   }
  // }, [window.innerWidth])

  return (
    <>
      <div className="navbar-container">
        <header>
          <Link to="/">Echoes</Link>

          <nav className={"navbar"}>
            {username && (
              <>
                <Link to="/search">
                  Search
                </Link>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/register">Register</Link>
                <Link onClick={showAlert}>
                  Logout{username && "{" + username + "}"}
                </Link>
                {/* <Link to="/search">
                  <SearchIcon />
                </Link> */}
              </>
            )}
            {!username && (
              <>
                <Link to="/">
                  Home
                </Link>
                <Link to="/search">
                  Search
                </Link>
                <Link to="/register">Register</Link>
                <Link to="/login">Login</Link>
                {/* <Link to="/search">
                  <SearchIcon />
                </Link> */}
              </>
            )}
          </nav>
          <div className="hamburger" onClick={showMenu}>
            <MenuIcon />

          </div>

        </header>
        <div id="logout_dialog_box" className="logout_modal">
          <div className="logout_content">
            <span className="logout_close" onClick={closeAlert}>
              &times;
            </span>
            {/* <p>{errMsg}</p> */}
            <p>Are you sure about leaving us?</p>
            <button onClick={clickLogout}>Leave</button>
          </div>
        </div>
        <div id="ham_dialog_box" className="ham_modal">
          <div className="ham_content">
            <span className="ham_close" onClick={closeMenu}>
              &times;
            </span>
            {username && (
              <>

                <Link to="/search" onClick={closeMenu}>
                  Search
                </Link>
                <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
                <Link to="/register" onClick={closeMenu}>Register</Link>
                <Link onClick={() => {
                  closeMenu();
                  showAlert();
                }}>
                  Logout{username && "{" + username + "}"}
                </Link>
              </>
            )}
            {!username && (
              <>

                <Link to="/search" onClick={closeMenu}>
                  Search
                </Link>
                <Link to="/register" onClick={closeMenu}>Register</Link>
                <Link to="/login" onClick={closeMenu}>Login</Link>
              </>
            )}
          </div>
        </div>
      </div >
    </>
  );
};

export default Navbar;
