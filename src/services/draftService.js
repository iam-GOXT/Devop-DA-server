const draftModel = require('../models/draftModel');

class draftService {

    // register a draftModel
    async createDraft(draft){
        return await draftModel.create(draft)
    }

    // edit a draft
    async update(id, draftData) {
        return await draftModel.findByIdAndUpdate(id, draftData, {
            new: true
        })
    }

    // Delete a draft
    async delete(filter){
        return await draftModel.findByIdAndDelete(filter)
    }

    // find a draft by their id
    async findOne(filter){
        return await draftModel.findOne(filter)
    }

    // get all draft
    async getAll(filter) {
        return await draftModel.find(filter)
    }

    // get draft count
    async getCount(filter) {
        return await draftModel.countDocuments(filter)
    }
}

module.exports = new draftService()