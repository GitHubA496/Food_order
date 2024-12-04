import { Request } from 'express';
import bcrypt from 'bcrypt';
import { AuthPayload, VandorPayload } from '../dto';
import jwt from 'jsonwebtoken';


export const GenerateSalt = async () => {
    const salt = await bcrypt.genSalt(10);
    return salt;
}
export const hashPassword = async (password: any, salt: any) => {
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};

export const validatePassword = async (password : string, savedpassword: string,salt : string) => {
    return await hashPassword(password,salt) === savedpassword
}

export const GenerateSignature = (payload :AuthPayload) => {
    const signature = jwt.sign(payload,process.env.SECRET, {expiresIn: '1d'});
    return signature;
}

export const ValidateSignature =async (req : Request) => {
    try {
        const signature = req.get('Authorization');

        if (signature && signature.startsWith('Bearer ')) {
            const token = signature?.split(" ")[1];
            const payload = jwt.verify(token, process.env.SECRET) as VandorPayload;

            req.user = payload;
            return true;
        }

        console.error('Authorization header missing or malformed');
        return false;
    } catch (error: any) {
        console.error('JWT verification failed:', error.message);
        return false;
    }
}