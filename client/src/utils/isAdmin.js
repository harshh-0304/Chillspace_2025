// src/utils/isAdmin.js
export function isAdmin() {
    return localStorage.getItem("role") === "admin";
  }
  