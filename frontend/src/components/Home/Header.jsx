import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// import AuthModal from "../Modals/AuthModal";

const Header = () => {
  const navigate = useNavigate();
  // const [isAuthModalOpened, setIsAuthModalOpened] = useState(false);
  
  return (
    <header className="header">
      <nav>
        <div className="nav__header">
          <div className="nav__logomain">
            <Link to="/">
              <img src="/assets/chopchop.svg" alt="Chop Chop logo" />
            </Link>
          </div>

          <div className="nav__menu__btn" id="menu-btn">
            <span>
              <i className="ri-menu-line"></i>
            </span>
          </div>
        </div>

        <ul className="nav__links" id="nav-links">

          <li className="link">
            <Link to="/posts">Explore Recipes</Link>
          </li>
          <li className="link">
            <Link to="/learning">Tutorials</Link>
          </li>

          <li className="link">
             <Link
              to="/community"
              // onClick={(e) => {
              //   if (!localStorage.getItem("userId")) {
              //     e.preventDefault();
              //     setIsAuthModalOpened(true); // Open the authentication modal if not logged in
              //   }
              // }}
            > 
              Share Recipe
             </Link> 
          </li>

          <li className="link">
            <button
              onClick={() => navigate("/community")}
              // onClick={() => {
              //   if (localStorage.getItem("userId")) {
              //     navigate("/community"); // Navigate to the feed page
              //   } else {
              //     setIsAuthModalOpened(true); // Open the authentication modal
              //   }
              // }}
              className="btn"
            >
              Join Now
            </button>
          </li>
        </ul>
      </nav>


      {/* ---Home Content--- */}
      <div className="section__container header__container" id="home">
        <div>
          <img src="/assets/chopchophd.svg" />
        </div>
        <div className="header__content">
          <h4>Share Your Culinary Journey &</h4>
          <h1 className="section__header">Connect with Food Enthusiasts on Chop Chop!</h1>
          <p>
            Share your cooking achievements, discover mouthwatering recipes, and connect with a 
            community of food lovers. Upload photos and videos, follow other chefs, and engage 
            with their culinary creations through likes and comments.
          </p>
          <div className="header__btn">
            <button
              // onClick={() => {
              //   if (localStorage.getItem("userId")) {
              //     navigate("/community"); // Navigate to the feed page
              //   } else {
              //     setIsAuthModalOpened(true); // Open the authentication modal
              //   }
              // }}
              className="btn"
            >
              Start Sharing Today
            </button>
          </div>
        </div>
      </div>

      {/* <AuthModal
        onClose={() => {
          setIsAuthModalOpened(false);
        }}
        isOpen={isAuthModalOpened}
      /> */}
    </header>
  );
};

export default Header;