import { Router } from 'express';
import Middleware from '../middlewares';
import Controller from '../controllers';
import { asyncHandler } from '@helpers/index';
import portfolioBuilderBackendSkillsUpload from '@config/skills_upload.config';

const route = Router();

route.put(
  '/edit-profile',
  portfolioBuilderBackendSkillsUpload.single('avatar'),
  asyncHandler(Middleware.users().validateEditProfile),
  asyncHandler(Middleware.checkIfAuthenticated),
  asyncHandler(Controller.user().editProfile)
);

route.put(
  '/change-pwd',
  asyncHandler(Middleware.checkIfAuthenticated),
  asyncHandler(Controller.user().changePwd)
);

route.get(
  '/profile',
  asyncHandler(Middleware.checkIfAuthenticated),
  asyncHandler(Controller.user().viewProfile)
);

export default route;
