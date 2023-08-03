import React, { useState } from "react";
import styles from "./Post.module.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import en from "javascript-time-ago/locale/en";
import TimeAgo from "javascript-time-ago";
import Loading from "../../components/Loading/Loading";
TimeAgo.addLocale(en);

const Post = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState({});
  const { post_id } = useParams();
  const username = useSelector((state) => state.auth.user);
  const timeAgo = new TimeAgo("en-US");
  const formatter = Intl.NumberFormat("en", {
    notation: "compact",
  });

  const fetchSingle = async () => {
    return axios.get(`https://echoes-api.onrender.com/post/fetch/${post_id}`, {
      withCredentials: true,
    });
  };

  const { data, error, isLoading, isFetching } = useQuery(
    "single_post",
    fetchSingle,
    {
      refetch: false,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setPost((prev) => data.data.post);
      },
      onError: (error) => {
        console.log("query err:", error);
      },
    }
  );

  const deletePost = async () => {
    try {
      const deleteResponse = await axios.delete(
        `https://echoes-api.onrender.com/post/delete/${post_id}`,
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
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const viewed = async () => {
    try {
      const viewRes = await axios.put(
        `https://echoes-api.onrender.com/post/views/${post_id}`
      );
      console.log(viewRes);
    } catch (error) {
      console.log("Error while adding view");
    }
  };

  function showAlert() {
    document.getElementById("post_dialog_box").style.display = "block";
  }

  function closeAlert() {
    document.getElementById("post_dialog_box").style.display = "none";
    if (errMsg === "Registration complete ✅") {
      navigate("/login");
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    const addView = setTimeout(() => {
      viewed();
    }, 15 * 1000);
    return () => {
      clearTimeout(addView);
    };

  }, []);

  useEffect(() => {
    console.log(post.created_at);
  }, [post]);


  if (isLoading || isFetching || !data) {
    // console.log("postData is empty");
    return <Loading />;
  }
  return (
    <>
      <div className={styles.post}>
        {username === post.author && (
          <div className={styles.btns}>
            <Link className={styles.central_button} to={`/edit/${post_id}`}>
              Edit post
            </Link>
            <div className={styles.del_central_button} onClick={showAlert}>
              Delete post
            </div>
          </div>
        )}
        {post.cover && (
          <div className={styles.full_image}>
            <img src={`${post.cover}`} alt="cover photo" />
          </div>
        )}

        <div className={styles.title}>
          <h1>{post.title}</h1>
        </div>
        <div className={styles.details}>
          <h3>{formatter.format(post.views)} views</h3>

          <span className={styles.author}>
            <h3>
              <Link to={`/profile/${post.author_id}`}>{post.author}</Link>
            </h3>
            <h3>
              {post.updated_at && timeAgo.format(new Date(post.created_at))}
            </h3>
          </span>
        </div>
        <div className={styles.summary}>
          <blockquote>{post.summary}</blockquote>
        </div>
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: post.body }}
        ></div>
      </div>
      <div id="post_dialog_box" className={styles.post_modal}>
        <div className={styles.post_modal_content}>
          <span className={styles.post_close} onClick={closeAlert}>
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

export default Post;
