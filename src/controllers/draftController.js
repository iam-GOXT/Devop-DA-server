const draftService = require('../services/draftService')

exports.createDraft = async( req, res) => {
    // const admin_id = req.user
    const draftInfo = req.body

    try{
        const draftData = await draftService.createDraft({ ...draftInfo} , { "$set": { deleted: false, status: "Draft", isDraft: true }})
        return res.status(200).json({ success: true, message: draftData })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message})
    }
}

exports.getDraftRecords = async (req, res) => {
    try{
        const draftData = await draftService.getAll({ status: "Draft", deleted: false})
        const totalDraft = await draftService.getCount({ status: "Draft"})
        
       return res.status(200).json({
            success: true,
            message:"Draft successfully fetched",
            TotalDraft: totalDraft,
            data: draftData,      
        })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message})
    }
}

// get record by id
exports.getDraftById = async (req, res) => {
    const draftId = req.params._id

    try{
        const draftData = await recordService.findOne({ _id: draftId })
        return res.status(201).json({
            success: true,
            message: 'Record data fetched successfully',
            totalRecords: draftData
        })

    } catch(err) {
        res.status(403).json({ success: false, message: err.message })
    }
}