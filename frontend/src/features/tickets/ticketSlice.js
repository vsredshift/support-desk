import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { extractErrorMessage } from "../../utils";
import ticketService from "./ticketService";

const initialState = {
  tickets: [],
  ticket: {},
};

// Create new ticket
export const createTicket = createAsyncThunk(
  "tickets/create",
  async (ticketData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await ticketService.createTicket(ticketData, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Get user tickets
export const getTickets = createAsyncThunk(
  "tickets/getAll",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await ticketService.getTickets(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Get user ticket
export const getTicket = createAsyncThunk(
  "tickets/get",
  async (ticketId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await ticketService.getTicket(ticketId, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Close Ticket
export const closeTicket = createAsyncThunk(
  "tickets/close",
  async (ticketId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await ticketService.closeTicket(ticketId, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Set ticket status to open
// TODO: Write a generic function to set the ticket status dynamically
export const openTicket = createAsyncThunk(
  "tickets/open",
  async (ticketId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await ticketService.openTicket(ticketId, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getTickets.pending, (state) => {
        state.ticket = null;
      })
      .addCase(getTickets.fulfilled, (state, action) => {
        state.tickets = action.payload;
      })
      .addCase(getTicket.fulfilled, (state, action) => {
        state.ticket = action.payload;
      })
      .addCase(closeTicket.fulfilled, (state, action) => {
        state.ticket = action.payload;
        state.tickets.map((ticket) => {
          ticket._id === action.payload._id
            ? (ticket.status = "closed")
            : ticket;
        });
      })
      .addCase(openTicket.fulfilled, (state, action) => {
        state.ticket = action.payload;
        state.tickets.map((ticket) => {
          ticket._id === action.payload._id ? (ticket.status = "open") : ticket;
        });
      });
  },
});

export const { reset } = ticketSlice.actions;
export default ticketSlice.reducer;
