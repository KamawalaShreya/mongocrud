import express from "express";
import { logo } from "../src/common/helper";

const router = express.Router();

router.get("/changelogs", (req, res) => {
  return res.render("api/changelogs", { logo: logo() });
});

module.exports = router;
