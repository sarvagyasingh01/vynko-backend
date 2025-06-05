import express from "express";
import { PublicAPI } from "../controllers/index.js";
const router = express.Router();
// router.post("/addPopUp",PublicAPI.postPopUp )
// router.get("/getPopUp/:device", PublicAPI.getPopUp);
// router.get("/findAllPopUp",PublicAPI.getAllPopUp)
// router.post('/addSpecificUser',PublicAPI.addSpecificUser)
// router.get("/findAllSpecificUsers",PublicAPI.getAllSpecificUsers)
// router.post("/addSpecificUserWithdrawAmount",PublicAPI.addSpecificUserMinWithdrawAmount)
// router.get("/findAllSpecificUserMinWithdraw",PublicAPI.getAllSpecificUsersMinWithdraw)
// router.post("/updatePremiumWithdraw",PublicAPI.addPremiumPlusWithdrawAmount)
// router.post("/updatePremiumPlusWithdrawCharge",PublicAPI.changeWithdrawChargeForPremiumPlus)
// triplesols apix

// router.post("/checkLogin", PublicAPI.checkIsLoggedIn);
// router.get("/fetch_team_info", PublicAPI.fetchTeamInfoAPI);
// router.get("/fetch_interns_info", PublicAPI.fetchInternsInfoAPI);
// router.post("/example_message", PublicAPI.exampleMessageControllerAPI);
// router.get("/example_message", PublicAPI.fetchExampleMessageAPI);

// router.get("/", PublicAPI.rootAPI);
// router.get("/health", PublicAPI.healthAPI);
// router.get("/sponsorid", PublicAPI.validateSponsorIdAPI);
// router.get("/validate_username", PublicAPI.validateUsernameAPI);
// router.get("/validate_email", PublicAPI.validateEmailAPI);
// router.get("/validate_mobile", PublicAPI.validateMobileAPI);

// router.post("/login", PublicAPI.loginAPI);
// router.post("/google_login", PublicAPI.googleLogin);
// router.post("/login-with-mobile", PublicAPI.loginWithMobileAPI);
// router.post("/register", PublicAPI.registerAPI);
// router.post("/mobile_register", PublicAPI.mobileRegister);

// router.get(
//   "/find_mobile_no_in_database",
//   PublicAPI.findMobileNumberOnDatabaseAPI
// );
router.post("/send-otp", PublicAPI.sendOtpAPI);
router.post("/check-otp-match", PublicAPI.checkOtpMatchAPI);
router.post("/register", PublicAPI.registerAPI);
router.post("/login", PublicAPI.loginAPI);
router.get("/validate_mobile", PublicAPI.validateMobileAPI);
// router.post("/check-email-otp-match", checkEmailOtpMatchAPI);

router.post("/admin-login", PublicAPI.adminLoginAPI);

export { router };
