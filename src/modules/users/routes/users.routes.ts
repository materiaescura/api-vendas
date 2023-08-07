import { Router } from 'express';
import UserController from '../controllers/UserController';
import { Segments, Joi, celebrate } from 'celebrate';
import isAuthenticated from '../../../shared/http/middlewares/isAuthenticated';
import UserAvatarController from '../controllers/UserAvatarController';
import multer from 'multer';
import uploadConfig from '@config/upload';

const userController = new UserController();
const avatarController = new UserAvatarController();

const userRouter = Router();

const upload = multer(uploadConfig);

userRouter.get('/', isAuthenticated, userController.index);
userRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
    },
  }),
  userController.create,
);

userRouter.patch(
  '/avatar',
  isAuthenticated,
  upload.single('avatar'),
  avatarController.update,
);
export default userRouter;
