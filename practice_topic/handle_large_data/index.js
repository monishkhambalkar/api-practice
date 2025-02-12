const express = require("express");
const app = express();

let productSchema;

// implement pagination
app.get("/products", async (req, res) => {
  let { limit = 10, cursor } = req.query;
  limit = parseInt(limit);

  let filter = cursor ? { _id: { $gt: cursor } } : {};

  try {
    const products = await Product.find(filter).sort({ _id: 1 }).limit(limit);

    const nextCursor = products.length
      ? products[products.length - 1]._id
      : null;
    res.json({ data: products, nextCursor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Implement Filtering with Query Parameters
app.get("/products", async (req, res) => {
  let {
    status,
    date,
    category,
    minPrice,
    maxPrice,
    search,
    limit = 10,
    page = 1,
  } = req.query;

  let filter = {};

  if (status) filter.status = status;
  if (date) filter.date = date;
  if (category) filter.category = category;
  if (minPrice && maxPrice) filter.price = { $gte: minPrice, $lte: maxPrice };
  if (search) filter.$text = { $search: search }; // Full-text search

  limit = parent(limit);
  page = parseInt(page);
  const skip = (page - 1) * limit;
  try {
    const products = await product
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocument(filter);
    res.json({
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
      data: products,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Optimize Queries with Indexing
// productSchema.index({ status: 1 });
// ProductSchema.index({ category: 1 });
// ProductSchema.index({ price: 1 });
// ProductSchema.index({ createdAt: -1 });
// ProductSchema.index({ name: "text", description: "text" });

// Use Full-Text Search for Complex Filtering
app.get("/search", async (req, res) => {
  let { query, limit = 10 } = req.query;
  limit = parseInt(limit);

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    const results = await Product.find({ $text: { $search: query } })
      .sort({ score: { $meta: "textScore" } })
      .limit(limit);

    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Use Aggregation for Advanced Filtering
app.get("/products/advanced", async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $match: { status: "active" } }, // Filter active products
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      { $sort: { createdAt: -1 } }, // Sort by latest
      { $limit: 10 },
    ]);

    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Caching with Redis for Faster Queries
const Redis = require("ioredis");
const redis = new Redis();

app.get("/products", async (req, res) => {
  let { page = 1, limit = 10 } = req.query;
  const cacheKey = `products?page=${page}&limit=${limit}`;

  try {
    const cachedData = await redis.get(cacheKey);
    if (cachedData) return res.json(JSON.parse(cachedData)); // Return cached data

    const products = await Product.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    await redis.set(cacheKey, JSON.stringify(products), "EX", 300); // Cache for 5 min
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 4001;

app.listen(PORT, () => {
  console.log(`Your Server is running on port http://localhost:${PORT}`);
});

// https://chatgpt.com/share/67ac0d2c-a264-8003-8165-cd77e2045e16
