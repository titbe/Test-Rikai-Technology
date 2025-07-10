const pool = require("../models/db");
const { formatVN } = require("../utils/common");
const { Parser } = require("json2csv");

exports.list = async (req, res) => {
  const { company_id, search } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;

  let sql = `
    SELECT users.*, companies.name AS company_name
    FROM users
    LEFT JOIN companies ON users.company_id = companies.id
    WHERE 1=1
  `;
  let countSql = `
    SELECT COUNT(*) AS count
    FROM users
    LEFT JOIN companies ON users.company_id = companies.id
    WHERE 1=1
  `;
  let params = [];
  let countParams = [];

  if (company_id) {
    sql += " AND users.company_id = ?";
    countSql += " AND users.company_id = ?";
    params.push(company_id);
    countParams.push(company_id);
  }

  if (search) {
    sql += " AND users.name LIKE ?";
    countSql += " AND users.name LIKE ?";
    params.push("%" + search + "%");
    countParams.push("%" + search + "%");
  }

  sql += " ORDER BY users.created_at DESC LIMIT ? OFFSET ?";
  params.push(limit, offset);

  const [[{ count }]] = await pool.query(countSql, countParams);
  const totalPages = Math.ceil(count / limit);

  const [users] = await pool.query(sql, params);
  const [companies] = await pool.query("SELECT * FROM companies");

  users.forEach((u) => {
    u.created_at_formatted = formatVN(u.created_at);
  });

  res.render("users", {
    title: "Users",
    users,
    companies,
    filter: { company_id, search },
    pagination: { page, totalPages }
  });
};


exports.createForm = async (req, res) => {
  const [companies] = await pool.query("SELECT * FROM companies");
  res.render("user_form", {
    title: "Create User",
    user: null,
    companies,
  });
};

exports.create = async (req, res) => {
  const { name, email, company_id } = req.body;
  await pool.query(
    "INSERT INTO users (name, email, company_id) VALUES (?, ?, ?)",
    [name, email, company_id]
  );
  res.redirect("/users");
};

exports.editForm = async (req, res) => {
  const [userRows] = await pool.query("SELECT * FROM users WHERE id = ?", [
    req.params.id,
  ]);
  const [companies] = await pool.query("SELECT * FROM companies");
  res.render("user_form", {
    title: "Edit User",
    user: userRows[0],
    companies,
  });
};

exports.update = async (req, res) => {
  const { name, email, company_id } = req.body;
  await pool.query(
    "UPDATE users SET name = ?, email = ?, company_id = ? WHERE id = ?",
    [name, email, company_id, req.params.id]
  );
  res.redirect("/users");
};

exports.delete = async (req, res) => {
  await pool.query("DELETE FROM users WHERE id = ?", [req.params.id]);
  res.redirect("/users");
};

exports.exportCSV = async (req, res) => {
  const [users] = await pool.query(`
    SELECT users.id, users.name, users.email, companies.name AS company_name, users.created_at
    FROM users
    LEFT JOIN companies ON users.company_id = companies.id
    ORDER BY users.created_at DESC
  `);

  const fields = ['id', 'name', 'email', 'company_name', 'created_at'];
  const opts = { fields };
  const parser = new Parser(opts);
  const csv = parser.parse(users);

  res.header('Content-Type', 'text/csv');
  res.attachment('users.csv');
  res.send(csv);
};