import { celebrate, Joi, Segments } from 'celebrate';

/**
 * POST /auth/register
 * body:
 *  - email: valid email (required)
 *  - password: string, min 8 chars (required)
 */
export const registerUserSchema = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});

/**
 * POST /auth/login
 * body:
 *  - email: valid email (required)
 *  - password: string (required)
 */
export const loginUserSchema = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});
