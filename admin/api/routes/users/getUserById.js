const { app, conn } = require("../../database/conn");
const User = require("../../models/User");

module.exports = app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // checar se usuário existe
    const result = await User.findByPk(id);
    if (!result) return res.status(422).json({ message: "User not found!" });

    // validação do req.params.id em ser apenas números
    if (!id.match(/^[0-9]*$/)) {
      return res.status(400).json({ message: "Just numbers, please!" });
    }

    // uso de 'mysql.escape()' para evitar ataques de SQL injection
    const sql1 =
      `SELECT * , "" as password FROM users WHERE id = ` + conn.escape(id);
    const [user] = await conn.query(sql1);

    if (!user) return res.status(422).json({ message: "User not found!" });

    // uso de 'mysql.escape()' para evitar ataques de SQL injection
    const sql2 = `SELECT * FROM addresses WHERE userId = ` + conn.escape(id);
    const [address] = await conn.query(sql2);

    // uso de 'mysql.escape()' para evitar ataques de SQL injection
    const sql3 = `SELECT * FROM reservations WHERE userId = ` + conn.escape(id);
    const [reservations] = await conn.query(sql3);

    return res.status(200).json({ user, address, reservations });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  };
});
