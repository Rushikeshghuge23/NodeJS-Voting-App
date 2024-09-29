const express = require('express');
const router = express.Router();
const User = require("./../models/user");
const {jwtAuthMiddleware, generateToken} = require('./../jwt');

router.post('/signup', async (req,res) => {
    try{
      const data = req.body;
  
    //create a new user document using the mongoose model
    const newUser = new User(data);
  
    //save the new user to the database
      const response = await newUser.save();
      console.log("Data Saved");

      const payload = {
        id: response.id
      }
      console.log(JSON.stringify(payload));

      const token = generateToken(payload);
      console.log("Token is: ", token);

      res.status(200).json({response: response, token: token});
    } catch (err){
        console.log(err);
        res.status(500).json({error: "Internal server error"});
    }
});

//login Route
router.post('/login', async(req, res) => {
  try{
    //extract username and password from request body
    const {aadharCardNumber, password} = req.body;

    //find the user by aadharCardNumber
    const user = await User.findOne({aadharCardNumber: aadharCardNumber});

    //if user does not exit or password does not match
    if(!user || !(await user.comparePassword(password))){
      return res.status(401).json({error: "Invalid username or password"});
    }

    //genertare token
    const payload = {
      id: user.id
    }
    const token = generateToken(payload);

    //return token as responce
    res.json({token});
  } catch (err){
    console.log(err);
    res.status(500).json({error: "Internal Server Error"});
  }
});

//profile route
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
  try{
    const userData = req.user;

    const userId = userData.id;
    const user = await User.findById(userId);

    res.status(200).json({user});
  } catch(err) {
    console.log(err);
    res.status(500).json({error: "Internal Server Error"});
  }
})



router.put('/profile/password', jwtAuthMiddleware, async (req,res) => {
  try{
    const userId = req.user; //extract the id from the token
    const {currentPassword, newPassword} = req.body; //Extract current and new password from request body

    //find the user by userId
    const user = await User.findById(userId);

    //if password does not match, return error
    if(!(await user.comparePassword(currentPassword))){
      return res.status(401).json({error: "Invalid password"});
    }

    //update the user password
    user.password = newPassword;
    await user.save();

    console.log("password Updated");
    res.status(200).json({message: "Password updated"});
  } catch (err) {
    console.log(err);
    res.status(500).json({error: "Internal server error"});
  }
});


module.exports = router;