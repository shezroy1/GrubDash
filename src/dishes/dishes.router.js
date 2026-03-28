const router = require("express").Router();
const dishesController = require("./dishes.controller");

// TODO: Implement the /dishes routes needed to make the tests pass
router
  .route("/:dishId")
  .get(dishesController.read)
  .post(dishesController.create)
  .delete(dishesController.destroy)
  .put(dishesController.update);
router.route("/").get(dishesController.list);
module.exports = router;
