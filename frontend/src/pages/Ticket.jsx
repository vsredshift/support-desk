import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import Modal from "react-modal";
import {
  getTicket,
  closeTicket,
  openTicket,
} from "../features/tickets/ticketSlice";
import { createNote, getNotes } from "../features/notes/noteSlice";
import NoteItem from "../components/NoteItem";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";

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

  const { ticket } = useSelector((state) => state.tickets);
  const { notes } = useSelector((state) => state.notes);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ticketId } = useParams();

  useEffect(() => {
    dispatch(getTicket(ticketId)).unwrap().catch(toast.error);
    dispatch(getNotes(ticketId)).unwrap().catch(toast.error);
    // eslint-disable-next-line
  }, [ticketId, dispatch]);

  const onTicketClose = () => {
    dispatch(closeTicket(ticketId))
      .unwrap()
      .then(() => {
        toast.success("Ticket closed");
        navigate("/tickets");
      })
      .catch(toast.error);
  };

  const onReopenTicket = () => {
    dispatch(openTicket(ticketId))
      .unwrap()
      .then(() => {
        toast.success("Ticket reopened");
        navigate("/tickets");
      })
      .catch(toast.error);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const toggleSortOrder = () =>
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");

  const onNoteSubmit = (e) => {
    e.preventDefault();
    dispatch(createNote({ noteText, ticketId }))
      .unwrap()
      .then(() => {
        setNoteText("");
      })
      .catch(toast.error);
    dispatch(openTicket(ticketId))
      .unwrap()
      .then(() => closeModal())
      .catch(toast.error);
  };

  if (!ticket) {
    return <Spinner />;
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
        {notes?.length > 0 && (
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

      {notes?.length === 0
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
