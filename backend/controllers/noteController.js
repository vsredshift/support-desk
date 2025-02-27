const asyncHandler = require("express-async-handler");
const Ticket = require("../models/ticketModel");
const Note = require("../models/noteModel");

/**
 * @description Get ticket notes
 * @access      Private
 * @route       GET api/tickets/:ticketId/notes
 */
const getNotes = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.ticketId);

  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorised");
  }

  const notes = await Note.find({ ticket });

  res.status(200).json(notes);
});

/**
 * @description Create ticket note
 * @access      Private
 * @route       POST api/tickets/:ticketId/notes
 */
const addNote = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.ticketId);

  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorised");
  }

  if (!req.body.text || req.body.text.trim() === "") {
    res.status(400);
    throw new Error("Note content cannot be empty");
  }

  const note = await Note.create({
    text: req.body.text,
    isStaff: false,
    ticket: req.params.ticketId,
    user: req.user.id,
  });

  res.status(200).json(note);
});

module.exports = {
  getNotes,
  addNote,
};
