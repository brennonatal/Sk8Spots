import Sql = require("../infra/sql");

export = class TipoLocal {
    public id_tipo_local: number;
    public nome_tipo_local: string;

    private static validar(s: TipoLocal): string {
		s.nome_tipo_local = (s.nome_tipo_local || "").trim();
        if (s.nome_tipo_local.length < 3 || s.nome_tipo_local.length > 255) {
            return "Nome do tipo de local inválido!";
        }

        return null;
    }

    public static async listar(): Promise<TipoLocal[]> {
        let lista: TipoLocal[] = null;

        await Sql.conectar(async (sql: Sql) => {
            lista = await sql.query("select id_tipo_local, nome_tipo_local from tipo_local order by nome_tipo_local asc") as TipoLocal[];
        });

        return (lista || []);
    }

    public static async obter(id_tipo_local: number): Promise<TipoLocal> {
        let lista: TipoLocal[] = null;

        await Sql.conectar(async (sql: Sql) => {
            lista = await sql.query("select id_tipo_local, nome_tipo_local from tipo_local where id_tipo_local = ? order by nome_tipo_local asc", [id_tipo_local]) as TipoLocal[];
        });

        return ((lista && lista[0]) || null);
    }

    public static async criar(s: TipoLocal): Promise<string> {
        let res: string;
        if ((res = TipoLocal.validar(s)))
            return res;

        await Sql.conectar(async (sql: Sql) => {
            try {
                await sql.query(`insert into tipo_local (nome_tipo_local) values (?)`, [s.nome_tipo_local]);
            } catch (e) {
                if (e.code && e.code === "ER_DUP_ENTRY")
                    res = "O tipo de local já existe!";
                else
                    throw e;
            }
        });

        return res;
    }

    public static async alterar(s: TipoLocal): Promise<string> {
        let res: string;
        if ((res = TipoLocal.validar(s)))
            return res;

        await Sql.conectar(async (sql: Sql) => {
            try {
                await sql.query("update tipo_local set nome_tipo_local = ? where id_tipo_local = " + s.id_tipo_local, [s.nome_tipo_local]);
                res = sql.linhasAfetadas.toString();
            } catch (e) {
                if (e.code && e.code === "ER_DUP_ENTRY")
                    res = "O tipo de local já existe!";
                else
                    throw e;
            }
        });

        return res;
    }

    public static async excluir(id_tipo_local: number): Promise<string> {
        let res: string = null;

        await Sql.conectar(async (sql: Sql) => {
            await sql.query("delete from tipo_local where id_tipo_local = " + id_tipo_local);
            res = sql.linhasAfetadas.toString();
        });

        return res;
    }

}