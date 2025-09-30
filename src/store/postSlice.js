import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import blogService from "../services/mock/mockBlogService"; // your API / mock

// 1️⃣ Entity adapter for posts
const postsAdapter = createEntityAdapter({
  selectId: (post) => post.id,   // use "id" or "$id" depending on your mock
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt), // newest first
});

// 2️⃣ Initial state with adapter + extras
const initialState = postsAdapter.getInitialState({
  status: "idle",   // idle | loading | succeeded | failed
  error: null,
});

// 3️⃣ Thunks
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const res = await blogService.getPosts(); 
  return res; // should return an array of posts
});

export const addPost = createAsyncThunk("posts/addPost", async (newPost) => {
  const res = await blogService.createPost(newPost);
  console.log("PostSlice- createPost");
  
  return res; // should return the created post
});

export const updatePost = createAsyncThunk("posts/updatePost", async (post) => {
  const res = await blogService.updatePost(post.id, post);
  console.log("value of post.id in postSlice", post.id);
  
  return res; // should return the updated post
});

export const deletePost = createAsyncThunk("posts/deletePost", async (postId) => {
  await blogService.deletePost(postId);
  return postId; // return id so we can remove it
});

// 4️⃣ Slice
const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        postsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // add
      .addCase(addPost.fulfilled, (state, action) => {
        postsAdapter.addOne(state, action.payload);
      })

      // update
      .addCase(updatePost.fulfilled, (state, action) => {
        postsAdapter.upsertOne(state, action.payload);
      })

      // delete
      .addCase(deletePost.fulfilled, (state, action) => {
        postsAdapter.removeOne(state, action.payload);
      });
  },
});

export default postsSlice.reducer;

// 5️⃣ Export selectors (super handy)
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors((state) => state.posts);
