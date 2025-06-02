<template>
    <div class="main-content">
        <div class="page-content">
            <div class="container-fluid">
                <!-- title of page -->
                <div class="row">
                    <div class="col-12">
                        <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                            <h4 class="mb-sm-0">Hallo, {{ $store.state?.user?.name }}</h4>
                        </div>
                    </div>
                </div>
                <!-- statistic employee -->
                <div class="row">
                    <div class="col-md-4 col-sm-6" v-if="['superadmin', 'admin'].indexOf($store.state.user?.role?.toLowerCase()) != -1">
                        <div class="card custom-rounded-medium">
                            <div class="card-body">
                                <div class="d-flex">
                                    <div class="avatar-md">
                                        <span class="avatar-title rounded-circle bg-primary h1">
                                            <i class="ri-gift-2-line text-white"></i>
                                        </span>
                                    </div>
                                    <div class="d-block ms-3">
                                        <p class="mb-1 text-dark">Total Merk Barang</p>
                                        <div class="d-flex align-items-end"><h1 class="mb-0 me-2 fw-bold text-primary">{{statistic.total_candidate | 0}}</h1> <span class="font-size-12 mb-1">data</span></div>
                                    </div>
                                </div>
                            </div>
                            <!-- end card-body -->
                        </div>
                        <!-- end card -->
                    </div>
                    <div class="col-md-4 col-sm-6" v-if="['superadmin', 'admin'].indexOf($store.state.user?.role?.toLowerCase()) != -1">
                        <div class="card custom-rounded-medium">
                            <div class="card-body">
                                <div class="d-flex">
                                    <div class="avatar-md">
                                        <span class="avatar-title rounded-circle bg-info h1">
                                            <i class="ri-stack-overflow-line text-white"></i>
                                        </span>
                                    </div>
                                    <div class="d-block ms-3">
                                        <p class="mb-1 text-dark">Total Kategori Barang</p>
                                        <div class="d-flex align-items-end"><h1 class="mb-0 me-2 fw-bold text-info">{{statistic.total_candidate_passed | 0}}</h1> <span class="font-size-12 mb-1">data</span></div>
                                    </div>
                                </div>
                            </div>
                            <!-- end card-body -->
                        </div>
                        <!-- end card -->
                    </div>
                    <div class="col-md-4 col-sm-6" v-if="['superadmin', 'admin'].indexOf($store.state.user?.role?.toLowerCase()) != -1">
                        <div class="card custom-rounded-medium">
                            <div class="card-body">
                                <div class="d-flex">
                                    <div class="avatar-md">
                                        <span class="avatar-title rounded-circle bg-warning h1">
                                            <i class="ri-dropbox-line text-white"></i>
                                        </span>
                                    </div>
                                    <div class="d-block ms-3">
                                        <p class="mb-1 text-dark">Total Barang</p>
                                        <div class="d-flex align-items-end"><h1 class="mb-0 me-2 fw-bold text-warning">{{statistic.total_candidate_failed | 0}}</h1> <span class="font-size-12 mb-1">orang</span></div>
                                    </div>
                                </div>
                            </div>
                            <!-- end card-body -->
                        </div>
                        <!-- end card -->
                    </div>
                    <div class="col-md-6 col-sm-12" v-if="['superadmin', 'admin'].indexOf($store.state.user?.role?.toLowerCase()) != -1">
                        <div class="card custom-rounded-medium">
                            <div class="card-body">
                                <div class="d-flex">
                                    <div class="avatar-md">
                                        <span class="avatar-title rounded-circle bg-success h1">
                                            <i class="ri-coins-fill text-white"></i>
                                        </span>
                                    </div>
                                    <div class="d-block ms-3">
                                        <p class="mb-1 text-dark">Jumlah Pemasukan Bulan Juni 2025</p>
                                        <div class="d-flex align-items-end"><h1 class="mb-0 me-2 fw-bold text-success">{{statistic.total_admin | 0}}</h1> <span class="font-size-12 mb-1">rupiah</span></div>
                                    </div>
                                </div>
                            </div>
                            <!-- end card-body -->
                        </div>
                        <!-- end card -->
                    </div>
                    <div class="col-md-6 col-sm-12" v-if="['superadmin', 'admin'].indexOf($store.state.user?.role?.toLowerCase()) != -1">
                        <div class="card custom-rounded-medium">
                            <div class="card-body">
                                <div class="d-flex">
                                    <div class="avatar-md">
                                        <span class="avatar-title rounded-circle bg-danger h1">
                                            <i class="ri-exchange-dollar-fill text-white"></i>
                                        </span>
                                    </div>
                                    <div class="d-block ms-3">
                                        <p class="mb-1 text-dark">Jumlah Pengeluaran Bulan Juni 2025</p>
                                        <div class="d-flex align-items-end"><h1 class="mb-0 me-2 fw-bold text-danger">{{statistic.total_admin | 0}}</h1> <span class="font-size-12 mb-1">rupiah</span></div>
                                    </div>
                                </div>
                            </div>
                            <!-- end card-body -->
                        </div>
                        <!-- end card -->
                    </div>
                    <!-- end col -->
                </div>
                <div class="row mb-3" v-if="['superadmin', 'admin', 'koordinator', 'manajer'].indexOf($store.state.user?.role?.toLowerCase()) != -1">
                    <div class="col-md-12">
                        <div class="card custom-rounded-medium">
                            <div class="card-body">
                                <div class="d-flex justify-content-between mb-4 align-items-center">
                                    <div class="d-block">
                                        <h4>Daftar Barang Yang Baru Ditambahkan</h4>
                                        <div class="mb-sm-0 text-muted">Berikut ini adalah daftar barang yang baru ditambahkan ke sistem</div>
                                    </div>
                                    <div class="d-block">
                                        <router-link :to="`items`" class="btn custom-rounded-medium btn-outline-primary py-2">
                                            <div class="d-flex align-items-center mb-0">
                                                <div>Lihat Selengkapnya</div>
                                                <i class="ri-arrow-right-s-line fs-5 ms-2"></i>
                                            </div>
                                        </router-link>
                                    </div>
                                </div>
                                <table class="table table-custom-card mb-0">
                                    <thead>
                                        <tr>
                                            <th class="middle-item text-center" width="5%">#</th>
                                            <th class="middle-item">Nama</th>
                                            <th class="middle-item">Harga Beli</th>
                                            <th class="middle-item">Harga Jual</th>
                                            <th class="middle-item">Qty</th>
                                            <th class="middle-item">Tanggal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <template v-if="statistic.last_item?.length > 0">
                                            <tr v-for="item, index in statistic.last_item">
                                                <td class="middle-item text-center" style="width: 5%;">{{ (index + 1) }}</td>
                                                <td class="middle-item">
                                                    <div class="fw-bold">{{ item.name }}</div>
                                                    <div class="badge bg-dark font-size-12 mt-1 me-2" v-if="item.brand">Merk : {{ item.brand }}</div>
                                                    <div class="badge bg-dark font-size-12 mt-1" v-if="item.category">Kategori : {{ item.category }}</div>
                                                </td>
                                                <td class="middle-item">Rp. {{ $toCurrency(item.purchase_price, 0, 0) || '-' }}</td>
                                                <td class="middle-item">Rp. {{ $toCurrency(item.selling_price, 0, 0) || '-' }}</td>
                                                <td class="middle-item fw-bold">{{ item.quantity }}</td>
                                                <td class="middle-item text-nowrap" style="width: 18%">
                                                    <div class="d-flex align-items-center px-3 py-2 bg-light border custom-rounded-medium mb-1 fw-bold">
                                                        <i class="mdi mdi-calendar-month me-2"></i>
                                                        {{ $changeFormatDate(item.date, 'DD MMMM YYYY') }}
                                                    </div>
                                                </td>
                                            </tr>
                                        </template>
                                        <template v-else>
                                            <tr>
                                                <td colspan="5" class="text-muted disabled text-center">
                                                    Data tidak ditemukan
                                                </td>
                                            </tr>
                                        </template>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import simplebar from 'simplebar-vue';
