import { api } from "../api";

// Backend document -> frontend food log shape (matches what Diet.jsx expects)
function toFrontend(doc) {
  return {
    id: doc._id,
    meal: doc.mealType,
    food: doc.foodItem,
    calories: doc.calories ?? 0,
    potassium: doc.potassiumMg ?? 0,
    phosphorus: doc.phosphorusMg ?? 0,
    sodium: doc.sodiumMg ?? 0,
    time: doc.time || "",
  };
}

// Frontend newFood state -> backend payload
function toBackend(food) {
  const now = new Date();
  return {
    date: now.toISOString(),
    mealType: food.meal,
    foodItem: food.food,
    time: food.time || undefined,
    calories: food.calories ? parseInt(food.calories, 10) : 0,
    potassiumMg: food.potassium ? parseInt(food.potassium, 10) : 0,
    phosphorusMg: food.phosphorus ? parseInt(food.phosphorus, 10) : 0,
    sodiumMg: food.sodium ? parseInt(food.sodium, 10) : 0,
  };
}

// Returns just today's entries — Diet.jsx only shows the current day's food log
function isToday(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export const dietService = {
  async getTodayLog() {
    const res = await api.get("/diet-logs?limit=200");
    return res.data.filter((doc) => isToday(doc.date)).map(toFrontend);
  },

  async create(food) {
    const res = await api.post("/diet-logs", toBackend(food));
    return toFrontend(res.data);
  },

  async remove(id) {
    await api.delete(`/diet-logs/${id}`);
  },
};
