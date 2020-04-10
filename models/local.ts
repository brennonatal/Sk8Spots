import Sql = require("../infra/sql");
import { IncomingMessage } from "http";
import { BinaryData } from "fs";

export = class Local {
	public id: number;
	public nome: string;
	public latitude: string;
	public longitude: string;
	public idtipo: number;
	public endereco: string;
	public bairro: string;
	public instalacoes: number;
	public image: BinaryData;

	private static validar(t: Local): string {
		if (!t) {
			return "Dados inválidos!";
		}

		t.nome = (t.nome || "").normalize().trim();
		if (t.nome.length < 3 || t.nome.length > 50) {
			return "Nome do tipo de local inválido!";
		}

		//t.idtipo = (t.idtipo);
		if (t.idtipo === 0 || t.idtipo > 5) {
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

		if (t.instalacoes != t.idtipo) {
			return "Tipo de instalação inválido!";
		}

		if(t.image == null){
			return "Adicione uma foto!"
		}

		return null;
	}

	public static async listar(): Promise<Local[]> {
		let lista: Local[] = null;

		await Sql.conectar(async (sql: Sql) => {
			lista = (await sql.query("select * from local order by nome asc")) as Local[];
		});

		return lista || [];
	}

	public static async obter(id: number): Promise<Local> {
		let lista: Local[] = null;

		if (isNaN(id)) {
			return null;
		}

		await Sql.conectar(async (sql: Sql) => {
			lista = (await sql.query("select * from local where id = ? order by nome asc", [id])) as Local[];
		});

		return (lista && lista[0]) || null;
	}

	public static async criar(t: Local): Promise<string> {
		let res: string;
		if ((res = Local.validar(t))) {
			return res;
		}

		await Sql.conectar(async (sql: Sql) => {
			try {
				// Duvida de como adicionar a instalação
				await sql.query("insert into local (nome, latitude, longitude, idtipo, endereco, bairro) values (?, ?, ?, ?, ?, ?)", [t.nome, t.latitude, t.longitude, t.idtipo, t.endereco, t.bairro]);
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
			}
		});

		return res;
	}
};
