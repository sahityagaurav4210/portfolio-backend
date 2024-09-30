import mongoose, { model, Schema } from 'mongoose';
import { IWebsiteUpdates } from '../interfaces/website_updates';
import { ModelNames } from '../constant';

const websiteUpdatesSchema = new Schema<IWebsiteUpdates>(
  {
    website_owner: {
      type: mongoose.Types.ObjectId,
      required: [true, 'Website owner info is required'],
    },
    portfolio_url: {
      type: String,
      required: [true, 'Portfolio url is required'],
    },
  },
  { timestamps: true }
);

export const WebsiteUpdates = model(ModelNames.WEBSITE_UPDATES, websiteUpdatesSchema);
