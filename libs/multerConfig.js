import multer from "multer";
import fs from "fs";
import path from "path";

// Ensure the 'files' directory exists; if not, create it for storing uploaded files
// fs ensures the directory for file storage exists, even if file data is saved in the database.
// `path.join` is used to safely construct file paths (ensuring correct platform-specific path separators)
const uploadDir = path.join("private", "profilePics");
const defaultImagePath = path.join("assets", "default-profilePic.png");
// Path where the default profile picture should be copied
const destinationPath = path.join(uploadDir, "default-profilePic.png");
// Check if the directory exists; if not, create it and any necessary parent directories
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // create all directories
}
// Check if the default image is in the directory; if not, copy it
if (!fs.existsSync(destinationPath)) {
  fs.copyFileSync(defaultImagePath, destinationPath);
  console.log("Default profile picture copied to upload directory.");
}

// Multer configuration to define where and how files are stored
const multerConfig = multer.diskStorage({
  // The 'destination' sets the directory for storing files
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  // The 'filename' sets a unique name for each file using a timestamp
  // 'path' module extract file extension (safe)
  // Unique filenames prevent overwriting and ensure safe file handling, even if the database uses unique IDs.
  filename: (req, file, cb) => {
    cb(
      null,
      //  Example name: profilePic-1723044627530.jpg (the original name wont be used, only the extension)
      // fieldname of the formular will be profilePic
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// File filter to accept only image files (jpeg, jpg, png), ensures only valid image files are uploaded
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;

  // Checking both file extension and MIME type ensures better validation.
  // The extension can be easily changed and may not reflect the actual file content, whereas MIME type(for example: image/jpeg) is more reliable for determining the file’s true content type.
  // Using both checks provides more robust validation.
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  // Accept the file if both MIME type and extension match
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Error: Images Only!"));
  }
};

const upload = multer({
  // Defines where and how files are stored using the multerConfig object
  storage: multerConfig,
  // Limits the file size to 3MB (3 megabytes! 1KB = 1024 bytes, 1MB = 1024KB = 1.048.576 bytes )
  limits: { fileSize: 1024 * 1024 * 3 },
  // Function to filter uploaded files based on MIME type and extension
  fileFilter: fileFilter,
});

// Export the configured 'upload' object
export default upload;
