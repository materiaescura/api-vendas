import { Router } from 'express';
import ProfileController from '../controllers/ProfileController';
import { Joi, Segments, celebrate } from 'celebrate';
import isAuthenticated from '@shared/http/middlewares/isAuthenticated';

const profileRouter = Router();

const profileControler = new ProfileController();

profileRouter.use(isAuthenticated);

profileRouter.get(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  profileControler.show,
);

profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string().optional(),
      password_confirmation: Joi.string()
        .valid(Joi.ref('password'))
        .when('password', {
          is: Joi.exist(),
          then: Joi.required(),
        }),
    },
  }),
  profileControler.update,
);

export default profileRouter;
