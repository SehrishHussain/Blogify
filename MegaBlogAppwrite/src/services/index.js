import realAuth from "./real/authService";
import realPosts from "./real/blogService";
import mockAuth from "./mock/mockAuthService";
import mockPosts from "./mock/mockBlogService";

const useMock = import.meta.env.VITE_USE_MOCK === "true"; 
// 👆 make sure this matches your .env

export const authService = useMock ? mockAuth : realAuth;
export const blogService = useMock ? mockPosts : realPosts;

const services = {
   authService,
  blogService
};

export default services;
