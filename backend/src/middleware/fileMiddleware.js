import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 3 * 1024 * 1024,
    files: 1,
  },

  fileFilter: (req, file, cb) => {
    console.log("========== MULTER FILE ==========");
    console.log("Name:", file.originalname);
    console.log("Mimetype:", file.mimetype);
    console.log("Field:", file.fieldname);
    console.log("=================================");

    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }

    cb(null, true);
  },
});

export default upload;