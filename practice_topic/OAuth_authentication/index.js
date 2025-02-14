// const express = require("express");
// const axios = require("axios");
// const app = express();

// const PORT = 3200;

// const CLIENT_ID = process.env.CLIENT_ID;
// const CLIENT_SECRET = process.env.CLIENT_SECRET;
// const REDIRECT_URI = "http://localhost:3200/callback";
// const AUTHORIZATION_URL = "https://accounts.google.com/o/oauth2/v2/auth";
// const TOKEN_URL = "https://oauth2.googleapis.com/token";

// app.get("/login", (req, res, next) => {
//   const authUrl = `${AUTHORIZATION_URL}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email`;
//   res.redirect(authUrl);
// });

// app.get("/callback", async (req, res) => {
//   const { code } = req.query;
//   try {
//     const response = await axios.post(TOKEN_URL, {
//       code,
//       client_id: CLIENT_ID,
//       client_secret: CLIENT_SECRET,
//       redirect_uri: REDIRECT_URI,
//       grant_type: "authorization_code",
//     });
//     const { access_token } = response.data;
//     console.log(response);
//     res.send("Authentication successful");
//   } catch (error) {
//     res.status(500).send("Authentication failed");
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Your server is running on http://localhost:${PORT}`);
// });
