import { useEffect, useState } from "react";
import styles from "./Card.module.css";
import _ from "lodash";
import { Link, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import en from "javascript-time-ago/locale/en";
import { Fab } from "@material-ui/core";
import { useSelector } from "react-redux";
import Loading from "../Loading/Loading";
import TimeAgo from "javascript-time-ago";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import axios from "axios";
TimeAgo.addDefaultLocale(en);

const Card = ({
  title,
  author,
  authorDetails,
  summary,
  image,
  time,
  views,
  id,
}) => {
  if (!title || !author || !summary || !time || !id) {
    console.log("missing fields in card");
    return <Loading />;
  }

  // const post_id = id;
  const cardHeight = image ? "auto" : "250px";
  const navigate = useNavigate();
  const username = useSelector((state) => state.auth.user);
  const formatter = Intl.NumberFormat("en", {
    notation: "compact",
  });

  const timeAgo = new TimeAgo("en-US");
  const canEdit = username === author ? "flex" : "none";

  const visit = (ev) => {
    navigate(`/post/${id}`);
  };

  const edit = (ev) => {
    navigate(`/edit/${id}`);
  };

  function showAlert() {
    document.getElementById("card_dialog_box" + id).style.display = "block";
  }

  function closeAlert() {
    document.getElementById("card_dialog_box" + id).style.display = "none";

  }

  const deletePost = async () => {
    // alert(title + "\n" + id);
    try {
      const deleteResponse = await axios.delete(
        `https://echoes-api.onrender.com/post/delete/${id}`,
        {
          withCredentials: true,
        }
      );
      console.log(deleteResponse);
      const { data } = deleteResponse;
      if (data.status === "ok") {
        navigate(`../dashboard`, {
          replace: true,
        });
        closeAlert();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div
        // data-aos="fade-right"
        // data-aos="zoom-in"
        id="hidden"
        className={styles.card}
        style={{
          height: cardHeight,
        }}
      // onClick={() => console.log("card id=", id)}
      >
        <Fab
          color="primary"
          aria-label="edit"
          id="editBtn"
          style={{
            display: canEdit,
            backgroundColor: "black",
          }}
          onClick={edit}
        >
          <EditIcon />
        </Fab>
        <Fab
          color="primary"
          aria-label="edit"
          id="delBtn"
          style={{
            display: canEdit,
            backgroundColor: "red",
          }}
          onClick={() => {
            showAlert()
          }}
        >
          <DeleteForeverIcon />
        </Fab>
        {image && (
          <div className={styles.card_img} onClick={visit}>
            <img src={`${image}`} alt="Cover picture" />
          </div>
        )}
        <div className={styles.card_text}>
          <h2 onClick={visit}>
            {_.truncate(title, {
              length: 55,
              omission: "...",
            })}
          </h2>
          <p className={styles.card_detail_para}>
            <Link to={`/profile/${authorDetails}`} className={styles.author}>
              {author}
              {/* <span className={styles.tooltip}>View the author</span> */}
            </Link>
            <time className={styles.time} onClick={visit}>
              {timeAgo.format(new Date(time))}
              {/* <ReactTimeAgo date={new Date(time)} locale="en-US" /> */}
            </time>
            <span className={styles.views} onClick={visit}>
              {formatter.format(views)} views
            </span>
          </p>
          <p className={styles.card_body} onClick={visit}>
            {_.truncate(summary, {
              length: 300,
              omission: "...",
            })}
          </p>
          <div className={styles.spaceInCards}></div>
        </div>
      </div >
      <div id={"card_dialog_box" + id} className={styles.card_modal}>
        <div className={styles.card_modal_content}>
          <span className={styles.card_close} onClick={() => {
            closeAlert();
          }}>
            &times;
          </span>
          <p>Delete this post forever?</p>
          <button className={styles.del_central_button} onClick={deletePost}>
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default Card;
