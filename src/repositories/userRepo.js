import User from '../models/UserModel.js';

const UserRepo = {

    create(userData) {
        const user = new User(userData);
        return user.save();
    },

    update(id, updateData) {
        if (!updateData.password) delete updateData.password;

        return User.findByIdAndUpdate(id, { $set: updateData });
    },

    deactivate(id) {
        return db.User.findByIdAndUpdate(id, { isActive: false });
    },

    getAll() {
        return User.find({}, { password: 0, __v: 0 });
    },

    getById(id) {
        return User.findById(id);
    },

    getUserByEmail(email) {
        return User.findOne({ email });
    }
};

export default UserRepo;