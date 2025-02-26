const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Ticket = require("../models/ticketModel");

/**
 * @description Get user tickets
 * @access      Private
 * @route       GET api/tickets
 */
const getTickets = asyncHandler(async (req, res) => {
  // Get user from JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const tickets = await Ticket.find({ user });

  res.status(200).json(tickets);
});

/**
 * @description Create a new ticket
 * @access      Private
 * @route       POST api/tickets
 */
const createTicket = asyncHandler(async (req, res) => {
  const { product, description } = req.body;

  if (!product || !description) {
    res.status(400);
    throw new Error("Please provide a product and description");
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const ticket = await Ticket.create({
    product,
    description,
    user,
    status: "new",
  });

  res.status(201).json(ticket);
});

/**
 * @description Get a single ticket
 * @access      Private
 * @route       GET api/tickets/:id
 */
const getTicket = asyncHandler(async (req, res) => {
  // Get user from JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not Authorised");
  }

  res.status(200).json(ticket);
});

/**
 * @description Delete a ticket
 * @access      Private
 * @route       DELETE api/tickets/:id
 */
const deleteTicket = asyncHandler(async (req, res) => {
  // Get user from JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not Authorised");
  }

  await ticket.deleteOne({ id: req.params.id });

  res.status(200).json({ success: true });
});

/**
 * @description Update a ticket
 * @access      Private
 * @route       PUT api/tickets/:id
 */
const updateTicket = asyncHandler(async (req, res) => {
  // Get user from JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not Authorised");
  }

  const updatedTicket = await Ticket.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedTicket);
});

module.exports = {
  getTickets,
  createTicket,
  getTicket,
  deleteTicket,
  updateTicket,
};
