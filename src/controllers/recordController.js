const recordModel = require("../models/recordModel");
const recordService = require("../services/recordService");
const cloudinary = require("../utils/cloudinaryUtil");

// create record data
// exports.createRecord = async (req, res) => {
//   const user_id = req.user;
//   const recordInfo = req.body;

//   try {
//     const recordData = await recordService.createRecord({
//       ...recordInfo,
//       user_id,
//     });

//     if (req.files !== undefined) {
//       if (req.files.profile_img !== undefined) {
//         var schoolImage = await storeImage(req.files.schoolImage.path);
//         var schoolLogo = await storeImage(req.files.schoolLogo.path);
//       }
//     }

//     return res.status(200).json({ success: true, message: recordData });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

exports.createRecord = async (req, res, next) => {
  const user_id = req.user;
  // console.log("req.user", req.user);
  // console.log("user_id", user_id);

  const { image, logo, ...rest } = req.body;
  try {
    if (image) {
      const upLoadImage = await cloudinary.uploader.upload(image, {
        upload_preset: "school-image",
      });
      rest.image = upLoadImage.secure_url;
    }
    if (logo) {
      const upLoadLogo = await cloudinary.uploader.upload(logo, {
        upload_preset: "school-logo",
      });
      rest.logo = upLoadLogo.secure_url;
    }
    const newRecord = new recordModel({ ...rest, user_id });
    await newRecord.save();
    res.status(201).send(newRecord);
  } catch (error) {
    next(error);
  }
};

// delete record'
exports.deleteRecord = async (req, res) => {
  // const admin_id = req.user
  const recordId = req.params.id;

  try {
    const recordData = await recordService.findOne({ _id: recordId });

    if (!recordData)
      return res.status(404).json({ message: "Record does not exist" });

    await recordService.update(
      { _id: recordId },
      { $set: { deleted: true, status: "Trash" } }
    );
    return res.status(200).json({
      success: true,
      message: "Record successfully deleted",
    });
  } catch (error) {
    res.status(403).json({ success: false, message: error.message });
  }
};

