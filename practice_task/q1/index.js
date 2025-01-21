const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const users = [
  { id: 1, name: "John Doe", email: "john.doe@example.com" },
  { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
];

app.get("/users", (req, res) => {
  res.json({
    success: true,
    message: "User information retrieved successfully",
    data: users,
  });
});

// add new user
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

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`YOur server is running on http://localhost:${PORT}`);
});
