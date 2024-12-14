const express = require('express');
const router = express.Router();
const db = require('../config/database'); // Koneksi database

// Get all riwayat pasien untuk dokter yang sedang login
router.get('/', (req, res) => {
    const { id_dokter } = req.query;
    const sql = `
        SELECT 
            daftar_poli.status_periksa, periksa.id, pasien.alamat, 
            pasien.id AS idPasien, pasien.no_ktp, pasien.no_hp, pasien.no_rm, 
            periksa.tgl_periksa, pasien.nama AS namaPasien, dokter.nama, daftar_poli.keluhan, 
            periksa.catatan, GROUP_CONCAT(obat.nama_obat) AS namaObat, 
            SUM(obat.harga) AS hargaObat 
        FROM detail_periksa 
        INNER JOIN periksa ON detail_periksa.id_periksa = periksa.id 
        INNER JOIN daftar_poli ON periksa.id_daftar_poli = daftar_poli.id 
        INNER JOIN pasien ON daftar_poli.id_pasien = pasien.id 
        INNER JOIN obat ON detail_periksa.id_obat = obat.id 
        INNER JOIN jadwal ON daftar_poli.id_jadwal = jadwal.id 
        INNER JOIN dokter ON jadwal.id_dokter = dokter.id  
        WHERE dokter.id = '${id_dokter}' AND status_periksa = '1' 
        GROUP BY pasien.id;
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ data: results });
    });
});

// Get detail riwayat pasien berdasarkan ID
router.get('/detail/:id', (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT 
            detail_periksa.id AS idDetailPeriksa,
            periksa.tgl_periksa, 
            pasien.nama AS namaPasien, dokter.nama, daftar_poli.keluhan, 
            periksa.catatan, GROUP_CONCAT(obat.nama_obat) AS namaObat, 
            SUM(obat.harga) + periksa.biaya_periksa AS hargaObat
        FROM detail_periksa 
        INNER JOIN periksa ON detail_periksa.id_periksa = periksa.id 
        INNER JOIN daftar_poli ON periksa.id_daftar_poli = daftar_poli.id 
        INNER JOIN pasien ON daftar_poli.id_pasien = pasien.id 
        INNER JOIN obat ON detail_periksa.id_obat = obat.id 
        INNER JOIN jadwal ON daftar_poli.id_jadwal = jadwal.id 
        INNER JOIN dokter ON jadwal.id_dokter = dokter.id 
        WHERE pasien.id = '${id}'
        GROUP BY periksa.tgl_periksa;
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }
        res.status(200).json({ data: results });
    });
});

module.exports = router;
