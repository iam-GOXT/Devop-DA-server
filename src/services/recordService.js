const recordModel = require("../models/recordModel");
// const {limit, page, sortBy} = require('../controllers/recordController')

class recordService {
  // register a recordModel
  async createRecord(record) {
    return await recordModel.create(record);
  }

  // edit a record
  async update(id, recordData) {
    return await recordModel.findByIdAndUpdate(id, recordData, {
      new: true,
      runValidators: true,
    });
  }

  // Delete a record
  async delete(filter) {
    return await recordModel.findByIdAndDelete(filter);
  }

  // delete all records
  // async deleteAll() {
  //   return await recordModel.deleteMany({});
  // }

  // find a record by their id
  async findOne(filter) {
    return await recordModel.findOne(filter);
  }

  // get all Records
  async getAll(filter) {
    return await recordModel.find(filter);
    // .limit(limit).skip(page * limit).sort(sortBy);
  }

  // get record count
  async getCount(filter) {
    return await recordModel.countDocuments(filter);
  }
}

module.exports = new recordService();
