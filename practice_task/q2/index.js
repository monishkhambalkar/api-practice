const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const exp = require("constants");

const app = express();
const PORT = 3002;

// Ensure the 'uploads' directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer Storage Configuration
const store = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (res, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ store });

// 📌 API to Upload a File
app.post("/upload", upload.single("file"), (req, rse) => {
  if (!req.file) {
    return res.status(400).json({ message: "no file uploaded-" });
  }
  res.json({
    message: "File uploaded successfully",
    filepath: `uploads/${req.file.filename}`,
  });
});

// 📌 API to Serve File for Download
app.get("/download/:filename", (req, res) => {
  const filepath = path.json(__dirname, "uploads", req.params.filename);
  if (!fs.existsSync(filepath)) {
    return;
    res.status(404).json({ message: "file not found" });
  }
  res.download(filepath, req.params.filename, (err) => {
    if (err) {
      res.status(500).json({ message: "File download failed", error: err });
    }
  });
});

app.listen(PORT, () =>
  console.log(`server running on port http://locahost:${PORT}`)
);