//update record
exports.updateRecord = async (req, res) => {
  const itemId = req.params.itemId;
  console.log("updtae route", itemId);
  // const recordInfo = req.body;
  // console.log("recordInfo", type);

  //   try {
  //     if (req.method === "GET") {
  //       // Handle GET request to retrieve record details
  //       const record = await recordService.findOne(itemId);
  //       if (!record) {
  //         return res
  //           .status(404)
  //           .json({ success: false, message: "Record not found" });
  //       }
  //       res.status(200).json({ success: true, message: record });
  //     } else if (req.method === "PUT") {
  //       // Handle PUT request to update the record
  //       const updatedRecord = await recordService.update(
  //         itemId,
  //         type,
  //         { ...recordInfo },
  //         { new: true }
  //       );
  //       if (!updatedRecord) {
  //         return res
  //           .status(404)
  //           .json({ success: false, message: "Record not found" });
  //       }
  //       res.status(200).json({ success: true, message: updatedRecord });
  //     }
  //   } catch (err) {
  //     res.status(500).json({ success: false, message: err.message });
  //   }
  // };
  try {
    const updatedRecord = await recordService.update(itemId, req.body, {
      new: true,
    });
    if (!updatedRecord) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }
    res.status(200).json(updatedRecord);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// get record by id
exports.getRecordById = async (req, res) => {
  const recordId = req.params.id;
  try {
    const limit = parseInt(req.query.perPage) || 10;
    const totalRecord = await recordService.getCount({
      deleted: false,
      isDraft: false,
    });
    const recordData = await recordService.findOne({ _id: recordId });
    const similar = await recordModel
      .find({
        department: recordData.department,
        _id: { $ne: recordId },
      })
      .limit(limit);
    return res.status(201).json({
      success: true,
      message: "Record data fetched successfully",
      total: totalRecord,
      data: recordData,
      similar: similar,
    });
  } catch (err) {
    res.status(403).json({ success: false, message: err.message });
  }
};

// get all record by an id
exports.getAllRecordByAdmin = async (req, res) => {
  const user_id = req.user;
  console.log("user_id", user_id);
  try {
    const limit = parseInt(req.query.perPage) || 10;
    const page = parseInt(req.query.page) || 0;
    let sortBy = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(",");
      sortBy[parts[0]] = parts[1] === "desc" ? -1 : 1;
    } else {
      sortBy = { createdAt: -1 };
    }

    const recordData = await recordModel
      .find({ user_id, deleted: false, isDraft: false })
      .limit(limit)
      .skip(page * limit)
      .sort(sortBy)
      .populate({
        path: "user_id",
        select: "firstName lastName",
      });

    // const recordData = await recordService.getAll({ user_id }).populate({
    //   path: "user_id",
    //   select: "firstName lastName",
    // }).
    console.log("recordData", recordData);
    const total_Record = await recordService.getCount({
      user_id,
      deleted: false,
      isDraft: false,
    });

    const numPages = Math.ceil(total_Record / limit);

    return res.status(201).json({
      success: true,
      message: " Record by Admin is fetched successfully",
      total: total_Record,
      data: recordData,
      page: page + 1,
      numPages,
      perPage: limit,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// get all record
exports.getAllRecord = async (req, res) => {
  try {
    const limit = parseInt(req.query.perPage) || 100;
    const page = parseInt(req.query.page) || 0;
    let sortBy = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(",");
      sortBy[parts[0]] = parts[1] === "desc" ? -1 : 1;
    } else {
      sortBy = { createdAt: -1 };
    }

    const recordData = await recordModel
      .find({ deleted: false })
      .limit(limit)
      .skip(page * limit)
      .sort(sortBy)
      .populate({
        path: "user_id",
        select: "firstName lastName",
      });
    const totalRecord = await recordService.getCount({ deleted: false });
    console.log("totalRecord", totalRecord);

    let numPages = Math.ceil(totalRecord / limit);

    res.status(200).json({
      success: true,
      message: "Records is successfully fetched",
      total: totalRecord,
      data: recordData,
      page: page + 1,
      numPages,
      perPage: limit,
    });
  } catch (err) {
    console.log("New error: ", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// view deleted records of admins
exports.getDeletedRecords = async (req, res) => {
  try {
    const limit = parseInt(req.query.perPage) || 10;
    const page = parseInt(req.query.page) || 0;
    let sortBy = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(",");
      sortBy[parts[0]] = parts[1] === "desc" ? -1 : 1;
    } else {
      sortBy = { createdAt: -1 };
    }
    const recordData = await recordModel
      .find({
        deleted: true,
        status: "Trash",
      })
      .sort(sortBy)
      .limit(limit)
      .skip(page * limit)
      .populate({
        path: "user_id",
        select: "firstName lastName",
      });
    // console.log(recordData);

    const Total_trash = await recordModel.countDocuments({
      deleted: true,
      status: "Trash",
    });

    const numPages = Math.ceil(Total_trash / limit);

    return res.status(200).json({
      success: true,
      message: "Trash successfully fetched",
      data: recordData,
      total: Total_trash,
      page: page + 1,
      numPages,
      perPage: limit,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// view deleted records by admin
exports.getDeletedRecordsByAdmin = async (req, res) => {
  const user_id = req.user;
  // console.log("user_id", user_id);
  // const user = req.params.userId;
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.perPage) || 10;
    let sortBy = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(",");
      sortBy[parts[0]] = parts[1] === "desc" ? -1 : 1;
    } else {
      sortBy = { createdAt: -1 };
    }
    const recordData = await recordModel
      .find({
        user_id: user_id,
        deleted: true,
        status: "Trash",
      })
      .sort(sortBy)
      .limit(limit)
      .skip(page * limit)
      .populate({
        path: "user_id",
        select: "firstName lastName",
      });
    // console.log(recordData);

    const total = await recordService.getCount({
      user_id: user_id,
      deleted: true,
      status: "Trash",
    });

    const numPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      message: "Trash successfully fetched",
      data: recordData,
      total,
      page: page + 1,
      numPages,
      perPage: limit,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.searchRecord = async (req, res) => {
  let { keyword, courseType, location, beginning, fee, schoolName, city } =
    req.query;
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.perPage) || 10;
    let sortBy = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(",");
      sortBy[parts[0]] = parts[1] === "desc" ? -1 : 1;
    } else {
      sortBy = { createdAt: -1 };
    }
    keyword = keyword || "";
    courseType = courseType || "";
    location = location || "";
    beginning = beginning || "";
    fee = fee || "";
    schoolName = schoolName || "";
    city = city || "";

    let dropMenu = {
      $and: [
        { degree: { $regex: courseType, $options: "i" } },
        { country: { $regex: location, $options: "i" } },
        { beginning: { $regex: beginning, $options: "i" } },
        { fee: { $regex: fee, $options: "i" } },
        { schoolName: { $regex: schoolName, $options: "i" } },
        { city: { $regex: city, $options: "i" } },
      ],
    };

    let dropMenu2 =
      courseType || location || beginning || fee || schoolName || city || "";

    const searchQuery = {
      $or: [
        { department: { $regex: keyword, $options: "i" } },
        { schoolName: { $regex: keyword, $options: "i" } },
      ],
    };

    let data = [];
    let total = 0;
    if (keyword && !dropMenu2) {
      data = await recordModel
        .find({ status: "Active", ...searchQuery })
        .sort(sortBy)
        .limit(limit)
        .skip(page * limit)
        .populate({
          path: "user_id",
          select: "firstName lastName",
        });
      console.log("searchQuery Only keyword", keyword);
      total = await recordService.getCount({
        status: "Active",
        ...searchQuery,
      });
      console.log("searchQuery Only");
    } else if (keyword && dropMenu) {
      data = await recordModel
        .find({ status: "Active", ...searchQuery, ...dropMenu })
        .sort(sortBy)
        .limit(limit)
        .skip(page * limit);
      console.log("searchQuery and dropMenu", keyword, dropMenu);
      total = await recordService.getCount({
        status: "Active",
        ...searchQuery,
        ...dropMenu,
      });
      console.log("searchQuery and dropMenu");
    } else if (!keyword && dropMenu2) {
      data = await recordModel
        .find({ status: "Active", ...dropMenu })
        .sort(sortBy)
        .limit(limit)
        .skip(page * limit);
      console.log("dropMenu Only");
      total = await recordService.getCount({ status: "Active", ...dropMenu });
    } else {
      data = await recordModel
        .find({ status: "Active" })
        .sort(sortBy)
        .limit(limit)
        .skip(page * limit)
        .populate({
          path: "user_id",
          select: "firstName lastName",
        });
      total = await recordService.getCount({ status: "Active" });
      console.log("No searchQuery and dropMenu");
    }

    const getDropdownMenu = await recordModel
      .find({ status: "Active", ...searchQuery, ...dropMenu })
      .select("schoolName degree city beginning fee");
    console.log("dis is search", getDropdownMenu);

    let filterMenu = getDropdownMenu;
    let getSchoolMenu = filterMenu.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.schoolName === item.schoolName)
    );

    let getDegreeMenu = filterMenu.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.degree === item.degree)
    );

    let getCityMenu = filterMenu.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.city === item.city)
    );

    let getBeginningMenu = filterMenu.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.beginning === item.beginning)
    );

    let getFeeMenu = filterMenu.filter(
      (item, index, self) => index === self.findIndex((t) => t.fee === item.fee)
    );

    let getDropdownMenuData = {
      schoolName: getSchoolMenu.map((item) => item.schoolName),
      degree: getDegreeMenu.map((item) => item.degree),
      city: getCityMenu.map((item) => item.city),
      beginning: getBeginningMenu.map((item) => item.beginning),
      fee: getFeeMenu.map((item) => item.fee),
    };

    let numPages = Math.ceil(total / limit);
    const response = {
      error: false,
      data,
      total,
      getDropdownMenuData,
      page: page + 1,
      numPages,
      perPage: limit,
      //   similar,
    };

    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// delete records in trash created by admin

