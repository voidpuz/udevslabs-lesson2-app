// routes/itemRoutes.js

const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the item
 *         name:
 *           type: string
 *           description: Name of the item
 *         description:
 *           type: string
 *           description: Description of the item
 *         quantity:
 *           type: integer
 *           description: Quantity in stock
 *       example:
 *         id: d5fE_asz
 *         name: Apple
 *         description: Red Delicious Apples
 *         quantity: 10
 */

/**
 * @swagger
 * tags:
 *   name: Items
 *   description: The items managing API
 */

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Returns the list of all the items
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: The list of items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 */

router.get('/', async (req, res) => {
  try {
    const items = await Item.find().limit(10);

    
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/items/{id}:
 *   get:
 *     summary: Get the item by id
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The item id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The item description by id
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         description: The item was not found
 */

router.get('/:id', getItem, (req, res) => {
  res.json(res.item);
});

/**
 * @swagger
 * /api/items:
 *   post:
 *     summary: Create a new item
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       201:
 *         description: The item was successfully created
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       400:
 *         description: Bad Request
 */

router.post('/', async (req, res) => {
  const item = new Item({
    name: req.body.name,
    description: req.body.description,
    quantity: req.body.quantity,
  });

  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/items/{id}:
 *   patch:
 *     summary: Update the item by the id
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The item id
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       200:
 *         description: The item was updated
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         description: The item was not found
 *       400:
 *         description: Bad Request
 */

router.patch('/:id', getItem, async (req, res) => {
  if (req.body.name != null) {
    res.item.name = req.body.name;
  }
  if (req.body.description != null) {
    res.item.description = req.body.description;
  }
  if (req.body.quantity != null) {
    res.item.quantity = req.body.quantity;
  }

  try {
    const updatedItem = await res.item.save();
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/items/{id}:
 *   delete:
 *     summary: Remove the item by id
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The item id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The item was deleted
 *       404:
 *         description: The item was not found
 */

router.delete('/:id', getItem, async (req, res) => {
  try {
    await res.item.remove();
    res.json({ message: 'Item Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get item by ID
async function getItem(req, res, next) {
  let item;
  try {
    item = await Item.findById(req.params.id);
    if (item == null) {
      return res.status(404).json({ message: 'Cannot find item' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.item = item;
  next();
}

module.exports = router;