import mongoose from 'mongoose';

const connectdb = async () => {

    mongoose.connection.on('connected', () => {
        console.log('Mongoose connected to db');
    });
    await mongoose.connect(`${process.env.MONGODB_URI}/imagify`)
}

export default connectdb;