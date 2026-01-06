import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/register.model.js";


const login = async (req, res) => {
  // const { email, password } = req.body;

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with email ${email} does not exist` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ sucess: false, error: "wrong password" });
    }

    //    const token = jwt.sign({_id:user._id, role:user.role} ,
    //    process.env.JWT_SECRET,{expiresIn: "1d"}

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    return res.status(200).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name },
    });
  } catch (error) {
    // console.error(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};



export { login };
