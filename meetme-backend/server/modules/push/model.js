import mongoose, { Schema } from 'mongoose';

const PushSchema = new Schema({
  token: {
    type : String,
    required : true
  }
});


export default mongoose.model('Push', PushSchema);
