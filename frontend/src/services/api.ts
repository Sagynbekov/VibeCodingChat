import { User, Message } from '../models/types';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const getUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_BASE_URL}/api/users`);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
};

export const getMessages = async (): Promise<Message[]> => {
  const response = await fetch(`${API_BASE_URL}/api/messages`);
  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }
  return response.json();
};

export const createUser = async (nickname: string, password: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname, password }),
    });
    if (!response.ok) {
        // Возвращаем сам ответ, чтобы обработать статус в компоненте
        throw response;
    }
    return response.json();
};

export const loginUser = async (nickname: string, password: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname, password }),
    });
    if (!response.ok) {
        // Возвращаем сам ответ, чтобы обработать статус в компоненте
        throw response;
    }
    return response.json();
};

export const createMessage = async (user_id: string, text: string): Promise<Message> => {
  const response = await fetch(`${API_BASE_URL}/api/messages`, {
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
