import User from '../models/UserModel.js';

const UserRepo = {

    create(userData) {
        const user = new User(userData);
        return user.save();
    },

    update(id, updateData) {
        return User.findByIdAndUpdate(id, updateData);
    },

    deactivate(id) {
        return db.User.findByIdAndUpdate(id, { isActive: false });
    },

    getAll() {
        return User.find();
    },

    getById(id) {
        return User.findById(id);
    },

    getUserByEmail(email) {
        return User.findOne({ email });
    }
};

export default UserRepo;