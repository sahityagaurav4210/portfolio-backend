import mongoose, { model, Schema } from 'mongoose';
import { IPortfolio } from '../interfaces/portfolio.interface';
import { ModelNames, ProjectType } from '../constant';

const portfolioSchema = new Schema<IPortfolio>(
  {
    homeSection: {
      type: {
        profilePic: { type: String, default: null },
        description: {
          type: String,
          minlength: [10, 'Too short description'],
          required: [true, 'Description is required'],
        },
      },
      _id: false,
      required: [true, 'Home section is required'],
    },
    projectSection: {
      type: [
        {
          name: {
            type: String,
            required: [true, 'Project name is required'],
            minlength: [2, 'Too short project name'],
          },
          description: {
            type: String,
            required: [true, 'Project description is required'],
            minlength: [10, 'Too short description'],
          },
          tech_stack: {
            type: [String],
            required: [true, 'Project tech stack is required'],
            length: [1, 'Too less no. of tech stack'],
          },
          live_link: {
            type: String,
            default: null,
          },
          code_link: {
            type: String,
            minlength: [5, 'Too short code link'],
          },
          documentation_link: {
            type: String,
            default: null,
          },
          project_type: {
            type: String,
            required: [true, 'Project type is required'],
            enum: ProjectType,
          },
          disabled: {
            type: Boolean,
            default: false,
          },
        },
      ],
      required: [true, 'Project section is required'],
      _id: false,
    },
    portfolio_user: {
      type: mongoose.Schema.ObjectId,
      ref: ModelNames.USERS,
      required: [true, 'User is required'],
    },
  },
  { timestamps: true }
);

const Portfolio = model(ModelNames.PORTFOLIO, portfolioSchema);

export default Portfolio;
