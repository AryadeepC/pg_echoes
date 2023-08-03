import React, { useState, useEffect } from "react";
import styles from "./Forgot.module.css";
import axios from "axios"
import { validateForgot } from "../../utils/Validation";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setNoUser } from "../../app/features/authSlice";

const Forgot = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loggedUser = useSelector((state) => state.auth.user)

  useEffect(() => {
    console.log("in forgot", loggedUser)
    if (loggedUser === '') {
      navigate("/login")
    } else {
      window.scrollTo(0, 0)
    }
  }, [])

  const [resetInfo, setResetInfo] = useState({ code: "", password: "" });
  const [formError, setFormError] = useState({});
  const [errMsg, setErrMsg] = useState("");

  function showAlert(msg) {
    if (!msg) return;
    document.getElementById("log_dialog_box").style.display = "block";
  }

  function closeAlert() {
    document.getElementById("log_dialog_box").style.display = "none";
  }



  const logoutPostReset = async () => {
    try {
      const all_data = await axios.get("https://echoes-api.onrender.com/user/logout", {
        withCredentials: true,
      });
      console.log(all_data);
      const { data } = all_data;
      if (data.status === "ok") {
        dispatch(setNoUser());
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.log("Err in logout", error.message);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    const [resetErrors, errCount] = validateForgot(resetInfo);
    setFormError(resetErrors);
    if (errCount > 0) return;

    try {
      const resetResponse = await axios.post(
        "https://echoes-api.onrender.com/user/reset",
        resetInfo,
        {
          withCredentials: true,
        }
      );
      console.log(resetResponse);

      const { data } = resetResponse;
      if (data.status === "ok") {
        logoutPostReset();
      } else {
        showAlert(data.message);
      }
    } catch (error) {
      console.log("Error(reset password): ", error.message);
    }
  };

  return (
    <>
      <div className={styles.forgot_container}>
        <h1>Enter the code sent to your registered email</h1>
        <form className={styles.forgot_form} onSubmit={resetPassword}>
          <input
            type="text"
            placeholder="Verification code"
            value={resetInfo.code}
            onChange={(e) =>
              setResetInfo((prev) => ({ ...prev, code: e.target.value }))
            }
          />
          <p className={styles.err}>{formError.code || ""}</p>
          <input
            type="password"
            placeholder="New password"
            value={resetInfo.password}
            onChange={(e) =>
              setResetInfo((prev) => ({ ...prev, password: e.target.value }))
            }
          />
          <p className={styles.err}>{formError.password || ""}</p>
          <button type="submit">Reset password</button>
        </form>
      </div>

      <div id="forgot_dialog_box" className={styles.forgot_modal}>
        <div className={styles.forgot_modal_content}>
          <span className={styles.forgot_close} onClick={closeAlert}>
            &times;
          </span>
          {/* <p>Hoe</p> */}
        </div>
      </div>
    </>
  );
};

export default Forgot;
