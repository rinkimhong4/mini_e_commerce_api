const { verifySignUp } = require("../middleware");
const controller = require("../controller/auth.controller");
const { body } = require("express-validator");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    body("username").notEmpty(),
    body("password").isLength({ min: 6 }),
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);
  app.get("/api/auth/getAllUsers", controller.getAllUsers);
  app.post("/api/auth/signout", controller.signout);

};