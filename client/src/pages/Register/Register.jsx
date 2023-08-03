import { useEffect, useState } from "react";
import styles from "./Register.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { validateRegister } from "../../utils/Validation";

const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "", email: "", password: "" });
  const [formError, setFormError] = useState({});
  const [errMsg, setErrMsg] = useState("");

  function showAlert(msg) {
    if (!msg) return;
    setErrMsg(msg);
    document.getElementById("reg_dialog_box").style.display = "block";
  }

  function closeAlert() {
    document.getElementById("reg_dialog_box").style.display = "none";
    if (errMsg === "Registration complete ✅") {
      navigate("/login");
    }
    setErrMsg("");
  }

  const register = async (e) => {
    e.preventDefault();
    const [ferr, errCount] = validateRegister(user);
    setFormError(ferr);
    if (errCount > 0) {
      return;
    }
    try {
      const { data } = await axios.post(
        "https://echoes-api.onrender.com/user/register",
        user
      );
      console.log(data);
      if (data.status === "ok") {
        showAlert("Registration complete ✅");
      } else {
        showAlert("⚠ Error. Try again later !!");
        // showAlert(data.message);
      }

    } catch (error) {
      const err_message = (error.name == 'AxiosError') ? error.response.data.message : error.message;
      console.log("Error(register)=", err_message);
      showAlert(err_message);
    }
  };

  return (
    <>
      <div className={styles.register_container}>
        <h1>Create an account</h1>
        <p>Let's get started with your journey with us.</p>

        <form className={styles.register_form} onSubmit={register}>
          <input
            type="text"
            placeholder="Username"
            value={user.username}
            maxLength={15}
            onChange={(e) =>
              setUser((prev) => ({ ...prev, username: e.target.value }))
            }
          />
          <p className={styles.err}>{formError.username || ""}</p>
          <input
            type="email"
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

          <button type="submit">Create account</button>
        </form>
        <h6 className={styles.redir}>
          Already have an account? <Link to="/login">Log in</Link>
        </h6>
      </div>

      <div id="reg_dialog_box" className={styles.reg_modal}>
        <div className={styles.reg_modal_content}>
          <span className={styles.reg_close} onClick={closeAlert}>
            &times;
          </span>
          <p>{errMsg}</p>
          <button onClick={closeAlert}>Ok</button>
        </div>
      </div>
    </>
  );
};

export default Register;
