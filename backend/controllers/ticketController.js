const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Ticket = require("../models/ticketModel");

/**
 * @description Get user tickets
 * @access      Private
 * @route       GET api/tickets
 */
const getTickets = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Get tickets" });
});

/**
 * @description Create a new ticket
 * @access      Private
 * @route       POST api/tickets
 */
const createTicket = asyncHandler(async (req, res) => {
  res.status(201).json({ message: "Create ticket" });
});

module.exports = {
  getTickets,
  createTicket,
};
