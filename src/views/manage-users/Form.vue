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
                                    <h4 class="mb-sm-0">Form Data Pengguna</h4>
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
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <div class="form-group mb-3">
                                                        <label class="form-label">NIK <span class="text-danger">*</span></label>
                                                        <Field type="text" name="nik" class="form-control custom-rounded-medium mb-2" placeholder="Masukkan NIK" v-model="form.nik"/>
                                                        <ErrorMessage name="nik" :class="'text-danger'" />
                                                    </div>
                                                    <div class="form-group mb-3">
                                                        <label class="form-label">NIP <span class="text-danger">*</span></label>
                                                        <Field type="text" name="nip" class="form-control custom-rounded-medium mb-2" placeholder="Masukkan NIP" v-model="form.nip"/>
                                                        <div class="alert alert-info custom-rounded-medium p-2 mb-2">
                                                            <i class="mdi mdi-information me-2"></i> Email ini akan digunakan sebagai username untuk login aplikasi
                                                        </div>
                                                        <ErrorMessage name="nip" :class="'text-danger'" />
                                                    </div>
                                                    <div class="form-group mb-3">
                                                        <label class="form-label">Nama <span class="text-danger">*</span></label>
                                                        <Field type="text" name="name" class="form-control custom-rounded-medium mb-2" placeholder="Masukkan nama" v-model="form.name"/>
                                                        <ErrorMessage name="name" :class="'text-danger'" />
                                                    </div>
                                                    <div class="form-group mb-3">
                                                        <label class="form-label">Email</label>
                                                        <Field type="text" name="email" class="form-control custom-rounded-medium mb-2" placeholder="Masukkan email" v-model="form.email"/>
                                                    </div>
                                                    <div class="form-group mb-3">
                                                        <label class="form-label">No. Telepon</label>
                                                        <Field name="phone" type="text" v-maska data-maska="+62 8##-####-####" class="form-control custom-rounded-medium" placeholder="+62 8xx-xxxx-xxxx" v-model="form.phone" />
                                                    </div>
                                                    <div class="form-group mb-3">
                                                        <label class="form-label">Alamat</label>
                                                        <Field as="textarea" name="address" rows="4" class="form-control custom-rounded-medium" placeholder="Masukkan alamat" v-model="form.address"/>
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="custom-rounded-medium p-3 alert alert-primary">
                                                        <h5><i class="mdi mdi-information me-3"></i>Informasi Akun</h5>
                                                        <p>Silahkan masukkan password untuk login ke aplikasi</p>
                                                        <div class="spacer-medium"></div>
        
                                                        <div class="form-group" :class="{'mb-2': passwordStrength, 'mb-3': !passwordStrength}">
                                                            <label class="form-label">Password</label>
                                                            <div style="position: relative;" class="mb-2">
                                                                <Field :type="togglePasswordVisibility[0] ? 'text' : 'password'" name="password" class="form-control" placeholder="Masukkan password" v-model="form.password" />
                                                                <i class="mdi" v-if="form.password" :class="{'mdi-eye': togglePasswordVisibility[0], 'mdi-eye-off': !togglePasswordVisibility[0]}" style="position: absolute; top: 10px; right: 10px; cursor: pointer" @click="togglePasswordVisibility[0] = !togglePasswordVisibility[0]"></i>
                                                            </div>
                                                            <ErrorMessage name="password" :class="'text-danger'" />
                                                        </div>
                                                        <div class="d-flex mb-3 fw-bold" v-if="passwordStrength" :class="{'text-danger': passwordStrength.level < 2, 'text-primary': passwordStrength.level < 4, 'text-success': passwordStrength.level >= 4}">
                                                            <i class="mdi me-2" :class="{'mdi-alert': passwordStrength.level < 3, 'mdi-check-circle': passwordStrength.level >= 3}"></i>
                                                            <div>{{passwordStrength.message}}</div>
                                                        </div>
                                                        <div class="form-group mb-3">
                                                            <label class="form-label">Konfirmasi Password</label>
                                                            <div style="position: relative;" class="mb-2">
                                                                <Field :type="togglePasswordVisibility[1] ? 'text' : 'password'" name="password_confirm" class="form-control" placeholder="Masukkan konfirmasi password" v-model="form.confirmPassword" />
                                                                <i class="mdi" v-if="form.confirmPassword" :class="{'mdi-eye': togglePasswordVisibility[1], 'mdi-eye-off': !togglePasswordVisibility[1]}" style="position: absolute; top: 10px; right: 10px; cursor: pointer" @click="togglePasswordVisibility[1] = !togglePasswordVisibility[1]"></i>
                                                            </div>
                                                            <ErrorMessage name="password_confirm" :class="'text-danger'" />
                                                        </div>
                                                        <div class="alert alert-light custom-rounded-medium">
                                                            <h6>
                                                                <i class="mdi mdi-information me-2"></i>Rekomendasi kombinasi password :
                                                            </h6>
                                                            <ul class="mt-2 mb-0 font-size-12">
                                                                <li>Memiliki setidaknya 8 karakter</li>
                                                                <li>Mengandung minimal satu huruf kecil (a-z).</li>
                                                                <li>Mengandung minimal satu huruf besar (A-Z).</li>
                                                                <li>Mengandung minimal satu angka (0-9).</li>
                                                                <li>Mengandung minimal satu simbol (misalnya: !@#$%^&*()_+).</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="form-group mb-3">
                                                <label class="form-label">Status</label>
                                                <div class="d-flex" style="gap: 10px">
                                                    <label for="active" class="d-flex align-items-center border custom-rounded-medium p-2 pointer" :class="{'border-primary': form.status == 'active'}">
                                                        <Field type="radio" name="status" id="active" class="radio-form me-2" :value="'active'" v-model="form.status" />
                                                        <div class="my-0" :class="{'text-primary': form.status == 'active'}">Active</div>
                                                    </label>
                                                    <label for="deactive" class="d-flex align-items-center border custom-rounded-medium p-2 pointer" :class="{'border-primary': form.status == 'deactive'}">
                                                        <Field type="radio" name="status" id="deactive" class="radio-form me-2" :value="'deactive'" v-model="form.status" />
                                                        <div class="my-0" :class="{'text-primary': form.status == 'deactive'}">Deactive</div>
                                                    </label>
                                                </div>
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
                nip: '',
                nik: '',
                name: '',
                email: '',
                phone: '',
                status: 'active',
                username: '',
                password: '',
                address: '',
                confirmPassword: '',
            },
            togglePasswordVisibility: [false, false]
        }
    },
    components: {
        Field, Form, ErrorMessage
    },
    computed: {
        passwordStrength() {
            const rules = [
                { regex: /.{8,}/, message: 'Password lemah', level: 1 },
                { regex: /[a-z]/, message: 'Password sedang', level: 2 },
                { regex: /[A-Z]/, message: 'Password kuat', level: 3 },
                { regex: /[0-9]/, message: 'Password sangat kuat', level: 4 },
                { regex: /[\W_]/, message: 'Password sangat kuat', level: 5 }
            ];

            if (this.form.password) {
                const strength = rules.reduce((acc, rule) => acc + rule.regex.test(this.form.password), 0);
                return strength ? rules[strength - 1] : false;
            } else {
                return false
            }
        },
        schema() {
            return yup.object({
                name: yup.string().required('Masukkan nama'),
                email: yup.string().required('Masukkan email'),
                nip: yup.string().required('Masukkan NIP'),
                nik: yup.string().required('Masukkan NIK'),
                password: !this.$route.params.id ? yup.string().required('Masukkan password').min(8, 'Masukkan password minimal 8 karakter') : null,
                password_confirm: !this.$route.params.id ? yup.string().required('Masukkan konfirmasi password').min(8, 'Masukkan password minimal 8 karakter') : null,
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
        setRawPhone() {
            this.form.phone = this.form.phone.replace(/\D/g, "")
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
                if (this.form.password !== this.form.confirmPassword) {
                    this.$toast.error('Password dan konfirmasi password tidak sama');
                    return;
                }

                this.setRawPhone()
                
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