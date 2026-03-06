import multer from "multer";
import * as path from "node:path";
import { randomInt } from "node:crypto";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'assets/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(randomInt(1, 1E9));
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const portfolioBuilderBackendFileUpload = multer({
  storage: storage,
  limits: { fileSize: Number.parseInt(process.env.MAX_FILE_SIZE || "1", 10) * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'));
    }
  }
});

export default portfolioBuilderBackendFileUpload;