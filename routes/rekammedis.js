const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const connection = require("../config/database");

// Rute untuk menampilkan semua rekam medis
router.get("/", (req, res) => {
    const sql = `
        SELECT 
            pasien.nama AS nama_pasien,
            pasien.no_rm AS no_rekam_medis,
            daftar_poli.keluhan,
            periksa.tgl_periksa,
            periksa.catatan,
            dokter.nama AS nama_dokter,
            poli.nama_poli AS poli,
            GROUP_CONCAT(obat.nama_obat SEPARATOR ', ') AS obat
        FROM 
            detail_periksa
        INNER JOIN periksa ON detail_periksa.id_periksa = periksa.id
        INNER JOIN obat ON detail_periksa.id_obat = obat.id
        INNER JOIN daftar_poli ON periksa.id_daftar_poli = daftar_poli.id
        INNER JOIN pasien ON daftar_poli.id_pasien = pasien.id
        INNER JOIN jadwal ON daftar_poli.id_jadwal = jadwal.id
        INNER JOIN dokter ON jadwal.id_dokter = dokter.id
        INNER JOIN poli ON dokter.id_poli = poli.id
        GROUP BY periksa.id
        ORDER BY periksa.tgl_periksa DESC`;

    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ status: false, message: "Internal Server Error" });
        }
        return res.status(200).json({ status: true, message: "List Rekam Medis", data: results });
    });
});

// Rute untuk menambahkan rekam medis baru
router.post(
    "/simpan",
    [
        body("id_pasien").notEmpty().withMessage("ID Pasien wajib diisi"),
        body("keluhan").notEmpty().withMessage("Keluhan wajib diisi"),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ status: false, errors: errors.array() });
        }

        const { id_pasien, keluhan, id_dokter, id_poli } = req.body;

        const formData = {
            id_pasien,
            keluhan,
            id_dokter,
            id_poli,
            tgl_periksa: new Date(), // Menyimpan tanggal sekarang
        };

        connection.query("INSERT INTO periksa SET ?", formData, (err, result) => {
            if (err) {
                return res.status(500).json({ status: false, message: "Internal Server Error" });
            }
            return res.status(201).json({ status: true, message: "Rekam medis berhasil disimpan", data: result });
        });
    }
);

// Rute untuk mengupdate data rekam medis
router.patch(
    "/update/:id",
    [
        body("keluhan").notEmpty().withMessage("Keluhan wajib diisi"),
        body("catatan").notEmpty().withMessage("Catatan wajib diisi"),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ status: false, errors: errors.array() });
        }

        const { keluhan, catatan } = req.body;
        const id = req.params.id;

        connection.query(
            "UPDATE periksa SET keluhan = ?, catatan = ? WHERE id = ?",
            [keluhan, catatan, id],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ status: false, message: "Internal Server Error" });
                }
                return res.status(200).json({ status: true, message: "Rekam medis berhasil diupdate" });
            }
        );
    }
);

// Rute untuk menghapus rekam medis
router.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    connection.query("DELETE FROM periksa WHERE id = ?", [id], (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: "Internal Server Error" });
        }
        return res.status(200).json({ status: true, message: "Rekam medis berhasil dihapus" });
    });
});

module.exports = router;
