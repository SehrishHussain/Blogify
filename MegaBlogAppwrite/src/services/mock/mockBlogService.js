import postsData from "../mockData/posts.json";

const STORAGE_KEY = "posts";
const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

/* -------------------- HELPERS -------------------- */
function _normalize(post) {
  return {
    id: post.id || post.$id,
    title: post.title,
    content: post.content,
    userId: post.userId || post.author || null,
    tags: post.tags || [],
    createdAt: post.createdAt || new Date().toISOString(),
    updatedAt: post.updatedAt || post.createdAt || new Date().toISOString(),
    slug: post.slug,
    redirects: post.redirects || [],
    featuredImage: post.featuredImage || "https://placekitten.com/800/400",
    views: post.views || 0,
  };
}

function _ensureInitialized() {
  if (localStorage.getItem(STORAGE_KEY)) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(postsData));
}

function _savePosts(posts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (e) {
    console.error("Failed to save posts to localStorage", e);
  }
}

function _loadPosts() {
  if (typeof window === "undefined") return []; // SSR guard
  _ensureInitialized();

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(_normalize) : [];
  } catch (e) {
    console.error("Failed to parse mock posts from localStorage", e);
    return [];
  }
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-");
}

/* -------------------- PUBLIC API -------------------- */

// Fetch list of posts
async function getPosts({ q, limit = 20, offset = 0 } = {}) {
  await delay();
  let posts = _loadPosts();

  if (q) {
    const lower = q.toLowerCase();
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(lower) ||
        p.content.toLowerCase().includes(lower)
    );
  }

  const total = posts.length;
  const documents = posts.slice(offset, offset + limit);
  return { total, documents };
}

// Fetch a single post (no increment here!)
async function getPost(slug) {
  await delay();
  const posts = _loadPosts();
  const idx = posts.findIndex(
    (p) => p.slug === slug || (p.redirects || []).includes(slug)
  );
  if (idx === -1) return null;

  // ✅ Increment views directly here
  posts[idx].views = (posts[idx].views || 0) + 1;
  _savePosts(posts);

  return { ...posts[idx] }; // return updated post
}





// Fetch posts by a user
async function getUserPosts(userId, { limit = 20, offset = 0 } = {}) {
  await delay();
  const posts = _loadPosts().filter((p) => p.userId === userId);

  const total = posts.length;
  const documents = posts.slice(offset, offset + limit);
  return { total, documents };
}

// Fetch post by id
async function getPostById(id) {
  await delay();
  const posts = _loadPosts();
  return posts.find((p) => p.id === id) || null;
}

// Create a post
async function createPost({ title, content, userId, featuredImage }) {
  await delay();
  const posts = _loadPosts();
  const id = String(Date.now());
  const now = new Date().toISOString();

  // Generate unique slug
  let baseSlug = slugify(title);
  let slug = baseSlug;
  let counter = 1;
  while (posts.some((p) => p.slug === slug)) {
    slug = `${baseSlug}-${counter++}`;
  }

  // Auto inject placeholder image if none provided
  const defaultImage = `https://picsum.photos/600/300?random=${Date.now()}`;
  console.log("✅ Saving post with userId:", userId);

  const newPost = _normalize({
    id,
    title,
    content,
    userId,
    createdAt: now,
    updatedAt: now,
    tags: [],
    slug,
    redirects: [],
    featuredImage: featuredImage || defaultImage,
  });

  posts.unshift(newPost);
  _savePosts(posts);
  return newPost;
}

// Update a post
async function updatePost(id, patch) {
  await delay();
  const posts = _loadPosts();
  const idx = posts.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Post not found");

  const now = new Date().toISOString();
  let updated = { ...posts[idx], ...patch, updatedAt: now };

  if (patch.title && patch.title !== posts[idx].title) {
    const baseSlug = slugify(patch.title);
    let slug = baseSlug;
    let counter = 1;
    while (posts.some((p) => p.slug === slug && p.id !== id)) {
      slug = `${baseSlug}-${counter++}`;
    }
    updated.redirects = [...(posts[idx].redirects || []), posts[idx].slug];
    updated.slug = slug;
  }

  if (!updated.featuredImage) {
    updated.featuredImage = "https://placehold.co/600x300?text=Updated+Post";
  }

  posts[idx] = _normalize(updated);
  _savePosts(posts);

  return posts[idx];
}

// Delete a post
async function deletePost(id) {
  await delay();
  const posts = _loadPosts();
  _savePosts(posts.filter((p) => p.id !== id));
  return { success: true };
}

// Reset mock data
async function resetDemoData() {
  localStorage.removeItem(STORAGE_KEY);
  _ensureInitialized();
  return true;
}

/* -------------------- EXPORT -------------------- */
export default {
  getPosts,
  getUserPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  resetDemoData,
  getPost,
 
};
