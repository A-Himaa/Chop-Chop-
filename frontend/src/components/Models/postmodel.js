import React, { useEffect, useState } from "react";
import "../../Styles/community.css";


const PostsPage = () => {
  const [posts, setPosts] = useState([]);
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
  
// Delete Option  
const handleDelete = async (postId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this post?");
  if (!confirmDelete) return;

  try {
    const response = await fetch(`http://localhost:8080/api/posts/${postId}`, {
      method: "DELETE",
    });

    if (response.ok) {
  
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
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
      .then(setPosts)
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

  return (
    <div className="community-container">
      <header className="community-header">
      <a href="/">
        <img src="/assets/chopchop.svg" alt="ChopChop Logo" className="logo" />
      </a>

        {/* <h1 className="logo-text">ChopChop</h1> */}
        <a href="/profile">
          <img
            src="/assets/User.png"
            alt="User Avatar"
            className="user-avatar"/>
        </a>
      </header>

      {/* New wrapper for the white card */}
      <div className="community-content-card">
        <section className="learning-plan">
          <div className="circle-placeholder">
            <img
              src="/assets/plus.png"
              alt="Create Story"
              className="learning-avatar"
            />
            {/* <p className="learntext">New Story</p> */}
          </div>
          

        </section>
        <div className="storytext">Your Story</div>

         {/* Tabs Navigation Section */}
        
        <section className="skill-sharing">
          <div className="share-box">
            {/* <img src="/assets/User.png" alt="User" className="share-avatar" /> */}
            <h2 style={{ marginLeft: "40vw", fontWeight:"600", fontSize:"20px", marginTop: "5px" }}>Explore</h2>
          </div>

          <div style={{ padding: "20px" }}>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>

              {posts.map((post) => (
                <div style={{ padding: "10px", backgroundColor: "#ff5e001b", borderRadius: "5px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", height: "auto", position: "relative", }}>

                  <div style={{ display: "flex",justifyContent: "space-between", gap: "10px", marginBottom: "5px" }}>

                  {/* User icon */}
                  <div style = {{ position: "relative", display: "inline-block" }}>
                  <img
                    src="/assets/User.png"
                    alt="User Avatar"
                    className="user-avatar"
                    style={{ width: "30px", height: "30px", marginLeft: "8px", opacity: "0.8", cursor: "pointer" }}
                    onClick={() => setActiveMenuPostId(activeMenuPostId === post.id ? null : post.id)}

                  />
                  {/* Menu  */}
                  {activeMenuPostId === post.id && (
                    <div
                      style={{
                        position: "absolute",
                        top: "33px",
                        left: "0",
                        backgroundColor: "#fff",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                        borderRadius: "6px",
                        padding: "8px",
                        zIndex: 10,
                        width: "120px"
                      }}
                    >
                      <button
                        style={{
                          ...dropdownButtonStyle,
                          marginBottom: "5px",
                          width: "100%",
                          textAlign: "left",
                          padding: "6px",
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          borderRadius: "5px",
                          transition: "background-color 0.2s",
                        }}
                        onMouseOver={(e) => (e.target.style.backgroundColor = "#ff5e00ac")}
                        onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
                      >
                        Update
                      </button>

                      <div style={{ margin: "3px 0" }}>
                        <hr style={{ border: "0", height: "1px", backgroundColor: "#ddd" }} />
                      </div>

                      <button
                        style={{
                          ...dropdownButtonStyle,
                          width: "100%",
                          textAlign: "left",
                          padding: "6px",
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          borderRadius: "5px",
                          transition: "background-color 0.2s",
                        }}
                        onMouseOver={(e) => (e.target.style.backgroundColor = "#ff5e00ac")}
                        onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
                        onClick={() => handleDelete(post.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}


                  </div>

                  <button style={{background: "#ff5e00ac", padding: "5px", paddingLeft: "10px", paddingRight: "10px", borderRadius: "5px", color: "#ffffff", fontSize: "15px",marginRight: "8px"}}>+Follow</button>
                  </div>

                <div key={post.id} style={{ padding: "5px", width: "350px" }}>
                <div style={{ padding: "10px", backgroundColor: "#ffffff", borderRadius: "5px" }}>
                  <img src={post.mediaLink} alt={post.title} style={{ width: "100%", height: "auto" }} />
                </div>

                <div style={{ padding: "20px",marginTop: "8px", backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
                    <p style={{ whiteSpace: "pre-wrap", textAlign: "left", fontSize: "15px", fontFamily: "Poppins, sans-serif" }}>{post.contentDescription}</p>
                </div>
                </div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "10px",
                  marginLeft: "8px",
                  height: "15px",
                  borderRadius: "8px"
                }}
              >
                <input type="text"/>
                <button ><img src="/assets/like.png" alt="User Avatar" style={{width: "30px", marginLeft: "5px" }}/></button>
                <button ><img src="/assets/share.png" alt="User Avatar" style={{width: "30px", marginLeft: "5px", opacity: "0.8" }}/></button>
                <button ><img src="/assets/bookmark.png" alt="User Avatar" style={{width: "30px", marginLeft: "5px", opacity: "0.8"}}/></button>
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
