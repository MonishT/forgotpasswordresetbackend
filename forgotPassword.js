import express from 'express';
import {updateUserEntity,findUsers,createEntity} from './Database/db-utils.js';
import nodemailer from 'nodemailer';
import cryptoRandomString from 'crypto-random-string';

const forgotRouter = express.Router();
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'monish23don@gmail.com',
      pass: 'bzbskfrvwkekocds',
    },
  });
//API call to create user
forgotRouter.post('/createUser', async (req, res) => {
    const{email}=req.body;
    const user = await findUsers('user',email);
    // console.log("User : "+user);
    if(user === null){
        await createEntity('user',req.body);
        res.send({'msg':'User created successfully'});
    }else{
        res.send({'msg':"User already exists"});
    }
});

//API call for forgotPassword
forgotRouter.post('/forgotPassword', async (req, res) => {
    const{email}=req.body;
    const user = await findUsers('user',email);
    //console.log("User : "+user['id']);
    if(user !== null){
        // Generate a random string/token
        const resetToken = cryptoRandomString({ length: 32 });
        console.log("resetToken :"+resetToken);
        await updateUserEntity('user',user['id'],resetToken);

        // Send an email with the password reset link
        const mailOptions = {
            from: 'monish23don@gmail.com',
            to: email,
            subject: 'Password Reset',
            text: `Click the following link to reset your password: https://forgotpasswordfrontend.onrender.com/resetPassword/${resetToken}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log('Error:', error);
              return res.status(500).json({ message: 'Error sending email.' });
            }
            console.log('Email sent:', info.response);
            res.status(200).json({ message: 'Password reset link sent to your email.' });
        });
        res.send({'msg':'Password link shared to your mail'});
    }else{
        res.send({'msg':"User doesn't exists"});
    }
});

export default forgotRouter;