import { User } from '../types';

const USERS_KEY = 'nst_users';

// Initialize DB with some dummy data if empty
const initDB = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    const initialUsers: User[] = [
      { id: '1', name: 'Rahul Kumar', email: 'rahul@example.com', role: 'STUDENT', credits: 50, class: 'Class 10', stream: 'Science', board: 'CBSE' },
      { id: '2', name: 'Priya Sharma', email: 'priya@example.com', role: 'STUDENT', credits: 100, class: 'Class 12', stream: 'Science', board: 'CBSE' }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
  }
};

export const getAllUsers = (): User[] => {
  initDB();
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const addUser = (user: User): void => {
  const users = getAllUsers();
  // Check if email exists
  if (users.some(u => u.email === user.email)) {
    throw new Error('User already exists!');
  }
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const deleteUser = (userId: string): void => {
  let users = getAllUsers();
  users = users.filter(u => u.id !== userId);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const findUser = (email: string): User | undefined => {
  const users = getAllUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};
