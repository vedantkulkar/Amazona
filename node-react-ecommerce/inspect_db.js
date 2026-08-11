const mongoose = require('mongoose');

const mongodbUrl = 'mongodb://127.0.0.1/amazona';

mongoose.connect(mongodbUrl).then(async () => {
  console.log('Connected to MongoDB');
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('Collections:', collections.map(c => c.name));
  
  const products = await mongoose.connection.db.collection('products').find({}).toArray();
  console.log('Number of products in "products" collection:', products.length);
  if (products.length > 0) {
    console.log('Sample product ID:', products[0]._id, 'Name:', products[0].name);
  }
  
  process.exit(0);
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});
