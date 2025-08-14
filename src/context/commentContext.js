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
            async function fetchComments() {
                const res = await fetch("https://jsonplaceholder.typicode.com/comments");
                const data = await res.json();
                setComments(data);
                setLoading(false);
            }
            fetchComments();
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