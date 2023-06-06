import User from "../../model/User";
import commonService from "../../utils/commonServices";
import { randomStringGenerator } from "../common/helper";
import { BadRequestException, ConflictException, ForbiddenException, NotFoundException, PreconditionFailedException, UnprocesssableEntityException } from "../error-exceptions";
import AuthHelper from "../common/auth.helper";
import sendMail from "../common/middlewares/sendMail";
import Otp from "../../model/Otp";
import { OTPTYPE } from "../common/constants/constants";
import FcmToken from "../../model/FcmToken";
const moment = require('moment');

class AuthService {
    /**
     * Register data
     * @param {*} data
     * @returns
     */
    static async register(data) {

        if(data.file) {
            data.reqData.profileImage = data.file.destination + "/" + data.file.filename;
        }

        const checkExistEmail = await commonService.findOne(User, { email : data.reqData.email });
        
        if(checkExistEmail) {
            throw new ConflictException("Email already in use.");
        }

        const checkExistPhoneNo = await commonService.findOne(User, { phoneNo : data.reqData.phoneNo });
        
        if(checkExistPhoneNo) {
            throw new ConflictException("Phone No. already in use.");
        }

        const registerUser = await commonService.createOne(User, data.reqData);

        // const randomString = randomStringGenerator();

        // const token = await AuthHelper.tokenGenerator({
        //     id: registerUser.id,
        //     jti: randomString,
        // });

        // await AuthHelper.storeAccessToken(registerUser, randomString);

        // registerUser.token = token;
    
        const generateOTP = await AuthHelper.generateOTP();
        
        const obj = {
            to: registerUser.email,
            subject: `Welcome To ${process.env.APP_NAME}`,
            otp : generateOTP,
            type : OTPTYPE.REGISTRATION_OTP
        };

        const send = await sendMail(obj, "otp-mail");

        if(send) {
            await commonService.createOne(Otp, {
                email : registerUser.email,
                otp : generateOTP,
                type : OTPTYPE.REGISTRATION_OTP
            });
        }
       
        return registerUser;

    }

    /**
     * Verify OTP data
     * @param {*} data
     * @returns
     */

    static async verifyOtp(data) {
       const checkExistOTP = await commonService.findOne(Otp, { email : data.reqData.email, otp : data.reqData.otp, type : data.reqData.type });
       let registerUser;

        if(!checkExistOTP) {
            throw new NotFoundException("Invalid Otp.");
        }
     
        const pastDate = moment(checkExistOTP.created_at, 'YYYY-MM-DD HH:mm:ss');
        const presentDate = moment(); // Current date and time
        const duration = moment.duration(presentDate.diff(pastDate));
        const diffInMinutes = duration.asMinutes();

        if(diffInMinutes > 1) {
            await commonService.updateOne(Otp, { _id : checkExistOTP._id }, { isExpired : 1 });
            throw new ForbiddenException("Otp expired.");
        } else {
            registerUser = await commonService.findOne(User, { email : data.reqData.email });
            if( OTPTYPE.REGISTRATION_OTP == data.reqData.type ) {
                const isVerified = await commonService.updateOne(User, { _id : registerUser.id }, { isVerified : 1 });

                if(isVerified) {
                    const randomString = randomStringGenerator();
    
                    const token = await AuthHelper.tokenGenerator({
                        id: registerUser.id,
                        jti: randomString,
                    });
    
                    await AuthHelper.storeAccessToken(registerUser, randomString);
    
                    return token;
                }
            } else if( OTPTYPE.FORGOT_PASSWORD == data.reqData.type ) {
                const isForgotPasswordVerified = await commonService.updateOne(User, { _id : registerUser.id }, { isForgotPasswordVerified : 1 });

                return "OTP verified successfully.";
            }
          
        }

        
    }

    /**
     * Resend OTP data
     * @param {*} data
     * @returns
     */
    static async resendOtp(data) {
        const checkExistEmail = await commonService.findOne(User, { email : data.email });

        if(!checkExistEmail) {
            throw new PreconditionFailedException("User not exist with this email address.");
        } else if(checkExistEmail.isVerified == true && data.type != OTPTYPE.FORGOT_PASSWORD) {
            throw new ForbiddenException("Already Verified.");
        }
        const generateOTP = await AuthHelper.generateOTP();
        
        if(data.type == OTPTYPE.FORGOT_PASSWORD) {
            await commonService.updateOne(User, { _id : checkExistEmail._id }, { isForgotPasswordVerified : false });
        }
        const obj = {
            to: data.email,
            subject: `Welcome To ${process.env.APP_NAME}`,
            otp : generateOTP,
            type : data.type
        };

        const send = await sendMail(obj, "otp-mail");

        let otp;
        if(send) {
            otp = await commonService.createOne(Otp, {
                email : data.email,
                otp : generateOTP,
                type : data.type
            });
        }

        return otp;
    }

    /**
     * Login data
     * @param {*} data
     * @returns
     */
    static async login(data) {
        const checkExistUser = await commonService.findOne(User, { email : data.email });

        if(!checkExistUser) {
            throw new PreconditionFailedException("User not exist.");
        } else if(checkExistUser.isVerified != true) {
            throw new UnprocesssableEntityException("User not verified yet.");
        }

        const checkPassword = await checkExistUser.isPasswordMatch(data.password);
        if(!checkPassword) {
            throw new BadRequestException("Password mismatched.");
        } 

        const randomString = randomStringGenerator();

        const token = await AuthHelper.tokenGenerator({
            id: checkExistUser.id,
            jti: randomString,
        });

        await AuthHelper.storeAccessToken(checkExistUser, randomString);
        checkExistUser.token = token;
        return checkExistUser;
    }

    
    /**
     * Fcm Token data
     * @param {*} data
     * @returns
     */
    static async addFcmToken(data) {
        const authUser = data.user;
        const { deviceId, token, platform } = data.reqData;
      
        const fcmToken =  await commonService.findOne(FcmToken, { userId: authUser._id, deviceId });
        // await commonService.findOne(FcmToken, { userId: authUser._id, deviceId });
        if (!fcmToken) {
            // return await FcmToken.create({
            //   token,
            //   deviceId,
            //   userId: authUser._id,
            //   platform,
            // });
            return await commonService.createOne(FcmToken, {
                token,
                deviceId,
                userId: authUser._id,
                platform
            })
          }
        
        return FcmToken.updateOne(
            { userId: authUser._id, deviceId },
            {
                token,
                deviceId,
            }
        );
      
    }

}

export default AuthService;