import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  getTicket,
  reset,
  closeTicket,
  reopenTicket,
} from "../features/tickets/ticketSlice";
import { getNotes, reset as notesReset } from "../features/notes/noteSlice";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NoteItem from "../components/NoteItem";

function Ticket() {
  const { ticket, isSuccess, isError, isLoading, message } = useSelector(
    (state) => state.tickets
  );
  const { notes, isLoading: notesIsLoading } = useSelector(
    (state) => state.notes
  );

  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { ticketId } = params;

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    dispatch(getTicket(ticketId));
    dispatch(getNotes(ticketId));
    // eslint-disable-next-line
  }, [isError, message, ticketId, isSuccess]);

  const onTicketClose = () => {
    dispatch(closeTicket(ticketId));
    toast.success("Ticket closed");
    navigate("/tickets");
  };

  const onReopenTicket = () => {
    dispatch(reopenTicket(ticketId));
    toast.success("Ticket reopened");
    navigate("/tickets");
  };

  if (isLoading || notesIsLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h3>Something went wrong</h3>;
  }

  return (
    <div className="ticket-page">
      <header className="ticket-header">
        <BackButton url="/tickets" />
        <h2>
          Ticket ID: {ticket._id}
          <span className={`status status-${ticket.status}`}>
            {ticket.status}
          </span>
        </h2>
        <h3>Product: {ticket.product}</h3>
        <h3>
          Date Submitted: {new Date(ticket.createdAt).toLocaleString("sv-SV")}
        </h3>
        <hr />
        <div className="ticket-desc">
          <h3>Description of the issue</h3>
          <p>{ticket.description}</p>
        </div>
        <h2>Notes</h2>
      </header>

      {notes.length === 0 ? "No notes yet" : notes.map((note) => (
        <NoteItem key={note._id} note={note} />
      ))}

      {ticket.status !== "closed" ? (
        <button className="btn btn-block btn-danger" onClick={onTicketClose}>
          Close Ticket
        </button>
      ) : (
        <button className="btn btn-block btn-reopen" onClick={onReopenTicket}>
          Re-open ticket
        </button>
      )}
    </div>
  );
}

export default Ticket;
