const express = require('express');
const router = express.Router();
const db = require('../config/database'); // Koneksi database

// Get all Poli (medical departments)
router.get('/poli', (req, res) => {
    const sql = 'SELECT * FROM poli';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ data: results });
    });
});

// Get available Jadwal (schedule) for a selected Poli
router.post('/jadwal', (req, res) => {
    const { poliId } = req.body;
    const sql = 'SELECT * FROM jadwal WHERE poli_id = ?';
    db.query(sql, [poliId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ data: results });
    });
});

// Register a new Daftar Poli (medical registration)
router.post('/daftarPoli', (req, res) => {
    const { no_rm, poli, jadwal, keluhan } = req.body;
    const sql = 'INSERT INTO daftar_poli (no_rm, poli_id, jadwal_id, keluhan) VALUES (?, ?, ?, ?)';
    db.query(sql, [no_rm, poli, jadwal, keluhan], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Registration Successful', id: result.insertId });
    });
});

// Get all Daftar Poli (registrations) for a patient
router.get('/daftarPoli/:no_rm', (req, res) => {
    const { no_rm } = req.params;
    const sql = `
        SELECT dp.id, p.nama_poli, d.nama, j.mulai, dp.no_antrian 
        FROM daftar_poli dp
        JOIN jadwal j ON dp.jadwal_id = j.id
        JOIN dokter d ON j.dokter_id = d.id
        JOIN poli p ON d.poli_id = p.id
        WHERE dp.no_rm = ?
    `;
    db.query(sql, [no_rm], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ data: results });
    });
});

module.exports = router;
