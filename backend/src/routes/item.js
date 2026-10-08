const express = require('express')

const router = express.Router()

// local imports
const authMidware = require('../middleware/authMidWare')
const upload = require('../middleware/upload')
const {
  newItem,
  allItems,
  myItems,
  updateItem,
  deleteItem,
} = require('../controllers/item')

// PUBLIC: anyone can browse items (home page), no login needed
router.get('/', allItems)

// PRIVATE: only the logged-in user's own items (must come before '/:id')
router.get('/mine', authMidware, myItems)

// PRIVATE: report a new item, with an image upload
router.post('/', authMidware, upload.single('image'), newItem)

// PRIVATE: edit or delete (owner-only, enforced in the controller)
router
  .route('/:id')
  .patch(authMidware, upload.single('image'), updateItem)
  .delete(authMidware, deleteItem)

module.exports = router
