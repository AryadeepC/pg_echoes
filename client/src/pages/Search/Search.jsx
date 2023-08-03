import React from 'react'
import styles from "./Search.module.css";
import { Divider, IconButton, InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { useQuery } from 'react-query';
import { createSearchParams, useNavigate } from "react-router-dom";
import Card from '../../components/Card';
import * as animdata from "../../assets/empty_box.json";
import * as searchAnimData from "../../assets/searching.json";
import * as searchBoxAnimData from "../../assets/searchBox.json";
import * as searchErrData from "../../assets/searchError.json";
import Lottie from "lottie-react";

const Search = () => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = React.useState("")
    const [posts, setPosts] = React.useState([]);
    const [animData, setAnimData] = React.useState(searchBoxAnimData)

    React.useEffect(() => {
        window.scrollTo(0, 0)
    }, [])



    const searchData = async () => {
        return axios.get("https://echoes-api.onrender.com/post/search?q=" + searchText, {
            withCredentials: true,
        });
    };


    const { data, error, isLoading, isFetching, refetch } = useQuery(
        "all_posts",
        searchData,
        {
            enabled: false,
            onSuccess: (data) => {
                setPosts((prev) => data.data.result);
                if (posts.length == 0) {
                    setAnimData(prev => ({ ...searchErrData }))
                }
            },
            onError: (error) => {
                setAnimData(prev => ({ ...searchErrData }))
                console.log("query err:", error);
            },
        }
    );

    // if (isLoading || isFetching || !data) {
        // setAnimData(prev => ({ ...searchAnimData }))
    // }

    const search = async (e) => {
        e.preventDefault();
        if (!searchText) return;
        navigate({
            search: `?${createSearchParams({
                q: searchText
            })}`
        });
        refetch();
    }

    return (
        <>

            <div className={styles.searchFull}>
                <div className={styles.searchForm}>
                    <Paper
                        className={styles.searchPaper}
                        component="form"
                        // sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '65%', borderRadius: '9px' }}
                        sx={{ borderRadius: '9px' }}
                        elevation={5}
                        onSubmit={e => search(e)}
                    >
                        <IconButton sx={{ p: '10px' }} aria-label="menu" type='submit'>
                            <SearchIcon />
                        </IconButton>
                        <Divider orientation="vertical" flexItem />
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search"
                            onChange={e => setSearchText(e.target.value)}
                            value={searchText}
                            type='search'
                        />
                    </Paper>
                </div>
                {/* <Divider variant="middle" /> */}
                <div className={styles.searchResult}>
                    {posts?.length == 0 && (
                        <Lottie
                            className={styles.lottie}
                            animationData={{ ...animData }}
                            loop={true}
                        />
                    )}
                    {posts.length > 0 && posts.map((post) => (
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
                    ))}
                </div>
            </div>
        </>

    )
}

export default Search