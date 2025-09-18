const { sql } = require("../db");

// Listar todas as quadras
exports.listCourts = async (req, res) => {
  try {
    const courts = await sql`SELECT id, name, location FROM courts ORDER BY name`;
    return res.json(courts);
  } catch (err) {
    console.error("listCourts error:", err);
    return res.status(500).json({ message: "Erro interno", error: err.message });
  }
};

// Criar reserva de 1h
exports.createReservation = async (req, res) => {
  try {
    const { userId, courtId, date, startHour } = req.body;

    if (!userId || !courtId || !date || startHour == null) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }

    const reservationDate = new Date(date);
    if (isNaN(reservationDate.getTime())) {
      return res.status(400).json({ message: "Data inválida" });
    }

    // Verifica se já existe reserva para a mesma quadra e hora
    const existing = await sql`
      SELECT id
      FROM reservations
      WHERE court_id = ${courtId} AND date = ${reservationDate} AND start_hour = ${startHour}
    `;
    if (existing.length > 0) {
      return res.status(409).json({ message: "Horário já reservado" });
    }

    // Inserir reserva
    const inserted = await sql`
      INSERT INTO reservations (user_id, court_id, date, start_hour, end_hour)
      VALUES (${userId}, ${courtId}, ${reservationDate}, ${startHour}, ${startHour + 1})
      RETURNING *
    `;

    return res.status(201).json({
      message: "Reserva criada com sucesso",
      reservation: inserted[0]
    });
  } catch (err) {
    // captura erro de unicidade do banco
    if (err && err.code === "23505") {
      return res.status(409).json({ message: "Horário já reservado" });
    }
    console.error("createReservation error:", err);
    return res.status(500).json({ message: "Erro interno", error: err.message });
  }
};

// Listar reservas de um usuário
exports.listReservations = async (req, res) => {
  try {
    const { userId } = req.params;

    const reservations = await sql`
      SELECT r.id, r.date, r.start_hour, r.end_hour, c.name as court_name
      FROM reservations r
      JOIN courts c ON c.id = r.court_id
      WHERE r.user_id = ${userId}
      ORDER BY r.date, r.start_hour
    `;

    return res.json(reservations);
  } catch (err) {
    console.error("listReservations error:", err);
    return res.status(500).json({ message: "Erro interno", error: err.message });
  }
};

// Cancelar reserva
exports.cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await sql`
      DELETE FROM reservations
      WHERE id = ${id}
      RETURNING *
    `;

    if (deleted.length === 0) {
      return res.status(404).json({ message: "Reserva não encontrada" });
    }

    return res.json({ message: "Reserva cancelada com sucesso", reservation: deleted[0] });
  } catch (err) {
    console.error("cancelReservation error:", err);
    return res.status(500).json({ message: "Erro interno", error: err.message });
  }
};

exports.getSchedule = async (req, res) => {
  try {
    const { courtId, date } = req.params;

    const scheduleDate = new Date(date);
    if (isNaN(scheduleDate.getTime())) {
      return res.status(400).json({ message: "Data inválida" });
    }

    // Horários do dia
    const hours = [];
    for (let h = 8; h < 22; h++) {
      hours.push({ startHour: h, endHour: h + 1, reserved: false });
    }

    // Buscar reservas existentes
    const reservations = await sql`
      SELECT start_hour
      FROM reservations
      WHERE court_id = ${courtId} AND date = ${scheduleDate}
    `;

    const reservedHours = reservations.map(r => r.start_hour);

    // Marcar horários reservados
    const schedule = hours.map(slot => ({
      ...slot,
      reserved: reservedHours.includes(slot.startHour)
    }));

    return res.json({ date: scheduleDate.toISOString().split("T")[0], courtId, schedule });
  } catch (err) {
    console.error("getSchedule error:", err);
    return res.status(500).json({ message: "Erro interno", error: err.message });
  }
};

