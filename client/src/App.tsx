import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LeaderboardPage from "./pages/Leaderboard";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/App.css";
import { useState, useEffect } from "react";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import SetupProfile from "./pages/SetupProfile";
import SignUp from "./pages/SignUp";

type userInfo = {
  id: number;
  clerk_id: string;
  name: string;
  email: string;
  phone_number: string;
  school: string;
  tags: string[];
};

/**
 * This is the highest level component which builds the application.
 * It manages user log ins and routing of the application's pages.
 *
 * @return JSX of the entire application
 */
const App: React.FC = () => {
  const { isSignedIn, user } = useUser();
  const [firstLogin, setFirstLogin] = useState(false);
  const [userInfo, setUserInfo] = useState<userInfo | null>(null);

  // useEffect(() => {
  //   // checks if user has loggined in for the first time. if so, send them to
  //   // setupProfilepage
  //   const checkIfFirstLogin = async () => {
  //     if (isSignedIn && user) {
  //       try {
  //         const response = await fetch(`http://localhost:5001/login`);
  //         const data = await response.json();
  //         if (data.response_type === "success") {
  //           setUserInfo(data.user_data);
  //           setFirstLogin(false);
  //         } else {
  //           setFirstLogin(true);
  //         }
  //       } catch (error) {
  //         console.error("error checking if user details are set up", error);
  //       }
  //     }
  //   };
  //   checkIfFirstLogin();
  // }, [isSignedIn, user]);
  useEffect(() => {
    const checkIfFirstLogin = async () => {
      if (isSignedIn && user) {
        try {
          // Send POST request to login endpoint
          const response = await fetch("https://brownhackathon25.onrender.com/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.primaryEmailAddress?.emailAddress,
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          if (data.message === "Login successful") {
            setUserInfo(data.student);
            setFirstLogin(false);
          } else {
            setFirstLogin(true);
          }
        } catch (error) {
          console.error("Login check failed:", error);
          setFirstLogin(true);
        }
      }
    };
    checkIfFirstLogin();
  }, [isSignedIn, user]);

  // const handleUserClick = (id: number) => {
  //   navigate(`/user/${id}?${searchParams.toString()}`);
  // };

  return (
    <div aria-label="Application Container">
      <SignedOut>
        <SignUp aria-label="Sign-Up Page" />
      </SignedOut>
      <SignedIn>
        <Router>
          {firstLogin ? (
            <SetupProfile
              setFirstLogin={setFirstLogin}
              aria-label="Setup Profile Page"
            />
          ) : (
            <div>
              <nav
                className="navbar navbar-expand-lg navbar-custom"
                aria-label="Main Navigation"
              >
                <div
                  className="container-fluid navbar-container"
                  aria-label="Navigation Container"
                >
                  <a
                    className="navbar-brand"
                    href="/"
                    aria-label="The CompJoster Home Page Link"
                  >
                    The CompJoster
                  </a>
                  <div className="nav sections">
                    <a href="/" className="home" aria-label="Home Page Link">
                      Home
                    </a>
                    <a
                      href="/#/leaderboard"
                      className="leaderboard"
                      aria-label="Leaderboard Page Link"
                    >
                      Leaderboard
                    </a>
                  </div>
                </div>
              </nav>
              <Routes>
                <Route path="/" element={<HomePage aria-label="Home Page" />} />
                <Route
                  path="/leaderboard"
                  element={<LeaderboardPage aria-label="Leaderboard Page" />}
                />
              </Routes>
            </div>
          )}
        </Router>
      </SignedIn>
    </div>
  );
};

export default App;
