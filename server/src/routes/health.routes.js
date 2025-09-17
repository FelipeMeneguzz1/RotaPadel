const router = require("express").Router();
const { sql } = require("../db");

router.get("/", async (req, res) => {
  try {
    const [{ now }] = await sql`SELECT NOW() as now`;
    res.json({ ok: true, now });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;
