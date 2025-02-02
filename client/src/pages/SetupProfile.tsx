import React, { useState, useEffect } from "react";
import "../styles/SetupProfile.css";
import { useUser } from "@clerk/clerk-react";

interface SetupProfileProps {
  setFirstLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const SetupProfile = ({ setFirstLogin }: SetupProfileProps) => {
  const [name, setName] = useState("");
  const [bannerID, setBannerID] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  const validateBannerID = (id: string) => {
    return id.startsWith("B01");
  };

  const handleBannerIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBannerID(value);
    if (value && !validateBannerID(value)) {
      setError("Banner ID must start with B01");
    } else {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !bannerID) {
      setError("All fields are required.");
      return;
    }

    if (!validateBannerID(bannerID)) {
      setError("Banner ID must start with B01");
      return;
    }

    try {
      const response = await fetch("https://brownhackathon25.onrender.com/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentName: name,
          bannerID: bannerID,
          email: user?.primaryEmailAddress?.emailAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }
      
      //make call to load data in intiallg
      await fetch(`https://brownhackathon25.onrender.com/${bannerID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          change: 0
        }),
      });


      setFirstLogin(false);
    } catch (err) {
      console.error("Registration error:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div
      className="setup-profile-container"
      aria-label="Setup profile container"
    >
      <h2 aria-label="Setup profile heading">Student Registration</h2>
      <form
        onSubmit={handleSubmit}
        className="setup-profile-form"
        aria-label="Setup profile form"
      >
        {error && (
          <p className="error-message" aria-label={`Error: ${error}`}>
            {error}
          </p>
        )}

        {/* Name Field */}
        <div className="form-group" aria-label="Name input field">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            aria-label="Enter your full name"
            required
          />
        </div>

        {/* Banner ID Field */}
        <div className="form-group" aria-label="Banner ID input field">
          <label htmlFor="bannerID">Banner ID</label>
          <input
            id="bannerID"
            type="text"
            value={bannerID}
            onChange={handleBannerIDChange}
            placeholder="Enter your Banner ID"
            aria-label="Enter your Banner ID"
            required
          />
        </div>

        <button
          type="submit"
          aria-label="Register button"
          className="btn btn-primary"
        >
          Complete Registration
        </button>
      </form>
    </div>
  );
};

export default SetupProfile;
