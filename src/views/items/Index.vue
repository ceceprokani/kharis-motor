<template>
    <div class="main-content">
        <div class="page-content">
            <div class="container-fluid">
                <!-- title of page -->
                <div class="row">
                    <div class="col-12">
                        <div class="page-title-box d-sm-flex align-items-start justify-content-between">
                            <h4 class="mb-sm-0">Data Barang</h4>
                            <div class="d-flex">
                                <button class="btn button-rounded me-2" type="button" :class="{'btn-light': selectedData.length <= 0, 'btn-danger': selectedData.length > 0}" :disabled="selectedData.length <= 0" @click="deletedDataBatch()">Hapus Terpilih</button>
                                <button type="button" class="btn btn-primary button-rounded" data-bs-toggle="modal" data-bs-target=".modal-form">Tambah Baru</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="table-fullscreen mb-4" :class="{'active p-3': fullScreen}">
                    <div class="d-flex mb-3" style="gap: 0.5rem">
                        <div class="w-100">
                            <div class="input-group-left">
                                <i class="mdi mdi-magnify fs-2 input-group-icon"></i>
                                <input type="text" class="form-control input-group-form" placeholder="Cari data barang disini" v-model="params.keywords" @input="debouncedHandler">
                            </div>
                        </div>
                    </div>
                    <div class="spacer-medium"></div>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="d-flex justify-content-between mb-3">
                                <p>Menampilkan {{pagination.total}} data barang</p>
                                <div>
                                    <select class="form-select select-rounded padding-vertical-10" v-model="pagination.limit" @change="fetchData(1)">
                                        <option v-for="item in limit" :value="item">{{item}}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="card card-body custom-rounded-medium p-0">
                                <div class="table-responsive">
                                    <table class="table table-bordered table-striped mb-4">
                                        <thead>
                                            <tr>
                                                <th width="2%" v-if="['superadmin', 'admin'].indexOf($store.state.user?.role?.toLowerCase()) != -1"><input type="checkbox" class="form-check-input" v-model="isCheckAll" @change="checkAll()" /></th>
                                                <th class="middle-item">#</th>
                                                <th class="middle-item">Nama</th>
                                                <th class="middle-item">HBR</th>
                                                <th class="middle-item">HBT</th>
                                                <th class="middle-item text-nowrap">Harga Beli Terakhir</th>
                                                <th class="middle-item text-nowrap">Harga Jual</th>
                                                <th class="middle-item text-nowrap">Harga Jual Pembulatan</th>
                                                <th class="middle-item">Qty</th>
                                                <th colspan=2 class="middle-item"><div class="d-flex"><i class="ri-calendar-2-line me-2"></i> Ditambahkan pada</div></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <template v-if="pagination.total">
                                                <tr v-for="item, index in list">
                                                    <td class="middle-item" v-if="['superadmin', 'admin'].indexOf($store.state.user?.role?.toLowerCase()) != -1"><input type="checkbox" class="form-check-input" v-model="item.checked" /></td>
                                                    <td class="middle-item text-center" style="width: 5%;">{{ (index + 1) + (pagination.page - 1) * pagination.limit }}</td>
                                                    <td class="middle-item w-100">
                                                        <div class="fw-bold">{{ item.code }} | {{ item.name }}</div>
                                                        <div class="d-flex">
                                                            <div class="badge bg-dark font-size-12 mt-1 me-2" v-if="item.brand">Merk : {{ item.brand }}</div>
                                                            <div class="badge bg-dark font-size-12 mt-1" v-if="item.category">Kategori : {{ item.category }}</div>
                                                        </div>
                                                    </td>
                                                    <td class="middle-item text-nowrap">Rp. {{ $toCurrency(item.purchase_price, 0, 0) || '-' }}</td>
                                                    <td class="middle-item text-nowrap">Rp. {{ $toCurrency(item.purchase_price, 0, 0) || '-' }}</td>
                                                    <td class="middle-item text-nowrap">Rp. {{ $toCurrency(item.purchase_price, 0, 0) || '-' }}</td>
                                                    <td class="middle-item text-nowrap">Rp. {{ $toCurrency(item.selling_price, 0, 0) || '-' }}</td>
                                                    <td class="middle-item text-nowrap">Rp. {{ $toCurrency(item.selling_price, 0, 0) || '-' }}</td>
                                                    <td class="middle-item fw-bold">{{ item.quantity }}</td>
                                                    <td class="middle-item text-nowrap" style="width: 18%">
                                                        {{ $changeFormatDate(item.date) }}
                                                    </td>
                                                    <td class="middle-item" v-if="['superadmin', 'admin'].indexOf($store.state.user?.role?.toLowerCase()) != -1">
                                                        <div class="d-flex justify-content-end align-items-center">
                                                            <button type="button" class="btn btn-square border bg-primary text-white me-2" data-bs-toggle="modal" data-bs-target=".modal-form"><i class="ri-edit-circle-line fs-4"></i></button>
                                                            <button type="button" class="btn btn-square border bg-white me-2" @click="deletedData(item)"><i class="ri-delete-bin-5-line fs-4"></i></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </template>
                                            <tr v-else>
                                                <td colspan="8" class="text-center text-muted">Data tidak tersedia</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <button type="button" class="btn btn-white border custom-rounded-medium toggle-table text-dark fw-bold" style="margin-bottom: 12px" @click="fullScreen = !fullScreen"><div class="d-flex align-items-center"><i class="mdi fs-5 me-2" :class="{'mdi-fullscreen-exit': fullScreen, 'mdi-fullscreen': !fullScreen}"></i> <span>{{ !fullScreen ? 'Perbesar' : 'Perkecil' }}</span></div></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row justify-content-center" v-if="pagination.total > 0">
                        <div class="col-auto">
                            <Pagination :page="pagination.page" :prev="pagination.prev" :next="pagination.next" v-on:fetchData="fetchData"></Pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade modal-form" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-fullscreen">
                <Form :validation-schema="schema" @submit="handleSubmit" ref="form" class="modal-content p-4">
                    <div class="modal-header border-0">
                        <h5 class="modal-title">Tambah Barang</h5>
                        <button type="button" class="btn btn-square bg-white border" data-bs-dismiss="modal" ref="closeModal"><i class="ri-close-line fs-4"></i></button>
                    </div>
                    <div class="modal-body">
                        <div class="d-block bg-light custom-rounded-medium p-3">
                            <h6 class="mb-4">Silahkan lengkapi form dibawah ini dengan benar.</h6>
                            <div class="form-group row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label">Kode <span class="text-danger">*</span></label>
                                    <Field type="text" name="code" class="form-control custom-rounded-medium mb-2" placeholder="Masukkan kode barang" v-model="form.code"/>
                                    <ErrorMessage name="code" :class="'text-danger'" />
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Nama <span class="text-danger">*</span></label>
                                    <Field type="text" name="name" class="form-control custom-rounded-medium mb-2" placeholder="Masukkan nama barang" v-model="form.name"/>
                                    <ErrorMessage name="name" :class="'text-danger'" />
                                </div>
                            </div>
                            <div class="form-group row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label">Merk <span class="text-danger">*</span></label>
                                    <Field name="brand" as="select" class="form-select select-rounded padding-vertical-10 mb-2" v-model="form.position_id">
                                        <option value="">Pilih Merk &nbsp;</option>
                                        <option v-for="item in listBrand" :value="item.id">{{ item.name }} &nbsp;</option>
                                    </Field>
                                    <ErrorMessage name="brand" :class="'text-danger'" />
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Kategori <span class="text-danger">*</span></label>
                                    <Field name="category" as="select" class="form-select select-rounded padding-vertical-10 mb-2" v-model="form.position_id">
                                        <option value="">Pilih Kategori &nbsp;</option>
                                        <option v-for="item in listCategory" :value="item.id">{{ item.name }} &nbsp;</option>
                                    </Field>
                                    <ErrorMessage name="category" :class="'text-danger'" />
                                </div>
                            </div>
                            <div class="form-group mb-3 bg-white custom-rounded-medium">
                                <div class="border-bottom p-3">
                                    <label class="form-label mb-0">Harga Beli Barang</label>
                                </div>
                                <div class="row px-3">
                                    <div class="col-md-4 py-3">
                                        <label class="form-label">Harga Beli Rendah <span class="text-danger">*</span></label>
                                        <Field type="text" name="purchase_price_low" v-money-mask class="form-control custom-rounded-medium mb-2" placeholder="Rp. xxx.xxx"/>
                                        <ErrorMessage name="name" :class="'text-danger'" />
                                    </div>
                                    <div class="col-md-4 py-3 border-start border-end">
                                        <label class="form-label">Harga Beli Tinggi <span class="text-danger">*</span></label>
                                        <Field type="text" name="purchase_price_high" v-money-mask class="form-control custom-rounded-medium mb-2" placeholder="Rp. xxx.xxx"/>
                                        <ErrorMessage name="name" :class="'text-danger'" />
                                    </div>
                                    <div class="col-md-4 py-3">
                                        <label class="form-label">Harga Beli Akhir <span class="text-danger">*</span></label>
                                        <Field type="text" name="purchase_price_high" v-money-mask class="form-control custom-rounded-medium mb-2" placeholder="Rp. xxx.xxx"/>
                                        <ErrorMessage name="name" :class="'text-danger'" />
                                    </div>
                                </div>
                            </div>
                            <div class="form-group mb-3 bg-white custom-rounded-medium">
                                <div class="border-bottom p-3">
                                    <label class="form-label mb-0">Penjualan Barang</label>
                                </div>
                                <div class="row px-3">
                                    <div class="col-md-6">
                                        <div class="alert alert-success p-3 custom-rounded-medium">
                                            <div class="d-flex align-items-center">
                                                <i class="ri-creative-commons-nc-fill fs-1 me-3"></i>
                                                <div class="d-block w-100">
                                                    <div class="d-flex justify-content-between">
                                                        <div>Harga Jual Bawah</div>
                                                        <div class="badge bg-success fw-bold pb-0 fs-6">15%</div>
                                                    </div>
                                                    <div class="fs-2 fw-bold">Rp. 2.000.000</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="alert alert-success p-3 custom-rounded-medium">
                                            <div class="d-flex align-items-center">
                                                <i class="ri-funds-fill fs-1 me-3"></i>
                                                <div class="d-block w-100">
                                                    <div class="d-flex justify-content-between">
                                                        <div>Harga Jual Tinggi</div>
                                                        <div class="badge bg-success fw-bold pb-0 fs-6">30%</div>
                                                    </div>
                                                    <div class="fs-2 fw-bold">Rp. 2.500.000</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group mb-3">
                                <label class="form-label">Jumlah <span class="text-danger">*</span></label>
                                <Field type="number" name="quantity" class="form-control custom-rounded-medium mb-2" placeholder="Masukkan jumlah barang" v-model="form.quantity"/>
                                <ErrorMessage name="quantity" :class="'text-danger'" />
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer border-0">
                        <div class="d-flex justify-content-end">
                            <button tyype="button" data-bs-dismiss="modal" class="btn border-light bg-white custom-rounded-medium me-2">Tutup</button>
                            <button type="submit" @click="validateBeforeSubmit" class="btn btn-primary custom-rounded-medium">Simpan</button>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    </div>
