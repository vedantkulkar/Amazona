import express from 'express';
import Product from '../models/productModel';
import { isAuth, isAdmin } from '../util';
import data from '../data';


const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const category = req.query.category ? { category: req.query.category } : {};
    const searchKeyword = req.query.searchKeyword
      ? {
          name: {
            $regex: req.query.searchKeyword,
            $options: 'i',
          },
        }
      : {};
    const sortOrder = req.query.sortOrder
      ? req.query.sortOrder === 'lowest'
        ? { price: 1 }
        : { price: -1 }
      : { _id: -1 };
    const products = await Product.find({ ...category, ...searchKeyword }).sort(
      sortOrder
    );
    if (products && products.length > 0) {
      return res.send(products);
    }
  } catch (error) {
    console.log('DB Query error, falling back to data.js:', error.message);
  }

  // Fallback to in-memory data
  let filtered = [...data.products];
  if (req.query.category) {
    filtered = filtered.filter((p) => p.category.toLowerCase() === req.query.category.toLowerCase());
  }
  if (req.query.searchKeyword) {
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(req.query.searchKeyword.toLowerCase())
    );
  }
  if (req.query.sortOrder === 'lowest') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (req.query.sortOrder === 'highest') {
    filtered.sort((a, b) => b.price - a.price);
  }
  res.send(filtered);
});

router.get('/seed', async (req, res) => {
  try {
    await Product.deleteMany({});
    const seedItems = data.products.map(({ _id, ...item }) => item);
    const createdProducts = await Product.insertMany(seedItems);
    res.send({ message: `${createdProducts.length} products seeded successfully!`, data: createdProducts });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });
    if (product) {
      return res.send(product);
    }
  } catch (error) {
    console.log('DB findById error, checking fallback:', error.message);
  }

  // Fallback match by _id or index
  const product = data.products.find(
    (p) => String(p._id) === req.params.id || p.name === req.params.id
  );
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found.' });
  }
});
router.post('/:id/reviews', isAuth, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    const review = {
      name: req.body.name,
      rating: Number(req.body.rating),
      comment: req.body.comment,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((a, c) => c.rating + a, 0) /
      product.reviews.length;
    const updatedProduct = await product.save();
    res.status(201).send({
      data: updatedProduct.reviews[updatedProduct.reviews.length - 1],
      message: 'Review saved successfully.',
    });
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});
router.put('/:id', isAuth, isAdmin, async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);
  if (product) {
    product.name = req.body.name;
    product.price = req.body.price;
    product.image = req.body.image;
    product.brand = req.body.brand;
    product.category = req.body.category;
    product.countInStock = req.body.countInStock;
    product.description = req.body.description;
    const updatedProduct = await product.save();
    if (updatedProduct) {
      return res
        .status(200)
        .send({ message: 'Product Updated', data: updatedProduct });
    }
  }
  return res.status(500).send({ message: ' Error in Updating Product.' });
});

router.delete('/:id', isAuth, isAdmin, async (req, res) => {
  const deletedProduct = await Product.findById(req.params.id);
  if (deletedProduct) {
    await deletedProduct.remove();
    res.send({ message: 'Product Deleted' });
  } else {
    res.send('Error in Deletion.');
  }
});

router.post('/', isAuth, isAdmin, async (req, res) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    image: req.body.image,
    brand: req.body.brand,
    category: req.body.category,
    countInStock: req.body.countInStock,
    description: req.body.description,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
  });
  const newProduct = await product.save();
  if (newProduct) {
    return res
      .status(201)
      .send({ message: 'New Product Created', data: newProduct });
  }
  return res.status(500).send({ message: ' Error in Creating Product.' });
});

export default router;
