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

  if (!ticket || ticket.user.toString() !== req.user.id) {
    res.status(401).json({ message: "User not authorised" });
    return;
  }

  const notes = await Note.find({ ticket: ticket._id });
  res.status(200).json(notes);
});

/**
 * @description Create ticket note
 * @access      Private
 * @route       POST api/tickets/:ticketId/notes
 */
const addNote = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.ticketId);

  if (!ticket || ticket.user.toString() !== req.user.id) {
    res.status(401).json({ message: "User not authorised" });
    return;
  }

  const { text } = req.body;
  if (!text || text.trim() === "") {
    res.status(400).json({ message: "Note content cannot be empty" });
    return;
  }

  const note = await Note.create({
    text: text.trim(),
    isStaff: false,
    ticket: ticket._id,
    user: req.user.id,
  });

  res.status(201).json(note);
});

module.exports = {
  getNotes,
  addNote,
};
