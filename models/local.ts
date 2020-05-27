import Sql = require("../infra/sql");
import FS = require("../infra/fs");
import Upload = require("../infra/upload");

export = class Local {
	public id: number;
	public nome: string;
	public latitude: number;
	public longitude: number;
	public idtipo: number;
	public endereco: string;
	public bairro: string;
	public instalacoes: number[];

	private static validar(t: Local): string {
		if (!t) {
			return "Dados inválidos!";
		}

		t.nome = (t.nome || "").normalize().trim();
		if (t.nome.length < 3 || t.nome.length > 50) {
			return "Nome do tipo de local inválido!";
		}

		t.latitude = parseFloat(t.latitude as any);
		if (isNaN(t.latitude)) {
			return "Latitude inválida!";
		}

		t.longitude = parseFloat(t.longitude as any);
		if (isNaN(t.longitude)) {
			return "Longitude inválida!";
		}

		t.idtipo = parseInt(t.idtipo as any);
		if (isNaN(t.idtipo) || t.idtipo < 1 || t.idtipo > 5) {
			return "Tipo de local inválido!";
		}

		t.endereco = (t.endereco || "").normalize().trim();
		if (t.endereco.length < 5 || t.endereco.length > 100) {
			return "Endereço do local inválido!";
		}

		t.bairro = (t.bairro || "").normalize().trim();
		if (t.bairro.length < 3 || t.bairro.length > 50) {
			return "Bairro do local inválido!";
		}

		if (!t.instalacoes) {
			t.instalacoes = [];
		} else if ((typeof t.instalacoes) === "string") {
			t.instalacoes = [t.instalacoes as any];
		}

		let idtipoOK = false;
		for (let i = 0; i < t.instalacoes.length; i++) {
			t.instalacoes[i] = parseInt(t.instalacoes[i] as any);
			if (t.instalacoes[i] === t.idtipo) {
				idtipoOK = true;
			}
			if (isNaN(t.instalacoes[i]) || t.instalacoes[i] < 1 || t.instalacoes[i] > 5) {
				return "Tipo de local inválido!";
			}
		}
		if (!idtipoOK) {
			t.instalacoes.push(t.idtipo);
		}

		return null;
	}

	public static async listar(): Promise<Local[]> {
		let lista: any[] = null;

		await Sql.conectar(async (sql: Sql) => {
			lista = (await sql.query("select l.id, l.nome, l.latitude, l.longitude, l.idtipo, t.nome nometipo, l.endereco, l.bairro, (select group_concat(li.idtipo) as idtipos from local_instalacao li where li.idlocal = l.id group by li.idlocal) idtipos, (select group_concat(t2.nome) as nometipos from local_instalacao li2 inner join tipo t2 on t2.id = li2.idtipo where li2.idlocal = l.id group by li2.idlocal) nometipos from local l inner join tipo t on t.id = l.idtipo order by l.nome asc"));
			for (let i = 0; i < lista.length; i++) {
				let tmp = (lista[i].idtipos as string).split(",");
				lista[i].instalacoes = new Array(tmp.length);
				for (let j = 0; j < tmp.length; j++) {
					lista[i].instalacoes[j] = parseInt(tmp[j]);
				}
			}
		});

		return lista || [];
	}
	//METODO PESQUISAR LOCAL PELO NOME
	public static async pesquisar(nome: string): Promise<Local[]> {
		let lista: any[] = null;

		if (!nome) {
			return null;
		}

		await Sql.conectar(async (sql: Sql) => {
			lista = (await sql.query("select * from local where nome like '%?%' order by nome asc", [nome])) as Local[];
			//lista = (await sql.query("select l.id, l.nome, l.latitude, l.longitude, l.idtipo, t.nome nometipo, l.endereco, l.bairro, (select group_concat(li.idtipo) as idtipos from local_instalacao li where li.idlocal = l.id group by li.idlocal) idtipos, (select group_concat(t2.nome) as nometipos from local_instalacao li2 inner join tipo t2 on t2.id = li2.idtipo where li2.idlocal = l.id group by li2.idlocal) nometipos from local l inner join tipo t on t.id = l.idtipo order by l.nome asc"));
			/*for (let i = 0; i < lista.length; i++) {
				let tmp = (lista[i].idtipos as string).split(",");
				lista[i].instalacoes = new Array(tmp.length);
				for (let j = 0; j < tmp.length; j++) {
					lista[i].instalacoes[j] = parseInt(tmp[j]);
				}
			}  */
			
		});

		return (lista || []);
	}

	public static async obter(id: number): Promise<Local> {
		let lista: any[] = null;

		if (isNaN(id)) {
			return null;
		}

		await Sql.conectar(async (sql: Sql) => {
			lista = (await sql.query("select * from local where id = ? order by nome asc", [id])) as Local[];
			lista = (await sql.query("select l.id, l.nome, l.latitude, l.longitude, l.idtipo, t.nome nometipo, l.endereco, l.bairro, (select group_concat(li.idtipo) as idtipos from local_instalacao li where li.idlocal = l.id group by li.idlocal) idtipos, (select group_concat(t2.nome) as nometipos from local_instalacao li2 inner join tipo t2 on t2.id = li2.idtipo where li2.idlocal = l.id group by li2.idlocal) nometipos from local l inner join tipo t on t.id = l.idtipo where l.id = ?", [id]));
			for (let i = 0; i < lista.length; i++) {
				let tmp = (lista[i].idtipos as string).split(",");
				lista[i].instalacoes = new Array(tmp.length);
				for (let j = 0; j < tmp.length; j++) {
					lista[i].instalacoes[j] = parseInt(tmp[j]);
				}
			}
		});

		return (lista && lista[0]) || null;
	}

	public static async criar(t: Local, image: any): Promise<string> {
		let res: string;
		if ((res = Local.validar(t))) {
			return res;
		}

		await Sql.conectar(async (sql: Sql) => {
			try {
				sql.beginTransaction();

				await sql.query("insert into local (nome, latitude, longitude, idtipo, endereco, bairro) values (?, ?, ?, ?, ?, ?)", [t.nome, t.latitude, t.longitude, t.idtipo, t.endereco, t.bairro]);
				t.id = (await sql.scalar("select last_insert_id()")) as number;

				for (let i = 0; i < t.instalacoes.length; i++) {
					await sql.query("insert into local_instalacao (idlocal, idtipo) values (?, ?)", [t.id, t.instalacoes[i]]);
				}

				await Upload.gravarArquivo(image, "public/locais", t.id + ".jpg");

				sql.commit();
			} catch (e) {
				sql.rollback();
				if (e.code && e.code === "ER_DUP_ENTRY") {
					res = "O local já existe!";
				} else {
					throw e;
				}
			}
		});

		return res;
	}

	public static async alterar(t: Local): Promise<string> {
		let res: string;
		if ((res = Local.validar(t))) {
			return res;
		}

		if (isNaN(t.id)) {
			return "Dados inválidos!";
		}

		await Sql.conectar(async (sql: Sql) => {
			try {
				await sql.query("update local set nome = ?, latitude = ?, longitude = ?, idtipo = ?, endereco = ?, bairro =? where id = ?", [t.nome, t.latitude, t.longitude, t.idtipo, t.endereco, t.bairro, t.id]);
				if (!sql.linhasAfetadas) {
					res = "Tipo de local não encontrado!";
				}
			} catch (e) {
				if (e.code && e.code === "ER_DUP_ENTRY") {
					res = "O tipo de local já existe!";
				} else {
					throw e;
				}
			}
		});

		return res;
	}

	public static async excluir(id: number): Promise<string> {
		let res: string = null;

		if (isNaN(id)) {
			return "Dados inválidos!";
		}

		await Sql.conectar(async (sql: Sql) => {
			await sql.query("delete from local where id = ?", [id]);
			if (!sql.linhasAfetadas) {
				res = "Tipo de local não encontrado!";
			} else {
				let caminho = "public/locais/" + id + ".jpg";
				if (await FS.existeArquivo(caminho)) {
					await FS.excluirArquivo(caminho);
				}
			}
		});

		return res;
	}
};
