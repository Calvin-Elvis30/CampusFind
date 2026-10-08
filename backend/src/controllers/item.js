// dependencies
const fs = require('fs')
const path = require('path')
const { StatusCodes } = require('http-status-codes')

// local imports
const Item = require('../model/item')

// delete an uploaded file from disk (ignores errors if it's already gone)
const removeFile = (imagePath) => {
  if (!imagePath || !imagePath.startsWith('/uploads/')) return
  fs.unlink(path.join(__dirname, '..', imagePath), () => {})
}

// add a new item (create)
const newItem = async (req, res, next) => {
  try {
    const { name, category, location, status, description, date } = req.body

    if (!name || !category || !location || !status || !req.file) {
      // validation failed, so don't keep the orphaned upload
      if (req.file) removeFile(`/uploads/${req.file.filename}`)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'Please provide all required fields, including an image' })
    }

    await Item.create({
      name,
      category,
      location,
      status,
      description,
      date,
      image: `/uploads/${req.file.filename}`,
      createdBy: req.user.id,
    })

    res.status(StatusCodes.CREATED).json({ msg: 'item submitted' })
  } catch (error) {
    if (req.file) removeFile(`/uploads/${req.file.filename}`)
    next(error)
  }
}

// see all items (read)
const allItems = async (req, res, next) => {
  try {
    const items = await Item.find({}).sort({ createdAt: -1 })

    res.status(StatusCodes.OK).json({ msg: items })
  } catch (error) {
    next(error)
  }
}

// see only the logged-in user's items (for "My Items")
const myItems = async (req, res, next) => {
  try {
    const items = await Item.find({ createdBy: req.user.id }).sort({
      createdAt: -1,
    })

    res.status(StatusCodes.OK).json({ msg: items })
  } catch (error) {
    next(error)
  }
}

// update an item
const updateItem = async (req, res, next) => {
  try {
    const {
      body: { name, category, location, status, description, date },
      params: { id: itemID },
    } = req

    const item = await Item.findById(itemID)

    if (!item) {
      if (req.file) removeFile(`/uploads/${req.file.filename}`)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No item matches ${itemID}` })
    }

    // only the owner can edit
    if (item.createdBy.toString() !== req.user.id) {
      if (req.file) removeFile(`/uploads/${req.file.filename}`)
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ msg: 'You can only edit your own items' })
    }

    if (name !== undefined && name.trim() === '') {
      if (req.file) removeFile(`/uploads/${req.file.filename}`)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'Name cannot be blank' })
    }

    // only overwrite fields that were actually sent
    if (name !== undefined) item.name = name
    if (category !== undefined) item.category = category
    if (location !== undefined) item.location = location
    if (status !== undefined) item.status = status
    if (description !== undefined) item.description = description
    if (date !== undefined) item.date = date

    // new image uploaded: swap it and delete the old file
    if (req.file) {
      const oldImage = item.image
      item.image = `/uploads/${req.file.filename}`
      await item.save()
      removeFile(oldImage)
    } else {
      await item.save()
    }

    res.status(StatusCodes.OK).json({ msg: 'Item updated successfully' })
  } catch (error) {
    if (req.file) removeFile(`/uploads/${req.file.filename}`)
    next(error)
  }
}

// delete an item
const deleteItem = async (req, res, next) => {
  try {
    const {
      params: { id: itemID },
    } = req

    const item = await Item.findById(itemID)

    if (!item) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No item matches ${itemID}` })
    }

    // only the owner can delete
    if (item.createdBy.toString() !== req.user.id) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ msg: 'You can only delete your own items' })
    }

    await item.deleteOne()
    removeFile(item.image)

    res.status(StatusCodes.OK).json({ msg: 'item deleted successfully' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  newItem,
  allItems,
  myItems,
  updateItem,
  deleteItem,
}
