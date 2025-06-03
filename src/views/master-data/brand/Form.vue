<template>
    <main>
        <div id="layout-wrapper">
            <div class="main-content">
                <div class="page-content">
                    <div class="container-fluid">
                        <!-- title of page -->
                        <div class="row">
                            <div class="col-12 mt-3">
                                <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                                    <h4 class="mb-sm-0">Form Merk Barang</h4>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <Form :validation-schema="schema" @submit="handleSubmit" ref="form">
                                    <div class="card custom-rounded-medium">
                                        <div class="card-body">
                                            <h6 class="mb-3">Silahkan lengkapi form dibawah ini dengan benar.</h6>
                                            <div class="spacer-medium"></div>
                                            <div class="form-group mb-3">
                                                <label class="form-label">Nama <span class="text-danger">*</span></label>
                                                <Field type="text" name="name" class="form-control custom-rounded-medium mb-2" placeholder="Masukkan nama merk barang" v-model="form.name"/>
                                                <ErrorMessage name="name" :class="'text-danger'" />
                                            </div>
                                        </div>
                                        <div class="card-footer card-footer-custom-radius-medium">
                                            <div class="d-flex justify-content-end">
                                                <router-link to="/manage-users" class="btn border-light bg-white custom-rounded-medium me-2">Kembali</router-link>
                                                <button type="submit" @click="validateBeforeSubmit" class="btn btn-primary custom-rounded-medium">Simpan</button>
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
<script>
import { Field, Form, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

import { ApiCore } from '@/services/core';
import apiEndPoint from '@/services/api-endpoint';

export default {
    name: 'MasterAdmin',
    data() {
        return {
            id: this.$route.params.id,
            form: {
                id: '',
                name: '',
            },
        }
    },
    components: {
        Field, Form, ErrorMessage
    },
    computed: {
        schema() {
            return yup.object({
                name: yup.string().required('Masukkan nama merk barang'),
            });
        }
    },
    async mounted() {
        if (this.id) {
            ApiCore.get(`${apiEndPoint.ADMINISTRATION_USER}/detail`, {id: this.$route.params.id}).then((result) => {
                if (result.status) {
                    this.form = {...result.data}
                }
            })
        }
    },
    methods: {
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