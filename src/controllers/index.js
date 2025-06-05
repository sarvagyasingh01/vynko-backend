import { adminLoginAPI, checkOtpMatchAPI, loginAPI, registerAPI, sendOTP, validateMobileAPI } from "./PublicAccessControllers.js";

const PublicAPI = {
  sendOtpAPI: sendOTP,
  checkOtpMatchAPI: checkOtpMatchAPI,
  registerAPI: registerAPI,
  loginAPI: loginAPI,
  validateMobileAPI: validateMobileAPI,
  adminLoginAPI: adminLoginAPI,
};

export { PublicAPI };
