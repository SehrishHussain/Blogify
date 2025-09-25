// config.js - Appwrite service wrapper
import conf from "../../confg/confg";
import { setUser } from "../../store/authSlice";
import client from "./client";
import authService from "./authService"; // ✅ import your AuthService
import { ID, Databases, Storage, Query, Permission, Role } from "appwrite";

export class Service {
  databases;
  bucket;

  constructor() {
    this.databases = new Databases(client);
    this.bucket = new Storage(client);
  }

  
// ✅ Create Post
async createPost({ title, slug, content, featuredImage, status }, dispatch) {
    try {
      // 1. Get the logged-in user
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) throw new Error("User not logged in");

      const userId = currentUser.$id;
      const role = currentUser.role; // comes from prefs (see auth.js)

     if (role === "reader") {
      await authService.account.updatePrefs({ role: "author" });
      const updatedUser = await authService.getCurrentUser();

// ✅ update Redux immediately
      if (dispatch) {
        dispatch(setUser(updatedUser));
      }

      role = "author";
    }

      // 2. Define permissions
      let permissions = [
        Permission.read(Role.any()), // anyone can read
        Permission.update(Role.user(userId)), // only owner can update
        Permission.delete(Role.user(userId)), // only owner can delete
      ];

      if (role === "admin") {
        permissions = [
          Permission.read(Role.any()),
          Permission.update(Role.team("admins")), // must exist in Appwrite console
          Permission.delete(Role.team("admins")),
        ];
      }

      // 3. Create document
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        ID.unique(),
        {
          title,
          slug,
          content,
          featuredImage,
          status,
          userId, // store owner ID
          role
        },
        permissions
      );
    } catch (error) {
      console.log("createPost error:", error.message);
      throw error;
    }
  }


  // ✅ Update Post
  async updatePost(postId, { title, content, featuredImage, status }) {
  try {
    const currentUser = await authService.getCurrentUser();
    if (!currentUser) throw new Error("User not logged in");

    // Fetch the post by ID
    const post = await this.databases.getDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      postId
    );

    if (currentUser.role === "admin" || post.userId === currentUser.$id) {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        postId,
        { title, content, featuredImage, status }
      );
    } else {
      throw new Error("Permission denied");
    }
  } catch (error) {
    console.log("updatePost error:", error.message);
    throw error;
  }
}


  // ✅ Delete Post
  async deletePost(postId) {
  try {
    const currentUser = await authService.getCurrentUser();
    if (!currentUser) throw new Error("User not logged in");

    // ✅ Get the post document directly
    const post = await this.databases.getDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      postId
    );

    if (currentUser.role === "admin" || post.userId === currentUser.$id) {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        postId
      );
      return true;
    } else {
      throw new Error("Permission denied");
    }
  } catch (error) {
    console.error("deletePost error:", error.message);
    return false;
  }
}


  // ✅ Get Posts of a User
  // ✅ Get Posts of a User
async getUserPosts(userId) {
  try {
    if (!userId) {
      throw new Error("userId is required for getUserPosts");
    }

    return await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      [Query.equal("userId", [userId])] // must be an array
    );
  } catch (error) {
    console.log("getUserPosts error:", error.message);
    return false;
  }
}


  // ✅ Get Single Post by Slug
  async getPost(slug) {
    try {
      const posts = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        [Query.equal("slug", slug)]
      );

      return posts.documents.length ? posts.documents[0] : null;
    } catch (error) {
      console.log("error in getPost", error.message);
      return null;
    }
  }

  // ✅ Get All Posts
  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        queries
      );
    } catch (error) {
      console.log("all posts error:", error.message);
      return false;
    }
  }

  // ✅ File Upload
  async uploadFile(file) {
    try {
      return await this.bucket.createFile(conf.appwriteBucketId, ID.unique(), file);
    } catch (error) {
      console.log("upload file error:", error.message);
      return false;
    }
  }
   async incrementViews(postId, currentViews) {
    try {
      const response = await this.databases.updateDocument(
        conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
        postId,
        { views: currentViews + 1 }
      );
      return response;
    } catch (error) {
      console.error("Error incrementing views:", error);
      return null;
    }
  }


  // ✅ File Delete
  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.log("error in delete file", error.message);
      return false;
    }
  }

  // ✅ File Preview
  getFilePreview(fileId) {
    try {
      return this.bucket.getFilePreview(conf.appwriteBucketId, fileId).toString();
    } catch (error) {
      console.log("error in getFilePreview", error.message);
      return null;
    }
  }

  // ✅ File View
  getFileView(fileId) {
    try {
      return this.bucket.getFileView(conf.appwriteBucketId, fileId).toString();
    } catch (error) {
      console.log("error in getFileView", error.message);
      return null;
    }
  }
  
}

const blogService = new Service();
export default blogService ;
