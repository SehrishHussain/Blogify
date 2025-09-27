// scripts/hashUsers.js
import fs from "fs";
import bcrypt from "bcrypt";

// Path to your mock users JSON
const filePath = "./src/services/mockData/users.json";

// Read the file
const users = JSON.parse(fs.readFileSync(filePath, "utf-8"));

// Hash all plain-text passwords
const saltRounds = 10;
const hashedUsers = users.map(user => {
  // Skip if already hashed (bcrypt hashes always start with "$2b$")
  if (user.password && user.password.startsWith("$2b$")) {
    return user;
  }

  return {
    ...user,
    password: bcrypt.hashSync(user.password, saltRounds),
  };
});

// Write back to JSON
fs.writeFileSync(filePath, JSON.stringify(hashedUsers, null, 2));

console.log("✅ Users passwords hashed successfully!");
