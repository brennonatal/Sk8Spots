import express = require("express");
import wrap = require("express-async-error-wrapper");

const router = express.Router();

router.all("/", wrap(async (req: express.Request, res: express.Response) => {
	res.render("home/index", { layout: "layout-vazio" });
}));

export = router;
