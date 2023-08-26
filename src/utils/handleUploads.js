const multer = require("multer");
const path = require("path");
const fs = require("fs");

const UPLOAD_DIR = path.resolve(__dirname, "../app/api-posts/uploads");

// Upload file
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
      cb(null, `${file.originalname}-${Date.now()}`);
    },
  }),
});

// Load file
const loadFileUpload = (req, res) => {
  console.log(req.params);
  const fileName = req.params.name;
  const options = {
    root: UPLOAD_DIR,
    headers: {
      "Content-Type": fileName.endsWith(".mp4") ? "video/mp4" : "image",
    },
  };
  res.sendFile(fileName, options, (err) => {
    if (err) {
      console.error(err);
      res.status(500).end();
    }
  });
};

// Delete file
const deleteFile = (listFileName) => {
  listFileName.forEach((fileName) => {
    fs.unlink(
      path.resolve(__dirname, `../app/api-posts/uploads/${fileName}`),
      (err) => {
        if (err) {
          throw err;
        }
      }
    );
  });
};

// Hàm cắt chuỗi link ảnh thành name ảnh
const getFileName = (linkImage) => {
  const parts = linkImage.split("/");
  const fileName = parts[parts.length - 1];
  return fileName;
};

module.exports = {
  upload,
  loadFileUpload,
  deleteFile,
  getFileName,
};
