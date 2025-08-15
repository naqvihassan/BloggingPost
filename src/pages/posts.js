import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { useRouter } from "next/router";
import { usePosts } from "../context/postContext";

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

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
            userEmail: currentUser.email,
            createdAt: Date.now(),
        };
        addPost(newPost);
        setNewTitle("");
        setNewBody("");
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            deletePost(id);
        }
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
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <h2 className="text-xl text-gray-600 classic-serif">Loading your stories...</h2>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 fade-in">
            {/* Classic Header */}
            <header className="classic-header text-white py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl sm:text-6xl classic-serif font-bold mb-6 leading-tight">
                        The Literary Journal
                    </h1>
                    <p className="text-xl sm:text-2xl text-gray-200 classic-sans font-light mb-4 max-w-2xl mx-auto">
                        Where thoughts become stories, and stories become timeless
                    </p>
                    <div className="classic-divider mt-8 mb-0">
                        <span className="text-gray-300">◆ ◆ ◆</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-12">
                {/* Welcome Section */}
                <div className="text-center mb-12">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6 paper-card p-8 rounded-lg">
                        <div>
                            <h2 className="text-2xl classic-serif font-semibold text-gray-800 mb-2">
                                Welcome back, <span className="text-gray-900">{currentUser.name}</span>
                            </h2>
                            <p className="text-gray-600 classic-sans">Ready to share your next story?</p>
                        </div>
                        <button
                            onClick={logOut}
                            className="classic-button bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded classic-sans font-medium"
                        >
                            Log Out
                        </button>
                    </div>
                </div>

                {/* Create Post Form */}
                <section className="mb-16">
                    <div className="paper-card p-8 rounded-lg">
                        <h3 className="text-2xl classic-serif font-semibold text-gray-800 mb-6 text-center">
                            Pen Your Thoughts
                        </h3>
                        <form onSubmit={handleCreatePost} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 classic-sans mb-2">
                                    Title
                                </label>
                                <input
                                    className="classic-input w-full px-4 py-4 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent classic-serif text-lg"
                                    placeholder="Enter your story title..."
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 classic-sans mb-2">
                                    Content
                                </label>
                                <textarea
                                    className="classic-input w-full px-4 py-4 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent classic-sans text-base leading-relaxed"
                                    placeholder="Begin your story..."
                                    value={newBody}
                                    onChange={(e) => setNewBody(e.target.value)}
                                    required
                                    rows={6}
                                />
                            </div>
                            <div className="text-center">
                                <button
                                    type="submit"
                                    className="classic-button bg-gray-900 hover:bg-gray-800 text-white px-12 py-4 rounded classic-sans font-medium text-lg"
                                >
                                    Publish Story
                                </button>
                            </div>
                        </form>
                    </div>
                </section>

                {/* Posts Section */}
                <section>
                    <div className="text-center mb-12">
                        <h3 className="text-3xl classic-serif font-semibold text-gray-800 mb-4">
                            Published Stories
                        </h3>
                        <div className="classic-divider">
                            <span>◆</span>
                        </div>
                    </div>

                    <div className="space-y-12">
                        {posts.length === 0 ? (
                            <div className="text-center py-16 paper-card rounded-lg">
                                <h4 className="text-xl classic-serif text-gray-600 mb-4">No stories yet</h4>
                                <p className="text-gray-500 classic-sans">Be the first to share your thoughts with the world.</p>
                            </div>
                        ) : (
                            posts.map((post, index) => (
                                <article
                                    key={post.id}
                                    className="paper-card p-8 rounded-lg blog-post"
                                >
                                    {editingPostId === post.id ? (
                                        <div className="space-y-4">
                                            <input
                                                className="classic-input w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 classic-serif text-xl font-semibold"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                            />
                                            <textarea
                                                className="classic-input w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 classic-sans text-base leading-relaxed"
                                                value={editBody}
                                                onChange={(e) => setEditBody(e.target.value)}
                                                rows={6}
                                            />
                                            <div className="flex gap-3 justify-end">
                                                <button
                                                    onClick={handleSaveEdit}
                                                    className="classic-button bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded classic-sans font-medium"
                                                >
                                                    Save Changes
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="classic-button bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded classic-sans font-medium"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <header className="mb-6">
                                                <h2 className="text-3xl classic-serif font-bold text-gray-900 mb-4 leading-tight">
                                                    {post.title}
                                                </h2>
                                                <div className="flex flex-wrap items-center text-gray-600 text-sm classic-sans gap-4">
                                                    <span className="flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                        </svg>
                                                        By {post.userEmail || "Anonymous"}
                                                    </span>
                                                    <span className="flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                        </svg>
                                                        {post.createdAt ? formatDate(post.createdAt) : "January 1, 2024"}
                                                    </span>
                                                </div>
                                            </header>
                                            
                                            <div className="prose max-w-none mb-8">
                                                <p className="text-gray-800 classic-sans text-lg leading-relaxed drop-cap">
                                                    {post.body.length > 300 
                                                        ? `${post.body.substring(0, 300)}...` 
                                                        : post.body
                                                    }
                                                </p>
                                            </div>

                                            <footer className="border-t border-gray-200 pt-6">
                                                <div className="flex flex-wrap gap-3 justify-between items-center">
                                                    <button
                                                        onClick={() => router.push(`/posts/${post.id}`)}
                                                        className="classic-button bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded border border-gray-300 classic-sans font-medium"
                                                    >
                                                        {post.body.length > 300 ? 'Continue Reading →' : 'View Comments →'}
                                                    </button>
                                                    
                                                    {post.userEmail === currentUser.email && (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => startEdit(post)}
                                                                className="classic-button bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded classic-sans font-medium text-sm"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(post.id)}
                                                                className="classic-button bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded classic-sans font-medium text-sm"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </footer>
                                        </>
                                    )}
                                </article>
                            ))
                        )}
                    </div>
                </section>
            </main>

            {/* Classic Footer */}
            <footer className="border-t border-gray-200 bg-white py-12 mt-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="classic-divider mb-6">
                        <span>◆ ◆ ◆</span>
                    </div>
                    <p className="text-gray-600 classic-sans mb-4">
                        "The art of writing is the art of discovering what you believe."
                    </p>
                    <p className="text-sm text-gray-500 classic-sans">
                        © {new Date().getFullYear()} The Literary Journal. Crafted with care for storytellers.
                    </p>
                </div>
            </footer>
        </div>
    );
}