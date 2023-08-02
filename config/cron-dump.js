const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../config.env") });
const { pool } = require("./db");
const shell = require('shelljs');

const dbDump = async () => {
    const date = new Date();
    const currentDate = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}.${date.getHours()}.${date.getMinutes()}`;
    const fileName = `database-backup-${currentDate}.sql`;
    try {
        // Backup a database at 11:59 PM every day.
        console.log(" -- DB DUMP -- ".padStart(10));
        if (shell.exec(`pg_dump -d ${process.env.POSTGRES_URL} -f backup/${fileName} -F p`).code !== 0) {
            throw new Error('Database Backup Aborted')
        }
        else {
            shell.echo('Database Backup Complete');
        }
    } catch (error) {
        console.error(error);
    } finally {
        console.log(" -- DB DUMP END -- ".padStart(10));
    }
}

module.exports = { dbDump };
