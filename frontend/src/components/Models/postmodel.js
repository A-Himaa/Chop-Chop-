import React, { useEffect, useState } from "react";
import "../../Styles/community.css";
import { getCommentsByPostId, addComment } from "../../api/comment";

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [comments, setComments] = useState({});
  const [activeMenuPostId, setActiveMenuPostId] = useState(null);

  const dropdownButtonStyle = {
    width: "100%",
    background: "none",
    border: "none",
    padding: "6px 10px",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "14px",
    fontFamily: "Poppins, sans-serif",
    color: "#333",
    transition: "background-color 0.2s",
  };

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8080/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        alert("Post deleted successfully.");
      } else if (response.status === 404) {
        alert("Post not found or already deleted.");
      } else {
        alert("Failed to delete post. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("An error occurred while deleting the post.");
    }
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        data.forEach((post) => loadCommentsForPost(post.id));
      })
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

  const loadCommentsForPost = async (postId) => {
    try {
      const res = await getCommentsByPostId(postId);
      setComments((prev) => ({ ...prev, [postId]: res.data }));
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };

  const handleInputChange = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  const handleCommentSubmit = async (postId) => {
    const content = commentInputs[postId];
    if (!content?.trim()) return;

    try {
      await addComment({
        postId,
        userId: "demoUser123",
        content,
      });
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      await loadCommentsForPost(postId);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="community-container">
      <header className="community-header">
        <a href="/">
          <img src="/assets/chopchop.svg" alt="ChopChop Logo" className="logo" />
        </a>
        <a href="/profile">
          <img src="/assets/User.png" alt="User Avatar" className="user-avatar" />
        </a>
      </header>

      <div className="community-content-card">
        <section className="learning-plan">
          <div className="circle-placeholder">
            <img src="/assets/plus.png" alt="Create Story" className="learning-avatar" />
          </div>
        </section>
        <div className="storytext">Your Story</div>

        <section className="skill-sharing">
          <div className="share-box">
            <h2 style={{ marginLeft: "40vw", fontWeight: "600", fontSize: "20px", marginTop: "5px" }}>Explore</h2>
          </div>

          <div style={{ padding: "20px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {posts.map((post) => (
                <div
                  key={post.id}
                  style={{
                    padding: "10px",
                    backgroundColor: "#ff5e001b",
                    borderRadius: "5px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    width: "370px",
                  }}
                >
                  {/* Top Section */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ position: "relative" }}>
                      <img
                        src="/assets/User.png"
                        alt="User Avatar"
                        className="user-avatar"
                        style={{ width: "30px", height: "30px", opacity: "0.8", cursor: "pointer" }}
                        onClick={() =>
                          setActiveMenuPostId(activeMenuPostId === post.id ? null : post.id)
                        }
                      />
                      {/* Dropdown Menu */}
                      {activeMenuPostId === post.id && (
                        <div
                          style={{
                            position: "absolute",
                            top: "35px",
                            left: "0",
                            backgroundColor: "#fff",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                            borderRadius: "6px",
                            padding: "8px",
                            zIndex: 10,
                            width: "120px",
                          }}
                        >
                          <button
                            style={dropdownButtonStyle}
                            onMouseOver={(e) => (e.target.style.backgroundColor = "#ff5e00ac")}
                            onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
                          >
                            Update
                          </button>
                          <hr style={{ margin: "5px 0", border: "none", height: "1px", backgroundColor: "#ddd" }} />
                          <button
                            style={dropdownButtonStyle}
                            onMouseOver={(e) => (e.target.style.backgroundColor = "#ff5e00ac")}
                            onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
                            onClick={() => handleDelete(post.id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                    <button style={{ background: "#ff5e00ac", padding: "5px 10px", borderRadius: "5px", color: "#ffffff" }}>
                      +Follow
                    </button>
                  </div>

                  {/* Post Image */}
                  <div style={{ marginTop: "10px" }}>
                    <img src={post.mediaLink} alt={post.title} style={{ width: "100%", borderRadius: "5px" }} />
                  </div>

                  {/* Description */}
                  <div
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      padding: "10px",
                      marginTop: "10px",
                    }}
                  >
                    <p style={{ fontSize: "15px", fontFamily: "Poppins, sans-serif", whiteSpace: "pre-wrap" }}>
                      {post.contentDescription}
                    </p>
                  </div>

                  {/* Comment Input */}
                  <div style={{ marginTop: "10px", display: "flex", gap: "5px" }}>
                    <input
                      type="text"
                      placeholder="Comment"
                      value={commentInputs[post.id] || ""}
                      onChange={(e) => handleInputChange(post.id, e.target.value)}
                      style={{
                        flex: 1,
                        padding: "6px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                      }}
                    />
                    <button onClick={() => handleCommentSubmit(post.id)}>Post</button>
                  </div>

                  {/* Comment List */}
                  <div style={{ marginTop: "8px" }}>
                    {(comments[post.id] || []).map((comment) => (
                      <div
                        key={comment.id}
                        style={{
                          backgroundColor: "#fff",
                          borderRadius: "5px",
                          padding: "6px",
                          fontSize: "14px",
                          marginBottom: "4px",
                        }}
                      >
                        <strong>{comment.userId}:</strong> {comment.content}
                      </div>
                    ))}
                  </div>

                  {/* Post Actions */}
                  <div
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <button><img src="/assets/like.png" alt="Like" style={{ width: "30px" }} /></button>
                    <button><img src="/assets/share.png" alt="Share" style={{ width: "30px", opacity: "0.8" }} /></button>
                    <button><img src="/assets/bookmark.png" alt="Bookmark" style={{ width: "30px", opacity: "0.8" }} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PostsPage;
