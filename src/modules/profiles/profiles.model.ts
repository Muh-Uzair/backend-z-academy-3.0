import { Schema, model, Document, Types } from "mongoose";

export interface IProfile extends Document {
  userId: Types.ObjectId;
  fullName: string;
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new Schema<IProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
    },
  },
  { timestamps: true }
);

const ProfileModel = model<IProfile>("Profile", profileSchema);

export default ProfileModel;
