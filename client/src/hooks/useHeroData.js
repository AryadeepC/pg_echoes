import { useQuery } from "react-query";
import options from "../utils/QueryOptions";
import axios from "axios";

const fetchData = () => {
  return axios.get("http://localhost:4000/superheroes");
};

const useHeroData = () => {
  return useQuery("heroes", fetchData, options);
};

export default useHeroData;
