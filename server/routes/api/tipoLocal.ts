import express = require("express");
import wrap = require("express-async-error-wrapper");
import TipoLocal = require("../../models/tipoLocal");

const router = express.Router();

// Se utilizar router.xxx() mas não utilizar o wrap(), as exceções ocorridas
// dentro da função async não serão tratadas!!!
router.get("/listar", wrap(async (req: express.Request, res: express.Response) => {
	let lista = await TipoLocal.listar();

	res.json(lista);
}));

router.get("/obter", wrap(async (req: express.Request, res: express.Response) => {
	let id = parseInt(req.query["id"]);

	let tipoLocal = await TipoLocal.obter(id);

	res.json(tipoLocal);
}));

router.post("/criar", wrap(async (req: express.Request, res: express.Response) => {
	let tipoLocal = req.body as TipoLocal;

	let resultado = await TipoLocal.criar(tipoLocal);

	if (resultado) {
		res.statusCode = 400;
		res.json(resultado);
	} else {
		res.json(true);
	}
}));

router.post("/alterar", wrap(async (req: express.Request, res: express.Response) => {
	let tipoLocal = req.body as TipoLocal;

	if (tipoLocal) {
		tipoLocal.id = parseInt(req.body.id);
	}

	let resultado = await TipoLocal.alterar(tipoLocal);

	if (resultado) {
		res.statusCode = 400;
		res.json(resultado);
	} else {
		res.json(true);
	}
}));

router.get("/excluir", wrap(async (req: express.Request, res: express.Response) => {
	let id = parseInt(req.query["id"]);

	let resultado = await TipoLocal.excluir(id);

	if (resultado) {
		res.statusCode = 400;
		res.json(resultado);
	} else {
		res.json(true);
	}
}));

export = router;
