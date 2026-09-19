import { api } from "../api";

function isSameDay(dateA, dateB) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

// Backend document -> frontend med shape (matches what Medications.jsx expects)
function toFrontend(doc) {
  const taken = doc.lastTakenDate
    ? isSameDay(new Date(doc.lastTakenDate), new Date())
    : false;
  return {
    id: doc._id,
    name: doc.name,
    dose: doc.dosage || "",
    times: doc.times || [],
    specificTime: doc.specificTime || "",
    mealInstruction: doc.mealInstruction || "After food",
    frequency: doc.frequency || "Daily",
    purpose: doc.purpose || "",
    refillDays: doc.refillDays ?? 30,
    taken,
  };
}

// Frontend newMed state -> backend payload
function toBackend(med) {
  return {
    name: med.name,
    dosage: med.dose,
    times: med.times,
    specificTime: med.specificTime || undefined,
    mealInstruction: med.mealInstruction || undefined,
    frequency: med.frequency || undefined,
    purpose: med.purpose || undefined,
  };
}

export const medicationService = {
  async getAll() {
    const res = await api.get("/medications?limit=200");
    return res.data.map(toFrontend);
  },

  async create(med) {
    const res = await api.post("/medications", toBackend(med));
    return toFrontend(res.data);
  },

  async setTaken(id, taken) {
    const res = await api.put(`/medications/${id}`, {
      lastTakenDate: taken ? new Date().toISOString() : null,
    });
    return toFrontend(res.data);
  },

  async remove(id) {
    await api.delete(`/medications/${id}`);
  },
};
