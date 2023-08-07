import { Router } from 'express';
import ForgotPasswordController from '../controllers/ForgotPasswordController';
import { Joi, Segments, celebrate } from 'celebrate';
import ResetPasswordController from '../controllers/ResetPasswordController';

const passwordRouter = Router();
const forgortPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

passwordRouter.post(
  '/forgot',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  forgortPasswordController.create,
);

passwordRouter.post(
  '/reset',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().uuid().required(),
      password: Joi.string().required(),
      password_confirmation: Joi.string()
        .email()
        .required()
        .valid(Joi.ref('password')),
    },
  }),
  resetPasswordController.create,
);

export default passwordRouter;
