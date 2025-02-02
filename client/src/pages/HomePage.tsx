import React from "react";
import "../styles/HomePage.css";
import { SignOutButton, useUser } from "@clerk/clerk-react";
import logo from "../assets/logo.png";
import coin from "../assets/mario-coin.png";
import cookie from "../assets/cookie.png";
import coupon from "../assets/coupon.png";
import swipe from "../assets/swipe.png";
import shirt from "../assets/shirt.png";

const HomePage = () => {
  const { user } = useUser();

  return (
    <div className="page">
      <div className="dashboard">
        <div className="dashboard-header">
          <div className="logo-section">
            <div className="recycle-logo">
              <img
                src={logo}
                alt="Project Logo"
                aria-label="Application Logo"
              />
            </div>
          </div>

          <div className="stats-section">
            <div className="stats-container">
              <div className="stat-item">
                <h2>Total Deposited</h2>
                <div className="stat-value">1111</div>
              </div>
              <div className="stat-item">
                <h2>Available Points</h2>
                <div className="stat-value">1111</div>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <div className="profile-pic">
              <img
                alt="Profile"
                style={{ height: "100%", width: "100%" }}
                className="profile-picture"
                src={user?.imageUrl}
                aria-label="User Profile Picture"
              />
            </div>
            <span className="profile-id">{user?.fullName}</span>
            <SignOutButton>
              <button className="btn-signout" aria-label="Sign Out Button">
                Sign out
              </button>
            </SignOutButton>
          </div>
        </div>

        <div className="rewards-section">
          <div className="up-down-animation">
            <div className="rewards-header">
              <img src={coin} alt="coin" className="coin-icon" />
              <h2>Rewards</h2>
              <img src={coin} alt="coin" className="coin-icon" />
            </div>
          </div>
          <div className="rewards-container">
            {[
              {
                points: 10,
                description: "Jo's Cookie",
                image: cookie,
              },
              {
                points: 25,
                description: "1 Swipe",
                image: swipe,
              },
              {
                points: 50,
                description: "10% Off Brown Bookstore Coupon",
                image: coupon,
              },
              {
                points: 100,
                description: "Brown T-Shirt!!!",
                image: shirt,
              },
            ].map((reward, index) => (
              <div key={index} className="reward-card">
                <img
                  src={reward.image}
                  alt={reward.description}
                  className="reward-image"
                />
                <h3>{reward.points} Points</h3>
                <p>{reward.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
