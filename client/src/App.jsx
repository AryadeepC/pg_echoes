import { Link, NavLink, Outlet } from "react-router-dom";
import "./styles/index.css";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "./components/Navbar";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLoggedUser, setNoUser } from "./app/features/authSlice";
import Footer from "./components/Footer";


const App = () => {
  const dispatch = useDispatch();
  const home = async () => {
    try {
      const all_data = await axios.get("https://echoes-api.onrender.com/user", {
        withCredentials: true,
      });
      console.log("home data", all_data);
      const { data } = all_data;
      if (data.status === "ok") {
        dispatch(setLoggedUser(data.username));
      } else {
        dispatch(setNoUser());
      }
    } catch (error) {
      console.log("Err in home", error.message);
    }
  };

  useEffect(() => {
    home();
    AOS.init({
      // Global settings:
      disable: 'phone', // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
      startEvent: "DOMContentLoaded", // name of the event dispatched on the document, that AOS should initialize on
      initClassName: "aos-init", // class applied after initialization
      animatedClassName: "aos-animate", // class applied on animation
      useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
      disableMutationObserver: false, // disables automatic mutations' detections (advanced)
      debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
      throttleDelay: 199, // the delay on throttle used while scrolling the page (advanced)

      // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
      offset: 350, // offset (in px) from the original trigger point
      delay: 0, // values from 0 to 3000, with step 50ms
      duration: 500, // values from 0 to 3000, with step 50ms
      easing: "ease", // default easing for AOS animations
      once: true, // whether animation should happen only once - while scrolling down
      mirror: false, // whether elements should animate out while scrolling past them
      anchorPlacement: "bottom-bottom", // defines which position of the element regarding to window should trigger the animation
    });
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default App;
