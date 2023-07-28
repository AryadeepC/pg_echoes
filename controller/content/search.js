const { pool } = require("../../config/db");
const { Err } = require("../../utils/ErrorResponse");

const search = async (req, res) => {
    const { q } = req.query;
    const queryString = q + ":*";
    // console.log(queryString);
    try {
        const searchResult = await pool.query("SELECT * FROM posts WHERE search_docs @@ to_tsquery('simple',$1) ORDER BY ts_rank(search_docs,to_tsquery('simple',$1))", [queryString]);

        if (!searchResult.rowCount) {
            // console.error(err);
            return res.send({ status: "error", message: "no result found", result: [] });
        }

        return res.send({ status: "ok", message: "search complete", result: searchResult.rows });
    } catch (error) {
        return Err(req, res, error.message);
    }
};

module.exports = { search };