exports.deleteTrashRecord = async (req, res) => {
  const recordId = req.params.id;
  console.log("update route", recordId);
  try {
    const recordData = await recordService.findOne({ _id: recordId });

    if (!recordData)
      return res.status(404).json({ message: "Record does not exist" });

    await recordService.delete({ _id: recordId });
    return res.status(200).json({
      success: true,
      message: "Record successfully deleted",
    });
  } catch (error) {
    res.status(403).json({ success: false, message: error.message });
  }
};

// recover records deleted

exports.recoverDeletedRecord = async (req, res) => {
  const recordId = req.params.id;
  console.log("recordId", recordId);
  try {
    const deletedRecord = await recordService.update(
      { _id: recordId },
      { deleted: false, status: "Active" }
    );
    console.log(deletedRecord);
    if (!deletedRecord) {
      return res.status(404).json({ message: "Record does not exist" });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "Record successfully recovered" });
    }
  } catch (error) {
    res.status(403).json({ success: false, message: error.message });
  }
};

// save records in draft
exports.createDraftRecord = async (req, res) => {
  const user_id = req.user;
  const { image, logo, ...rest } = req.body;
  try {
    if (image) {
      const upLoadImage = await cloudinary.uploader.upload(image, {
        upload_preset: "school-image",
      });
      rest.image = upLoadImage.secure_url;
    }
    if (logo) {
      const upLoadLogo = await cloudinary.uploader.upload(logo, {
        upload_preset: "school-logo",
      });
      rest.logo = upLoadLogo.secure_url;
    }
    const draftRecord = new recordModel({
      ...rest,
      user_id,
      isDraft: true,
      status: "Draft",
    });
    await draftRecord.save();
    res.status(201).json({
      success: true,
      data: draftRecord,
      message: "Record saved as draft",
    });
  } catch (error) {
    next(error);
  }
};
// get all draft record by an id
exports.getDraftRecordByAdmin = async (req, res) => {
  const user_id = req.user;
  console.log("user_id", user_id);
  try {
    const limit = parseInt(req.query.perPage) || 10;
    const page = parseInt(req.query.page) || 0;
    let sortBy = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(",");
      sortBy[parts[0]] = parts[1] === "desc" ? -1 : 1;
    } else {
      sortBy = { createdAt: -1 };
    }

    const recordData = await recordModel
      .find({ user_id, deleted: false, isDraft: true, status: "Draft" })
      .limit(limit)
      .skip(page * limit)
      .sort(sortBy)
      .populate({
        path: "user_id",
        select: "firstName lastName",
      });

    console.log("recordData", recordData);
    const total_Record = await recordService.getCount({
      user_id,
      deleted: false,
      isDraft: true,
      status: "Draft",
    });

    const numPages = Math.ceil(total_Record / limit);

    return res.status(201).json({
      success: true,
      message: "Admin record fetched successfully",
      total: total_Record,
      data: recordData,
      page: page + 1,
      numPages,
      perPage: limit,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// delete draft records created by admin
exports.deleteDraftRecord = async (req, res) => {
  const recordId = req.params.id;
  console.log("recordId", recordId);
  try {
    const recordData = await recordService.findOne({ _id: recordId });

    if (!recordData)
      return res.status(404).json({ message: "Record does not exist" });

    await recordService.delete({ _id: recordId });
    return res.status(200).json({
      success: true,
      message: "Record successfully deleted",
    });
  } catch (error) {
    res.status(403).json({ success: false, message: error.message });
  }
};

// update draft record and save to active

exports.updateDraftRecord = async (req, res) => {
  const itemId = req.params.itemId;
  console.log("update route", itemId);
  try {
    const updatedRecord = await recordService.update(itemId, req.body, {
      new: true,
    });
    if (!updatedRecord) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }
    res.status(200).json({
      success: true,
      data: updatedRecord,
      message: "Record successfully updated",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
