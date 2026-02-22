import jwt from "jsonwebtoken";
import { config } from "#config";

// Access Token 생성 (15분 유효)
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      nickname: user.nickname,
      email: user.email,
    },
    config.JWT_ACCESS_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

// Refresh Token 생성 (7일 유효)
export const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user.id },
    config.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// Access Token + Refresh Token 동시 생성
export const generateTokens = (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  return { accessToken, refreshToken };
};

// 토큰 검증
export const verifyToken = (token, tokenType = "access") => {
  try {
    const secret =
      tokenType === "access"
        ? config.JWT_ACCESS_SECRET
        : config.JWT_REFRESH_SECRET;
    
    // secret이 설정되지 않았을 경우를 대비한 방어 코드
    if (!secret) {
      throw new Error("JWT Secret is not defined in config.");
    }

    return jwt.verify(token, secret);
  } catch (error) {
    // 토큰 만료 시에는 에러 메시지만 출력하고 null 반환
    console.error("Token verification error:", error.message);
    return null;
  }
};