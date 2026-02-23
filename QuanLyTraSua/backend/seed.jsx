const mongoose = require('mongoose');
const fs = require('fs');

mongoose
    .connect('mongodb://localhost:27017/milktea')
    .then(async () => {
        console.log('Connected DB');

        const categories = JSON.parse(fs.readFileSync('./data/categories.json'));
        const products = JSON.parse(fs.readFileSync('./data/products.json'));
        const orders = JSON.parse(fs.readFileSync('./data/orders.json'));

        await mongoose.connection.db.collection('categories').insertMany(categories);
        await mongoose.connection.db.collection('products').insertMany(products);
        await mongoose.connection.db.collection('orders').insertMany(orders);

        console.log('Seed completed');
        process.exit();
    })
    .catch((err) => console.log(err));
