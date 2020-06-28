const express = require('express');

const Product = require('../models/Product');
const { tokenVerify, isAdmin } = require('../middlewares/authentication');

const app = express();

app.get('/product', tokenVerify, (req, res) => {
    let from = Number(req.query.from) || 0;
    let limit = Number(req.query.limit) || 10;
    
    Product.find({ available: true })
            .skip(from)
            .limit(limit)
            .sort('name')
            .populate('category', 'description')
            .populate('user', 'name email')
            .exec((error, products) => {
                if (error) {
                    return res.status(500).json({
                        ok: false,
                        error
                    });
                }

                Product.countDocuments({ available: true }, (error, total) => {
                    res.json({
                        ok: true,
                        total,
                        products
                    });
                });
            });
});

app.get('/product/:id', tokenVerify, (req, res) => {
    const id = req.params.id;
    
    Product.findById(id)
            .populate('category', 'description')
            .populate('user', 'name email')
            .exec((error, productDB) => {
                if (error) {
                    return res.status(500).json({
                        ok: false,
                        error
                    });
                }

                if (!productDB) {
                    return res.status(400).json({
                        ok: false,
                        error: {
                            message: 'Product not found'
                        }
                    });
                }

                res.json({
                    ok: true,
                    product: productDB
                });
            });
});

app.get('/product/search/:term', tokenVerify, (req, res) => {
    const term = req.params.term;

    let regexp = new RegExp(term, 'i');

    Product.find({ name: regexp })
           .populate('category', 'description')
           .exec((error, products) => {
                if (error) {
                    return res.status(500).json({
                        ok: false,
                        error
                    });
                }
                res.json({
                    ok: true,
                    products
                });
           });
});
  
app.post('/product', [tokenVerify, isAdmin], (req, res) => {
    
    const newProduct = new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        user: req.user._id,
    });

    newProduct.save((error, productDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        res.json({
            ok: true,
            product: productDB
        });
    });
});
  
app.put('/product/:id', [tokenVerify, isAdmin], (req, res) => {
    const id = req.params.id;
    const body = req.body;

    Product.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (error, productDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }
        
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Product not found'
                }
            });
        }

        res.json({
            ok: true,
            product: productDB
        });
    }); 
});
  
 app.delete('/product/:id', [tokenVerify, isAdmin], (req, res) => {
    let id = req.params.id;

    let isAvailable = {
        available: false
    };

    Product.findByIdAndUpdate(id, isAvailable, { new: true }, (error, productDB) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        if (!productDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Product not found'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Delete product',
            product: productDB
        });
    }); 
});

module.exports = app;