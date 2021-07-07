const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();
let instance = null;

const connection = mysql.createConnection({
    host: process.env.HOST,
    port: process.env.DB_PORT,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD
});

connection.connect(err => {
    if (err) console.log(err.message);
    else console.log("DB " + connection.state);
});

class DBService {
    static getDBServiceInstance() {
        if (instance) return instance;
        else {
            instance = new DBService();
            return instance;
        }
    }


    async insertNewName(name) {
        try {
            const dateAdded = new Date();
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO NAMES (name, date_added) VALUES (?, ?);";

                connection.query(query, [name, dateAdded], (error, result) => {
                    if (error) reject(new Error(error.message));
                    resolve(result.insertId);
                })
            });

            return {
                id: insertId,
                name: name,
                dateAdded: dateAdded
            }
        } catch(error) {
            console.log(error);
            return {
                id: "",
                name: "",
                dateAdded: ""
            }
        }
    }


    async getAllNames() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT id, name, date_added as dateAdded FROM names;";
                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getName(name) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT id, name, date_added as dateAdded FROM names" +
                              " WHERE name = ?;";
                connection.query(query, [name], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }


    async updateNameById(id, name) {
        try {
            const rowsUpdated = await new Promise((resolve, reject) => {
                const query = "UPDATE names SET name = ? WHERE id = ?";
                connection.query(query, [name, id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                });
            });

            return (rowsUpdated === 1) ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }


    async deleteNameById(id) {
        try {
            const rowsDeleted = await new Promise((resolve, reject) => {
                const query = "DELETE FROM names WHERE ID = ?;";

                connection.query(query, [id], (error, result) => {
                    if (error) reject(new Error(error.message));
                    resolve(result.affectedRows);
                });
            });

            return (rowsDeleted === 1) ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}

module.exports = DBService;