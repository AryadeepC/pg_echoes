import styles from "./Dashboard.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import Card from "../../components/Card";
import Loading from "../../components/Loading";
import * as animdata from "../../assets/empty_box.json";
import Lottie from "lottie-react";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [profileId, setProfileId] = useState("");
  const navigate = useNavigate();
  const [itemOffset, setItemOffset] = useState(0);
  const loggedUser = useSelector((state) => state.auth.user)

  useEffect(() => {
    console.log("in dashboard", loggedUser)
    if (!loggedUser) {
      navigate("/login")
    } else
      window.scrollTo(0, 0)
  }, [])

  const fetchData = async () => {
    return axios.get("https://echoes-api.onrender.com/user/posts", {
      withCredentials: true,
    });
  };

  const fetchUser = async () => {
    return axios.get("https://echoes-api.onrender.com/user", {
      withCredentials: true,
    });
  };

  const { data, error, isLoading, isFetching } = useQuery(
    "allPosts",
    fetchData,
    {
      onSuccess: (data) => {
        // console.log("FETCHED POSTS=", data.data.posts.length);
        setPosts((prev) => data.data.posts);
      },
      onError: (error) => {
        console.log("query err:", error);
      },
    }
  );
  const { userData, userError } = useQuery("userDetails", fetchUser, {
    onSuccess: (data) => {
      console.log(data.data.message);
      setProfileId(data.data.userid);
    },
    onError: (error) => {
      console.log("query err:", error);
    },
  });

  if (isLoading || isFetching || !data) {
    // console.log("postData is empty");
    return <Loading />;
  }

  const itemsPerPage = 5;
  const endOffset = itemOffset + itemsPerPage;
  const currentPosts = posts.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(posts.length / itemsPerPage) || 0;

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % posts.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };


  return (
    <>
      <div className={styles.create_post}>
        <Link className={styles.central_button} to="/publish">
          Create New Post
        </Link>
        <Link className={styles.central_button} to={`/profile/${profileId}`}>
          Visit Profile
        </Link>
        {/* <Link className={styles.central_button} to="/edit">
          Edit post
        </Link> */}
      </div>
      {posts.length == 0 && (
        <Lottie
          className={styles.lottie}
          animationData={{ ...animdata }}
          loop={true}
        />
      )}
      {posts.length > 0 && <ReactPaginate
        breakLabel="..."
        nextLabel="Next >>"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="<< Prev"
        renderOnZeroPageCount={null}
        containerClassName="pagination"
        pageLinkClassName="page-num"
        previousLinkClassName="page-num"
        nextLinkClassName="page-num"
        activeLinkClassName="active"
      />}
      {posts?.map((post) => (
        <Card
          key={post.id}
          id={post.id}
          title={post.title}
          authorDetails={post.author_id}
          author={post.author}
          summary={post.summary}
          image={post.cover}
          time={post.created_at}
          views={post.views}
        />
      ))}
    </>
  );
};

export default Dashboard;
