import { IHome } from "@interfaces/home.interface";
import mongoose, { model, Schema } from "mongoose";
import { ModelNames } from "../constant";

const Patterns = require('@book-junction/patterns');

const homeSchema = new Schema<IHome>({
  displayName: {
    type: String,
    trim: true,
    required: [true, "Display name is required"],
    match: [Patterns.common.name, "Invalid display name"]
  },
  url: {
    type: String,
    trim: true,
    lowercase: true,
  },
  specialization: {
    type: [String],
    required: [true, "Atleast one specialization is required"],
    lowercase: true,
    trim: true
  },
  about: {
    type: String,
    required: [true, "Your description is required"],
    trim: true,
    minLength: [10, "Your description is too short."],
    maxLength: [254, "Your description is too long."]
  },
  projectsDelivered: {
    type: Number,
    default: 0
  },
  codingQuestionSolved: {
    type: Number,
    default: 0
  },
  activeGithubContributions: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "User is required"]
  },
  experience: {
    type: Number,
    default: 0
  },
  designation: {
    type: String,
    trim: true,
    required: [true, "Your designation is required"]
  },
  hackerrankUrl: {
    type: String,
    default: null,
    trim: true
  },
  linkedInUrl: {
    type: String,
    default: null,
    trim: true
  },
  leetcodeUrl: {
    type: String,
    default: null,
    trim: true
  },
  twitterUrl: {
    type: String,
    default: null,
    trim: true
  }
}, { timestamps: true });

const Home = model(ModelNames.HOME, homeSchema, ModelNames.HOME);
export default Home;