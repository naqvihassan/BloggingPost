import { createContext, useContext, useEffect, useState } from "react";

const PostsContext = createContext();

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts");
      const data = await res.json();
      setPosts(data.slice(0, 10)); 
      setLoading(false);
    }
    fetchPosts();
  }, []);


  const addPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };


  const updatePost = (id, updatedData) => {
    setPosts(posts.map(p => (p.id === id ? { ...p, ...updatedData } : p)));
  };


  const deletePost = (id) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  return (
    <PostsContext.Provider value={{ posts, loading, addPost, updatePost, deletePost }}>
      {children}
    </PostsContext.Provider>
  );
}

export const usePosts = () => useContext(PostsContext);