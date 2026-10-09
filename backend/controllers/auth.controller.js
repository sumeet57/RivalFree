import {
  googleAuthService,
  guestAuthService,
} from "../services/auth.service.js";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse, ApiError } from "../utils/api-response.js";

export const handleGoogleAuth = asyncHandler(async (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    throw new ApiError(400, "Access token is required");
  }

  const user = await googleAuthService(accessToken);

  req.session.userId = user._id;

  await new Promise((resolve, reject) => {
    req.session.save((err) => {
      if (err) return reject(new ApiError(500, "Failed to save session"));
      resolve();
    });
  });

  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  };

  return new ApiResponse(200, "Authentication successful", userData).send(res);
});

export const handleGuestAuth = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await guestAuthService(email);

  req.session.userId = user._id;

  await new Promise((resolve, reject) => {
    req.session.save((err) => {
      if (err) return reject(new ApiError(500, "Failed to save session"));
      resolve();
    });
  });

  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  };

  return new ApiResponse(200, "Guest authentication successful", userData).send(
    res,
  );
});

export const handleLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(new ApiError(500, "Failed to logout"));
    }
    res.clearCookie("connect.sid");
    return new ApiResponse(200, "Logged out successfully").send(res);
  });
};

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.session.userId).select(
    "-googleId -__v -createdAt -updatedAt",
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return new ApiResponse(200, "User fetched successfully", user).send(res);
});
