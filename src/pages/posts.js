import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { useRouter } from "next/router";
import { usePosts } from "../context/postContext";

export default function PostsPage() {
    const { currentUser, logOut } = useAuth();
    const router = useRouter();
    const { posts, loading, addPost, updatePost, deletePost } = usePosts();

    const [newTitle, setNewTitle] = useState("");
    const [newBody, setNewBody] = useState("");
    const [editingPostId, setEditingPostId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editBody, setEditBody] = useState("");

    useEffect(() => {
        if (!currentUser) router.push("/auth");
    }, [currentUser]);

    const handleCreatePost = (e) => {
        e.preventDefault();
        const newPost = {
            id: Date.now(),
            title: newTitle,
            body: newBody,
            userEmail: currentUser.email
        };
        addPost(newPost);
        setNewTitle("");
        setNewBody("");
    };

    const handleDelete = (id) => {
        deletePost(id);
    };

    const startEdit = (post) => {
        setEditingPostId(post.id);
        setEditTitle(post.title);
        setEditBody(post.body);
    };

    const handleSaveEdit = () => {
        updatePost(editingPostId, { title: editTitle, body: editBody });
        setEditingPostId(null);
    };

    const cancelEdit = () => {
        setEditingPostId(null);
        setEditTitle("");
        setEditBody("");
    };

    if (!currentUser) return null;
    if (loading) return <h2>Loading posts...</h2>;

    return (
        <div style={{ maxWidth: "600px", margin: "20px auto" }}>
            <h1>Welcome, {currentUser.name}!</h1>
            <button onClick={logOut} style={{ marginBottom: "20px" }}>Logout</button>

            <form
                onSubmit={handleCreatePost}
                style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "20px" }}
            >
                <h3>Create a New Post</h3>
                <input
                    placeholder="Post Title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    style={{ display: "block", width: "100%", marginBottom: "5px" }}
                />
                <textarea
                    placeholder="Post Content"
                    value={newBody}
                    onChange={(e) => setNewBody(e.target.value)}
                    required
                    style={{ display: "block", width: "100%", marginBottom: "5px" }}
                />
                <button type="submit">Add Post</button>
            </form>

            {posts.map((post) => (
                <div
                    key={post.id}
                    style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}
                >
                    {editingPostId === post.id ? (
                        <>
                            <input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                style={{ display: "block", width: "100%", marginBottom: "5px" }}
                            />
                            <textarea
                                value={editBody}
                                onChange={(e) => setEditBody(e.target.value)}
                                style={{ display: "block", width: "100%", marginBottom: "5px" }}
                            />
                            <button onClick={handleSaveEdit}>Save</button>
                            <button onClick={cancelEdit}>Cancel</button>
                        </>
                    ) : (
                        <>
                            <h2>{post.title}</h2>
                            <p>{post.body}</p>
                        </>
                    )}

                    {post.userEmail === currentUser.email && editingPostId !== post.id && (
                        <>
                            <button onClick={() => startEdit(post)}>Edit</button>
                            <button onClick={() => handleDelete(post.id)}>Delete</button>
                        </>
                    )}

                </div>
            ))}
        </div>
    );
}