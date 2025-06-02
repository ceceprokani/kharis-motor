<template>
    <div class="main-content">
        <div class="page-content">
            <div class="container-fluid">
                <!-- title of page -->
                <div class="row">
                    <div class="col-12">
                        <div class="page-title-box d-sm-flex align-items-start justify-content-between">
                            <h4 class="mb-sm-0">Rekap Nilai</h4>
                            <div class="d-flex">
                                <button class="btn btn-white button-rounded me-2" type="button">Unduh Laporan</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="d-flex mb-3" style="gap: 0.5rem">
                    <div class="w-100">
                        <div class="input-group-left">
                            <i class="mdi mdi-magnify fs-2 input-group-icon"></i>
                            <input type="text" class="form-control input-group-form" placeholder="Cari data kandidat disini" v-model="params.keywords" @input="debouncedHandler">
                        </div>
                    </div>
                </div>
                <div class="spacer-medium"></div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="d-flex justify-content-between">
                            <p>Menampilkan {{pagination.total}} data kandidat</p>
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
                                        <th width="2%">#</th>
                                        <th>Nama</th>
                                        <th>Telepon</th>
                                        <th>Melamar Posisi</th>
                                        <th>Tanggal Psikotest</th>
                                        <th>Nilai</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <template v-if="pagination.total">
                                        <tr v-for="item, index in list">
                                            <td class="middle-item">
                                                {{ (index + 1) + (pagination.page - 1) * pagination.limit }}
                                            </td>
                                            <td class="middle-item">
                                                <div class="fw-bold">{{ item.name }}</div>
                                                <div>{{ item.nik }}</div>
                                            </td>
                                            <td class="middle-item text-nowrap" v-phone-mask>{{ item.phone || '-' }}</td>
                                            <td class="middle-item">{{ item.position_name || '-' }}</td>
                                            <td class="middle-item" v-if="item.has_answer">{{ item.date || '-' }}</td>
                                            <td class="middle-item fw-bold" v-if="item.has_answer">
                                                <div class="alert alert-danger px-3 py-2 custom-rounded-medium fs-5 text-center mb-0">
                                                    {{ item.result_exam.total_score }}
                                                </div>
                                            </td>
                                            <td class="middle-item" v-if="['superadmin', 'admin'].indexOf($store.state.user?.role?.toLowerCase()) != -1 && item.has_answer">
                                                <div class="d-flex justify-content-end align-items-center" v-if="!item.evaluation_status">
                                                    <button type="button" class="btn btn-primary custom-rounded-medium me-2" @click="updateStatus(item, 'approve')"><div class="d-flex align-items-center"><i class="ri-thumb-up-line me-2"></i> Terima</div></button>
                                                    <button type="button" class="btn btn-white border custom-rounded-medium me-2" @click="updateStatus(item, 'reject')"><div class="d-flex align-items-center"><i class="ri-thumb-down-line me-2"></i> Tolak</div></button>
                                                    <div class="dropdown dropstart">
                                                        <button class="btn btn-square border bg-white dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                            <i class="mdi mdi-dots-vertical fs-4"></i>
                                                        </button>
                                                        <div class="dropdown-menu custom-rounded-medium" data-popper-placement="top-end">
                                                            <a class="dropdown-item py-2" :href="item.attachment_card_identity" target="_blank">Lihat KTP</a>
                                                            <a class="dropdown-item py-2" :href="item.attachment_cv" target="_blank">Lihat CV</a>
                                                            <!-- a class="dropdown-item py-2" href="javascript:void(0)" data-bs-toggle="modal" data-bs-target=".modal-resign">Lihat Hasil Jawaban</!-->
                                                        </div>
                                                    </div>
                                                </div>
                                                <div v-else class="text-center">
                                                    <div v-if="item.evaluation_status == 'passed'" class="badge bg-success text-white fs-6">
                                                        DITERIMA
                                                    </div>
                                                    <template v-else>
                                                        <div class="badge bg-dark text-white fs-6 mb-1">
                                                            TIDAK DITERIMA
                                                        </div>
                                                        <div>
                                                            <button class="btn btn-link py-1" type="button" data-bs-toggle="modal" data-bs-target=".modal-reason" @click="detail = item">
                                                                <div class="d-flex">
                                                                    <i class="ri-search-line me-2"></i>
                                                                    Lihat Alasan
                                                                </div>
                                                            </button>
                                                        </div>
                                                    </template>
                                                </div>
                                            </td>
                                            <td class="middle-item" v-if="!item.has_answer" colspan="3">
                                                Belum mengerjakan psikotest
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
    <div class="modal fade modal-reason custom-rounded-medium" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content custom-rounded-medium">
                <div class="modal-header align-items-start">
                    <div class="d-block">
                        <h5>Alasan Penolakan</h5>
                        <h6>{{ detail.name }} | {{ detail.position_name }}</h6>
                    </div>
                    <button type="button" class="btn text-muted p-1 custom-rounded-medium" data-bs-dismiss="modal" aria-label="Close" ref="closeModalUpload"><i class="ri-close-circle-line fs-3"></i></button>
                </div>
                <div class="modal-body">
                    <div class="d-flex flex-column align-items-center mb-3 justify-content-center bg-light custom-rounded-medium p-3">
                        {{ detail.evaluation_note }}
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

