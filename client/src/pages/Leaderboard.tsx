import React, { useState, useEffect } from "react";
import "../styles/Leaderboard.css";

const LeaderboardPage = () => {
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("https://brownhackathon25.onrender.com/leaderboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }

        const data = await response.json();
        setLeaderboardData(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  // Helper function to format ranks
  const getRankString = (index: number) => {
    const rank = index + 1;
    switch (rank) {
      case 1:
        return "1ST";
      case 2:
        return "2ND";
      case 3:
        return "3RD";
      default:
        return `${rank}TH`;
    }
  };

  // Helper function to format names
  const formatName = (fullName: string) => {
    const names = fullName.split(" ");
    if (names.length > 1) {
      return `${names[0]} ${names[names.length - 1][0]}.`;
    }
    return fullName;
  };

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
          {leaderboardData.map((student, index) => (
            <div
              key={student._id}
              className={`leaderboard-row ${index === 3 ? "highlight" : ""}`}
            >
              <span>{getRankString(index)}</span>
              <span>{formatName(student.studentName)}</span>
              <span>{student.totalBoxes.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
