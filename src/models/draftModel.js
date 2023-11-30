const mongoose = require('mongoose');
// const bcrypt = require('bcrypt')

const draftSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId, 
        ref: "userModel", 
        required: true
    },
    schoolName: {
        type: String,
        trim: true
    },
    fee: {
        type: String,
    },
    faculty: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        trim: true
    },
    email: {
        type: String,
    },
    website: {
        type: String,
    },
    contact: {
        type: String,
        required: true,
        // max: 11,
    },
    course_overview: {
        type: String,
        trim: true
    },
    about_school: {
        type: String,
        trim: true
    },
    funding: {
        type: String,
        trim: true
    },
    requirement: {
        type: String,
        trim: true
    },
    services: {
        type: String,
        trim: true
    },
    isDraft: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["Active","Draft", "Trash"],
        default: false
    },
    deleted: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true })

const draftModel = mongoose.model('Draft', draftSchema)
module.export = draftModel