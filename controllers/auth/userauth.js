const { OAuth2Client } = require("google-auth-library");
const User = require("../../models/user");
const UserToken = require("../../models/usertoken");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const { errorCodes } = require("../../utils/constants");
const { generateTokens } = require("./utils");
const { googleAuthBodyValidation } = require("./validateuser");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleAuth = catchAsync(async (req, res, next) => {
    const { error } = googleAuthBodyValidation(req.body);
    if (error) {
        return next(
            new AppError(
                error.details[0].message,
                400,
                errorCodes.INPUT_PARAMS_INVALID
            )
        );
    }

    
    const token = req.body.token;
    const emailFromClient = req.body.email;
    
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    if (!ticket) {
        console.log(ticket,"+++hit1");
        return next(
            new AppError(
                "Please SignOut and SignIn Again",
                401,
                errorCodes.INVALID_TOKEN
            )
        );
    }

    const { email } = ticket.getPayload();
    if (email !== emailFromClient) {
        console.log(ticket,"+++hit2");
        return next(
            new AppError(
                "Please SignOut and SignIn Again",
                401,
                errorCodes.INVALID_TOKEN
            )
        );
    }

    const user = await User.findOne({ email: emailFromClient });
   
    if (!user) {
        await new User({
            email: emailFromClient,
            hasFilledDetails: false,
            firstName: null,
            lastName: null,
            regNo: null,
            mobileNumber: null,
            teamId: null,
        }).save();

        const user = await User.findOne({ email: emailFromClient });
        const { accessToken, refreshToken } = await generateTokens(user);

        return res.status(201).json({
            message: "User SignUp Succesfull",
            accessToken,
            refreshToken,
        });
    }
    // if(!user){
    //     return res.status(404).json({
    //         message:"Registrations are closed."
    //     })
    // }
    const { accessToken, refreshToken } = await generateTokens(user);
    console.log(accessToken);
    res.status(200).json({
        message: "Logged in sucessfully",
        accessToken,
        refreshToken,
    });
});

exports.logout = catchAsync(async (req, res, next) => {
    const { error } = refreshTokenBodyValidation(req.body);
    if (error) {
        return next(
            new AppError(
                error.details[0].message,
                400,
                errorCodes.INPUT_PARAMS_INVALID
            )
        );
    }

    const userToken = await UserToken.findOne({ token: req.body.refreshToken });
    if (!userToken) {
        return new AppError(
            "Please SignOut and SignIn Again",
            401,
            errorCodes.INVALID_TOKEN
        );
    }
    await userToken.deleteOne();
    res.status(200).json({ message: "Logged Out Sucessfully" });
});
