import { api } from "../api";

// Backend document -> frontend appointment shape (matches what Appointments.jsx expects)
function toFrontend(doc) {
  const dt = new Date(doc.dateTime);
  const date = dt.toISOString().slice(0, 10); // YYYY-MM-DD
  const time = dt.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return {
    id: doc._id,
    doctor: doc.doctorName || "",
    specialty: doc.specialty || "",
    hospital: doc.location || "",
    date,
    time,
    type: doc.visitType || "Other",
    phone: doc.phone || "",
    notes: doc.notes || "",
    status: doc.status === "completed" ? "Completed" : "Upcoming",
  };
}

// Frontend newAppt state -> backend payload
function toBackend(appt) {
  const dateTime = new Date(`${appt.date}T${appt.time}`);
  return {
    title: `${appt.type} with ${appt.doctor}`,
    doctorName: appt.doctor,
    specialty: appt.specialty || undefined,
    location: appt.hospital || undefined,
    phone: appt.phone || undefined,
    visitType: appt.type || undefined,
    dateTime: dateTime.toISOString(),
    notes: appt.notes || undefined,
  };
}

export const appointmentService = {
  async getAll() {
    const res = await api.get("/appointments?limit=200");
    return res.data.map(toFrontend);
  },
  async create(appt) {
    const res = await api.post("/appointments", toBackend(appt));
    return toFrontend(res.data);
  },
  async markCompleted(id) {
    const res = await api.put(`/appointments/${id}`, { status: "completed" });
    return toFrontend(res.data);
  },
  async remove(id) {
    await api.delete(`/appointments/${id}`);
  },
};
