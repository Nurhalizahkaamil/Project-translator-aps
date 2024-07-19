const { middleware } = require("../db/middleware/middlewareGenerator");
const { LocalizationController } = require("../controller/localizationController");

const router = require("express").Router();

router
  .route("")
  .post(middleware(["1"]), LocalizationController.createLocalization)
  .get(LocalizationController.getAllLocalization);

router
  .route("/:id")
  .patch(middleware(["1"]), LocalizationController.updateLocalization)
  .delete(middleware(["1"]), LocalizationController.deleteLocalization);

router
  .route("/translation")
  .post(LocalizationController.addTranslation)
  .get(LocalizationController.getTranslation);

router
  .route("/save-localization")
  .post(LocalizationController.saveJsonToDatabase)

//.post('/save-localization', LocalizationController.saveJsonToDatabase);

module.exports = router;
