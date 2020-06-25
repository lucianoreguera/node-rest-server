process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

process.env.EXPIRE_TOKEN = 60 * 60 * 24 * 30;

process.env.SEED_TOKEN = process.env.SEED_TOKEN || 'secret';

let urlDB ;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// Google CLient ID
process.env.CLIENT_ID = process.env.CLIENT_ID || '610302099653-63gms8ubj09us7vdddl6nua6ig55jc7o.apps.googleusercontent.com';