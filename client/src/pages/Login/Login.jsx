import { useState } from "react";
import styles from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import { validateLogin } from "../../utils/Validation";
import { useDispatch } from "react-redux";
import { setLoggedUser } from "../../app/features/authSlice";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [user, setUser] = useState({ email: "", password: "" });
  const [formError, setFormError] = useState({});
  const [errMsg, setErrMsg] = useState("");

  function showAlert(msg) {
    if (!msg) return;
    setErrMsg(msg);
    document.getElementById("log_dialog_box").style.display = "block";
  }

  function closeAlert() {
    document.getElementById("log_dialog_box").style.display = "none";
    if (errMsg.startsWith("Welcome")) {
      navigate("/");
    }
    setErrMsg("");
  }

  const loginUser = async (e) => {
    e.preventDefault();
    const [ferr, errCount] = validateLogin(user);
    setFormError(ferr);
    if (errCount > 0) return;
    try {
      const all_data = await axios.post(
        "https://echoes-api.onrender.com/user/login",
        user,
        {
          withCredentials: true,
        }
      );
      console.log(all_data);

      const { data } = all_data;
      if (data.status === "ok") {
        showAlert(`Welcome back ${data.username} 🌟`);
        dispatch(setLoggedUser(data.username));
        setUser({ email: "", password: "" });
      } else {
        showAlert(data.message);
      }
    } catch (error) {
      const err_message = (error.name == 'AxiosError') ? error.response.data.message : error.message;
      console.log("Error in login: ", err_message);
      showAlert(err_message);
    }
  };

  return (
    <>
      <div className={styles.login_container}>
        <h1>Sign in to your account</h1>
        <p>
          Great to have you back. Login and pick up from where you left off.
        </p>

        <form className={styles.login_form} onSubmit={loginUser}>
          <input
            type="text"
            placeholder="Email"
            value={user.email}
            onChange={(e) =>
              setUser((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <p className={styles.err}>{formError.email || ""}</p>
          <input
            type="password"
            placeholder="Password"
            value={user.password}
            onChange={(e) =>
              setUser((prev) => ({ ...prev, password: e.target.value }))
            }
          />
          <p className={styles.err}>{formError.password || ""}</p>
          <button type="submit">Login</button>
        </form>
        <h6 className={styles.redir}>
          New here? <Link to="/register">Create account</Link>
        </h6>
      </div>

      <div id="log_dialog_box" className={styles.log_modal}>
        <div className={styles.log_modal_content}>
          <span className={styles.log_close} onClick={closeAlert}>
            &times;
          </span>
          <p>{errMsg}</p>
          <button onClick={closeAlert}>Ok</button>
        </div>
      </div>
    </>
  );
};

export default Login;
