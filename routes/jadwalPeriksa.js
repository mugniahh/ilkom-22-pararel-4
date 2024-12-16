const express = require('express');
const router = express.Router();
const db = require('../config/database'); // Import koneksi database

// Get all jadwal periksa
router.get('/', (req, res) => {
    const sql = `
        SELECT jadwal.id, jadwal.id_dokter, jadwal.mulai, jadwal.status, 
        dokter.nama AS nama_dokter, poli.nama_poli 
        FROM jadwal 
        INNER JOIN dokter ON jadwal.id_dokter = dokter.id 
        INNER JOIN poli ON dokter.id_poli = poli.id`;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ data: results });
    });
});

// Get jadwal periksa by id
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT jadwal.id, jadwal.id_dokter, jadwal.mulai, jadwal.status, 
        dokter.nama AS nama_dokter, poli.nama_poli 
        FROM jadwal 
        INNER JOIN dokter ON jadwal.id_dokter = dokter.id 
        INNER JOIN poli ON dokter.id_poli = poli.id 
        WHERE jadwal.id = ?`;

    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Jadwal not found' });
        }
        res.json({ data: results[0] });
    });
});

// Create new jadwal periksa
router.post('/', (req, res) => {
    const { id_dokter, mulai, status } = req.body;

    if (!id_dokter || !mulai || !status) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const sql = 'INSERT INTO jadwal (id_dokter, mulai, status) VALUES (?, ?, ?)';
    db.query(sql, [id_dokter, mulai, status], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Jadwal created', id: result.insertId });
    });
});

// Update jadwal periksa
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { mulai, status } = req.body;

    const sql = 'UPDATE jadwal SET mulai = ?, status = ? WHERE id = ?';
    db.query(sql, [mulai, status, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Jadwal not found' });
        }
        res.json({ message: 'Jadwal updated' });
    });
});

// Delete jadwal periksa
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM jadwal WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Jadwal not found' });
        }
        res.json({ message: 'Jadwal deleted' });
    });
});

module.exports = router;