import {debounce, filter} from 'lodash'

import { Field, Form, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'

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
            togglePasswordVisibility: [false, false],
        }
    },
    components: {
        simplebar, Field, Form, ErrorMessage
    },
    setup() {
        const schema = yup.object({
            resign_request_date: yup.string().required('Masukan tanggal pengajuan'),
            resign_effective_date: yup.string().required('Masukan tanggal efektif keluar'),
            resign_attachment: yup.string().required('Pilih lampiran dokumen'),
        });

        return {
            schema,
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
            ApiCore.get(`${apiEndPoint.ADMINISTRATION_REPORT}`, {
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
        async updateStatus(data, status) {
            this.$swal
                .fire({
                    title: 'Approval Status Seleksi',
                    html: `
                        Kamu akan ${ status == 'approve' 
                            ? '<b class="text-success text-decoration-underline">MELULUSKAN</b>' 
                            : '<b class="text-danger text-decoration-underline">MENOLAK</b>'} kandidat dengan nama <b>${data.name}</b>
                        ${status != 'approve' 
                            ? '<div class="mt-3"><textarea id="swal-input-reason" class="form-control" placeholder="Masukan alasan penolakan calon karyawan (opsional)" rows="5"></textarea></div>' 
                            : ''}
                    `,
                    icon: 'warning',
                    showDenyButton: true,
                    showCancelButton: false,
                    confirmButtonText: 'Ya',
                    confirmButtonColor: '#091c48',
                    denyButtonColor: '#c0c0c0',
                    denyButtonText: 'Tidak',
                    preConfirm: () => {
                        if (status != 'approve') {
                            const reason = document.getElementById('swal-input-reason').value;
                            return { reason };
                        }
                        return {};
                    }
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        let reason = '';
                        if (status !== 'approve') {
                            // Ambil reason dari input swal
                            reason = document.getElementById('swal-input-reason')?.value || '';
                        }

                        try {
                            this.fetch = true
                            const process = await ApiCore.store(`${apiEndPoint.ADMINISTRATION_REPORT}/approve`, {id: data.id, status: status, reason: reason}, true)
                            this.fetch = false
                            if (process.status) {
                                this.$toast.success(process.message);
                                this.fetchData(this.pagination.page);
                            } else {
                                this.$toast.error(process.message);
                            }
                        } catch(error) {
                            this.fetch = false
                            this.$toast.error(error);
                        }
                    }
                });
        },
    }
}
</script>