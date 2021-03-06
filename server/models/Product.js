const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: { 
        type: String, 
        required: [true, 'Name is required!'] 
    },
    price: { 
        type: Number, 
        required: [true, 'Price is required!'] 
    },
    description: { 
        type: String, 
        required: false 
    },
    available: { 
        type: Boolean, 
        required: true, 
        default: true 
    },
    img: {
        type: String,
        required: false
    },
    category: { 
        type: Schema.Types.ObjectId, 
        ref: 'Category', 
        required: true 
    },
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    }
});


module.exports = mongoose.model('Product', productSchema);