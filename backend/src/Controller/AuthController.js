import User from "../Modal/User.js";
import response from "../Utils/ResponseHandler/ResponseHandler.js";
import ResTypes from "../Utils/ResponseHandler/ResTypes.js";
import bcrypt from "bcryptjs";
import generateToken from "../Utils/Token/generateToken.js";


class AuthController {

    //create SignUp
    signUp = async (req, res) => {
        const { name, email, password } = req.body;
        try {
            const existing = await User.findOne({ email })
            if (existing) return response(res, 403, ResTypes.errors.user_exists)

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new User({ name, email, password: hashedPassword })
            const createdUser = await user.save()
            if (createdUser) return response(res, 201, ResTypes.successMessages.user_created)
        } catch (error) {
            return response(res, 500, error)
        }
    }
    //create SignIn
    signIn = async (req, res) => {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email })
            if (!user) {
                return response(res, 404, ResTypes.errors.no_user);
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return response(res, 403, ResTypes.errors.invalid_password)
            }
            const token = generateToken(user)
            return response(res, 201, { email, token, role: user.role, ...ResTypes.successMessages.login_successful })
        } catch (error) {
            console.error(error)
            return response(res, 500, error)
        }
    }
    // Forgot Password
    forgotPassword = async (req, res) => {
        const { nic, newPassword } = req.body;
        try {
            const user = await User.findOne({ nic });
            if (!user) {
                return response(res, 404, {message:"password reseted"});
            }
            // Generate new hashed password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            // Update user's password
            user.password = hashedPassword;
            await user.save();
            return response(res, 200, {message:"password reseted"});
        } catch (error) {
            console.error(error);
            return response(res, 500, error);
        }
    }
}

export default AuthController = new AuthController()