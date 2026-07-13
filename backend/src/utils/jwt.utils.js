import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

export const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user.id, 
            rut: user.rut, 
            rol: user.rol,
            nombre: user.nombre,
            turno: user.turno
        },
        SECRET,
        { expiresIn: EXPIRES_IN }
    );
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET);
    } catch (error) {
        return null;
    }
};