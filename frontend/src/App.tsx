import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "./axios";
import { RootState, AppDispatch } from "./store/store.ts";
import { setAccessToken, clearAccessToken } from "./slices/authSlice";
import { AxiosError } from "axios";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = async () => {
    try {
      const response = await axios.post("/login", { username });
      dispatch(setAccessToken(response.data.accessToken));
      setError(null);
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed.");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/logout");
      dispatch(clearAccessToken());
      setError(null);
    } catch (error) {
      setError("Logout failed.");
    }
  };

  const handleRefreshToken = async () => {
    try {
      const response = await axios.post("/token");
      dispatch(setAccessToken(response.data.accessToken));
      setError(null);
    } catch (error) {
      console.error("Token refresh failed:", error);
      if (error instanceof AxiosError) {
        setError(error.response?.data?.message || "Token refresh failed.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="app-container">
      <div className="login-container">
        <h1>JWT Authentication Example</h1>
        <p>
          Write any username to login. The server will return an access token
        </p>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
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
