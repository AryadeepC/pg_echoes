import React, { useState } from 'react'
import styles from "./Landing.module.css"
import * as animdata from "../../assets/journalist.json";
import * as animdata2 from "../../assets/blog.json";
import * as animdata3 from "../../assets/blog2.json";
import * as animdata4 from "../../assets/blog3.json";
import * as animdata5 from "../../assets/blog4.json";
import Lottie from "lottie-react";
import { Link, useNavigate } from "react-router-dom";
import Typical from "react-typical";

const Landing = () => {
    const [animPic, setAnimPic] = useState([animdata, animdata2, animdata3, animdata4, animdata5])
    return (
        <div className={styles.animated_main}>
            <div className={styles.anim_details}>
                <h1>
                    <span style={{ color: "rgb(223,178,56)" }}>E</span>
                    <span style={{ color: "rgb(227,9,27)" }}>c</span>
                    <span style={{ color: "rgb(181,223,218)" }}>h</span>
                    <span style={{ color: "rgb(83,191,118)" }}>o</span>
                    <span style={{ color: "rgb(115,226,174)" }}>e</span>
                    <span style={{ color: "rgb(127,131,218)" }}>s</span>
                </h1>
                <Typical
                    steps={[1000, "Presenting you Echoes ", 7000, "Dive into the ocean of your mind ", 14000]}
                    loop={Infinity}
                    wrapper="h2"
                    className={styles.home_tagline}
                />
            </div>
            <Lottie className={styles.anim_svg} animationData={{ ...animPic[Math.floor(Math.random() * animPic.length)] }} loop={true} onClick={() => {
                navigate("/dashboard")
            }} />
        </div>
    )
}

export default Landing