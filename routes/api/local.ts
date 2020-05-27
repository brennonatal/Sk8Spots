import express = require("express");
import multer = require("multer");
import wrap = require("express-async-error-wrapper");
import Local = require("../../models/local");

const router = express.Router();

// Se utilizar router.xxx() mas não utilizar o wrap(), as exceções ocorridas
// dentro da função async não serão tratadas!!!
router.get("/listar", wrap(async (req: express.Request, res: express.Response) => {
	let lista = await Local.listar();

	res.json(lista);
}));

router.get("/pesquisar", wrap(async (req: express.Request, res: express.Response) => {
	let nome = (req.query["nome"]);
	//console.log(nome);
	let lista = await Local.pesquisar(nome);

	res.json(lista);
}));

router.get("/obter", wrap(async (req: express.Request, res: express.Response) => {
	let id = parseInt(req.query["id"]);

	let local = await Local.obter(id);

	res.json(local);
}));

router.post("/criar", multer().single("image"), wrap(async (req: express.Request, res: express.Response) => {
	let local = req.body as Local;

	if (!req["file"] || !req["file"].buffer || !req["file"].size || req["file"].size > (500 * 1024)) {
		res.statusCode = 400;
		res.json("Imagem inválida!");
		return;
	}

	let resultado = await Local.criar(local, req["file"]);

	if (resultado) {
		res.statusCode = 400;
		res.json(resultado);
	} else {
		res.json(true);
	}
}));

router.post("/alterar", wrap(async (req: express.Request, res: express.Response) => {
	let local = req.body as Local;

	if (local) {
		local.id = parseInt(req.body.id);
	}

	let resultado = await Local.alterar(local);

	if (resultado) {
		res.statusCode = 400;
		res.json(resultado);
	} else {
		res.json(true);
	}
}));

router.get("/excluir", wrap(async (req: express.Request, res: express.Response) => {
	let id = parseInt(req.query["id"]);

	let resultado = await Local.excluir(id);

	if (resultado) {
		res.statusCode = 400;
		res.json(resultado);
	} else {
		res.json(true);
	}
}));

router.get("/buscarEndereco", wrap(async (req: express.Request, res: express.Response) => {
	let end = req.query["end"];

	let resultado = await Local.buscarEndereco(end);

	res.json(resultado);
}));

export = router;
