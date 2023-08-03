import React from "react";
import styles from "./Likes.module.css";
import { Typography } from "@material-ui/core";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import VisibilityIcon from "@mui/icons-material/Visibility";

const Likes = () => {
  return (
    <div className={styles.bar}>
      <div className={styles.likeCount}>
        <ThumbUpOffAltIcon className={styles.icon} />
        <Typography variant="body1">1234</Typography>
      </div>
      <div className={styles.viewCount}>
        <VisibilityIcon className={styles.icon} />
        <Typography variant="body1">5678</Typography>
      </div>
    </div>
  );
};

export default Likes;
