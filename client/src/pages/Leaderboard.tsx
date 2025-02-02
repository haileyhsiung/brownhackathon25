import React from "react";
import "../styles/Leaderboard.css";

const LeaderboardPage = () => {
  const leaderboardData = [
    { rank: "1ST", name: "HDN", score: 959244417 },
    { rank: "2ND", name: "CSI", score: 947357401 },
    { rank: "3RD", name: "JGV", score: 939113841 },
    { rank: "4TH", name: "AAA", score: 906620103 },
    { rank: "5TH", name: "AWC", score: 878158101 },
    { rank: "6TH", name: "IXV", score: 850404399 },
    { rank: "7TH", name: "OGX", score: 823622865 },
    { rank: "8TH", name: "DQE", score: 802947386 },
    { rank: "9TH", name: "VUS", score: 794364074 },
    { rank: "10TH", name: "KTB", score: 693584974 },
  ];

  return (
    <div className="leaderboard-page">
      <h1 className="leaderboard-title">LEADERBOARD</h1>
      <span className="update-time">*Updated daily at 2AM</span>
      <div className="leaderboard-table">
        <div className="leaderboard-header">
          <span>RANK</span>
          <span>NAME</span>
          <span>SCORE</span>
        </div>
        <div className="leaderboard-body">
          {leaderboardData.map((entry, index) => (
            <div
              key={index}
              className={`leaderboard-row ${index === 3 ? "highlight" : ""}`}
            >
              <span>{entry.rank}</span>
              <span>{entry.name}</span>
              <span>{entry.score.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
