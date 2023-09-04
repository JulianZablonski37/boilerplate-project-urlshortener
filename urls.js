import mongoose from 'mongoose';

const UrlSchema = new mongoose.Schema({
  original_url : {
    type: String,
    required: true,
  },
  short_url : {
    type: Number,
    required: true,
  },
});


export default mongoose.model('Url', UrlSchema);