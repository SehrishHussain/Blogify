import conf from "../../confg/confg";
import client from "./client";
import { Account, Databases, ID, Permission, Role, Query } from "appwrite";

export class AuthService {
  account;
  databases;

  constructor() {
    this.account = new Account(client);
    this.databases = new Databases(client);
  }

  // Create user + auto login
  async createAccount({ email, password, name, role = "reader" }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );

      if (!userAccount) return null;

      // Auto login
      await this.login({ email, password });

      // Set initial role (default: reader)
      await this.account.updatePrefs({ role });

      // ✅ Ensure profile exists
      await this.ensureProfile(userAccount.$id, name);

      return await this.getCurrentUser();
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }
  }

  // Email + Password login
  async login({ email, password }) {
    return await this.account.createEmailPasswordSession(email, password);
  }

  // Google OAuth login
  async loginWithGoogle() {
    return this.account.createOAuth2Session(
      "google",
      "http://localhost:5173/oauth-callback",
      "http://localhost:5173/login"
    );
  }

  // Ensure every user always has a role
  async ensureRole(defaultRole = "reader") {
    try {
      const user = await this.account.get();

      if (!user.prefs?.role) {
        await this.account.updatePrefs({ role: defaultRole });
        user.prefs = { ...user.prefs, role: defaultRole };
      }

      // ✅ Ensure profile exists
      await this.ensureProfile(user.$id, user.name);

      return {
        ...user,
        role: user.prefs.role,
      };
    } catch (error) {
      console.error("Error ensuring role:", error);
      throw error;
    }
  }

  // ✅ Ensure profile exists for a user
  async ensureProfile(userId, displayName = "") {
    try {
      const profiles = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        
        [Query.equal("userId", userId)]
      );

      if (profiles.documents.length === 0) {
        await this.databases.createDocument(
          conf.appwriteDatabaseId,
         
          ID.unique(),
          {
            userId,
            displayName,
            bio: "",
            avatarId: null,
            createdAt: new Date().toISOString(),
          },
          [
            Permission.read(Role.any()), // anyone can view
            Permission.update(Role.user(userId)), // only owner can update
            Permission.delete(Role.user(userId)), // only owner can delete
          ]
        );
      }
    } catch (error) {
      console.error("Error ensuring profile:", error);
    }
  }

  // Get current user (always fresh prefs + profile)
  async getCurrentUser() {
    try {
      const user = await this.account.get();

      if (!user.prefs) {
        user.prefs = {};
      }

      const role = user.prefs.role || "reader";

      // ✅ Fetch profile
      const profiles = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        
        [Query.equal("userId", user.$id)]
      );

      const profile = profiles.documents[0] || null;

      return {
        ...user,
        role,
        profile, // attach profile doc
      };
    } catch (error) {
      console.log("appwrite service: current user : ", error);
      return null;
    }
  }

  async logout() {
    await this.account.deleteSessions();
  }
}

const authService = new AuthService();
export  default authService ;
