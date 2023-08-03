import React, { useEffect, useState, Suspense, lazy } from "react";
import Card from "../../components/Card";
import Loading from "../../components/Loading";
import axios from "axios";
import { useQuery } from "react-query";
import "./Home.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReactPaginate from 'react-paginate';
import { Divider } from "@mui/material";

const Landing = lazy(() => import('../../components/Landing/Landing'));

const Home = () => {
  // const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [itemOffset, setItemOffset] = useState(0);

  const username = useSelector((state) => state.auth.user);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    document.getElementById('root').scrollTo(0, 0)
  }, [])

  const fetchData = async () => {
    return axios.get("https://echoes-api.onrender.com/post/all", {
      withCredentials: true,
    });
  };

  const { data, error, isLoading, isFetching } = useQuery(
    "all_posts",
    fetchData,
    {
      onSuccess: (data) => {
        setPosts((prev) => data.data.posts);
      },
      onError: (error) => {
        console.log("query err:", error);
      },
    }
  );

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

  const svgStyle = {
    height: '350px',
    width: '450px',
    backgroundColor: 'rgb(144, 204, 194)',
  }


  return (
    <>
      <div className="home_full">
        {!username && <>
          <Suspense fallback={<Loading />}>
            <Landing />
          </Suspense>
        </>}


        {username && <>
          <div className="home_cards">
            <h2>EXPLORE</h2>


            {currentPosts.map((post) => (
              <>

                <Card
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  author={post.author}
                  authorDetails={post.author_id}
                  summary={post.summary}
                  image={post.cover}
                  time={post.created_at}
                  views={post.views}
                />
                <Divider variant="middle" />
              </>
            ))}
            {posts.length > 0 &&
              <ReactPaginate
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
              />
            }

          </div>
        </>}

      </div>

    </>
  );
};

export default Home;
