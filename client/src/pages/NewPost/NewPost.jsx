import React, { useEffect, useState } from "react";
import styles from "./NewPost.module.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { quill_formats, quill_modules } from "../../utils/QuillOptions.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const NewPost = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState({ title: "", summary: "" });
  const [errMsg, setErrMsg] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState({});
  const formData = new FormData();


  const loggedUser = useSelector((state) => state.auth.user)

  useEffect(() => {
    // console.log("in dashboard", loggedUser)
    if (!loggedUser) {
      navigate("/login")
    } else
      window.scrollTo(0, 0)
  }, [])

  function showAlert(msg) {
    if (!msg) return;
    setErrMsg(msg);
    document.getElementById("create_dialog_box").style.display = "block";
  }

  function closeAlert() {
    document.getElementById("create_dialog_box").style.display = "none";
    setErrMsg("");
  }

  const cleanup = () => {
    formData.delete("title");
    formData.delete("summary");
    formData.delete("body");
    formData.delete("cover_photo");
    setPost({ title: "", summary: "" });
    setContent("");
    setFile({});
  };

  const publish = async (ev) => {
    ev.preventDefault();
    if (!post.title || !post.summary || !content || !file) return;

    // formData.append(, post.title);
    formData.append("title", post.title);
    formData.append("summary", post.summary);
    formData.append("body", content);
    formData.append("cover_photo", file);

    try {
      const all_data = await axios.post(
        "https://echoes-api.onrender.com/post/create",
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
      console.log("Error in new post: ", err_message);
      showAlert(err_message);
    }
    // console.log(content);
    cleanup();
  };

  return (
    <>
      <div className={styles.publish_container}>
        <form className={styles.publish_form} onSubmit={publish}>
          <input
            type="title"
            placeholder="Title"
            value={post.title}
            onChange={(e) =>
              setPost((prev) => ({ ...prev, title: e.target.value }))
            }
          />

          <input
            type="summary"
            placeholder="Summary"
            value={post.summary}
            onChange={(e) =>
              setPost((prev) => ({ ...prev, summary: e.target.value }))
            }
          />

          <div className={styles.file_section}>
            <label className={styles.custom_file_upload}>
              <input
                type="file"
                name="cover_photo"
                files={file}
                accept="image/*"
                onChange={(e) => setFile((prev) => e.target.files[0])}
              />
              Choose file
            </label>
            <span className={styles.selected_file}>
              {file?.name || "No file chosen"}
            </span>
          </div>

          <ReactQuill
            theme="snow"
            value={content}
            className={styles.quill}
            modules={quill_modules}
            formats={quill_formats}
            onChange={setContent}
          />

          <div>
            <button type="submit">Publish</button>
          </div>
        </form>
      </div>
      <div id="create_dialog_box" className={styles.modal}>
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

export default NewPost;
