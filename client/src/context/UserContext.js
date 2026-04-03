import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    role: "patient",
    dob: "",
    // Profile setup fields
    gender: "",
    phone: "",
    address: "",
    ckdStage: "",
    dialysis: "",
    dialysisType: "",
    allergies: "",
    doctorName: "",
    hospital: "",
    doctorPhone: "",
    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",
  });

  const updateUser = (data) => setUser((prev) => ({ ...prev, ...data }));

  const getAge = () => {
    if (!user.dob) return null;
    const today = new Date();
    const birth = new Date(user.dob);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const isKid = () => {
    const age = getAge();
    return age !== null && age < 18;
  };

  return (
    <UserContext.Provider value={{ user, updateUser, getAge, isKid }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
