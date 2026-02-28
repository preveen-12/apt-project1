import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    scanHistory: [{
        type: { type: String }, 
        target: String,         
        results: Object,        
        date: { type: Date, default: Date.now }
    }]
});

// This prevents the "MissingSchemaError" by checking if the model exists first
const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;