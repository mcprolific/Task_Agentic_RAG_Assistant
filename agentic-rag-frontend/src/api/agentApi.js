import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

export const queryAgent = async (query, session_id = "default_session") => {
  const response = await axios.post(`${API_BASE}/query`, { query, session_id });
  return response.data;
};
