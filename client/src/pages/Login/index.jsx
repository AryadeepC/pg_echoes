import React from "react";
import { useQuery } from "react-query";
import Login from "./Login";

const index = (props) => {
  return (
    <>
      <Login {...props}/>
    </>
  );
};

export default index;
