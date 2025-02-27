import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Modal from "react-modal";
import {
  getTicket,
  closeTicket,
  openTicket,
  reset,
} from "../features/tickets/ticketSlice";
import {
  createNote,
  getNotes,
  reset as notesReset,
} from "../features/notes/noteSlice";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NoteItem from "../components/NoteItem";
import { FaPlus } from "react-icons/fa";

const customStyles = {
  content: {
    width: "600px",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    position: "relative",
  },
};

Modal.setAppElement("#root");

function Ticket() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

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
    dispatch(openTicket(ticketId));
    toast.success("Ticket reopened");
    navigate("/tickets");
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  const onNoteSubmit = (e) => {
    e.preventDefault();
    dispatch(createNote({ noteText, ticketId }));
    dispatch(openTicket(ticketId));
    dispatch(reset());
    closeModal();
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
        <hr />
        <h2>Notes</h2>
      </header>

      <div className="note-header">
        {ticket.status !== "closed" && (
          <button className="btn" onClick={openModal}>
            <FaPlus />
            Add Note
          </button>
        )}
        {notes.length > 0 && (
          <button
            className="btn btn-note-order btn-sm"
            onClick={toggleSortOrder}
          >
            Show {sortOrder === "asc" ? "newest" : "oldest"} first
          </button>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Add Note"
      >
        <h2>Add Note</h2>
        <form onSubmit={onNoteSubmit}>
          <div className="form-group">
            <textarea
              name="noteText"
              id="noteText"
              className="form-control"
              placeholder="Note text"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            ></textarea>
          </div>
          <div className="modal-buttons">
            <div className="form-group">
              <button type="submit" className="btn">
                Submit
              </button>
            </div>
            <div className="form-group">
              <button className="btn btn-danger" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {notes.length === 0
        ? "No notes yet"
        : [...notes]
            .sort((a, b) =>
              sortOrder === "desc"
                ? new Date(b.createdAt) - new Date(a.createdAt)
                : new Date(a.createdAt) - new Date(b.createdAt)
            )
            .map((note) => <NoteItem key={note._id} note={note} />)}

      {ticket.status !== "closed" ? (
        <button className="btn btn-block btn-danger" onClick={onTicketClose}>
          Close Ticket
        </button>
      ) : (
        <button className="btn btn-block btn-reopen" onClick={onReopenTicket}>
          Re-open ticket
        </button>
      )}
      <br />
      <br />
    </div>
  );
}

export default Ticket;
