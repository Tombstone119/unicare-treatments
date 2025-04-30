import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        role: string;
      };
    }
  }
}

type JwtPayload = { _id: string; role: string };

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }
  try {
    const secret = process.env.ACCESS_TOKEN_SECRET || "";
    const decoded = jwt.verify(token, secret);
    req.user = decoded as JwtPayload;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token." });
    return;
  }
};

// You can also create role-based middleware
export const authorizeRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Not authenticated" });
      return;
    }

    // You'll need to fetch the user's role from the database
    // For example:
    const userId = req.user._id;
    // Assume there's a service method to get user by ID
    try {
      // This would be your actual service call
      // const user = await userService.findUserById(userId);

      // For now, let's simulate this part
      const user = { role: "admin" }; // Replace with actual implementation

      if (roles.includes(user.role)) {
        next();
      } else {
        res.status(403).json({
          success: false,
          message: "You don't have permission to perform this action",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error verifying user role",
      });
    }
  };
};
