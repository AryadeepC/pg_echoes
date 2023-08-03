import { useQuery } from "react-query";
import axios from "axios";

const useRegister = (userData) => {
  return useQuery(
    "register",
    () => {
      return axios.post("http://localhost:8000/user/register", userData);
    },
    { enabled: false }
  );
};

export default useRegister;
