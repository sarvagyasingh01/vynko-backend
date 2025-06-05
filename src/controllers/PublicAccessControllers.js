import {
  createJWT,
  encryptPassword,
  verifyJWT,
  verifyPassword,
} from "../helpers/AuthHelpers.js";
import { OTP } from "../models/otp/otpSchema.js";
import { r } from "../helpers/ResponseHelper.js";
import { Users } from "../models/users/UsersSchema.js";
import { getIstTime } from "../config/getTime.js";
import GenerateUserId from "../config/generateUserId.js";

const sendOTP = async (req, res) => {
  let post = req.body;
  let mobile = String(post?.mobile).trim();
  const quire1 = `+91${mobile}`;
  const quire2 = `91${mobile}`;
  // const quire1 = `+91${mobile}`;
  // if (!mobile.startsWith("+91")) {
  //   return res.status(400).json({ message: "please Provide Valid Number" });
  // }

  function generateRandomNumber() {
    return Math.floor(1000 + Math.random() * 9000);
  }
  let randomOTP = generateRandomNumber();
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        "Access-Control-Allow-Origin": "*",
        authorization:
          "zf8GmUYMrSH7y61LvwuFOQVD5RjIAp0oaJskT34cZ9lXi2gKxWhaXyjbfRNI9qSrAHQopDezuwBPWVL0",
        // "Fiad0RKEAwYHVkWtTCqBnQohlImxsz4Zj3p6P9M1gJcvyXLrNSqVM16cOnyk9XYHDthvjJIba3eRoslA",
      },
    };
    const requestBody = {
      route: "otp",
      variables_values: randomOTP,
      numbers: post?.mobile,
    };

    const find = await OTP.findOne({
      $or: [{ mobile: quire1 }, { mobile: quire2 }],
      $or: [{ mobile }],
    });
    // console.log({ find });
    if (!!find) {
      const updateOtp = await OTP.findOneAndUpdate(
        { $or: [{ mobile: quire1 }, { mobile: quire2 }] },
        {
          $set: {
            lastOtp: randomOTP,
          },
        },
        { new: true }
      );
    } else {
      const updateOtp = await OTP.create({
        mobile: quire1,
        lastOtp: randomOTP,
      });
    }
    // const result = await axios.post(
    //   "https://www.fast2sms.com/dev/bulkV2",
    //   requestBody,
    //   config
    // );
    // const response = {
    //   data: result?.data,
    // };
    return r.rest(
      res,
      true,
      "OTP Sent Successfully!"
      //  response
    );
  } catch (e) {
    console.log(e);
    console.log(e?.response?.data);
    return r.rest(res, false, "OTP Not Sent!", e?.response?.data);
  }
};

const checkOtpMatchAPI = async (req, res) => {
  const mobile = String(req.body.mobile).trim();
  const otp = String(req.body.otp).trim();
  const quire1 = `91${mobile}`;
  const quire2 = `+91${mobile}`;
  const quire3 = mobile?.slice(2, 13);
  const quire4 = mobile;
  const quire5 = `+91${mobile?.slice(2, 13)}`;
  if (!!mobile) {
    const account = await OTP.findOne({
      $or: [
        { mobile: quire1 },
        { mobile: quire2 },
        { mobile: quire3 },
        { mobile: quire4 },
        { mobile: quire5 },
      ],
    }).sort({ createdAt: -1 });
    // console.log({ account });
    if (account.isDeleted) {
      return res.status(403).json({
        message: "Your account has been Deleted.",
      });
    }
    if (account?.lastOtp !== otp) {
      return r.rest(res, false, "OTP does not match!");
    } else {
      return r.rest(res, true, "OTP matched!");
    }
  }
};

const validateMobileAPI = async (req, res) => {
  let mobile = String(req.query.mobile).trim();
  const variations = [
    mobile,
    `+${mobile}`,
    `+91${mobile}`,
    // `91${mobile}`,
    // normalizedMobile.length === 12 && normalizedMobile.startsWith('91') ? normalizedMobile.slice(2) : normalizedMobile,
  ];
  const account = await Users.findOne({
    mobile: { $in: variations },
    // mobile: mobile
  });
  if (mobile.length == 0) {
    return r.rest(res, false, `Invalid mobile!`, null);
  } else if (!account) {
    return r.rest(res, true, `Mobile available!`, null);
  } else {
    return r.rest(res, false, `Mobile taken!`, null);
  }
};

