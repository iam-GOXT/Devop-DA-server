const userModel = require('../models/userModel')

class userService {
    // register a user
    async createUser(user) {
        return await userModel.create(user)
    }

    // edit a user
    async update(id, userData) {
        return await userModel.findByIdAndUpdate(id, userData, {
            new: true
        })
    }

    // Delete a user
    async delete(filter){
        return await userModel.findByIdAndDelete(filter)
    }

    //find a user by id
    async findOne(filter){
        return await userModel.findOne(filter)
    } 

    // Get all users
    async getAll(filter){
        return await userModel.find(filter)
    }

     // get user count
     async getCount(filter) {
        return await userModel.countDocuments(filter)
    }
}

module.exports = new userService()