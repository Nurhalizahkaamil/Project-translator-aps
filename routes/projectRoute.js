const { middleware } = require("../db/middleware/middlewareGenerator");
const { ProjectController } = require("../controller/projectController");

const router = require("express").Router();

router
  .route("/")
  .post(middleware(["1"]), ProjectController.createProject)
  .get(middleware(["1", "2"]), ProjectController.getAllProject); // Mengubah dari getAllProject menjadi getAllProjects

router
  .route("/:id")
  .get(middleware(["1"]), ProjectController.getProjectById)
  .patch(middleware(["1"]), ProjectController.updateProject)
  .delete(middleware(["1"]), ProjectController.deleteProject);

module.exports = router;
