const router = require("express").Router();
const validate = require("../middlewares/validateMiddleware");
const { isAuth } = require("../middlewares/authenticationMiddleware");
const { verifyUser, isSuperAdminAuth } = require("../middlewares/verifyUser");
const { createSchema } = require("../schemas/recordSchema");

const {
  createRecord,
  deleteRecord,
  getRecordById,
  getAllRecordByAdmin,
  getAllRecord,
  getDeletedRecords,
  getDeletedRecordsByAdmin,
  searchRecord,
  updateRecord,
  deleteTrashRecord,
  recoverDeletedRecord,
  getDraftRecordByAdmin,
  deleteDraftRecord,
  createDraftRecord,
  updateDraftRecord,
} = require("../controllers/recordController");

// Record CRUD and queries
router.post(
  "/create",
  validate(createSchema),
  isAuth,
  verifyUser,
  createRecord
);
router.get("/all", isAuth, getAllRecord);
router.get("/trash", isAuth, isSuperAdminAuth, getDeletedRecords);
router.get("/search", searchRecord);
router.get("/search/id", isAuth, verifyUser, getAllRecordByAdmin);
// router.get("/trash/:userId", isAuth, getDeletedRecordsByAdmin);
router.get("/trash/id", isAuth, getDeletedRecordsByAdmin);
router.delete("/trash/:id", isAuth, deleteTrashRecord);
router.put("/trash/:id", recoverDeletedRecord);
router.delete("/:id", isAuth, verifyUser, deleteRecord);
router.put("/:itemId", isAuth, verifyUser, updateRecord);
router.get("/draft/id", isAuth, getDraftRecordByAdmin);
router.delete("/draft/:id", isAuth, deleteDraftRecord);
router.post("/draft/create", isAuth, createDraftRecord);
router.put("/draft/:id", isAuth, updateDraftRecord);
router.get("/:id", getRecordById);

module.exports = router;
