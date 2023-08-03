import React, { useEffect, useState } from "react";
import styles from "./Edit.module.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { quill_formats, quill_modules } from "../../utils/QuillOptions.js";
import _ from "lodash";
import axios from "axios";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const Edit = () => {
  const navigate = useNavigate();
  const formData = new FormData();
  const { post_id } = useParams();
  const [post, setPost] = useState({ title: "", summary: "" });
  const [errMsg, setErrMsg] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState({});
  const [emptyPic, setEmptyPic] = useState(false);

  const loggedUser = useSelector((state) => state.auth.user)

  useEffect(() => {
    // console.log("in dashboard", loggedUser)
    if (!loggedUser) {
      navigate("/login")
    } else
      window.scrollTo(0, 0)
  }, [])


  const fetchSingle = async () => {
    return axios.get(`https://echoes-api.onrender.com/post/fetch/${post_id}`, {
      withCredentials: true,
    });
  };

  // const deletePost = () => {};

  const { data, error, isLoading, isFetching } = useQuery(
    "single_post",
    fetchSingle,
    {
      refetch: false,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        console.log("data to edit", data.data);
        setPost((prev) => data.data.post);
        setContent(data.data.post.body);
      },
      onError: (error) => {
        console.log("query err:", error);
      },
    }
  );

  useEffect(() => {
    setPost({ title: post.title, summary: post.summary });
    setContent(content);
    window.scrollTo(0, 0)
  }, []);

  const removeImage = () => {
    setPost((prev) => ({ ...prev, cover: "" }));
    setFile({});
    setEmptyPic(true);
  };

  function showAlert(msg) {
    if (!msg) return;
    setErrMsg(msg);
    document.getElementById("edit_dialog_box").style.display = "block";
  }

  function closeAlert() {
    document.getElementById("edit_dialog_box").style.display = "none";
    setErrMsg("");

  }

  const cleanup = () => {
    formData.delete("title");
    formData.delete("summary");
    formData.delete("body");
    formData.delete("cover_photo");
    formData.delete("emptyPic");
  };

  const edit = async (event) => {
    event.preventDefault();

    // if (!post.title || !post.summary || !content || !file) return;
    console.log(file);
    formData.append("title", post.title);
    formData.append("summary", post.summary);
    formData.append("body", content);
    formData.append("cover_photo", file);
    formData.append("emptyPic", emptyPic);

    try {
      const all_data = await axios.put(
        `https://echoes-api.onrender.com/post/update/${post_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log(all_data);
      const { data } = all_data;
      if (data.status === "ok") {
        navigate(`../post/${data.id}`, {
          replace: true,
        });
      }
    } catch (error) {
      const err_message = (error.name == 'AxiosError') ? error.response.data.message : error.message;
      console.log("Error in edit: ", err_message);
      showAlert(err_message);
    }

    cleanup();
  };

  return (
    <>
      <div className={styles.publish_container}>
        <form className={styles.publish_form} onSubmit={edit}>
          <input
            type="title"
            placeholder="Title"
            value={post.title}
            onChange={(e) => {
              setPost((prev) => ({ ...prev, title: e.target.value }));
            }}
          />

          <input
            type="summary"
            placeholder="Summary"
            value={post.summary}
            onChange={(e) =>
              setPost((prev) => ({ ...prev, summary: e.target.value }))
            }
          />

          {post.cover && (
            <div className={styles.full_image}>
              <img
                src={`${post.cover}`}
                alt="cover photo"
              />
            </div>
          )}
          <div className={styles.image_options}>
            <div>
              <label className={styles.central_button}>
                <input
                  type="file"
                  files={file}
                  accept="image/*"
                  onChange={(e) => {
                    setFile((prev) => e.target.files[0]);
                    setEmptyPic(false);
                  }}
                />
                Choose file
              </label>
              <span className={styles.selected_file}>
                {file?.name || "No file chosen"}
              </span>
            </div>
          </div>
          <div className={styles.image_options}>
            <div className={styles.central_button} onClick={removeImage}>
              Remove Image
            </div>
          </div>
          {/* {!_.isEmpty(file) && (
            <label
              className={styles.custom_file_upload}
              onClick={(ev) => {
                console.log(_.isEmpty(file));
                setFile({});
              }}
            >
              Clear selection
            </label>
          )} */}

          <ReactQuill
            theme="snow"
            value={content}
            className={styles.quill}
            modules={quill_modules}
            formats={quill_formats}
            onChange={setContent}
          />

          <div>
            <button className={styles.central_button} type="submit">Confirm changes</button>
          </div>
        </form>
      </div>
      <div id="edit_dialog_box" className={styles.modal}>
        <div className={styles.modal_content}>
          <span className={styles.close} onClick={closeAlert}>
            &times;
          </span>
          <p>{errMsg}</p>
        </div>
      </div>
    </>
  );
};

export default Edit;
