import axios from "axios";


export const logout = async () => {
    try {
        const all_data = await axios.get("https://echoes-api.onrender.com/user/logout", {
            withCredentials: true,
        });
        console.log(all_data);
        const { data } = all_data;
        if (data.status === "ok") {
            dispatch(setNoUser());
            navigate("/");
        }
    } catch (error) {
        console.log("Err in logout", error.message);
    }
};
