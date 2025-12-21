import { Schema, model, Document } from "mongoose";
import { UserRoleEnum } from "./users.zod.schema"; // Zod enum object import for values
import type { UserRoles } from "./users.types"; // Type import for TS safety (union type)

// Interface for TS (extend Document for Mongoose)
// Yeh mein UserRoles type use kar raha hun taake role field ki type safety ho
export interface IUser extends Document {
  email: string;
  password: string; // Hashed password
  role: UserRoles; // Yeh union type use karo
  isEmailVerified: boolean;
  otp: number | null;
  otpExpiry: Date | null;
  createdAt: Date;
  updatedAt: Date;
  // Add more fields later if needed
}

// Mongoose Schema (Zod se match karte fields)
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Invalid email format"], // Basic regex, but Zod pe full rely karo
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: UserRoleEnum.options, // Yeh array deta hai values ka
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: Number,
      min: 100000,
      max: 999999,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null, // 10 minutes
    },
  },
  {
    timestamps: true, // Auto createdAt/updatedAt
  }
);

// Model export
const UserModel = model<IUser>("User", userSchema);

export default UserModel;
