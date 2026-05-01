const mongoose = require('mongoose');
const fs = require('fs');

mongoose
    .connect('mongodb://localhost:27017/milktea')
    .then(async () => {
        console.log('Connected DB');

        const categories = JSON.parse(fs.readFileSync('./data/models/categories.json'));
        const products = JSON.parse(fs.readFileSync('./data/models/products.json'));

        await mongoose.connection.db.collection('categories').insertMany(categories);
        await mongoose.connection.db.collection('products').insertMany(products);

        console.log('Seed completed');
        process.exit();
    })
    .catch((err) => console.log(err));
