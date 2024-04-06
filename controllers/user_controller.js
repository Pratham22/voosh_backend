import { User } from "../models/index.js";
import * as apiResponse from "../helper/apiResponse.js";
import * as bcryptHelper from "../helper/bcrypt.js";
import * as utility from "../helper/utility.js";

// Function to handle user registration
async function registration(req, res) {
    try {
        const { email, password, confirm_password } = req.body;
        
        // Check if email already exists
        const emailcheck = await User.findOne({ email });
        if (emailcheck) {
            return apiResponse.errorResponse(res, "Email already exists");
        } else if (password !== confirm_password) {
            // Check if passwords match
            return apiResponse.validationErrorWithData(
                res,
                "Password doesn't match"
            );
        } else {
            // Hash the password and create user
            const hashedPassword = await bcryptHelper.hashPassword(password);
            req.body.password = hashedPassword;
            req.body.createdAt = new Date();
            req.body.updatedAt = new Date();
            delete req.body.confirm_password;

            await User.create(req.body);
            return apiResponse.successResponse(
                res,
                "User registered successfully"
            );
        }
    } catch (error) {
        return apiResponse.errorResponse(res, error.message);
    }
}

// Function to handle user login
async function loginUser(req, res) {
    try {
        const { googlekey, email, logintype, password } = req.body;

        // Social type login
        if (logintype === "google") {
            let user = await User.findOne({ email });

            if (!user) {
                // Create new user if not exists
                let userDetails = await User.create(req.body);
                const token = utility.generateJWTToken({
                    userId: userDetails._id,
                    email: userDetails.email,
                });
                userDetails = await User.findOneAndUpdate(
                    { _id: userDetails._id },
                    { $set: { token: token } },
                    { new: true, select: "name email token" }
                );
                return apiResponse.successResponseWithData(
                    res,
                    "Login successful",
                    userDetails
                );
            } else {
                // Validate social key
                const isSocialKeyValid = googlekey === user.googlekey;
                if (!isSocialKeyValid) {
                    return apiResponse.errorResponse(
                        res,
                        "Login with your social account"
                    );
                }
                // Generate token and update user
                const userId = user._id;
                var accessToken = utility.generateJWTToken({
                    userId,
                    email: user.email,
                });

                user = await User.findOneAndUpdate(
                    { _id: userId },
                    { $set: { token: accessToken } },
                    { new: true, select: "name email token" }
                );
                return apiResponse.successResponseWithData(
                    res,
                    "Login successful",
                    user
                );
            }
        } else {
            // Normal login type
            let user = await User.findOne({ email });
            if (!user) {
                return apiResponse.unauthorizedResponse(res, "User not found");
            }
            if (!password) {
                return apiResponse.notFoundResponse(
                    res,
                    "Password doesn't match"
                );
            }
            const isPasswordMatch = await bcryptHelper.comparePassword(
                password,
                user.password
            );

            if (!isPasswordMatch) {
                return apiResponse.unauthorizedResponse(
                    res,
                    "Password doesn't match"
                );
            }
            // Generate token and update user
            const userId = user._id;
            var accessToken = utility.generateJWTToken({
                userId,
                email: user.email,
            });
            user = await User.findOneAndUpdate(
                { _id: userId },
                { $set: { token: accessToken } },
                { new: true, select: "name email token" }
            );
            return apiResponse.successResponseWithData(
                res,
                "Login successful",
                user
            );
        }
    } catch (error) {
        return apiResponse.errorResponse(res, error.message);
    }
}

// Function to get all users
const getAllUsers = async (req, res) => {
    try {
        // Fetch all non-private users
        const users = await User.find(
            { isPrivate: false },
            "-password -token -isActive -isPrivate -lastlogin -createdAt -updatedAt -googlekey -role -__v"
        );

        return apiResponse.successResponseWithData(
            res,
            "Users retrieved successfully",
            users
        );
    } catch (error) {
        return apiResponse.errorResponse(res, error.message);
    }
};

// Function to get all users for admin
const getAllUsersAdmin = async (req, res) => {
    try {
        // Fetch all users for admin
        const users = await User.find(
            {},
            "-password -token -isActive -isPrivate -lastlogin -createdAt -updatedAt -googlekey -role -__v"
        );

        return apiResponse.successResponseWithData(
            res,
            "Users retrieved successfully",
            users
        );
    } catch (error) {
        return apiResponse.errorResponse(res, error.message);
    }
};

// Function to get user by ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        // Find user by ID
        const user = await User.findById(id);

        if (!user) {
            return apiResponse.notFoundResponse(res, "User not found");
        }
        const userObj = user.toObject();
        delete userObj.password;
        return apiResponse.successResponseWithData(
            res,
            "User details retrieved successfully",
            userObj
        );
    } catch (error) {
        return apiResponse.errorResponse(res, error.message);
    }
};

// Function to update user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, country, image } = req.body;
        // Find user by ID
        const user = await User.findById(id);

        if (!user) {
            return apiResponse.notFoundResponse(res, "User not found");
        }
        // Update user details
        user.name = name;
        user.country = country;
        user.image = image;
        user.updatedAt = new Date();
        await user.save();
        const userObj = user.toObject();
        delete userObj.password;
        return apiResponse.successResponseWithData(
            res,
            "User updated successfully",
            userObj
        );
    } catch (error) {
        return apiResponse.errorResponse(res, error.message);
    }
};

// Function to change user account type
const changeType = async (req, res) => {
    try {
        const { id } = req.params;
        // Find user by ID
        const user = await User.findById(id);
        if (!user) {
            return apiResponse.notFoundResponse(res, "User not found");
        }
        // Toggle account type
        user.isPrivate = !user.isPrivate;
        user.updatedAt = new Date();
        await user.save();
        const statusMessage = user.isPrivate ? "private" : "public";

        return apiResponse.successResponse(
            res,
            `User account status changes to ${statusMessage}`
        );
    } catch (error) {
        return apiResponse.errorResponse(res, error.message);
    }
};

// Export all functions
export {
    getAllUsers,
    getAllUsersAdmin,
    getUserById,
    registration,
    loginUser,
    updateUser,
    changeType,
};
