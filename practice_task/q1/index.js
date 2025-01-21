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

// 1. Create a simple GET endpoint to retrieve user information.
app.get("/users", (req, res) => {
  res.json({
    success: true,
    message: "User information retrieved successfully",
    data: users,
  });
});

// add new user
// 2.Design a POST endpoint to add a new user.
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

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`YOur server is running on http://localhost:${PORT}`);
});
