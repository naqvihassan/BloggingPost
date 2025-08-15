import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../context/authContext";
import { usePosts } from "../../context/postContext";
import { useComments } from "../../context/commentContext";

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

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
    if (!currentUser) {
      router.push("/auth");
    }
  }, [currentUser, router]);

  useEffect(() => {
    if (id) {
      const foundPost = posts.find((p) => p.id == id);
      setPost(foundPost);
    }
  }, [id, posts]);

  if (currentUser === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <h2 className="text-xl text-gray-600 classic-serif">Checking authentication...</h2>
        </div>
      </div>
    );
  }

  if (!currentUser) return null;

  if (!post) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <h2 className="text-xl text-gray-600 classic-serif">Loading story...</h2>
      </div>
    </div>
  );
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <h2 className="text-xl text-gray-600 classic-serif">Loading comments...</h2>
      </div>
    </div>
  );

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!currentUser) return alert("You must be logged in to comment!");

    const myComment = {
      id: Date.now(),
      body: newComment,
      email: currentUser.email,
      userEmail: currentUser.email,
      createdAt: Date.now(),
    };

    addComment(Number(id), myComment);
    setNewComment("");
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteComment(commentId);
    }
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
      createdAt: Date.now(),
    });
    setEditingCommentId(null);
  };

  const postComments = comments.filter((c) => String(c.postId) === String(id));

  return (
    <div className="min-h-screen bg-gray-50 fade-in">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <button
            onClick={() => router.push("/posts")}
            className="classic-button bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded border border-gray-300 classic-sans font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Stories
          </button>
        </div>

        <article className="paper-card p-8 rounded-lg mb-12 blog-post">
          <header className="mb-8">
            <h1 className="text-4xl classic-serif font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center text-gray-600 text-sm classic-sans gap-4">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                By {post.userEmail || post.email || "Anonymous"}
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
              {post.body}
            </p>
          </div>
        </article>

        {currentUser && (
          <section className="mb-12">
            <div className="paper-card p-8 rounded-lg">
              <h3 className="text-2xl classic-serif font-semibold text-gray-800 mb-6 text-center">
                Share Your Thoughts
              </h3>
              <form onSubmit={handleAddComment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 classic-sans mb-2">
                    Your Comment
                  </label>
                  <textarea
                    className="classic-input w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent classic-sans text-base leading-relaxed"
                    placeholder="Write your thoughts on this story..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                    rows={4}
                  />
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="classic-button bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded classic-sans font-medium"
                  >
                    Post Comment
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        <section>
          <div className="text-center mb-8">
            <h3 className="text-3xl classic-serif font-semibold text-gray-800 mb-4">
              Reader Comments
            </h3>
            <div className="classic-divider">
              <span>◆</span>
            </div>
          </div>

          {postComments.length === 0 ? (
            <div className="text-center py-12 paper-card rounded-lg">
              <h4 className="text-xl classic-serif text-gray-600 mb-4">No comments yet</h4>
              <p className="text-gray-500 classic-sans">Be the first to share your thoughts on this story.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {postComments.map((comment) => (
                <div
                  key={comment.id}
                  className="paper-card p-6 rounded-lg"
                >
                  <div className="flex items-center text-gray-600 text-sm classic-sans gap-2 mb-3">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span>{comment.userEmail || comment.email || "Anonymous"}</span>
                    <span className="mx-2">•</span>
                    <span>{comment.createdAt ? formatDate(comment.createdAt) : "January 1, 2024"}</span>
                  </div>
                  
                  {editingCommentId === comment.id ? (
                    <div className="space-y-4">
                      <textarea
                        className="classic-input w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent classic-sans text-base leading-relaxed"
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                        rows={4}
                      />
                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={handleSaveEditComment}
                          className="classic-button bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded classic-sans font-medium text-sm"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditingCommentId(null)}
                          className="classic-button bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded classic-sans font-medium text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-800 classic-sans text-base leading-relaxed mb-4">
                        {comment.body}
                      </p>
                      
                      {comment.userEmail === currentUser?.email && (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => startEditComment(comment)}
                            className="classic-button bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded classic-sans font-medium text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="classic-button bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded classic-sans font-medium text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <footer className="border-t border-gray-200 bg-white py-12 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="classic-divider mb-6">
            <span>◆ ◆ ◆</span>
          </div>
          <p className="text-gray-600 classic-sans mb-4">
            "Every story is a journey, every comment a connection."
          </p>
          <p className="text-sm text-gray-500 classic-sans">
            © {new Date().getFullYear()} The Literary Journal. Crafted with care for storytellers.
          </p>
        </div>
      </footer>
    </div>
  );
}
