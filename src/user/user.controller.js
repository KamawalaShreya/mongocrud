import UserService from "./user.service";

class UserController {
    /**
     * Users Data
     * @param {*} req
     * @param {*} res
     */
    static async index(req, res) {
        
        const data = [];

        // data.id = req.query._id;
        data.user = req.user;
       
        const users = await UserService.index(data);

        res.send({ data : users });
    }

    /**
     * Forgot Password Data
     * @param {*} req
     * @param {*} res
     */
    static async forgotPassword(req, res) {
        const data = req.body;
        
        await UserService.forgotPassword(data);

        return res.send({ message : "OTP sent to your email. Please check your inbox." });
    }

    static async resetPassword(req, res) {
        const data = req.body;
        
        await UserService.resetPassword(data);

        return res.send({ message : "Your Password reset successfully." });
    }
        
}

export default UserController;