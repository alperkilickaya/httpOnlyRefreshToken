const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const ACCESS_TOKEN_SECRET = "youraccesstokensecret";
const REFRESH_TOKEN_SECRET = "yourrefreshtokensecret";

let refreshTokens = [];

// Kullanıcı oturumu açma
app.post("/login", (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).send("Username is required");
  }

  const accessToken = jwt.sign({ username }, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ username }, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  refreshTokens.push(refreshToken);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // Geliştirme için false, üretimde true olmalı
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 gün
  });

  res.json({ accessToken });
});

// Access token ve refresh token yenileme
app.post("/token", (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    return res.sendStatus(403);
  }

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const accessToken = jwt.sign(
      { username: user.username },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const newRefreshToken = jwt.sign(
      { username: user.username },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    refreshTokens.push(newRefreshToken);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false, // Geliştirme için false, üretimde true olmalı
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 gün
    });

    res.json({ accessToken });
  });
});

// Kullanıcı çıkışı
app.post("/logout", (req, res) => {
  const { refreshToken } = req.cookies;
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  res.clearCookie("refreshToken");
  res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
