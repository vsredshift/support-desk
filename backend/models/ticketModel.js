const mongoose = require("mongoose");

const ticketSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    product: {
      type: String,
      required: [true, "Please select a product"],
      enum: ["Phone", "Laptop", "PC", "MacBook", "Headphones"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description of the issue"],
    },
    status: {
      type: String,
      required: true,
      enum: ["new", "open", "resolved", "closed"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Ticket", ticketSchema);
