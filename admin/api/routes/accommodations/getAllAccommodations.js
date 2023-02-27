const { app } = require('../../database/conn');

module.exports = app.get('/accommodations', async (_, res) => {
  try {
    const [rows] = await global.connection.query('SELECT * FROM accommodation;');

  if (!rows)
    return res.status(422).json({ message: 'Record not found!' });
      
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  };
});
