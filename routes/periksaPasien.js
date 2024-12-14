const express = require('express');
const router = express.Router();
const db = require('../config/database'); // Koneksi database

// Get all periksaPasien
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM periksaPasien';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ data: results });
    });
});

// Get periksaPasien by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM periksaPasien WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Pasien not found' });
        }
        res.json({ data: results[0] });
    });
});

// Create new periksaPasien
router.post('/', (req, res) => {
    const { nama, id_daftar_poli, tanggal_periksa, catatan, status_periksa } = req.body;
    const sql = 'INSERT INTO periksaPasien (nama, id_daftar_poli, tanggal_periksa, catatan, status_periksa) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [nama, id_daftar_poli, tanggal_periksa, catatan, status_periksa], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Pasien successfully created', id: result.insertId });
    });
});

// Update periksaPasien
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nama, id_daftar_poli, tanggal_periksa, catatan, status_periksa } = req.body;
    const sql = 'UPDATE periksaPasien SET nama = ?, id_daftar_poli = ?, tanggal_periksa = ?, catatan = ?, status_periksa = ? WHERE id = ?';
    db.query(sql, [nama, id_daftar_poli, tanggal_periksa, catatan, status_periksa, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pasien not found' });
        }
        res.json({ message: 'Pasien successfully updated' });
    });
});

// Delete periksaPasien
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM periksaPasien WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pasien not found' });
        }
        res.json({ message: 'Pasien successfully deleted' });
    });
});

module.exports = router;
