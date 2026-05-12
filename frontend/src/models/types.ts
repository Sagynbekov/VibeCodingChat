export interface User {
  id: string;
  nickname: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp: string; // ISO 8601 date string
}
