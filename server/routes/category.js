const express = require('express');

const Category = require('../models/Category');
const { tokenVerify, isAdmin } = require('../middlewares/authentication');

const app = express();

app.get('/category', tokenVerify, (req, res) => {
    
    Category.find({})
            .sort('description')
            .populate('user', 'name email')
            .exec((error, categories) => {
                if (error) {
                    return res.status(400).json({
                        ok: false,
                        error
                    });
                }

                Category.countDocuments({}, (error, total) => {
                    res.json({
                        ok: true,
                        total,
                        categories
                    });
                });
            });
});

app.get('/category/:id', tokenVerify, (req, res) => {
    const id = req.params.id;
    
    Category.findById(id)
            .populate('user', 'name email')
            .exec((error, categoryDB) => {
                if (error) {
                    return res.status(500).json({
                        ok: false,
                        error
                    });
                }

                if (!categoryDB) {
                    return res.status(400).json({
                        ok: false,
                        error: {
                            message: 'Category not found'
                        }
                    });
                }

                res.json({
                    ok: true,
                    category: categoryDB
                });
            });
});
  
app.post('/category', [tokenVerify, isAdmin], (req, res) => {
    
    const newCategory = new Category({
        description: req.body.description,
        user: req.user._id,
    });

    newCategory.save((error, categoryDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });
    });
});
  
app.put('/category/:id', [tokenVerify, isAdmin], (req, res) => {
    const id = req.params.id;
    const body = req.body;

    Category.findByIdAndUpdate(id, body, { new: true }, (error, categoryDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }
        
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Category not found'
                }
            });
        }

        res.json({
            ok: true,
            Category: categoryDB
        });
    }); 
});
  
 app.delete('/category/:id', [tokenVerify, isAdmin], (req, res) => {
    let id = req.params.id;

    Category.findByIdAndRemove(id, (error, categoryDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Category not found'
                }
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });
    }); 
});

module.exports = app;