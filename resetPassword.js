import express from 'express';
import bcrypt from 'bcrypt';
import {updatePasswordEntity,findToken} from './Database/db-utils.js';

const resetRouter = express.Router();

//API call to reset password
resetRouter.post('/:token', async (req, res) => {
    const{token} = req.params;
    const{password}=req.body;
    const user = await findToken('user',token);
    if(user !== null){
        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await updatePasswordEntity('user',user['id'],hashedPassword);
        res.send({'msg':'Password changed successfully'});
    }else{
        res.send({'msg':"Invalid or expired password reset link."});
    }
});

export default resetRouter;