const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {

    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
};


// REGISTER
const register = async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;

        if (
            !name ||
            !email ||
            !password
        ) {
            return res.status(400).json({
                message:
                    "Name, email and password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message:
                    "Password must contain at least 6 characters"
            });
        }

        const existingUser =
            await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message:
                    "User already exists"
            });
        }

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );

        const user =
            await User.create({
                name,
                email,
                password: hashedPassword
            });

        const token =
            generateToken(user._id);

        res.status(201).json({
            message:
                "Registration successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};


// LOGIN
const login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        const user =
            await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message:
                    "Invalid email or password"
            });
        }

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordMatch) {
            return res.status(401).json({
                message:
                    "Invalid email or password"
            });
        }

        const token =
            generateToken(user._id);

        res.json({
            message: "Login successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};


// PROFILE
const getProfile = async (
    req,
    res
) => {

    try {

        const user =
            await User.findById(
                req.user
            ).select("-password");

        res.json(user);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    register,
    login,
    getProfile
};