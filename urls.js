import mongoose from 'mongoose';

const UrlSchema = new mongoose.Schema({
  origUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: Number,
    required: true,
  },
});


export default mongoose.model('Url', UrlSchema);