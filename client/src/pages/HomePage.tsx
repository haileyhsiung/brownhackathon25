import React, { useState, useEffect } from "react";
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
  const [stats, setStats] = useState({ totalBoxes: 0, totalPoints: 0 });
  const [bannerID, setBannerID] = useState("");
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [claimError, setClaimError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.primaryEmailAddress?.emailAddress) {
        try {
          const bannerResponse = await fetch(
            `http://localhost:5001/user-bannerID/${user.primaryEmailAddress.emailAddress}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!bannerResponse.ok) throw new Error("Failed to fetch bannerID");
          const fetchedBannerID = await bannerResponse.json();
          setBannerID(fetchedBannerID.bannerID);

          const statsResponse = await fetch(
            `http://localhost:5001/user/${fetchedBannerID.bannerID}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!statsResponse.ok) throw new Error("Failed to fetch stats");
          const statsData = await statsResponse.json();
          setStats(statsData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleClaimReward = async () => {
    if (!selectedReward) return;

    try {
      const response = await fetch(
        `http://localhost:5001/claim-reward/${bannerID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bannerID: bannerID,
            change: -selectedReward.points,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to claim reward");
      }

      const updatedStats = await response.json();
      setStats(updatedStats);
      setSelectedReward(null);
      setClaimError(null);
    } catch (err) {
      setClaimError("Failed to claim reward");
    }
  };

  const rewards = [
    { points: 10, description: "Jo's Cookie", image: cookie },
    { points: 25, description: "1 Swipe", image: swipe },
    {
      points: 50,
      description: "10% Off Brown Bookstore Coupon",
      image: coupon,
    },
    { points: 100, description: "Brown T-Shirt!!!", image: shirt },
  ];

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
                <div className="stat-value">{stats.totalBoxes}</div>
              </div>
              <div className="stat-item">
                <h2>Available Points</h2>
                <div className="stat-value">{stats.totalPoints}</div>
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
            {rewards.map((reward, index) => (
              <div
                key={index}
                className="reward-card"
                onClick={() => setSelectedReward(reward)}
              >
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

        {selectedReward && (
          <div
            className="modal-backdrop"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div className="reward-modal">
              <button
                className="modal-close"
                onClick={() => setSelectedReward(null)}
              >
                ×
              </button>
              <img
                src={selectedReward.image}
                alt={selectedReward.description}
                className="modal-image"
              />
              <h2>{selectedReward.description}</h2>
              <p>Cost: {selectedReward.points} Points</p>
              <p>You have: {stats.totalPoints} Points</p>
              {claimError && <p className="error-message">{claimError}</p>}
              <button
                className="btn-claim"
                onClick={handleClaimReward}
                disabled={stats.totalPoints < selectedReward.points}
              >
                {stats.totalPoints >= selectedReward.points
                  ? "Claim Reward"
                  : "Not Enough Points"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
