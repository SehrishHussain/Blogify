import usersSeed from "../mockData/users.json";
import bcrypt from "bcryptjs";

const USER_KEY = "mock_user_v1";
const USERS_DB_KEY = "mock_users_v1"; // <-- local DB of users
const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

function _mapUser(u) {
  if (!u) return null;
  return {
    $id: u.id,
    name: u.name,
    email: u.email,
    role: u.role || "reader",
    $createdAt: u.createdAt || new Date().toISOString(),
    $updatedAt: u.updatedAt || u.createdAt || new Date().toISOString()
  };
}

// --- Helpers to manage "local DB" ---
function _loadUsers() {
  const raw = localStorage.getItem(USERS_DB_KEY);
  if (raw) return JSON.parse(raw);
  // initialize from seed
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersSeed));
  return [...usersSeed];
}

function _saveUsers(list) {
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(list));
}

async function createAccount({ name, email, password }) {
  await delay();
  const users = _loadUsers();

  // Check if user already exists
  let existing = users.find(u => u.email === email);
  if (existing) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Fake new user object
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password: hashedPassword, 
    role: "reader",
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  _saveUsers(users);

  // Simulate login after signup
  const token = "mock-token-" + btoa(newUser.id + ":" + Date.now());
  const mappedUser = _mapUser(newUser);
  const payload = { user: mappedUser, token };

  localStorage.setItem(USER_KEY, JSON.stringify(payload));
  return payload;
}

async function login(email, password) {
  await delay();
  const users = _loadUsers();

 const user = users.find(u => u.email === email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = "mock-token-" + btoa(user.id + ":" + Date.now());
  const mappedUser = _mapUser(user);

  const payload = { user: mappedUser, token };
  localStorage.setItem(USER_KEY, JSON.stringify(payload));
  return payload;
}

async function logout() {
  localStorage.removeItem(USER_KEY);
  return true;
}

async function getCurrentUser() {
  await delay();
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return {
      user: _mapUser(parsed.user),
      token: parsed.token
    };
  } catch (e) {
    console.error("Mock auth parse error", e);
    return null;
  }
}

export default {
  login,
  logout,
  getCurrentUser,
  createAccount
};