const registerAPI = async (req, res) => {
  try {
    let post = req.body;
    // if (post.password) {
    //   let encryptedpassword = encryptPassword(post.password);

    //   post = {
    //     ...post,
    //     password: encryptedpassword,
    //   };
    // } else {
    //   return r.rest(res, false, "Password must be provided ");
    // }
    if (!post.otp) {
      return r.rest(res, false, "OTP must be provided ");
    }

    const account = await OTP.findOne({
      mobile: post.mobile,
    }).sort({ createdAt: -1 });

    if (account?.lastOtp !== post.otp) {
      return r.rest(res, false, "OTP does not match!");
    }

    post.join_date = new Date().getTime();
    let totalUsers = await Users.countDocuments();
    //console.log("users",totalUsers);

    let email_exist = await Users.findOne({ email: post.email });
    let mobile_exist = await Users.findOne({ mobile: post.mobile });

    const id = await GenerateUserId();

    if (!id || id == -1) {
      console.log("Error generating user id");
      return r.rest(res, false, "Internal Server Error");
    }

    if (email_exist) {
      return r.rest(res, false, "Email already exist");
    } else if (mobile_exist) {
      return r.rest(res, false, "Mobile already exist");
    } else if (!email_exist && !mobile_exist) {
      // try {
      post.userId = id;
      post.isEmailVerified = true;
      post.registerVia = req.body.androidApp ? "app-email" : "website-email";
      post.join_date = new Date(getIstTime().date).getTime();
      post.date = new Date(getIstTime().date).toDateString();
      post.join_time = getIstTime().time;
      post.userindex = totalUsers;
      const user = new Users(post);
      const createUser = await user.save();

      if (createUser) {
        let token = createJWT({
          email: createUser.email,
          mobile: createUser.mobile,
          id: createUser._id,
        });
        createUser.token = token;
        await createUser.save();

        const done = await user.save();
        // User signup tpToken bonus
        // await Wallet.create({
        //   username,
        // });

        // sendVerificationMail(res, createUser);
        return r.rest(res, true, "Register Success!", {
          first_name: createUser.first_name,
          token: token,
          full_name: `${createUser.first_name} ${createUser.last_name}`,
        });
      } else {
        return r.rest(res, false, "Failed to create account at the moment!");
      }
    } else {
      return r.rest(res, false, "User Already Present!");
    }
  } catch (error) {
    console.log(error);
  }
};

const mobileRegister = async (req, res) => {
  try {
    const { date, time } = getIstTime();
    if (req.body.sponsorid) {
      const checkSponsorid = await Users.findOne({
        username: req.body.sponsorid,
      });
      if (!checkSponsorid) {
        return r.rest(res, false, "Invalid sponsor id");
      }
    }
    const checkMobile = await Users.findOne({
      mobile: req.body.mobile,
    });
    if (checkMobile) {
      return r.rest(res, false, "Already exist mobile");
    }

    const { mobile, first_name, sponsorid, last_name } = req.body;

    const userExists = await Users.findOne({ mobile: mobile });

    if (userExists) {
      if (userExists.isDeleted) {
        return res.status(403).json({
          message: "Your account has been Deleted.",
        });
      }
      // generate token only
      const token = createJWT({
        mobile: userExists.mobile,
        username: userExists.username,
        id: userExists._id,
      });

      return res.status(200).json({
        username: userExists.username,
        first_name: userExists.first_name,
        token: token,
        full_name: `${userExists.first_name} ${userExists.last_name}`,
        message: "Login success",
        isLoggedIn: true,
      });
    } else {
      // Create account and generate token
      let username;
      let password;
      let isUsernameUnique = false;
      let isMobileUnique = false;
      while (!isUsernameUnique && !isMobileUnique) {
        username = generateRandomUsername(first_name, last_name);
        const isUserExists = await Users.findOne({ username: username });
        const isMobileExists = await Users.findOne({
          mobile: req.body.mobile,
        });

        if (!isUserExists) {
          isUsernameUnique = true;
        }

        if (!isMobileExists) {
          isMobileUnique = true;
        }
      }

      password = generateRandomPassword();
      const sponsor = await Users.findOne({ username: sponsorid });
      console.log({ sponsor });
      const sponsor_name = `${sponsor?.first_name} ${sponsor?.last_name}`;
      // console.log({ password });
      const withDrawalCharges = await WithdrawCharge.findOne({});

      const endDatePremium = getIstTimeAddDays(
        withDrawalCharges.premium_discount_days
      );
      const endDatePremiumPlus = getIstTimeAddDays(
        withDrawalCharges.premium_plus_discount_days
      );

      let totalUsers = await Users.countDocuments();
      const user = await Users.create({
        sponsorid: req.body.sponsorid || "taskplanet",
        sponsor_name: sponsor ? sponsor_name : "Taskplanet Official",
        username: username,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: encryptPassword(password),
        mobile: req.body.mobile,
        // email: null,
        verified: true,
        registerVia: req.body.androidApp ? "app-mobile" : "website-mobile",
        userindex: totalUsers,
        userDepositAddress: generateHDWallet(totalUsers),
        join_date: new Date(getIstTime().date).getTime(),
        date: new Date(getIstTime().date).toDateString(),
        join_time: getIstTime().time,
        premium_discount_end_date: endDatePremium,
        premium_plus_discount_end_date: endDatePremiumPlus,
      });
      // console.log({ user });
      const { self_register } = await ManageReferral.findOne({
        charge_create_id: "taskplanet_manage_referral",
      });
      await DistributePoints(user.username, self_register, "Register");
      await giveRegisterReferralPoint(user.username);

      if (user) {
        // generate token only
        const token = createJWT({
          mobile: user.mobile,
          username: user.username,
          id: user._id,
        });

        await Wallet.create({
          username: user.username,
        });
        const updatedData = await addReferralLevels(user.username);

        if (!updatedData) {
          return res.status(500).json({
            success: false,
            message: "Internal server issue",
          });
        }

        await Users.findOneAndUpdate(
          { username: user.username },
          { $set: { isMobileVerified: true } }
        );

        await giveUserRegisterReferralPoints(user.username);

        return res.status(200).json({
          username: user.username,
          mobile: user.mobile,
          first_name: user.first_name,
          token: token,
          full_name: `${user.first_name} ${user.last_name}`,
          message: "Account created successfully",
        });
      }
    }
    // return res.status(200).json(payload);
  } catch (error) {
    console.log(error);
    return r.rest(res, false, "Something went wrong");
  }
};

