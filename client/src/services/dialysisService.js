// client/src/services/dialysisService.js
import { api } from "../api";

// Converts the page's local session shape into what the backend expects
function toBackend(session) {
  const isUpcoming = session.date ? new Date(session.date) > new Date() : false;
  return {
    type: session.type,
    date: session.date,
    dialysisMode: session.dialysisMode,
    durationMinutes: session.duration ? Number(session.duration) : undefined,
    location: session.center || undefined,
    doctor: session.doctor || undefined,
    bloodFlowRate: session.bloodFlow ? Number(session.bloodFlow) : undefined,
    exchanges: session.exchanges ? Number(session.exchanges) : undefined,
    dwellTimeHours: session.dwellTime ? Number(session.dwellTime) : undefined,
    fluidInMl: session.fluidIn ? Number(session.fluidIn) : undefined,
    fluidOutMl: session.fluidOut ? Number(session.fluidOut) : undefined,
    preWeightKg: session.weight_pre ? Number(session.weight_pre) : undefined,
    postWeightKg: session.weight_post ? Number(session.weight_post) : undefined,
    notes: session.notes || undefined,
    status: isUpcoming ? "Upcoming" : "Completed",
  };
}

// Converts a backend document back into the shape the page's JSX expects
function fromBackend(doc) {
  return {
    id: doc._id,
    _id: doc._id,
    date: doc.date ? doc.date.substring(0, 10) : "",
    type: doc.type,
    dialysisMode: doc.dialysisMode,
    duration: doc.durationMinutes,
    center: doc.location,
    doctor: doc.doctor,
    bloodFlow: doc.bloodFlowRate,
    exchanges: doc.exchanges,
    dwellTime: doc.dwellTimeHours,
    fluidIn: doc.fluidInMl,
    fluidOut: doc.fluidOutMl,
    weight_pre: doc.preWeightKg,
    weight_post: doc.postWeightKg,
    notes: doc.notes,
    status: doc.status,
  };
}

export const dialysisService = {
  async getAll() {
    const res = await api.get("/dialysis-sessions?limit=200");
    return res.data.map(fromBackend);
  },

  async create(session) {
    const res = await api.post("/dialysis-sessions", toBackend(session));
    return fromBackend(res.data);
  },

  async remove(id) {
    await api.delete(`/dialysis-sessions/${id}`);
  },
};
