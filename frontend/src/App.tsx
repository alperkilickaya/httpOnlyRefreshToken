import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "./axios";
import { RootState, AppDispatch } from "./store/store.ts";
import { setAccessToken, clearAccessToken } from "./slices/authSlice";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = async () => {
    try {
      const response = await axios.post("/login", { username });
      dispatch(setAccessToken(response.data.accessToken));
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/logout");
      dispatch(clearAccessToken());
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleRefreshToken = async () => {
    try {
      const response = await axios.post("/token");
      dispatch(setAccessToken(response.data.accessToken));
    } catch (error) {
      console.error("Token refresh failed:", error);
    }
  };

  return (
    <div className="app-container">
      <div className="login-container">
        <h1>JWT Authentication Example</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: "8px",
            marginTop: "16px",
          }}
        >
          <button
            onClick={handleLogin}
            style={{
              backgroundColor: "dodgerblue",
              color: "white",
              padding: "8px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              width: "100px",
            }}
          >
            Login
          </button>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "tomato",
              color: "white",
              padding: "8px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              width: "100px",
            }}
          >
            Logout
          </button>
          <button
            onClick={handleRefreshToken}
            style={{
              backgroundColor: "green",
              color: "white",
              padding: "8px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              width: "100px",
            }}
          >
            Refresh Token
          </button>
        </div>
        <p
          style={{
            padding: "16px",
            overflowWrap: "anywhere",
          }}
        >
          Access Token: {accessToken}
        </p>
      </div>
    </div>
  );
}

export default App;
