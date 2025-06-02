import { r } from "../helpers/ResponseHelper.js";
import { verifyJWT } from "../helpers/AuthHelpers.js";
import { Users } from "../models/index.js";

const auth_jwt = async (req, res, next) => {
  if (typeof req.headers["x-auth-token"] === "undefined") {
    r.rest(res, "Unauthorized Access! Auth token not found!");
  } else {
    let token = req.headers["x-auth-token"];
    //console.log(token)
    let decoded = verifyJWT(token);
    if (decoded.status) {
      req.auth = decoded.data;
      next();
    } else {
      r.rest(res, `Unauthorized Access! (${decoded.message})`);
    }
  }
};

const verifyAdmin = async (req, res, next) => {
  try {
    const requester = req.auth.mobile; // Assuming req.auth contains authenticated user details
    const requesterAccount = await Users.findOne({ mobile: requester });

    // Check if the requester is an admin
    if (requesterAccount?.role === "admin") {
      return next();
    }

    // If neither admin nor moderator, send unauthorized response
    return res.status(401).send({
      error: {
        message: `Not authorized, token failed ${requesterAccount?.first_name} ${requesterAccount?.role}` 
      },
    });
  } catch (e) {
    // Handle unexpected errors
    return res.status(500).send({
      error: {
        message: "Internal Server Error: " + e.message,
      },
    });
  }
};


const verifyUser = async (req, res, next) => {
  try {
    const requester = req.auth.username;
    // console.log({ requester });
    const requesterAccount = await Users.findOne({ username: requester });
    if (requesterAccount?.role === "user") {
      // if (requesterAccount.isDeleted) {
      //   return res.status(403).json({
      //     message: "Your account has been Deleted.",
      //   });
      // }
      next();
    } else {
      res.status(401).send({
        error: {
          message: "Not authorized, token failed",
        },
      });
    }
  } catch (e) {
    res.status(401).send({
      error: {
        message: e.message,
      },
    });
  }
};

export { auth_jwt, verifyUser, verifyAdmin };
