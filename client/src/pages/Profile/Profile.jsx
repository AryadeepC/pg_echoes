import React, { useEffect, useState } from "react";
import styles from "./Profile.module.css";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import { optEmail, optUserName } from "../../utils/TruncateOptions";

const Profile = () => {
  const navigate = useNavigate();
  const { user: author } = useParams();
  const loggedUser = useSelector((state) => state.auth.user);
  const postFormatter = Intl.NumberFormat("en", { notation: "compact" });
  const viewFormatter = Intl.NumberFormat("en", {
    notation: "compact",
  });
  const [Alert, setAlert] = useState("");

  const [info, setInfo] = useState({
    username: "",
    email: "",
    posts: postFormatter.format(0),
    views: viewFormatter.format(0),
  });

  useEffect(() => {
    // console.log("in dashboard", loggedUser)
    if (!loggedUser) {
      navigate("/login")
    } else
      window.scrollTo(0, 0)
  }, [])

  const getProfile = async () => {
    return axios.get(`https://echoes-api.onrender.com/user/profile/${author}`, {
      withCredentials: true,
    });
  };

  const { data, error, isLoading, isFetching } = useQuery(
    "get_profile",
    getProfile,
    {
      onSuccess: (data) => {
        console.log(data.data.message);
        if (data.data.invalid) {
          navigate("/login", { replace: true });
          return;
        }
        const obj = data.data.profile;
        setInfo((prev) => {
          return {
            ...obj,
            posts: postFormatter.format(obj.posts),
            views: viewFormatter.format(obj.views),
          };
        });
      },
      onError: (error) => {
        console.log("query err:", error);
      },
    }
  );

  function showAlert(msg) {
    if (!msg) return;
    setAlert(msg);
    document.getElementById("profile_dialog_box").style.display = "block";
  }

  function closeAlert() {
    document.getElementById("profile_dialog_box").style.display = "none";
    if (Alert === "Please check your registered email 📧") {
      navigate("/forgot", {
        replace: true,
      });
    }
    setAlert("")
  }

  const forgotPass = async (ev) => {
    ev.preventDefault();
    // console.log("FORGOT");
    try {
      const forgotResponse = await axios.get(
        "https://echoes-api.onrender.com/user/forgot",
        {
          withCredentials: true,
        }
      );
      console.log("profile forgot", forgotResponse);

      const { data } = forgotResponse;
      if (data.status === "ok") {
        showAlert("Please check your registered email 📧");
        // showAlert(`Welcome back ${data.username}`);
        // dispatch(setLoggedUser(data.username));
        // setUser({ email: "", password: "" });
      } else {
        showAlert(
          "An error occurred while trying to send you an email. Please try again"
        );
      }
    } catch (error) {
      const err_message = (error.name == 'AxiosError') ? error.response.data.message : error.message;
      console.log("Error(profile)=", err_message);
      showAlert(err_message);
    }
  };

  const mailAuthor = (ev) => {
    ev.preventDefault();
    location.href = `mailto:${info.email}`;
  };

  return (
    <>
      <div className={styles.profile_container}>
        <div className={styles.profile_form}>
          <h1>{info.username}</h1>
          <h3 className={styles.email} onClick={mailAuthor}>
            {_.truncate(info.email, optEmail)}
          </h3>
          <h3 className={styles.pnv}>
            <span>Posts: {info.posts}</span>    <span>Views: {info.views}</span>
          </h3>
          {loggedUser === info.username && (
            <h6 className={styles.redir}>
              <Link onClick={forgotPass}>Forgot password</Link>
            </h6>
          )}
        </div>
      </div>
      <div id="profile_dialog_box" className={styles.profile_modal}>
        <div className={styles.profile_modal_content}>
          <span className={styles.profile_close} onClick={closeAlert}>
            &times;
          </span>
          <p>{Alert}</p>
          <button onClick={closeAlert}>Ok</button>
        </div>
      </div>
    </>
  );
};
export default Profile;