</template>
<script>
import { ApiCore } from '@/services/core';
import apiEndPoint from '@/services/api-endpoint';

import { Field, Form, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

import {debounce, filter, map} from 'lodash'

export default {
    name: 'ItemsList',
    data() {
        return {
            fullScreen: false,
            list: [
                { id: 1, code: 'BRG001', name: 'Oli Mesin', purchase_price: 50000, selling_price: 65000, quantity: 20, date: '2024-06-01 08:15:23', brand: 'Pertamina', category: 'Pelumas' },
                { id: 2, code: 'BRG002', name: 'Kampas Rem', purchase_price: 30000, selling_price: 45000, quantity: 15, date: '2024-06-02 09:30:45', brand: 'Aspira', category: 'Rem' },
                { id: 3, code: 'BRG003', name: 'Busi', purchase_price: 15000, selling_price: 25000, quantity: 50, date: '2024-06-03 10:05:12', brand: 'NGK', category: 'Kelistrikan' },
                { id: 4, code: 'BRG004', name: 'Aki', purchase_price: 250000, selling_price: 300000, quantity: 8, date: '2024-06-04 11:20:33', brand: 'GS Astra', category: 'Kelistrikan' },
                { id: 5, code: 'BRG005', name: 'Filter Udara', purchase_price: 20000, selling_price: 35000, quantity: 18, date: '2024-06-05 12:45:55', brand: 'Honda', category: 'Filter' },
                { id: 6, code: 'BRG006', name: 'Lampu Depan', purchase_price: 40000, selling_price: 60000, quantity: 12, date: '2024-06-06 13:10:07', brand: 'Philips', category: 'Kelistrikan' },
                { id: 7, code: 'BRG007', name: 'Ban Luar', purchase_price: 150000, selling_price: 200000, quantity: 10, date: '2024-06-07 14:25:19', brand: 'IRC', category: 'Ban' },
                { id: 8, code: 'BRG008', name: 'Ban Dalam', purchase_price: 35000, selling_price: 50000, quantity: 25, date: '2024-06-08 15:40:41', brand: 'FDR', category: 'Ban' },
                { id: 9, code: 'BRG009', name: 'Rantai', purchase_price: 60000, selling_price: 80000, quantity: 14, date: '2024-06-09 16:55:02', brand: 'SSS', category: 'Penggerak' },
                { id: 10, code: 'BRG010', name: 'Spion', purchase_price: 25000, selling_price: 40000, quantity: 30, date: '2024-06-10 17:15:29', brand: 'Yamaha', category: 'Aksesoris' }
            ],
            listBrand: [
                { id: 1, name: 'Yamaha' },
                { id: 2, name: 'Honda' },
                { id: 3, name: 'Suzuki' },
                { id: 4, name: 'Kawasaki' },
                { id: 5, name: 'Federal Oil' }
            ],
            listCategory: [
                { id: 1, name: 'Pelumas' },
                { id: 2, name: 'Rem' },
                { id: 3, name: 'Kelistrikan' },
                { id: 4, name: 'Ban' },
                { id: 5, name: 'Aksesoris' }
            ],
            detail: {},
            isCheckAll: false,
            pagination: {
                prev: false,
                next: false,
                page: 1,
                limit: 10,
                total: 10
            },
            form: {
                name: ''
            },
            params: {
                keywords: '',
                location_id: '',
                department_id: ''
            },
            limit: [10,20,30,50,100],
        }
    },
    components: {
        Field, Form, ErrorMessage
    },
    computed: {
        selectedData() {
            return filter(this.list, function(data) { return data.checked; })
        },
        schema() {
            return yup.object({
                name: yup.string().required('Masukkan nama merk barang'),
            });
        }
    },
    mounted() {
        // this.fetchData(1)
    },
    created() {
        this.debouncedHandler = debounce(() => {
            this.pagination.page = 1
            this.fetchData(this.pagination.page)
        }, 500);
    },
    beforeUnmount() {
        this.debouncedHandler.cancel();
    },
    methods: {
        fetchData(page) {
            this.pagination.page = page
            ApiCore.get(`${apiEndPoint.ADMINISTRATION_USER}`, {
                page: page,
                limit: this.pagination.limit,
                status: this.currTab,
                ...this.params
            }, true).then((result) => {
                if (result.status) {
                    this.list = result.data
                }
                this.pagination.prev = page > 1
                this.pagination.next = result.pagination.total > 1 && page < result.pagination.total
                this.pagination.page = page
                this.pagination.total = result.pagination.total
            })
        },
        async deletedData(data) {
            this.$swal
                .fire({
                    title: 'Apakah kamu yakin ?',
                    html: `Kamu akan menghapus data dengan nama <b>${data.name}</b>`,
                    icon: 'warning',
                    showDenyButton: true,
                    showCancelButton: false,
                    confirmButtonText: 'Ya',
                    confirmButtonColor: '#091c48',
                    denyButtonColor: '#c0c0c0',
                    denyButtonText: 'Tidak',
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            this.fetch = true
                            const process = await ApiCore.delete(`${apiEndPoint.ADMINISTRATION_USER}`, data.user_id)
                            this.fetch = false
                            if (process.status) {
                                this.$toast.success('Data berhasil dihapus!');
                                this.fetchData(this.pagination.page);
                            } else {
                                this.$toast.error('Data gagal dihapus!');
                            }
                        } catch(error) {
                            this.fetch = false
                            this.$toast.error(error);
                        }
                    }
                });
        },
        async deletedDataBatch() {
            const selectedId = map(this.selectedData, 'id');
            this.$swal
                .fire({
                    title: 'Apakah kamu yakin ?',
                    html: `Kamu akan menghapus <b>${selectedId.length} data</b> data terpilih`,
                    icon: 'warning',
                    showDenyButton: true,
                    showCancelButton: false,
                    confirmButtonText: 'Ya',
                    confirmButtonColor: '#091c48',
                    denyButtonColor: '#c0c0c0',
                    denyButtonText: 'Tidak',
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            this.fetch = true
                            const process = await ApiCore.bulkDelete(`${apiEndPoint.ADMINISTRATION_USER}/bulk-delete`, {ids: selectedId})
                            this.fetch = false
                            this.isCheckAll = false
                            if (process.status) {
                                this.$toast.success('Data berhasil dihapus!');
                                this.fetchData(this.pagination.page);
                            } else {
                                this.$toast.error('Data gagal dihapus!');
                            }
                        } catch(error) {
                            this.fetch = false
                            this.$toast.error(error);
                        }
                    }
            })
        },
        showPassword(data) {
            this.detail = data
        },
        checkAll() {
            this.list.forEach(element => {
                element.checked = this.isCheckAll
            });
        },
        async validateBeforeSubmit() {
            const form = this.$refs.form;
            const { valid, errors } = await form.validate();

            if (!valid) {
                this.$toast.error('Silahkan lengkapi data terlebih dahulu!');
                return;
            }
        },
        async handleSubmit() {
            try {
                const result = await ApiCore.store(`${apiEndPoint.ADMINISTRATION_USER}/save`, {...this.form})
                this.fetch = false
                if (result.status) {
                    this.$router.push({name: 'manage-users'})
                    this.$toast.success(result.message);
                } else {
                    this.$toast.error(result.status);
                }
            } catch(error) {
                this.fetch = false

                let message = error.message || error.code

                this.$toast.error(message);
            }
        },
    }
}
</script>