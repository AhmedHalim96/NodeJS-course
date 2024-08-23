const path = require("path");

const express = require("express");

const { getAddProduct, postAddProduct } = require("./controller/products");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", getAddProduct);

// /admin/add-product => POS
router.post("/add-product", postAddProduct);

module.exports = router;
