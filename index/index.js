const express = require("express");
const app = express();
const port = 3000;

// import body parser
const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
// import routes poli
const postsRouter = require("./routes/poli");
app.use("/api/poli", postsRouter);

const dokterRoutes = require("./routes/dokter");
app.use("/api/dokter", dokterRoutes);

const pasienRoutes = require("./routes/pasien");
app.use("/api/pasien", pasienRoutes);

const obatRoutes = require("./routes/obat");
app.use("/api/obat", obatRoutes);

const rekamMedisRouter = require("./routes/rekammedis");
app.use("/api/rekamMedis", rekamMedisRouter);

const jadwalPeriksaRouter = require("./routes/jadwalPeriksa");
app.use("/api/jadwalPeriksa", rekamMedisRouter);

const periksaPasienRouter = require("./routes/periksaPasien");
app.use("/api/periksaPasien", rekamMedisRouter);

const riwayatRouter = require("./routes/riwayatPasien");
app.use("/api/riwayatPasien", rekamMedisRouter);

app.listen(port, () => {
    console.log(`app running at http://localhost:${port}`);
});
