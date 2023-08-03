import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <>
      <div className={styles.footer}>
          &copy; {new Date().getFullYear()} Echoes. All rights reserved.
      </div>
    </>
  );
};

export default Footer;
