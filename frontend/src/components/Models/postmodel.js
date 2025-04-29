import React, { useEffect, useState } from "react";
import "../../Styles/community.css";


const PostsPage = () => {
  const [posts, setPosts] = useState([]);

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
          
          {/* <div className="add-tag">
            <div className="circle-placeholder"></div>
            <p>+tag</p>
          </div> */}
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
                <div style={{ padding: "10px", backgroundColor: "#ff5e001b", borderRadius: "5px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", height: "auto" }}>

                  <div style={{ display: "flex",justifyContent: "space-between", gap: "10px", marginBottom: "5px" }}>
                  <div>
                    <img src="/assets/User.png" alt="User Avatar" className="user-avatar" style={{ width: "30px", height: "30px", marginLeft: "8px", opacity: "0.8"}}/>
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
                  marginLeft: "200px"
                }}
              >
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
