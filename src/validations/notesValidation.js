import { celebrate, Joi, Segments } from 'celebrate';
import mongoose from 'mongoose';
import { TAGS } from '../constants/tags.js';

/**
 * GET /notes
 * query:
 *  - page: number >= 1, default 1
 *  - perPage: number 5..20, default 10
 *  - tag: one of TAGS (optional)
 *  - search: string (can be empty)
 */
export const getAllNotesSchema = celebrate({
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    tag: Joi.string()
      .valid(...TAGS)
      .optional(),
    search: Joi.string().allow('').optional(),
  }),
});

/**
 * noteId param validation
 */
export const noteIdSchema = celebrate({
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom((value, helpers) => {
      if (!mongoose.isValidObjectId(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    }),
  }),
});

/**
 * POST /notes
 * body:
 *  - title: string, min 1 (required)
 *  - content: string (optional, can be empty)
 *  - tag: one of TAGS (optional)
 */
export const createNoteSchema = celebrate({
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).required(),
    content: Joi.string().allow('').optional(),
    tag: Joi.string()
      .valid(...TAGS)
      .optional(),
  }),
});

/**
 * PATCH /notes/:noteId
 * params + body
 * body must contain at least one of: title, content, tag
 */
export const updateNoteSchema = celebrate({
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom((value, helpers) => {
      if (!mongoose.isValidObjectId(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    }),
  }),
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).optional(),
    content: Joi.string().allow('').optional(),
    tag: Joi.string()
      .valid(...TAGS)
      .optional(),
  }).min(1),
});
