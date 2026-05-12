import { User, Message, Group } from '../models/types';

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

export const createMessage = async (sender_id: string, receiver_id: string, content: string): Promise<Message> => {
  const response = await fetch(`${API_BASE_URL}/api/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sender_id, receiver_id, content }),
  });
  if (!response.ok) {
    throw new Error('Failed to create message');
  }
  return response.json();
};

export const createGroup = async (name: string, members: string[]): Promise<Group> => {
  const response = await fetch(`${API_BASE_URL}/api/groups`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, members }),
  });
  if (!response.ok) {
    throw new Error('Failed to create group');
  }
  return response.json();
};

export const getGroups = async (): Promise<Group[]> => {
  const response = await fetch(`${API_BASE_URL}/api/groups`);
  if (!response.ok) {
    throw new Error('Failed to fetch groups');
  }
  return response.json();
};
