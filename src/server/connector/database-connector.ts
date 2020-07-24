import mongoose from 'mongoose';
import '../schemas/alphabet';

const connectDb = (): any => {
  return mongoose.connect('mongodb://localhost:27017/phonedirectory', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

const database = mongoose.connection;
database.on('error', console.error.bind(console, 'connection error:'));
database.once('open', () => {
  console.log('connected');
});

export { connectDb };
