<template>
    <div class="main-content">
        <div class="page-content">
            <div class="container-fluid">
                <!-- title of page -->
                <div class="row">
                    <div class="col-12">
                        <div class="page-title-box d-sm-flex align-items-start justify-content-between">
                            <h4 class="mb-sm-0">Data Kewajiban</h4>
                            <div class="d-flex">
                                <button class="btn button-rounded me-2" type="button" :class="{'btn-light': selectedData.length <= 0, 'btn-danger': selectedData.length > 0}" :disabled="selectedData.length <= 0" @click="deletedDataBatch()">Hapus Terpilih</button>
                                <button type="button" class="btn btn-primary button-rounded" data-bs-toggle="modal" data-bs-target=".modal-form">Tambah Baru</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="d-flex mb-3" style="gap: 0.5rem">
                    <div class="w-100">
                        <div class="input-group-left">
                            <i class="mdi mdi-magnify fs-2 input-group-icon"></i>
                            <input type="text" class="form-control input-group-form" placeholder="Cari data item barang disini" v-model="params.keywords" @input="debouncedHandler">
                        </div>
                    </div>
                </div>
                <div class="spacer-medium"></div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="d-flex justify-content-between mb-3">
                            <p>Menampilkan {{pagination.total}} data</p>
                            <div>
                                <select class="form-select select-rounded padding-vertical-10" v-model="pagination.limit" @change="fetchData(1)">
                                    <option v-for="item in limit" :value="item">{{item}}</option>
                                </select>
                            </div>
                        </div>
                        <div class="card card-body custom-rounded-medium p-0">
                            <div class="table-responsive-md">
                                <table class="table table-bordered table-striped mb-0">
                                    <thead>
                                        <tr>
                                            <th width="2%" v-if="['superadmin', 'admin'].indexOf($store.state.user?.role?.toLowerCase()) != -1"><input type="checkbox" class="form-check-input" v-model="isCheckAll" @change="checkAll()" /></th>
                                            <th class="text-center">#</th>
                                            <th>Item</th>
                                            <th class="text-center">Quantity</th>
                                            <th>Nilai</th>
                                            <th>Kewajiban</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <template v-if="pagination.total">
                                            <tr v-for="item, index in list">
                                                <td class="middle-item" v-if="['superadmin', 'admin'].indexOf($store.state.user?.role?.toLowerCase()) != -1"><input type="checkbox" class="form-check-input" v-model="item.checked" /></td>
                                                <td class="middle-item text-center" style="width: 5%;">{{ (index + 1) + (pagination.page - 1) * pagination.limit }}</td>
                                                <td class="middle-item w-100"><div class="fw-bold">{{ item.name }}</div></td>
                                                <td class="middle-item text-center"><div class="fw-bold">{{ item.quantity }}</div></td>
                                                <td class="middle-item text-nowrap"><div class="fw-bold">Rp. {{ $toCurrency(item.total_amount, 0, 0) || '-' }}</div></td>
                                                <td class="middle-item text-nowrap"><div class="fw-bold">Rp. {{ $toCurrency(item.amount, 0, 0) || '-' }}</div></td>
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
                                    <tfoot>
                                        <tr>
                                            <th colspan="5" class="bg-primary text-white custom-rounded-medium-bottom-left">Total Kewajiban (Per Bulan)</th>
                                            <th colspan="2" class="bg-primary text-white custom-rounded-medium-bottom-right">Rp. {{ $toCurrency(400000, 0, 0) || '-' }}</th>
                                        </tr>
                                    </tfoot>
                                </table>
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
        <div class="modal fade modal-form custom-rounded-medium" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content custom-rounded-medium">
                    <div class="modal-header">
                        <h5 class="modal-title">Tambah Merk Barang</h5>
                        <button type="button" class="btn btn-square bg-white border" data-bs-dismiss="modal" ref="closeModal"><i class="ri-close-line fs-4"></i></button>
                    </div>
                    <div class="modal-body">
                        <Form :validation-schema="schema" @submit="handleSubmit" ref="form">
                            <h6 class="mb-3">Silahkan lengkapi form dibawah ini dengan benar.</h6>
                            <div class="form-group mb-3">
                                <label class="form-label">Item <span class="text-danger">*</span></label>
                                <Field type="text" name="name" class="form-control custom-rounded-medium mb-2" placeholder="Masukkan nama item" v-model="form.name"/>
                                <ErrorMessage name="name" :class="'text-danger'" />
                            </div>
                            <div class="form-group mb-3 row">
                                <div class="col-md-6">
                                    <label class="form-label">Quantity <span class="text-danger">*</span></label>
                                    <Field type="number" name="quantity" class="form-control custom-rounded-medium mb-2" placeholder="Masukkan jumlah item" v-model="form.quantity"/>
                                    <ErrorMessage name="quantity" :class="'text-danger'" />
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Kewajiban <span class="text-danger">*</span></label>
                                    <Field type="text" name="amount" v-money-mask class="form-control custom-rounded-medium mb-2" placeholder="Rp. xxx.xxx"/>
                                    <ErrorMessage name="amount" :class="'text-danger'" />
                                </div>
                            </div>
                            <div class="form-group mb-3">
                                <label class="form-label">Total</label>
                                <div class="alert alert-primary custom-rounded-medium mb-0">
                                    <div class="fs-3 fw-bold">Rp. 300.000</div>
                                </div>
                            </div>
                            <div class="spacer-medium"></div>
                            <div class="d-flex justify-content-end">
                                <button tyype="button" data-bs-dismiss="modal" class="btn border-light bg-white custom-rounded-medium me-2">Tutup</button>
                                <button type="submit" @click="validateBeforeSubmit" class="btn btn-primary custom-rounded-medium">Simpan</button>
                            </div>
                        </Form>
                    </div>
                </div>
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
    name: 'Category',
    data() {
        return {
            list: [
                { id: 1, name: 'Sewa Toko', quantity: 1, amount: 5000000, total_amount: 5000000 },
                { id: 2, name: 'Listrik', quantity: 1, amount: 750000, total_amount: 750000 },
                { id: 3, name: 'Gaji Karyawan', quantity: 3, amount: 2000000, total_amount: 6000000 },
                { id: 4, name: 'Air', quantity: 1, amount: 200000, total_amount: 200000 },
                { id: 5, name: 'Internet', quantity: 1, amount: 400000, total_amount: 400000 },
                { id: 6, name: 'Pajak', quantity: 1, amount: 1000000, total_amount: 1000000 },
                { id: 7, name: 'ATK', quantity: 1, amount: 150000, total_amount: 150000 },
                { id: 8, name: 'Kebersihan', quantity: 1, amount: 250000, total_amount: 250000 },
                { id: 9, name: 'Transportasi', quantity: 2, amount: 300000, total_amount: 600000 },
                { id: 10, name: 'Maintenance', quantity: 1, amount: 500000, total_amount: 500000 },
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
                id: '',
                name: '',
            },
            params: {
                keywords: '',
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
        }
    }
}
</script>