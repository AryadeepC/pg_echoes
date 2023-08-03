import React, { useEffect } from "react";
import styles from "./Notfound.module.css";
import { useNavigate } from "react-router-dom";
import * as cover from "../../assets/404ErrorPage.png";

const NotFoundPage = (props) => {
  const navigate = useNavigate();

  const backHome = () => {
    navigate("/", {
      replace: true,
    });
  };

  useEffect(() => {
    const returnHome = setTimeout(() => {
      backHome();
    }, 15 * 1000);
    return () => {
      clearTimeout(returnHome);
    };
  })

  // return;
  const tooltip = (e) => {
    var x = e.clientX;
    var y = e.clientY;
    document.getElementById("tooltip").style.left = x + "px";
    document.getElementById("tooltip").style.top = y + "px";
  };

  return (
    <div
      className={styles.full}
      onClick={backHome}
      onMouseMove={(e) => tooltip(e)}
    >
      <div id="tooltip" className={styles.tooltip}>
        Click to return home
      </div>
    </div>
  );
};

export default NotFoundPage;
