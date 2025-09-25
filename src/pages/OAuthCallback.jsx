import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../store/authSlice";
import  {authService } from "../services";

function OAuthCallback() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await authService.getCurrentUser();
        if (userData) {
          dispatch(authLogin(userData));
          navigate("/"); // go home after login
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error(error);
        navigate("/login");
      }
    }
    fetchUser();
  }, [dispatch, navigate]);

  return <p>Signing you in with Google...</p>;
}

export default OAuthCallback;
