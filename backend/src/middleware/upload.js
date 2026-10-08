const multer = require('multer')
const path = require('path')
const crypto = require('crypto')

const storage = multer.diskStorage({
  destination: 'uploads/', // make sure this folder exists
  filename: (req, file, cb) => {
    const unique = crypto.randomBytes(8).toString('hex')
    cb(
      null,
      `${Date.now()}-${unique}${path.extname(file.originalname).toLowerCase()}`,
    )
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'))
    }
    cb(null, true)
  },
})

module.exports = upload
