export interface User {
  id: string;
  name: string;
}

export interface Message {
  id: string;
  user_id: string;
  text: string;
  timestamp: string; // ISO 8601 date string
}
