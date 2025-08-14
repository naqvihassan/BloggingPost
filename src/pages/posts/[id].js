import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../context/authContext";
import { usePosts } from "../../context/postContext";
import { useComments } from "../../context/commentContext";

export default function SinglePost() {
    const router = useRouter();
    const { id } = router.query;
    const { currentUser } = useAuth();
    const { posts } = usePosts();
    const { comments, addComment, deleteComment, loading } = useComments();

    const [post, setPost] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editCommentText, setEditCommentText] = useState("");

    useEffect(() => {
        if (id) {
            const foundPost = posts.find((p) => p.id == id);
            setPost(foundPost);
        }
    }, [id, posts]);

    if (!post) return <h2>Loading post...</h2>;
    if (loading) return <h2>Loading comments...</h2>;

    const handleAddComment = (e) => {
        e.preventDefault();
        if (!currentUser) return alert("You must be logged in to comment!");

        const myComment = {
            id: Date.now(),
            body: newComment,
            email: currentUser.email,
            userEmail: currentUser.email,
        };

        addComment(Number(id), myComment);
        setNewComment("");
    };

    const handleDeleteComment = (commentId) => {
        deleteComment(commentId);
    };

    const startEditComment = (comment) => {
        setEditingCommentId(comment.id);
        setEditCommentText(comment.body);
    };

    const handleSaveEditComment = () => {
        deleteComment(editingCommentId);
        addComment(Number(id), {
            id: editingCommentId,
            body: editCommentText,
            email: currentUser.email,
            userEmail: currentUser.email,
        });
        setEditingCommentId(null);
    };

    const postComments = comments.filter((c) => String(c.postId) === String(id));

    return (
        <div style={{ 
            maxWidth: "600px", 
            margin: "20px auto",
            padding: "0 20px",
            boxSizing: "border-box"
        }}>
            <button onClick={() => router.push("/posts")}>⬅ Back to Posts</button>

            <h1 style={{ 
                wordWrap: "break-word", 
                overflowWrap: "break-word",
                maxWidth: "100%"
            }}>{post.title}</h1>
            <p style={{ 
                wordWrap: "break-word", 
                overflowWrap: "break-word",
                maxWidth: "100%",
                lineHeight: "1.6"
            }}>{post.body}</p>

            <hr />

            {currentUser && (
                <form onSubmit={handleAddComment} style={{ marginBottom: "20px" }}>
                    <textarea
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        required
                        style={{ 
                            width: "100%", 
                            marginBottom: "5px",
                            boxSizing: "border-box",
                            resize: "vertical",
                            minHeight: "80px"
                        }}
                    />
                    <button type="submit">Add Comment</button>
                </form>
            )}

            <h3>Comments</h3>

            {postComments.length === 0 && <p>No comments yet.</p>}

            {postComments.map((comment) => (
                <div key={comment.id} style={{ 
                    borderBottom: "1px solid #ddd", 
                    padding: "10px",
                    marginBottom: "10px",
                    wordWrap: "break-word",
                    overflowWrap: "break-word"
                }}>
                    <strong style={{ display: "block", marginBottom: "5px" }}>{comment.email}</strong>

                    {editingCommentId === comment.id ? (
                        <>
                            <textarea
                                value={editCommentText}
                                onChange={(e) => setEditCommentText(e.target.value)}
                                style={{ 
                                    width: "100%", 
                                    marginBottom: "5px",
                                    boxSizing: "border-box",
                                    resize: "vertical",
                                    minHeight: "60px"
                                }}
                            />
                            <button onClick={handleSaveEditComment}>Save</button>
                            <button onClick={() => setEditingCommentId(null)}>Cancel</button>
                        </>
                    ) : (
                        <p style={{ 
                            wordWrap: "break-word", 
                            overflowWrap: "break-word",
                            maxWidth: "100%",
                            lineHeight: "1.5",
                            marginBottom: "10px"
                        }}>{comment.body}</p>
                    )}

                    {comment.userEmail === currentUser?.email && editingCommentId !== comment.id && (
                        <div style={{ marginTop: "10px" }}>
                            <button onClick={() => startEditComment(comment)}>Edit</button>
                            <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}