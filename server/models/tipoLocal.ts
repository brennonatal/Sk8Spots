import Sql = require("../infra/sql");

export = class TipoLocal {
	public id: number;
	public nome: string;

	private static validar(t: TipoLocal): string {
		if (!t) {
			return "Dados inválidos!";
		}

		t.nome = (t.nome || "").normalize().trim();
		if (t.nome.length < 3 || t.nome.length > 50) {
			return "Nome do tipo de local inválido!";
		}

		return null;
	}

	public static async listar(): Promise<TipoLocal[]> {
		let lista: TipoLocal[] = null;

		await Sql.conectar(async (sql: Sql) => {
			lista = (await sql.query("select id, nome from tipo_local order by nome asc")) as TipoLocal[];
		});

		return lista || [];
	}

	public static async obter(id: number): Promise<TipoLocal> {
		let lista: TipoLocal[] = null;

		if (isNaN(id)) {
			return null;
		}

		await Sql.conectar(async (sql: Sql) => {
			lista = (await sql.query("select id, nome from tipo_local where id = ? order by nome asc", [id])) as TipoLocal[];
		});

		return (lista && lista[0]) || null;
	}

	public static async criar(t: TipoLocal): Promise<string> {
		let res: string;
		if ((res = TipoLocal.validar(t))) {
			return res;
		}

		await Sql.conectar(async (sql: Sql) => {
			try {
				await sql.query("insert into tipo_local (nome) values (?)", [t.nome]);
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

	public static async alterar(t: TipoLocal): Promise<string> {
		let res: string;
		if ((res = TipoLocal.validar(t))) {
			return res;
		}

		if (isNaN(t.id)) {
			return "Dados inválidos!";
		}

		await Sql.conectar(async (sql: Sql) => {
			try {
				await sql.query("update tipo_local set nome = ? where id = ?", [t.nome, t.id]);
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
			await sql.query("delete from tipo_local where id = ?", [id]);
			if (!sql.linhasAfetadas) {
				res = "Tipo de local não encontrado!";
			}
		});

		return res;
	}
};
