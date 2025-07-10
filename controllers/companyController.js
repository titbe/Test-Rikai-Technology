const pool = require("../models/db");
const { formatVN } = require("../utils/common");

exports.list = async (req, res) => {
  const [companies] = await pool.query(
    "SELECT * FROM companies ORDER BY created_at DESC"
  );
  companies.forEach((c) => {
    c.created_at_formatted = formatVN(c.created_at);
  });

  res.render("companies", {
    title: "Companies",
    companies,
  });
};

exports.createForm = (req, res) => {
  res.render("company_form", {
    title: "Create Company",
    company: null,
  });
};

exports.create = async (req, res) => {
  const { name, address } = req.body;
  await pool.query("INSERT INTO companies (name, address) VALUES (?, ?)", [
    name,
    address,
  ]);
  res.redirect("/companies");
};

exports.editForm = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM companies WHERE id = ?", [
    req.params.id,
  ]);
  res.render("company_form", {
    title: "Edit Company",
    company: rows[0],
  });
};

exports.update = async (req, res) => {
  const { name, address } = req.body;
  await pool.query("UPDATE companies SET name = ?, address = ? WHERE id = ?", [
    name,
    address,
    req.params.id,
  ]);
  res.redirect("/companies");
};

exports.delete = async (req, res) => {
  await pool.query("DELETE FROM companies WHERE id = ?", [req.params.id]);
  res.redirect("/companies");
};
