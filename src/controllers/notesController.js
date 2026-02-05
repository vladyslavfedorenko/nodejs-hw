import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

/**
 * GET /notes
 */
export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search } = req.query;

    const skip = (page - 1) * perPage;

    // ✅ строим query через chain methods
    let query = Note.find().where('userId').equals(req.user._id);

    if (tag) {
      query = query.where('tag').equals(tag);
    }

    if (search) {
      query = query.where({ $text: { $search: search } });
    }

    // ✅ параллельное выполнение
    const [notes, totalNotes] = await Promise.all([
      query.skip(skip).limit(perPage),
      Note.countDocuments(query.getFilter()),
    ]);

    res.status(200).json({
      page: Number(page),
      perPage: Number(perPage),
      totalNotes,
      totalPages: Math.ceil(totalNotes / perPage),
      notes,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /notes/:noteId
 */
export const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findOne()
      .where('_id')
      .equals(req.params.noteId)
      .where('userId')
      .equals(req.user._id);

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /notes
 */
export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /notes/:noteId
 */
export const updateNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndUpdate(
      {
        _id: req.params.noteId,
        userId: req.user._id,
      },
      req.body,
      { new: true }
    );

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /notes/:noteId
 */
export const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.noteId,
      userId: req.user._id,
    });

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};
