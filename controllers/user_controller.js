import { User } from "../models/index.js";
import * as apiResponse from "../helper/apiResponse.js";
import * as bcryptHelper from "../helper/bcrypt.js";
import * as utility from "../helper/utility.js";

async function registration(req, res) {
    try {
        const { email, password, confirm_password } = req.body;
        const emailcheck = await User.findOne({ email });
        if (emailcheck) {
            return apiResponse.errorResponse(res, "Email already exists");
        } else if (password !== confirm_password) {
            return apiResponse.validationErrorWithData(
                res,
                "Password doesn't match"
            );
        } else {
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

async function loginUser(req, res) {
    try {
        const { googlekey, email, logintype, password } = req.body;

        // Social type login
        if (logintype === "google") {
            let user = await User.findOne({ email });

            if (!user) {
                let userDetails = await User.create(req.body);
                const token = utility.generateJWTToken({
                    userId: userDetails._id,
                    email: userDetails.email,
                });
                userDetails = await User.findOneAndUpdate(
                    { _id: userDetails._id },
                    { $set: { token: token } },
                    { new: true, select: 'name email token'}
                );
                return apiResponse.successResponseWithData(
                    res,
                    "Login successful",
                    userDetails
                );
            } else {
                const isSocialKeyValid = googlekey === user.googlekey;
                if (!isSocialKeyValid) {
                    return apiResponse.errorResponse(
                        res,
                        "Login with your social account"
                    );
                }
                const userId = user._id;
                var accessToken = utility.generateJWTToken({
                    userId,
                    email: user.email,
                });

                user = await User.findOneAndUpdate(
                    { _id: userId },
                    { $set: { token: accessToken } },
                    { new: true, select: 'name email token'  }
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
            const userId = user._id;
            var accessToken = utility.generateJWTToken({
                userId,
                email: user.email,
            });
            user = await User.findOneAndUpdate(
                { _id: userId },
                { $set: { token: accessToken } },
                { new: true, select: 'name email token' }
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

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});

        // // Map over each user to process and format data
        // const updatedUsersList = await Promise.all(
        //   users.map(async (user) => {
        //     const userObj = user.toObject({ versionKey: false });
        //     delete userObj.password;
        //     delete userObj.token;
        //     delete userObj.lastlogin;
        //     delete userObj.googlekey;
        //     delete userObj.role;
        //     delete userObj.sortingKey;

        //     // Check and process user image
        //     if (userObj.image && userObj.image.split("/")[0] === process.env.S3_PATH) {
        //       userObj.image = await cachePresignedUrl(
        //         userObj.image,
        //         userCache,
        //         `userImage_${user._id}`
        //       );
        //     }
        //     return userObj;
        //   })
        // );

        return apiResponse.successResponseWithData(
            res,
            "Users retrieved successfully",
            users
        );
    } catch (error) {
        return apiResponse.errorResponse(res, error.message);
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.body;
        const user = await User.findById(id);

        if (!user) {
            return apiResponse.notFoundResponse(res, "User not found");
        }
        if (user.image) {
            if (user.image.split("/")[0] == process.env.S3_PATH) {
                user.image = await cachePresignedUrl(
                    user.image,
                    userCache,
                    `userImage_${user._id}`
                );
            }
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

export { getAllUsers, getUserById, registration, loginUser };
