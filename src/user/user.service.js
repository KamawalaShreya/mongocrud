import commonService from "../../utils/commonServices";
import User from "../../model/User";
import AuthHelper from "../common/auth.helper";
import Otp from "../../model/Otp";
import sendMail from "../common/middlewares/sendMail";
import { PreconditionFailedException } from "../error-exceptions";
import { BCRYPT } from "../common/constants/constants";
import bcrypt from "bcryptjs";

class UserService {

    /**
     * User data
     * @param {*} data
     * @returns
     */

    static async index(data) {
        let query;
        // if(data.id) {
        //     query = {
        //         _id : data.id
        //     }
        // } else {
            query = {
                _id : data.user._id
            }
        // }

        const users = await commonService.findOne(User, query);

        return users;
    }

    /**
     * User data
     * @param {*} data
     * @returns
     */
    static async forgotPassword(data) {
        const checkExistEmail = await commonService.findOne(User, { email : data.email });

        if(!checkExistEmail) {
            throw new PreconditionFailedException("User not exist with this email address.");
        }

        const generateOTP = await AuthHelper.generateOTP();
        
        const obj = {
            to: data.email,
            subject: `Welcome To ${process.env.APP_NAME}`,
            otp : generateOTP,
            type : 2
        };

        const send = await sendMail(obj, "otp-mail");

        let otp;
        if(send) {
            otp = await commonService.createOne(Otp, {
                email : data.email,
                otp : generateOTP,
                type : data.type
            });
            await commonService.updateOne(User,
                { _id : checkExistEmail._id }, 
                { isForgotPasswordVerified : false }
            );
        }


    }

    /**
     * Reset Password data
     * @param {*} data
     * @returns
     */
    static async resetPassword(data) {
        const checkExistUser = await commonService.findOne(User, { email : data.email, isForgotPasswordVerified : true });

        if(!checkExistUser) {
            throw new PreconditionFailedException("Can't find this user.")
        }

        const newPass = await bcrypt.hash(data.newPassword,  BCRYPT.SALT_ROUND);
        await commonService.updateOne(User, { _id : checkExistUser._id }, { password : newPass});
        // await commonService.updateOne()
    }
}

export default UserService;