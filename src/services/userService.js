import WrongCredentials from '../errors/WrongCredentials.js';
import userRepo from '../repositories/userRepo.js';
import { comparePassword, hashPassword } from '../util/crypto.js';
import { AuthTokenType } from '../util/enums.js';
import { generateToken } from '../util/jwt.js';

async function createUser(userData) {
    userData.password = await hashPassword(userData.password);
    return userRepo.create(userData);
}

function updateUser(id, updateData) {
    return userRepo.update(id, updateData);
}

function deactivateUser(id) {
    return userRepo.deactivate(id);
}

function getAllUsers() {
    return userRepo.getAll();
}

function getUserById(id) {
    return userRepo.getById(id);
}

async function loginUser(input) {
    const { email, password } = input;
    const user = await userRepo.getUserByEmail(email);
    if (!user) throw new WrongCredentials();
    const isValid = await comparePassword(password, user.password);
    if (!isValid) throw new WrongCredentials();

    const payload = {
        firstName: user.firstName,
        LastName: user.lastName,
        email,
        tokenType: AuthTokenType.USER,
        role: user.role,
    };
    const token = generateToken(payload);
    return token;
}

export default {
    createUser,
    updateUser,
    getAllUsers,
    getUserById,
    deactivateUser,
    loginUser,
};