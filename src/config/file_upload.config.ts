import multer from 'multer';
import * as path from 'node:path';
import { randomInt } from 'node:crypto';

// S5693: hard-coded at SonarQube's safe threshold (8 000 000 bytes = 8 MB).
// SonarQube requires a statically resolvable literal/constant on `fileSize`
// — a dynamically computed value (even one that is mathematically bounded)
// cannot be verified by the static analyser.
const MAX_FILE_SIZE_BYTES = 8_000_000; // 8 MB

// Honour the env variable by applying it as an additional, stricter guard
// inside fileFilter where we can read the Content-Length header.
const envFileSizeMB = Number.parseInt(process.env.MAX_FILE_SIZE || '', 10);
const envFileSizeLimit =
  envFileSizeMB > 0 ? envFileSizeMB * 1_000_000 : MAX_FILE_SIZE_BYTES;

const portfolioBuilderBackendFileUpload = multer({
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES, // S5693 compliant: static constant ≤ 8 MB
    files: 1,
    fieldNameSize: 100,
  },
  storage: multer.diskStorage({
    destination: function (_req, _file, cb) {
      cb(null, 'assets/');
    },
    filename: function (_req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(randomInt(1, 1e9));
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
  }),
  fileFilter: (req, file, cb) => {
    // Apply the env-based size restriction when it is stricter than the hard cap.
    const contentLength = Number.parseInt(req.headers['content-length'] ?? '0', 10);
    if (contentLength > envFileSizeLimit) {
      return cb(new Error(`File size exceeds the ${envFileSizeMB > 0 ? envFileSizeMB : 8} MB limit`));
    }

    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'));
    }
  },
});

export default portfolioBuilderBackendFileUpload;
