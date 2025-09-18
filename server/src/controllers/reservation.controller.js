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

    // Criar data local para evitar problemas de fuso horário
    const [year, month, day] = date.split('-').map(Number);
    const reservationDate = new Date(year, month - 1, day);
    
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
    const userId = req.user.id; // ID do usuário autenticado

    // Buscar a reserva primeiro para validações
    const reservation = await sql`
      SELECT r.*, c.name as court_name
      FROM reservations r
      JOIN courts c ON c.id = r.court_id
      WHERE r.id = ${id}
    `;

    if (reservation.length === 0) {
      return res.status(404).json({ message: "Reserva não encontrada" });
    }

    const reservationData = reservation[0];

    // Validação 1: Verificar se o usuário é o dono da reserva
    if (reservationData.user_id !== userId) {
      return res.status(403).json({ 
        message: "Você só pode cancelar suas próprias reservas" 
      });
    }

    // Validação 2: Verificar se a reserva não é do passado
    const now = new Date();
    const reservationDateTime = new Date(reservationData.date);
    reservationDateTime.setHours(reservationData.start_hour, 0, 0, 0);

    if (reservationDateTime <= now) {
      return res.status(400).json({ 
        message: "Não é possível cancelar reservas que já passaram" 
      });
    }

    // Validação 3: Verificar tempo mínimo para cancelamento (2 horas antes)
    const twoHoursFromNow = new Date(now.getTime() + (2 * 60 * 60 * 1000));
    
    if (reservationDateTime <= twoHoursFromNow) {
      return res.status(400).json({ 
        message: "Não é possível cancelar reservas com menos de 2 horas de antecedência" 
      });
    }

    // Se passou em todas as validações, cancelar a reserva
    const deleted = await sql`
      DELETE FROM reservations
      WHERE id = ${id}
      RETURNING *
    `;

    return res.json({ 
      message: "Reserva cancelada com sucesso", 
      reservation: deleted[0] 
    });
  } catch (err) {
    console.error("cancelReservation error:", err);
    return res.status(500).json({ message: "Erro interno", error: err.message });
  }
};

exports.getSchedule = async (req, res) => {
  try {
    const { courtId, date } = req.params;

    // Criar data local para evitar problemas de fuso horário
    const [year, month, day] = date.split('-').map(Number);
    const scheduleDate = new Date(year, month - 1, day);
    
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

