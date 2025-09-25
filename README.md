# Blogify  

Blogify is a modern blogging application that provides a seamless writing and reading experience. It is built with React on the frontend, Appwrite for backend services (mocked here due to quota limits), and Redux for state management.  

This repository contains the **mock-data version** of Blogify, where posts and users are stored locally.  
 A fully Appwrite-integrated version is available here: [https://github.com/SehrishHussain/react/tree/master/MegaBlogAppwrite]  

---

##  Tech Stack  

- **Frontend**: React, JavaScript, TailwindCSS  
- **State Management**: Redux  
- **Authentication**: Google OAuth, Email/Password  
- **Backend**: Appwrite (mocked in this repository)  

---

##  Features  

- **Authentication & State Management**  
  - Google OAuth  
  - Email/Password authentication  
  - Auth state managed with Redux  

- **Blog Management (CRUD)**  
  - Create new blogs  
  - View blogs with view counts  
  - Update existing blogs  
  - Delete blogs  

- **Editor Workflow**  
  - Draft, save, and publish posts  
  - Instant updates without refresh delays  

---

## Repository Status  

- This repository demonstrates Blogify with **mock posts and users** (no live backend).  
- The same features have been implemented with Appwrite backend services in a separate repository.  

---

##  Getting Started  

### Prerequisites  
- Node.js (>= 16)  
- npm or yarn  

### Installation  
1. Clone the repository:  
   ```bash
   git clone https://github.com/SehrishHussain/Blogify.git
   cd Blogify
   ```
2. Install dependencies: 
`npm install
`
3. Start the development server:
    ``` 
    npm start
    npm run dev:mock // to run the app on mock data ```

### This project is work in progress! I will be adding more features and regularly updating. 