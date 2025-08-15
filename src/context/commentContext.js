import { createContext, useContext, useEffect, useState } from "react";

const CommentsContext = createContext();

export function CommentsProvider({ children }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const local = localStorage.getItem("comments");
        if (local) {
            setComments(JSON.parse(local));
            setLoading(false);
        } else {
            async function fetchCommentsForPosts() {
                try {
                    const postsRes = await fetch("https://jsonplaceholder.typicode.com/posts");
                    const postsData = await postsRes.json();

                    const commentsPromises = postsData.map(post =>
                        fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}/comments`).then(res => res.json())
                    );
                    const commentsArrays = await Promise.all(commentsPromises);
                    const allComments = commentsArrays.flat();
                    setComments(allComments);
                } catch (err) {
                    setComments([]);
                } finally {
                    setLoading(false);
                }
            }
            fetchCommentsForPosts();
        }
    }, []);

    useEffect(() => {
        if (!loading) {
            localStorage.setItem("comments", JSON.stringify(comments));
        }
    }, [comments, loading]);

    const addComment = (postId, comment) => {
        setComments(prev => [{ ...comment, postId }, ...prev]);
    };

    const deleteComment = (id) => {
        setComments(prev => prev.filter(c => c.id !== id));
    };

    return (
        <CommentsContext.Provider value={{ comments, loading, addComment, deleteComment }}>
            {children}
        </CommentsContext.Provider>
    );
}

export const useComments = () => useContext(CommentsContext);
