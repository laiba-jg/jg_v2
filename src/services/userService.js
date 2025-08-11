import UserInactiveError from '../errors/UserInactiveError.js';
import WrongCredentials from '../errors/WrongCredentials.js';
import userRepo from '../repositories/userRepo.js';
import { comparePassword, hashPassword } from '../util/crypto.js';
import { AuthTokenType } from '../util/enums.js';
import { generateToken } from '../util/jwt.js';

async function createUser(userData) {
    userData.password = await hashPassword(userData.password);
    return userRepo.create(userData);
}

async function updateUser(id, updateData) {
    if (updateData.password) updateData.password = await hashPassword(updateData.password);
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
    if (!user.active) throw new UserInactiveError();
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