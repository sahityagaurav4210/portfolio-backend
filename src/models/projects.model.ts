import { IProject } from '@interfaces/projects.interface';
import mongoose, { model, Schema } from 'mongoose';
import { ModelNames, ProjectDomain, ProjectType } from '../constant';

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: Schema.Types.String,
      required: [true, 'Project name is required'],
      trim: true,
      minlength: [2, 'Too short project name'],
    },
    text: {
      type: Schema.Types.String,
      required: [true, 'Project description text is required'],
      trim: true,
      minlength: [5, 'Too short project description'],
    },
    tech_stack: {
      type: [Schema.Types.String],
      default: [],
    },
    type: {
      type: Schema.Types.String,
      enum: Object.values(ProjectType),
      required: [true, 'Project type is required'],
      trim: true,
    },
    disabled: {
      type: Schema.Types.Boolean,
      default: false,
    },
    ongoing: {
      type: Schema.Types.Boolean,
      default: false,
    },
    showDivider: {
      type: Schema.Types.Boolean,
      default: false,
    },
    cardImage: {
      type: Schema.Types.String,
      default: null,
      trim: true,
    },
    liveLink: {
      type: Schema.Types.String,
      default: null,
      trim: true,
    },
    codeLink: {
      type: Schema.Types.String,
      default: null,
      trim: true,
    },
    documentation_link: {
      type: Schema.Types.String,
      default: null,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ModelNames.USERS,
      required: [true, 'User is required'],
      index: true,
    },
    isActive: {
      type: Schema.Types.Boolean,
      default: true,
    },
    priority: {
      type: Schema.Types.Number,
      default: 0,
    },
    projectDomain: {
      type: Schema.Types.String,
      enum: Object.values(ProjectDomain),
      required: [true, 'Project domain is required'],
      trim: true,
      default: ProjectDomain.CORPORATE,
    },
    note: {
      type: Schema.Types.String,
      default: null,
    },
  },
  { timestamps: true }
);

const Project = model(ModelNames.PROJECTS, projectSchema, ModelNames.PROJECTS);

export { projectSchema, Project };
export default Project;
