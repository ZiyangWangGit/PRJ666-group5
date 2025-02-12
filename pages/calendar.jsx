import { useState } from "react";
import { useUser } from "@/context/UserContext";
import Layout from "@/components/layout";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import PageHeader from "@/components/PageHeader";

const courseColors = {
  Math: "#e2a762", // Yellow
  Science: "#3498db", // Blue
  History: "#d33682", // Red
  General: "#95a5a6", // Gray
  Gym: "#6cba1b", // Green
};

const getEventColor = (course) => {
  return courseColors[course] || "#8e44ad"; // Default to purple if the course isn't listed
};

const sampleEvents = [
  {
    id: 1,
    title: "Math Assignment Due",
    date: "2025-02-01",
    description: "Complete the math assignment.",
    course: "Math",
  },
  {
    id: 2,
    title: "Science Project Presentation",
    date: "2025-02-24",
    description: "Present your science project.",
    course: "Science",
  },
  {
    id: 3,
    title: "History Exam",
    date: "2025-02-09",
    description: "History exam covering chapters 1-5.",
    course: "History",
  },
  {
    id: 4,
    title: "Parent-Teacher Meeting",
    date: "2025-02-10",
    description: "Meeting with parents and teachers.",
    course: "General",
  },
  {
    id: 5,
    title: "School Sports Day",
    date: "2025-02-20",
    description: "Annual school sports day event.",
    course: "Gym",
  },
].map((event) => ({
  ...event,
  backgroundColor: getEventColor(event.course),
  borderColor: getEventColor(event.course),
}));

export default function CalendarPage() {
  const { user } = useUser();
  const [events, setEvents] = useState(sampleEvents);
  const [selectedEvent, setSelectedEvent] = useState(null); // Stores event details
  const [modalOpen, setModalOpen] = useState(false);
  const [addEventModalOpen, setAddEventModalOpen] = useState(false);
  const [editEventModalOpen, setEditEventModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    description: "",
    course: "General",
  });
  const [editEvent, setEditEvent] = useState({
    id: "",
    title: "",
    date: "",
    description: "",
    course: "General",
  });

  // Open the modal when an event is clicked
  const handleEventClick = (info) => {
    setSelectedEvent({
      id: info.event.id,
      title: info.event.title,
      description: info.event.extendedProps.description,
      date: info.event.start.toDateString(),
    });
    setModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  // Open the add event modal
  const openAddEventModal = () => {
    setAddEventModalOpen(true);
  };

  // Close the add event modal
  const closeAddEventModal = () => {
    setAddEventModalOpen(false);
    setNewEvent({ title: "", date: "", description: "", course: "General" });
  };

  // Open the edit event modal
  const openEditEventModal = () => {
    setEditEvent({
      id: selectedEvent.id,
      title: selectedEvent.title,
      date: selectedEvent.date,
      description: selectedEvent.description,
      course: selectedEvent.course,
    });
    setEditEventModalOpen(true);
    setModalOpen(false);
  };

  // Close the edit event modal
  const closeEditEventModal = () => {
    setEditEventModalOpen(false);
    setEditEvent({
      id: "",
      title: "",
      date: "",
      description: "",
      course: "General",
    });
  };

  // Add a new event
  const handleAddEvent = () => {
    const newEventWithId = {
      ...newEvent,
      id: events.length + 1,
      backgroundColor: getEventColor(newEvent.course),
      borderColor: getEventColor(newEvent.course),
    };
    setEvents([...events, newEventWithId]);
    closeAddEventModal();
  };

  // Update an event
  const handleUpdateEvent = () => {
    setEvents(
      events.map((event) =>
        event.id === editEvent.id
          ? {
              ...editEvent,
              backgroundColor: getEventColor(editEvent.course),
              borderColor: getEventColor(editEvent.course),
            }
          : event
      )
    );
    closeEditEventModal();
  };

  // Remove an event
  const handleRemoveEvent = () => {
    if (window.confirm("Are you sure you want to remove this event?")) {
      setEvents(events.filter((event) => event.id !== selectedEvent.id));
      closeModal();
    }
  };

  return (
    <>
      <PageHeader text="Calendar" />

      {/* FullCalendar Component */}
      {user?.title === "professor" ? (
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          customButtons={{
            addEventButton: {
              text: "Add Event",
              click: openAddEventModal,
            },
          }}
          headerToolbar={{
            left: "addEventButton",
            center: "title",
            right: "prev,next today",
          }}
          nowIndicator={true}
          editable={true}
          selectable={true}
          events={events} // Uses the state to store events
          eventClick={handleEventClick} // Handles event click interactions
        />
      ) : (
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "",
            center: "title",
            right: "prev,next today",
          }}
          nowIndicator={true}
          editable={true}
          selectable={true}
          events={events} // Uses the state to store events
          eventClick={handleEventClick} // Handles event click interactions
        />
      )}
      {/* Modal for displaying event details */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="main-card modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{selectedEvent?.title}</h2>
            <p>
              <strong>Date: </strong>
              {selectedEvent ? selectedEvent.date : ""}
            </p>
            <p>
              <strong>Details: </strong>
              {selectedEvent?.description || "No additional details."}
            </p>
            <button className="custom-button" onClick={closeModal}>
              Close
            </button>
            {user?.title === "professor" && (
              <>
                <button
                  className="btn btn-secondary mt-2"
                  onClick={openEditEventModal}
                >
                  Edit Event
                </button>
                <button
                  className="btn btn-danger mt-2"
                  onClick={handleRemoveEvent}
                >
                  Remove Event
                </button>
              </>
            )}
          </div>
        </div>
      )}
      {/* Modal for adding a new event */}
      {addEventModalOpen && (
        <div className="modal-overlay" onClick={closeAddEventModal}>
          <div
            className="main-card modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="cancel-text" onClick={closeAddEventModal}>
              Cancel
            </span>
            <h2>Add New Event</h2>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Event Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Event Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={newEvent.date}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, date: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Event Description</label>
              <textarea
                className="form-control"
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Course</label>
              <select
                className="form-control"
                value={newEvent.course}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, course: e.target.value })
                }
              >
                <option value="Math">Math</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="General">General</option>
                <option value="Gym">Gym</option>
              </select>
            </div>
            <button className="custom-button" onClick={handleAddEvent}>
              Add Event
            </button>
          </div>
        </div>
      )}

      {/* Modal for editing an event */}
      {editEventModalOpen && (
        <div className="modal-overlay" onClick={closeEditEventModal}>
          <div
            className="main-card modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="cancel-text" onClick={closeEditEventModal}>
              Cancel
            </span>
            <h2>Edit Event</h2>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Event Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={editEvent.title}
                  onChange={(e) =>
                    setEditEvent({ ...editEvent, title: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Event Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={editEvent.date}
                  onChange={(e) =>
                    setEditEvent({ ...editEvent, date: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Event Description</label>
              <textarea
                className="form-control"
                value={editEvent.description}
                onChange={(e) =>
                  setEditEvent({ ...editEvent, description: e.target.value })
                }
              />
            </div>
            <div className="form-group mb-3">
              <label className="form-label">Course</label>
              <select
                className="form-control"
                value={editEvent.course}
                onChange={(e) =>
                  setEditEvent({ ...editEvent, course: e.target.value })
                }
              >
                <option value="Math">Math</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="General">General</option>
                <option value="Gym">Gym</option>
              </select>
            </div>
            <button className="btn custom-button" onClick={handleUpdateEvent}>
              Update Event
            </button>
          </div>
        </div>
      )}
    </>
  );
}
