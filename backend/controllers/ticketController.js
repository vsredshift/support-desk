const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Ticket = require("../models/ticketModel");

/**
 * @description Get user tickets
 * @access      Private
 * @route       GET api/tickets
 */
const getTickets = asyncHandler(async (req, res) => {
  try {
    // Get user from JWT
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ error: "User not found" });

    const tickets = await Ticket.find({ user });

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @description Create a new ticket
 * @access      Private
 * @route       POST api/tickets
 */
const createTicket = asyncHandler(async (req, res) => {
  const { product, description } = req.body;

  if (!product || !description) {
    return res
      .status(400)
      .json({ error: "Please provide a product and description" });
  }

  const user = await User.findById(req.user.id);
  if (!user) return res.status(401).json({ error: "User not found" });

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
  try {
    // Get user from JWT
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ error: "User not found" });

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    if (ticket.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not Authorised" });
    }

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

/**
 * @description Delete a ticket
 * @access      Private
 * @route       DELETE api/tickets/:id
 */
const deleteTicket = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ error: "User not found" });

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    if (ticket.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not Authorised" });
    }

    await ticket.deleteOne();

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @description Update a ticket
 * @access      Private
 * @route       PUT api/tickets/:id
 */
const updateTicket = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ error: "User not found" });

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    if (ticket.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not Authorised" });
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = {
  getTickets,
  createTicket,
  getTicket,
  deleteTicket,
  updateTicket,
};
