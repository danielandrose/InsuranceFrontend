import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addPolicy } from "../slices/policySlice.js";
import NavBar from "../components/NavBar.jsx";
import Hero from "../components/Hero.jsx";

const Home = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/login");
      }
      const { data } = await axios.post(
        "http://localhost:5000",
        {},
        { withCredentials: true }
      );
      const { status, user } = data;
      setUsername(user);
      return status
        ? toast(`Hello ${user}`, {
          position: "bottom-right",
        })
        : (removeCookie("token"), navigate("/login"));
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await axios.get("http://localhost:5000/policies", {
          withCredentials: true,
        });
        const policies = res.data;

        policies.forEach(policy => {
          dispatch(addPolicy(policy));
        });
      } catch (err) {
        console.error("Failed to fetch policies:", err);
      }
    };

    if (username) {
      fetchPolicies();
    }
  }, [username, dispatch]);

  const Logout = () => {
    removeCookie("token");
    navigate("/signup");
  };
  return (
    <>
      <div className="home_page">
        <NavBar logout={Logout} />
        {/*<h4>
          {" "}
          Welcome <span>{username}</span>
        </h4>*/}
        <Hero/>
      </div>
      <ToastContainer />
    </>
  );
};

export default Home;