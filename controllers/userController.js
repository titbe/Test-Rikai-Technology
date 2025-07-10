const pool = require("../models/db");
const { formatVN } = require("../utils/common");

exports.list = async (req, res) => {
  const { company_id, search } = req.query;

  let sql = `
    SELECT users.*, companies.name AS company_name
    FROM users
    LEFT JOIN companies ON users.company_id = companies.id
    WHERE 1=1
  `;
  let params = [];

  if (company_id) {
    sql += " AND users.company_id = ?";
    params.push(company_id);
  }

  if (search) {
    sql += " AND users.name LIKE ?";
    params.push("%" + search + "%");
  }

  sql += " ORDER BY users.created_at DESC";

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
