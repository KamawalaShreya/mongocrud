import AuthService from "./auth.service";
import GetUserResource from "./resources/getUser.resource";
const expiresInSeconds = 31536000;

class AuthController {
    /**
     * User Register
     * @param {*} req
     * @param {*} res
     */
    static async register(req, res) {
      const data = [];
      data.reqData = req.body;
      data.file = req.file;
      const registerUser = await AuthService.register(data); 

      return res.send({
          data: {
            ...new GetUserResource(registerUser),
            // auth: {
            //   tokenType: "Bearer",
            //   accessToken: registerUser.token,
            //   refreshToken: null,
            //   expiresIn: expiresInSeconds,
            // },
          },
      });
    }

    /**
     * Verify Otp
     * @param {*} req
     * @param {*} res
     */
    static async verifyOtp(req, res) {
      const data = [];
      data.reqData = req.body;

      const verifyOtp = await AuthService.verifyOtp(data);

      console.log(verifyOtp);
      return res.send({
        data: {
          auth: {
            tokenType: "Bearer",
            accessToken: verifyOtp,
            refreshToken: null,
            expiresIn: expiresInSeconds,
          },
        },
    });
    }

    /**
     * Resend Otp
     * @param {*} req
     * @param {*} res
     */
    static async resendOtp(req, res) {
      const data = req.body;

      const resendOtp = await AuthService.resendOtp(data);

      return res.send({ message : "OTP sent to your email. Please check your inbox." });

    }

    /**
     * User Register
     * @param {*} req
     * @param {*} res
    */
    static async login(req, res) {
      
      const loginUser = await AuthService.login(req.body);

      return res.send({
        data: {
          ...new GetUserResource(loginUser),
          auth: {
            tokenType: "Bearer",
            accessToken: loginUser.token,
            refreshToken: null,
            expiresIn: expiresInSeconds,
          },
        },
    });
    }

    /**
     * Fcm Token
     * @param {*} req
     * @param {*} res
    */
    static async addFcmToken(req, res) {
      const data = [];
      data.user = req.user;
      data.reqData = req.body;
      const token = await AuthService.addFcmToken(data)

      res.send({ data : token });
    }

}

export default AuthController;