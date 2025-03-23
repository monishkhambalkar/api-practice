import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const clientId =
  "713340321689-cr6k9usm1lgsus377a23ia97b7rhudqq.apps.googleusercontent.com";

const OAuthLogin = () => {
  const handleSuccess = async (response) => {
    console.log(response);

    if (!response.credential) {
      console.error("No credential received");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/auth/google", {
        token: response.credential,
      });

      console.log("User authenticated:", res.data);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
    } catch (error) {
      console.error("Authentication failed", error);
    }
  };

  const handleFailure = (error) => {
    console.error("Login Failed:", error);
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin onSuccess={handleSuccess} onError={handleFailure} />
    </GoogleOAuthProvider>
  );
};

export default OAuthLogin;
