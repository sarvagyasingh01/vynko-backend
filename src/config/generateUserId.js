import { Users } from "../models/users/UsersSchema.js";

const GenerateUserId = async () => {
    const latestUser = await Users.findOne({ userId: { $regex: /^user\d+$/ } })
      .sort({ createdAt: -1 });
  
    if (!latestUser || !latestUser.userId || !latestUser.userId.startsWith("user")) {
      return -1; 
    }
  
    const currentId = latestUser.userId.replace("user", "");
    const parsed = parseInt(currentId);
  
    if (isNaN(parsed)) {
      return -1; 
    }
  
    const idNumber = parsed + 1;
    return `user${idNumber.toString().padStart(4, "0")}`;
  };
  
  export default GenerateUserId;
  