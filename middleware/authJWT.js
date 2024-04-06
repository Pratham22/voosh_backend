import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import * as apiResponse from "../helper/apiResponse.js";

const secret = "voosh-secret-key";

const verifyToken = (req, res, next) => {
    try {
        const token = req.headers["authorization"];

        if (!token) {
            return apiResponse.notFoundResponse(res, "Unauthorized access");
        }

        jwt.verify(token, secret, async (err, decoded) => {
            if (err) {
                return apiResponse.unauthorizedResponse(
                    res,
                    "Unauthorized access"
                );
            }

            const userId = decoded.userId;

            const user = await User.findById(userId);

            if (!user) {
                return apiResponse.unauthorizedResponse(
                    res,
                    "Unauthorized access"
                );
            }

            req.userId = userId;
            next();
        });
    } catch (error) {
        return apiResponse.errorResponse(res, error.message);
    }
};

const verifyAdmin = async (req, res, next) => {
    try {
        const token = req.headers["authorization"];

        if (!token) {
            return apiResponse.notFoundResponse(res, "Unauthorized access");
        }

        jwt.verify(token, secret, async (err, decoded) => {
            if (err) {
                return apiResponse.unauthorizedResponse(
                    res,
                    "Unauthorized access"
                );
            }

            const userId = decoded.userId;

            const user = await User.findById(userId);
            if (!user || user.role !== "admin") {
                return apiResponse.unauthorizedResponse(
                    res,
                    "Unauthorized access"
                );
            }

            req.userId = userId;
            next();
        });
    } catch (error) {
        // console.error("Error during admin verification:", error.message);
        return apiResponse.errorResponse(res, error.message);
    }
};

export { verifyToken, verifyAdmin };
