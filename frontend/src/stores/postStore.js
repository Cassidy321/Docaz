import { create } from "zustand";
import api from "@/services/api";

const postStore = create((set, get) => ({
  posts: [],
  currentPost: null,
  loading: false,
  error: null,

  getPosts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/api/posts");
      set({
        posts: response.data.posts,
        loading: false,
      });
      return response.data.posts;
    } catch (error) {
      set({
        loading: false,
        error:
          error.response?.data?.message || "Impossible de charger les annonces",
      });
      throw error;
    }
  },

  getPostById: async (postId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/api/posts/${postId}`);
      set({
        currentPost: response.data.post,
        loading: false,
      });
      return response.data.post;
    } catch (error) {
      set({
        loading: false,
        error:
          error.response?.data?.message || "Impossible de charger l'annonce",
      });
      throw error;
    }
  },

  getUserPosts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/api/posts/user");
      set({
        posts: response.data.posts,
        loading: false,
      });
      return response.data.posts;
    } catch (error) {
      set({
        loading: false,
        error:
          error.response?.data?.message || "Impossible de charger vos annonces",
      });
      throw error;
    }
  },

  createPost: async (postData, images) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(postData));

      if (images && images.length > 0) {
        images.forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });
      }

      const response = await api.post("/api/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set((state) => ({
        posts: [response.data.post, ...state.posts],
        loading: false,
      }));

      return response.data.post;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Impossible de créer l'annonce",
      });
      throw error;
    }
  },

  updatePost: async (postId, postData, images) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(postData));

      if (images && images.length > 0) {
        images.forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });
      }

      const response = await api.put(`/api/posts/${postId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId ? response.data.post : post
        ),
        currentPost: response.data.post,
        loading: false,
      }));

      return response.data.post;
    } catch (error) {
      set({
        loading: false,
        error:
          error.response?.data?.message ||
          "Impossible de mettre à jour l'annonce",
      });
      throw error;
    }
  },

  deletePost: async (postId) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/api/posts/${postId}`);

      set((state) => ({
        posts: state.posts.filter((post) => post.id !== postId),
        loading: false,
      }));

      return true;
    } catch (error) {
      set({
        loading: false,
        error:
          error.response?.data?.message || "Impossible de supprimer l'annonce",
      });
      throw error;
    }
  },

  toggleFavorite: async (postId) => {
    try {
      const state = get();
      const post =
        state.posts.find((p) => p.id === postId) || state.currentPost;

      if (!post) return;

      const isFavorite = post.isFavorite;

      const updateFavoriteState = (posts, currentPost) => ({
        posts: posts.map((p) =>
          p.id === postId ? { ...p, isFavorite: !isFavorite } : p
        ),
        currentPost:
          currentPost?.id === postId
            ? { ...currentPost, isFavorite: !isFavorite }
            : currentPost,
      });

      set((state) => updateFavoriteState(state.posts, state.currentPost));

      if (isFavorite) {
        await api.delete(`/api/posts/${postId}/favorite`);
      } else {
        await api.post(`/api/posts/${postId}/favorite`);
      }
    } catch (error) {
      set((state) => {
        const post =
          state.posts.find((p) => p.id === postId) || state.currentPost;
        const originalState = post?.isFavorite || false;

        return {
          posts: state.posts.map((p) =>
            p.id === postId ? { ...p, isFavorite: originalState } : p
          ),
          currentPost:
            state.currentPost?.id === postId
              ? { ...state.currentPost, isFavorite: originalState }
              : state.currentPost,
        };
      });

      console.error("erreur lors de la mise à jour du favori : ", error);
      throw error;
    }
  },

  clearErrors: () => set({ error: null }),

  resetCurrentPost: () => set({ currentPost: null }),
}));

export default postStore;
