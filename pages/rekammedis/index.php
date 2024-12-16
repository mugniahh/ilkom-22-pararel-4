<!-- Content Header (Page header) -->
<div class="content-header">
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0">Rekam Medis</h1>
            </div><!-- /.col -->
            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="index.php?page=home">Home</a></li>
                    <li class="breadcrumb-item active">Rekam Medis</li>
                </ol>
            </div><!-- /.col -->
        </div><!-- /.row -->
    </div><!-- /.container-fluid -->
</div>
<!-- /.content-header -->

<!-- Main content -->
<div class="content">
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Daftar Riwayat Pasien</h3>
                        <div class="card-tools">
                            <!-- Tambahkan tombol/fitur jika diperlukan -->
                        </div>
                    </div>
                    <!-- /.card-header -->

                    <div class="card-body table-responsive p-0">
                        <table class="table table-hover text-nowrap">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Tanggal Periksa</th>
                                    <th>Nama Pasien</th>
                                    <th>Keluhan</th>
                                    <th>Catatan</th>
                                    <th>Obat</th>
                                    <th>Nama Dokter</th>
                                    <th>Poli</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                // Ambil data dari API
                                $url = "http://localhost:3000/api/rekammedis";
                                $ch = curl_init();
                                curl_setopt($ch, CURLOPT_URL, $url);
                                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

                                $response = curl_exec($ch);

                                if (curl_errno($ch)) {
                                    echo "<tr><td colspan='8'>Error: " . curl_error($ch) . "</td></tr>";
                                } else {
                                    $status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

                                    // Validasi respons
                                    if ($status_code == 200) {
                                        $datas = json_decode($response, true);
                                        if (isset($datas['data']) && is_array($datas['data'])) {
                                            $nomor = 1;
                                            foreach ($datas['data'] as $data) {
                                                echo "<tr>
                                                        <td>{$nomor}</td>
                                                        <td>{$data['tgl_periksa']}</td>
                                                        <td>{$data['nama_pasien']}</td>
                                                        <td>{$data['keluhan']}</td>
                                                        <td style='white-space: pre-line;'>{$data['catatan']}</td>
                                                        <td style='white-space: pre-line;'>{$data['obat']}</td>
                                                        <td>{$data['nama_dokter']}</td>
                                                        <td>{$data['poli']}</td>
                                                    </tr>";
                                                $nomor++;
                                            }
                                        } else {
                                            echo "<tr><td colspan='8'>Data tidak ditemukan atau format tidak valid.</td></tr>";
                                        }
                                    } else {
                                        echo "<tr><td colspan='8'>Error: Tidak dapat mengambil data dari API. Status Code: {$status_code}</td></tr>";
                                    }
                                }
                                curl_close($ch);
                                ?>
                            </tbody>
                        </table>
                    </div>
                    <!-- /.card-body -->
                </div>
                <!-- /.card -->
            </div>
        </div>
        <!-- /.row -->
    </div><!-- /.container-fluid -->
</div>
<!-- /.content -->
