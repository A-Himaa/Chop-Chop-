import React, { useEffect, useState } from "react";
import "../../Styles/community.css";
import { getCommentsByPostId, addComment } from "../../api/comment";


const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [comments, setComments] = useState({});

  useEffect(() => {
    fetch("http://localhost:8080/api/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        data.forEach(post => loadCommentsForPost(post.id));
      })
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

  const loadCommentsForPost = async (postId) => {
    try {
      const res = await getCommentsByPostId(postId);
      setComments(prev => ({ ...prev, [postId]: res.data }));
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };

  const handleInputChange = (postId, value) => {
    setCommentInputs(prev => ({ ...prev, [postId]: value }));
  };

  const handleCommentSubmit = async (postId) => {
    const content = commentInputs[postId];
    if (!content?.trim()) return;

    try {
      await addComment({
        postId,
        userId: "demoUser123",
        content
      });
      setCommentInputs(prev => ({ ...prev, [postId]: "" }));
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
                <div key={post.id} style={{ padding: "10px", backgroundColor: "#ff5e001b", borderRadius: "5px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", height: "auto" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", marginBottom: "5px" }}>
                    <div>
                      <img src="/assets/User.png" alt="User Avatar" className="user-avatar" style={{ width: "30px", height: "30px", marginLeft: "8px", opacity: "0.8" }} />
                    </div>
                    <button style={{ background: "#ff5e00ac", padding: "5px 10px", borderRadius: "5px", color: "#ffffff", fontSize: "15px", marginRight: "8px" }}>+Follow</button>
                  </div>

                  <div style={{ padding: "5px", width: "350px" }}>
                    <div style={{ padding: "10px", backgroundColor: "#ffffff", borderRadius: "5px" }}>
                      <img src={post.mediaLink} alt={post.title} style={{ width: "100%", height: "auto" }} />
                    </div>

                    <div style={{ padding: "20px", marginTop: "8px", backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
                      <p style={{ whiteSpace: "pre-wrap", textAlign: "left", fontSize: "15px", fontFamily: "Poppins, sans-serif" }}>{post.contentDescription}</p>
                    </div>
                  </div>

                  <div style={{ marginTop: "10px", marginLeft: "8px", display: "flex", alignItems: "center", gap: "5px" }}>
                    <input
                      type="text"
                      placeholder="Comment"
                      value={commentInputs[post.id] || ""}
                      onChange={(e) => handleInputChange(post.id, e.target.value)}
                      style={{ flexGrow: 1, padding: "6px", borderRadius: "5px", border: "1px solid #ccc", marginTop: "4px", marginBottom: "4px" }}
                    />
                    <button onClick={() => handleCommentSubmit(post.id)}>Post</button>
                  </div>

                  <div style={{ marginLeft: "8px", marginTop: "5px" }}>
                    {(comments[post.id] || []).map((comment) => (
                      <div key={comment.id} style={{ fontSize: "14px", marginBottom: "3px", backgroundColor: "#fff", padding: "4px 8px", borderRadius: "5px" }}>
                        <strong>{comment.userId}:</strong> {comment.content}
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px", marginLeft: "8px", height: "15px", borderRadius: "8px" }}>
                    <button><img src="/assets/like.png" alt="Like" style={{ width: "30px", marginLeft: "5px" }} /></button>
                    <button><img src="/assets/share.png" alt="Share" style={{ width: "30px", marginLeft: "5px", opacity: "0.8" }} /></button>
                    <button><img src="/assets/bookmark.png" alt="Bookmark" style={{ width: "30px", marginLeft: "5px", opacity: "0.8" }} /></button>
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
