import { User, Message } from '../models/types';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const getUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_BASE_URL}/users`);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
};

export const getMessages = async (): Promise<Message[]> => {
  const response = await fetch(`${API_BASE_URL}/messages`);
  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }
  return response.json();
};

export const createUser = async (name: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
    });
    if (!response.ok) {
        throw new Error('Failed to create user');
    }
    return response.json();
};


export const createMessage = async (user_id: string, text: string): Promise<Message> => {
  const response = await fetch(`${API_BASE_URL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id, text }),
  });
  if (!response.ok) {
    throw new Error('Failed to create message');
  }
  return response.json();
};
