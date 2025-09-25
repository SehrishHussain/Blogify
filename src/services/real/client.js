// client.js (new file)
import { Client } from "appwrite";
import conf from "../../confg/confg";

const client = new Client()
  .setEndpoint(conf.appwriteUrl)
  .setProject(conf.appwriteProjectId);

export default client;
