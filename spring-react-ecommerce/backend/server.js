import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import config from './config';
import userRoute from './routes/userRoute';
import productRoute from './routes/productRoute';
import orderRoute from './routes/orderRoute';
import uploadRoute from './routes/uploadRoute';

import Product from './models/productModel';
import data from './data';

const mongodbUrl = config.MONGODB_URL;
mongoose
  .connect(mongodbUrl)
  .then(async () => {
    console.log('MongoDB connected successfully to:', mongodbUrl);
    try {
      await Product.deleteMany({});
      const seedItems = data.products.map(({ _id, ...item }) => item);
      await Product.insertMany(seedItems);
      console.log('Auto-seeded updated products into MongoDB database!');
    } catch (e) {
      console.log('Auto-seed check failed:', e.message);
    }
  })
  .catch((error) => console.log('MongoDB connection error:', error.message));

const app = express();
app.use(bodyParser.json());
app.use('/api/uploads', uploadRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);
app.get('/api/config/paypal', (req, res) => {
  res.send(config.PAYPAL_CLIENT_ID);
});
app.use('/uploads', express.static(path.join(__dirname, '/../uploads')));
app.use(express.static(path.join(__dirname, '/../frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/build/index.html`));
});

app.listen(config.PORT, () => {
  console.log('Server started at http://localhost:5000');
});
