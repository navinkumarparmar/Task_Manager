import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    role: 'user' | 'admin';
    password: string;
}
interface AuthenticatedRequest extends Request {
    user?: any; // ya specific type agar user ka structure pata hai
  }

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
