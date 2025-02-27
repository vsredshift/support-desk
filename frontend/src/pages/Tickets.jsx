import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTickets } from "../features/tickets/ticketSlice";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import TicketItem from "../components/TicketItem";

const Tickets = () => {
  const [sortOrder, setSortOrder] = useState("desc");
  const { tickets } = useSelector((state) => state.tickets);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTickets());
  }, [dispatch]);

  const toggleSortOrder = () =>
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");

  if (!tickets) {
    return <Spinner />;
  }

  return (
    <>
      <BackButton url="/" />
      <h1>Tickets</h1>
      <div className="tickets">
        <div className="ticket-headings">
          <div>Date</div>
          <div>Product</div>
          <div>Status</div>
          <div className="btn btn-ticket-order" onClick={toggleSortOrder}>
            Show {sortOrder === "asc" ? "newest" : "oldest"} first
          </div>
        </div>
        {tickets && tickets.length > 0 ? (
          [...tickets]
            .sort((a, b) =>
              sortOrder === "desc"
                ? new Date(b.createdAt) - new Date(a.createdAt)
                : new Date(a.createdAt) - new Date(b.createdAt)
            )
            .map((ticket) => <TicketItem key={ticket._id} ticket={ticket} />)
        ) : (
          <p>No tickets to show</p>
        )}
      </div>
    </>
  );
};

export default Tickets;
