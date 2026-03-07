import multer from 'multer';
import * as path from 'node:path';
import { randomInt } from 'node:crypto';

const maxAllowedFileSize: number = Number.parseInt(process.env.MAX_FILE_SIZE || '', 10) || 1;

const portfolioBuilderBackendFileUpload = multer({
  limits: {
    fileSize: maxAllowedFileSize * 1024 * 1024,
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
