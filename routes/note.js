const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Note = require("../models/Note");
const { NotesResponse, NoteResponse } = require("../utils/responses");

const getNotesByUser = async (userId) => {
  try {
    const notes = await Note.find({ userId });
    return NotesResponse.success(notes);
  } catch (err) {
    return NotesResponse.failed(err.message);
  }
};

const addNote = async (userId, noteData) => {
  try {
    const noteTitle = noteData.title.trim();
    const noteText = noteData.note.trim();

    if (!noteTitle || !noteText) {
      throw new Error("Title and Note should not be blank");
    }
    if (noteTitle.length < 4 || noteTitle.length > 30) {
      throw new Error(
        "Title should be of min 4 and max 30 characters in length"
      );
    }

    const note = new Note({
      ...noteData,
      userId,
    });
    await note.save();
    return NoteResponse.success(note._id);
  } catch (err) {
    return NoteResponse.failed(err.message);
  }
};

const updateNote = async (userId, noteId, noteData) => {
  try {
    const noteTitle = noteData.title.trim();
    const noteText = noteData.note.trim();

    if (!noteTitle || !noteText) {
      throw new Error("Title and Note should not be blank");
    }
    if (noteTitle.length < 4 || noteTitle.length > 30) {
      throw new Error(
        "Title should be of min 4 and max 30 characters in length"
      );
    }

    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId },
      { $set: noteData },
      { new: true, runValidators: true }
    );
    if (!note) throw new Error("Note not found");
    return NoteResponse.success(note._id);
  } catch (err) {
    return NoteResponse.failed(err.message);
  }
};

const deleteNote = async (userId, noteId) => {
  try {
    const note = await Note.findOneAndDelete({ _id: noteId, userId });
    if (!note) throw new Error("Note not found");
    return NoteResponse.success(note._id);
  } catch (err) {
    return NoteResponse.failed(err.message);
  }
};

const updateNotePin = async (userId, noteId, isPinned) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId },
      { $set: { isPinned } },
      { new: true, runValidators: true }
    );
    if (!note) throw new Error("Note not found");
    return NoteResponse.success(note._id);
  } catch (err) {
    return NoteResponse.failed(err.message);
  }
};

// Create Note
router.post("/note/new", auth, async (req, res) => {
  const response = await addNote(req.user._id, req.body);
  res.status(response.status === "SUCCESS" ? 201 : 400).send(response);
});

// Get Notes
router.get("/notes", auth, async (req, res) => {
  const response = await getNotesByUser(req.user._id);
  res.status(response.status === "SUCCESS" ? 200 : 400).send(response);
});

// Get Note by ID
router.get("/note/:id", auth, async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });
  if (!note)
    return res.status(404).send(NoteResponse.notFound("Note not found."));
  res.send(note);
});

// Update Note
router.put("/note/:id", auth, async (req, res) => {
  const response = await updateNote(req.user._id, req.params.id, req.body);
  res.status(response.status === "SUCCESS" ? 200 : 400).send(response);
});

// Pin/Unpin Note
router.patch("/note/:id/pin", auth, async (req, res) => {
  const response = await updateNotePin(
    req.user._id,
    req.params.id,
    req.body.isPinned
  );
  res.status(response.status === "SUCCESS" ? 200 : 400).send(response);
});

// Delete Note
router.delete("/note/:id", auth, async (req, res) => {
  const response = await deleteNote(req.user._id, req.params.id);
  res.status(response.status === "SUCCESS" ? 200 : 400).send(response);
});

module.exports = router;
