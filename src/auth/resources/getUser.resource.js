import { baseUrl } from "../../common/config/constant.config";


export default class GetUserResource {
    constructor(data) {
      this._id = data._id;
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.profileImage = data.profileImage ? baseUrl(data.profileImage) : null;
      this.email = data.email;
      this.phoneNo = data.phoneNo;
      this.isVerified = data.isVerified;
    }
  }