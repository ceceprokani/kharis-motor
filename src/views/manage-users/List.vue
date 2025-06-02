<template>
    <div class="main-content">
        <div class="page-content">
            <div class="container-fluid">
                <!-- title of page -->
                <div class="row">
                    <div class="col-12">
                        <div class="page-title-box d-sm-flex align-items-start justify-content-between">
                            <h4 class="mb-sm-0">Data Pengguna</h4>
                            <div class="d-flex">
                                <button class="btn button-rounded me-2" type="button" :class="{'btn-light': selectedData.length <= 0, 'btn-danger': selectedData.length > 0}" :disabled="selectedData.length <= 0" @click="deletedDataBatch()">Hapus Terpilih</button>
                                <router-link :to="{name: 'manage-users.add'}" class="btn btn-primary button-rounded">Tambah Baru</router-link>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="d-flex mb-3" style="gap: 0.5rem">
                    <div class="w-100">
                        <div class="input-group-left">
                            <i class="mdi mdi-magnify fs-2 input-group-icon"></i>
                            <input type="text" class="form-control input-group-form" placeholder="Cari data pengguna disini" v-model="params.keywords" @input="debouncedHandler">
                        </div>
                    </div>
                </div>
                <div class="spacer-medium"></div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="d-flex justify-content-between">
                            <p>Menampilkan {{pagination.total}} data pengguna</p>
                            <div>
                                <select class="form-select select-rounded padding-vertical-10" v-model="pagination.limit" @change="fetchData(1)">
                                    <option v-for="item in limit" :value="item">{{item}}</option>
                                </select>
                            </div>
                        </div>
                        <div class="table-responsive-md">
                            <table class="table table-custom-card">
                                <thead>
                                    <tr>
                                        <th width="2%" v-if="['superadmin', 'admin'].indexOf($store.state.user?.role?.toLowerCase()) != -1"><input type="checkbox" class="form-check-input" v-model="isCheckAll" @change="checkAll()" /></th>
                                        <th>Nama</th>
                                        <th>Email</th>
                                        <th>Telepon</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <template v-if="pagination.total">
                                        <tr v-for="item, index in list">
                                            <td class="middle-item" v-if="['superadmin', 'admin'].indexOf($store.state.user?.role?.toLowerCase()) != -1"><input type="checkbox" class="form-check-input" v-model="item.checked" v-if="$store.state.user?.id != item.id" /></td>
                                            <td class="middle-item">
                                                <div class="fw-bold">{{ item.name }}</div>
                                                <div>{{ item.nip }}</div>
                                            </td>
                                            <td class="middle-item">{{ item.email || '-' }}</td>
                                            <td class="middle-item text-nowrap" v-phone-mask>{{ item.phone || '-' }}</td>
                                            <td class="middle-item" v-if="['superadmin', 'admin'].indexOf($store.state.user?.role?.toLowerCase()) != -1">
                                                <div class="d-flex justify-content-end align-items-center">
                                                    <button type="button" class="btn btn-white border custom-rounded-medium me-2 fw-bold" @click="showPassword(item)" data-bs-toggle="modal" data-bs-target=".modal-detail"><div class="d-flex align-items-center"><i class="ri-lock-line me-2 fs-5"></i> Lihat Password</div></button>
                                                    <router-link :to="`manage-users/form/${item.id}`" type="button" class="btn btn-square border bg-primary text-white me-2"><i class="ri-edit-circle-line fs-4"></i></router-link>
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
    <div class="modal fade modal-detail custom-rounded-medium" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content custom-rounded-medium">
                <div class="modal-header">
                    <div class="d-block px-2">
                        <p class="modal-title mb-1">Lihat Password</p>
                        <h5>{{ detail.nip }} - {{ detail.name }}</h5>
                    </div>
                </div>
                <div class="modal-body">
                    <div class="d-block custom-rounded-medium p-3 bg-light fw-bold fs-3 text-center">
                        {{ detail.password_raw ? $decryptAES(detail.password_raw) : '' }}
                    </div>
                </div>
                <div class="modal-footer p-3">
                    <button type="button" class="btn btn-white border waves-effect custom-rounded-medium fw-bold px-3" data-bs-dismiss="modal">Tutup</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { ApiCore } from '@/services/core';
import apiEndPoint from '@/services/api-endpoint';

import {debounce, filter, map} from 'lodash'

export default {
    name: 'ListUser',
    data() {
        return {
            list: [],
            detail: {},
            isCheckAll: false,
            pagination: {
                prev: false,
                next: false,
                page: 1,
                limit: 10,
                total: 0
            },
            params: {
                keywords: '',
                location_id: '',
                department_id: ''
            },
            limit: [10,20,30,50,100],
        }
    },
    computed: {
        selectedData() {
            return filter(this.list, function(data) { return data.checked; })
        },
    },
    mounted() {
        this.fetchData(1)
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