import multer from 'multer';
import * as path from 'node:path';
import { randomInt } from 'node:crypto';

// S5693: hard upper-bound expressed as a static constant so SonarQube can
// verify the file-size limit never exceeds 8 MB.
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8 MB
const envFileSizeMB = Number.parseInt(process.env.MAX_FILE_SIZE || '', 10);
const fileSizeLimitBytes = envFileSizeMB > 0
  ? Math.min(envFileSizeMB * 1024 * 1024, MAX_FILE_SIZE_BYTES)
  : MAX_FILE_SIZE_BYTES;

const portfolioBuilderBackendFileUpload = multer({
  limits: {
    fileSize: fileSizeLimitBytes,
    files: 1,
    fieldNameSize: 100,
  },
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'assets/');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(randomInt(1, 1e9));
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
  }),
  fileFilter: (req, file, cb) => {
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
