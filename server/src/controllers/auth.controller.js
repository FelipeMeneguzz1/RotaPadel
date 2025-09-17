const { sql } = require("../db");
const bcrypt = require("bcrypt");

// Helpers
function onlyDigits(str = "") {
  return str.replace(/\D/g, "");
}

function validateEmail(email) {
  if (!email) return false;
  // validação simples
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateCPF(rawCpf) {
  if (!rawCpf) return false;
  const cpf = onlyDigits(rawCpf);
  if (!/^\d{11}$/.test(cpf)) return false;
  // rejeita CPF com todos dígitos iguais (ex: 11111111111)
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  const calcCheck = (nums, factor) => {
    let total = 0;
    for (let i = 0; i < nums.length; i++) {
      total += nums[i] * (factor - i);
    }
    const remainder = total % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const digits = cpf.split("").map(d => Number(d));
  const first = calcCheck(digits.slice(0, 9), 10);
  if (first !== digits[9]) return false;
  const second = calcCheck(digits.slice(0, 10), 11);
  if (second !== digits[10]) return false;
  return true;
}

function isValidDateString(d) {
  if (!d) return false;
  const date = new Date(d);
  return !Number.isNaN(date.getTime());
}

exports.register = async (req, res) => {
  try {
    const { email, password, confirmPassword, cpf, birthDate, phone, role } = req.body;

    // 1) validações básicas
    if (!email || !password || !confirmPassword || !cpf) {
      return res.status(400).json({ message: "email, senha, confirmarSenha e cpf são obrigatórios" });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "email inválido" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "senhas não coincidem" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "senha deve ter ao menos 6 caracteres" });
    }
    if (!validateCPF(cpf)) {
      return res.status(400).json({ message: "CPF inválido" });
    }
    if (birthDate && !isValidDateString(birthDate)) {
      return res.status(400).json({ message: "data de nascimento inválida" });
    }

    const emailNormalized = String(email).trim().toLowerCase();
    const cpfClean = onlyDigits(cpf);
    const phoneClean = phone ? onlyDigits(phone) : null;
    const userRole = "user";

    // 2) checar se email ou CPF já existem
    const existing = await sql`
      SELECT id, email, cpf
      FROM users
      WHERE email = ${emailNormalized} OR cpf = ${cpfClean}
      LIMIT 1
    `;
    if (existing.length > 0) {
      const row = existing[0];
      if (row.email === emailNormalized) {
        return res.status(409).json({ message: "Email já cadastrado" });
      }
      if (row.cpf === cpfClean) {
        return res.status(409).json({ message: "CPF já cadastrado" });
      }
    }

    // 3) hash da senha
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 4) inserir no banco
    const inserted = await sql`
      INSERT INTO users (email, password_hash, cpf, birth_date, phone, role)
      VALUES (${emailNormalized}, ${passwordHash}, ${cpfClean}, ${birthDate || null}, ${phoneClean}, ${userRole})
      RETURNING id, email, cpf, role, created_at
    `;

    const user = inserted[0];
    return res.status(201).json({
      message: "Usuário criado com sucesso",
    });
  } catch (err) {
    console.error("register error:", err);
    if (err && err.code === "23505") {
      return res.status(409).json({ message: "Email ou CPF já cadastrado" });
    }
    return res.status(500).json({ message: "Erro interno", error: err.message });
  }
};

const jwt = require("jsonwebtoken");

// Função helper para gerar token JWT
function generateJWT(user) {
  // Payload do token
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role
  };

  // Secret e tempo de expiração
  const secret = process.env.JWT_SECRET || "segredo_super_forte";
  const expiresIn = "1h"; // 1 hora

  return jwt.sign(payload, secret, { expiresIn });
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email e senha são obrigatórios" });
    }

    const emailNormalized = String(email).trim().toLowerCase();

    // Buscar usuário pelo email
    const users = await sql`
      SELECT id, email, password_hash, role
      FROM users
      WHERE email = ${emailNormalized}
      LIMIT 1
    `;
    if (users.length === 0) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const user = users[0];

    // Verificar senha
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    // Gerar token JWT
    const token = generateJWT(user);

    return res.json({
      message: "Login realizado com sucesso",
      token
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ message: "Erro interno", error: err.message });
  }
};

//Esqueci minha senha
const { sendRecoveryCode } = require("../utils/email");

function generateCode(length = 6) {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
}

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "email é obrigatório" });

    const emailNormalized = String(email).trim().toLowerCase();

    // Verificar se usuário existe
    const users = await sql`
      SELECT id, email
      FROM users
      WHERE email = ${emailNormalized}
      LIMIT 1
    `;
    if (users.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const user = users[0];
    const code = generateCode(6);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

    // Inserir no banco
    await sql`
      INSERT INTO password_resets (user_id, code, expires_at)
      VALUES (${user.id}, ${code}, ${expiresAt})
    `;

    // Enviar e-mail
    await sendRecoveryCode(user.email, code);

    return res.json({ message: "Código de recuperação enviado por e-mail" });
  } catch (err) {
    console.error("forgotPassword error:", err);
    return res.status(500).json({ message: "Erro interno", error: err.message });
  }
};

//Reset de senha
exports.resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword, confirmPassword } = req.body;
    if (!email || !code || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Senhas não coincidem" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Senha deve ter ao menos 6 caracteres" });
    }

    const emailNormalized = String(email).trim().toLowerCase();

    // Buscar usuário
    const users = await sql`
      SELECT id
      FROM users
      WHERE email = ${emailNormalized}
      LIMIT 1
    `;
    if (users.length === 0) return res.status(404).json({ message: "Usuário não encontrado" });

    const user = users[0];

    // Verificar código
    const codes = await sql`
      SELECT id, expires_at, used
      FROM password_resets
      WHERE user_id = ${user.id} AND code = ${code} AND used = false
      ORDER BY created_at DESC
      LIMIT 1
    `;
    if (codes.length === 0) return res.status(400).json({ message: "Código inválido ou já usado" });

    const reset = codes[0];
    if (new Date(reset.expires_at) < new Date()) {
      return res.status(400).json({ message: "Código expirado" });
    }

    // Atualizar senha
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await sql`
      UPDATE users
      SET password_hash = ${passwordHash}
      WHERE id = ${user.id}
    `;

    // Marcar código como usado
    await sql`
      UPDATE password_resets
      SET used = true
      WHERE id = ${reset.id}
    `;

    return res.json({ message: "Senha redefinida com sucesso" });
  } catch (err) {
    console.error("resetPassword error:", err);
    return res.status(500).json({ message: "Erro interno", error: err.message });
  }
};