const loginAPI = async (req, res) => {
  const mobile = String(req.body.mobile).trim();
  const otp = String(req.body.otp).trim();

  const quire1 = `91${mobile}`;
  const quire2 = `+91${mobile}`;
  const quire3 = mobile?.slice(2, 13);
  const quire4 = mobile;
  const quire5 = `+91${mobile?.slice(2, 13)}`;
  if (!!mobile) {
    const otpInfo = await OTP.findOne({
      $or: [
        { mobile: quire1 },
        { mobile: quire2 },
        { mobile: quire3 },
        { mobile: quire4 },
        { mobile: quire5 },
      ],
    });
    const account = await Users.findOne({
      $or: [
        { mobile: quire1 },
        { mobile: quire2 },
        { mobile: quire3 },
        { mobile: quire4 },
        { mobile: quire5 },
      ],
    });

    if (!account) {
      return r.rest(res, false, "No account registered with provided mobile!");
    }

    if (account.isDeleted) {
      return res.status(403).json({
        message: "Your account has been Deleted.",
      });
    }
    if (otpInfo?.lastOtp !== otp) {
      return r.rest(res, false, "OTP does not match!");
    } else {
      if (!account) {
        return r.rest(
          res,
          false,
          "No account registered with provided mobile!"
        );
      } else {
        const token = createJWT({
          userId: await account.userId,
        });

        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 24 * 60 * 60 * 1000,
        });

        return r.rest(res, true, "Login Success!", {
          username: account.username,
          first_name: account.first_name,
          token: token,
          full_name: `${account.first_name} ${account.last_name}`,
        });
      }
    }
  }
};

const adminLoginAPI = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "E-Mail and Password are required!",
    });
  }

  try {
    const account = await Users.findOne({ email: email });

    if (!account) {
      return res.status(404).json({
        message: "Account not found!",
      });
    }

    if (!verifyPassword(password, account.password)) {
      return res.status(403).json({
        message: "Incorrect E-Mail or Password!",
      });
    }

    const token = createJWT({
      userId: await account.userId,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return r.rest(res, true, "Login Success!", {
      username: account.username,
      first_name: account.first_name,
      token: token,
      full_name: `${account.first_name} ${account.last_name}`,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export {
  sendOTP,
  checkOtpMatchAPI,
  registerAPI,
  mobileRegister,
  loginAPI,
  validateMobileAPI,
  adminLoginAPI,
};
