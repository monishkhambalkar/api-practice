import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const clientId = "";

const OAuthLogin = () => {
  const handleSuccess = async (response) => {
    console.log(response);

    if (!response.credential) {
      console.error("No credential received");
      return;
    }

    try {
      const res = await axios.post("", {
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
