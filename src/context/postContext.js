import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const PostsContext = createContext();

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    async function fetchPosts() {
      try {
        setLoading(true);
        setError(null);
        
        const local = typeof window !== "undefined" ? localStorage.getItem("user_posts") : null;
        const localPosts = local ? JSON.parse(local) : [];
        
        const response = await axios.get("https://jsonplaceholder.typicode.com/posts", { timeout: 8000 });
        const remotePosts = Array.isArray(response.data) ? response.data : [];

        if (!isCancelled) {
          setPosts([...localPosts, ...remotePosts]);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to fetch posts. Please try again later.");
        
        const local = typeof window !== "undefined" ? localStorage.getItem("user_posts") : null;
        const localPosts = local ? JSON.parse(local) : [];
        if (!isCancelled) {
          setPosts(localPosts);
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }
    
    fetchPosts();
    return () => {
      isCancelled = true;
    };
  }, []);

  const saveUserPostsToStorage = (currentPosts) => {
    if (typeof window === "undefined") return;
    const userPosts = currentPosts.filter(p => !!p.userEmail);
    localStorage.setItem("user_posts", JSON.stringify(userPosts));
  };

  const addPost = async (newPost) => {
    try {
      const tempPost = { ...newPost, id: newPost?.id ?? Date.now() };
      const updatedPosts = [tempPost, ...posts];
      setPosts(updatedPosts);
      
      saveUserPostsToStorage(updatedPosts);
      
    } catch (err) {
      console.error("Error adding post:", err);
      setError("Failed to add post. Please try again.");
    }
  };

  const updatePost = async (id, updatedData) => {
    try {
      const updatedPosts = posts.map(p => (p.id === id ? { ...p, ...updatedData } : p));
      setPosts(updatedPosts);
      
      saveUserPostsToStorage(updatedPosts);
      
    } catch (err) {
      console.error("Error updating post:", err);
      setError("Failed to update post. Please try again.");
    }
  };

  const deletePost = async (id) => {
    try {
      const updatedPosts = posts.filter(p => p.id !== id);
      setPosts(updatedPosts);
      
      saveUserPostsToStorage(updatedPosts);
      
    } catch (err) {
      console.error("Error deleting post:", err);
      setError("Failed to delete post. Please try again.");
    }
  };

  const refetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const local = typeof window !== "undefined" ? localStorage.getItem("user_posts") : null;
      const localPosts = local ? JSON.parse(local) : [];
      
      const response = await axios.get("https://jsonplaceholder.typicode.com/posts", { timeout: 8000 });
      const remotePosts = Array.isArray(response.data) ? response.data : [];
      
      setPosts([...localPosts, ...remotePosts]);
    } catch (err) {
      console.error("Error refetching posts:", err);
      setError("Failed to fetch posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PostsContext.Provider value={{ 
      posts, 
      loading, 
      error,
      addPost, 
      updatePost, 
      deletePost,
      refetchPosts
    }}>
      {children}
    </PostsContext.Provider>
  );
}

export const usePosts = () => useContext(PostsContext);