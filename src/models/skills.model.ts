import { ISkills } from "@interfaces/portfolio.interface";
import { model, Schema } from "mongoose";
import { ModelNames } from "../constant";

const skillSchema = new Schema<ISkills>({
  name: {
    type: Schema.Types.String,
    required: [true, "Skill name is required"],
    trim: true
  },
  experience: {
    type: Schema.Types.String,
    required: [true, "Experience is required"],
    trim: true
  },
  description: {
    type: Schema.Types.String,
    required: [true, "Description is required"],
    trim: true,
    minlength: [10, "Description should be of minimum 10 characters"],
    maxlength: [1000, "Too long description"]
  },
  url: {
    type: Schema.Types.String,
    required: false,
    trim: true,
    minlength: [5, "Too short url"]
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true
  }
}, { timestamps: true });

const Skill = model(ModelNames.SKILLS, skillSchema, ModelNames.SKILLS);

export default Skill;