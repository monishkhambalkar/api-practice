const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const users = [
  { id: 1, name: "John Doe", email: "john.doe@example.com", role: "admin" },
  { id: 2, name: "Jane Smith", email: "jane.smith@example.com", role: "user" },
  {
    id: 3,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    role: "user",
  },
  { id: 4, name: "Bob Brown", email: "bob.brown@example.com", role: "admin" },
];

//8.Access-Control-Allow-Origin: Specifies which domains can access the API.
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = ["http://localhost:3001"];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allow by cors"));
      }
    },
  })
);

//Manually Setting Headers
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "https://example.com");
//   res.setHeader(
//     "Access-Control-Allow-Method",
//     "GET,  POST, PUT, PATCH, DELETE"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-type, Authorization");
//   next();
// });

//allows all domains
// app.use((req, res, next) => {
//   res.setHeader("Allow-Control-Access-Origin", "*");
//   next();
// });

//6. Retry-After: Advises when to retry after rate limiting.
const limiter = rateLimit({
  window: 1 * 60 * 1000,
  max: 5,
  handler: (req, res) => {
    req.set("Retry-after ", 120);
    req.status(429).json({
      success: false,
      error: {
        status: 429,
        message: "To many request. please try again",
      },
    });
  },
});

app.use(limiter);

//Cache-Control: Defines how the response should be cached.
app.use(
  "/static",
  express.static("public", {
    setHeaders: (res) => {
      res.set("Cache-Control", "public, max-age=31536000, immutable");
    },
  })
);

// Implement basic authentication for a REST API.
const USERNAME = "admin";
const PASSWORD = "password123";

const basicAuth = (req, res, next) => {
  const authHeader = req.header.authorization;
  if (!authHeader) {
    res.status(401).send("Missing Authorization header");
    return;
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = buffer.from(base64Credentials, "base64").toSting("uft-8");
  const [username, password] = credentials.split(":");

  if (username === USERNAME && password === PASSWORD) {
    next();
  } else {
    res.status(401).send("Invalid username or password");
  }
};

// Secured route
app.get("/secure-data", basicAuth, (req, res) => {
  res.json({ message: "This is secure data!" });
});

// 1. Create a simple GET endpoint to retrieve user information.
// http://localhost:3001/users
app.get("/users", (req, res) => {
  // res.set("Cache-Control", "public, max-age=3600");
  res.set("Cache-Control", "no-store");
  res.json({
    success: true,
    message: "User information retrieved successfully",
    data: users,
  });
});

// add new user
// 2.Design a POST endpoint to add a new user.
// http://localhost:3001/users
app.post("/users", (req, res) => {
  const { id, name, email } = req.body;
  if (!id || !name || !email) {
    return res.status(400).json({
      success: false,
      message: `All fields (id, name, email) are required.","`,
    });
  }

  const existing = users.find((user) => user.id == id);
  if (existing) {
    return res.status(409).json({
      success: false,
      message: `User with ID ${id} already exists.`,
    });
  }

  const newUser = { id, name, email };
  users.push(newUser);

  return res.status(201).json({
    success: true,
    message: `user is added successfully with id ${id}`,
  });
});

// 3. Write a PUT request to update user details.
// http://localhost:3001/users/1
app.put("/users/:id", async (req, res) => {
  const userID = parseInt(req.params.id);
  const { id, name, email } = req.body;

  const userIndex = users.findIndex((user) => user.id === userID);
  if (userIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: `User With id ${userID} not found` });
  }

  try {
    users[userIndex] = {
      id: userID,
      name: name || users[userIndex].name,
      email: email || users[userIndex].email,
    };
    res.status(200).json({
      success: true,
      message: "User details updated successfully",
      data: users[userIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating user Details",
      error: error.message,
    });
  }
});

//4. Implement a DELETE request to remove a user.
// http://localhost:3001/users/1
app.delete("/users/:id", async (req, res) => {
  const userID = parseInt(req.params.id);

  const userIndex = users.findIndex((user) => user.id === userID);

  if (userIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: `User with ID ${userID} not found.` });
  }
  const deleteUser = users.splice(userIndex, 1);

  res.status(200).json({
    success: true,
    message: `User with ID ${userID} has been deleted.`,
    data: deleteUser[0],
  });
});

//5.Add query parameters to a GET request to filter data.
// http://localhost:3001/users-filter?name=John
//http://localhost:3001/users-filter?email=jane.smith@example.com
//localhost:3001/users-filter?role=admin
//http://localhost:3001/users-filter?name=Jane&role=user
app.get("/users-filter", (req, res) => {
  const { name, email, role } = req.query;

  console.log(req.query);

  let filteredUsers = users;

  if (name) {
    filteredUsers = filteredUsers.filter((user) =>
      user.name.toLocaleLowerCase().includes(name.toLocaleLowerCase())
    );
  }
  if (email) {
    filteredUsers = filteredUsers.filter((user) =>
      user.email.toLocaleLowerCase().includes(email.toLocaleLowerCase())
    );
  }
  if (role) {
    filteredUsers = filteredUsers.filter((user) =>
      user.role.toLocaleLowerCase().includes(role.toLocaleLowerCase())
    );
  }

  res.status(200).json({
    success: true,
    message: "Filtered users retrieved successfully.",
    data: filteredUsers,
  });
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`YOur server is running on http://localhost:${PORT}`);
});