import 'simplebar-core/dist/simplebar.css';

import { ApiCore } from '@/services/core';
import apiEndPoint from '@/services/api-endpoint';

export default {
    name: 'Home',
    data() {
        return {
            fetching: false,
            statistic: {
                last_item: [
                    { id: 1, name: 'Oli Mesin', purchase_price: 50000, selling_price: 65000, quantity: 20, date: '2024-06-01', brand: 'Pertamina', category: 'Pelumas' },
                    { id: 2, name: 'Kampas Rem', purchase_price: 30000, selling_price: 45000, quantity: 15, date: '2024-06-02', brand: 'Aspira', category: 'Rem' },
                    { id: 3, name: 'Busi', purchase_price: 15000, selling_price: 25000, quantity: 50, date: '2024-06-03', brand: 'NGK', category: 'Kelistrikan' },
                    { id: 4, name: 'Aki', purchase_price: 250000, selling_price: 300000, quantity: 8, date: '2024-06-04', brand: 'GS Astra', category: 'Kelistrikan' },
                    { id: 5, name: 'Filter Udara', purchase_price: 20000, selling_price: 35000, quantity: 18, date: '2024-06-05', brand: 'Honda', category: 'Filter' },
                    { id: 6, name: 'Lampu Depan', purchase_price: 40000, selling_price: 60000, quantity: 12, date: '2024-06-06', brand: 'Philips', category: 'Kelistrikan' },
                    { id: 7, name: 'Ban Luar', purchase_price: 150000, selling_price: 200000, quantity: 10, date: '2024-06-07', brand: 'IRC', category: 'Ban' },
                    { id: 8, name: 'Ban Dalam', purchase_price: 35000, selling_price: 50000, quantity: 25, date: '2024-06-08', brand: 'FDR', category: 'Ban' },
                    { id: 9, name: 'Rantai', purchase_price: 60000, selling_price: 80000, quantity: 14, date: '2024-06-09', brand: 'SSS', category: 'Penggerak' },
                    { id: 10, name: 'Spion', purchase_price: 25000, selling_price: 40000, quantity: 30, date: '2024-06-10', brand: 'Yamaha', category: 'Aksesoris' }
                ]
            },
        }
    },
    components: {
        simplebar
    },
    mounted() {
        // this.fetchData()
    },
    methods: {
        fetchData() {
            this.fetching = true
            ApiCore.get(`${apiEndPoint.ADMINISTRATION_DASHBOARD}`, {}).then((result) => {
                if (result.status) {
                    this.statistic = result.data
                }
                this.fetching = false
            }).catch(() => {
                this.fetching = false
            })
        },
    }
}
</script>