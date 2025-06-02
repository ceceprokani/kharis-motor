<template>
    <div class="main-content">
        <div class="page-content">
            <div class="container-fluid">
                <!-- title of page -->
                <div class="row justify-content-center">
                    <div class="col-6">
                        <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                            <h4 class="mb-sm-0">Ubah Password</h4>
                        </div>
                    </div>
                </div>
                <div class="row justify-content-center">
                    <div class="col-md-6">
                        <Form :validation-schema="schema" @submit="handleSubmit">
                            <div class="card custom-rounded-medium">
                                <div class="card-body">
                                    <h6 class="mb-3">Silahkan lengkapi form dibawah ini dengan benar.</h6>
                                    <div class="spacer-medium"></div>
                                    <div class="form-group" :class="{'mb-2': passwordStrength, 'mb-3': !passwordStrength}">
                                        <label class="form-label">Password</label>
                                        <div style="position: relative;">
                                            <Field :type="togglePasswordVisibility[0] ? 'text' : 'password'" name="password" class="form-control" placeholder="Masukan password" v-model="form.new_password" />
                                            <i class="mdi" v-if="form.new_password" :class="{'mdi-eye': togglePasswordVisibility[0], 'mdi-eye-off': !togglePasswordVisibility[0]}" style="position: absolute; top: 10px; right: 10px; cursor: pointer" @click="togglePasswordVisibility[0] = !togglePasswordVisibility[0]"></i>
                                        </div>
                                        <ErrorMessage name="password" :class="'text-danger'" />
                                    </div>
                                    <div class="d-flex mb-3 fw-bold" v-if="passwordStrength" :class="{'text-danger': passwordStrength.level < 2, 'text-info': passwordStrength.level < 4, 'text-success': passwordStrength.level >= 4}">
                                        <i class="mdi me-2" :class="{'mdi-alert': passwordStrength.level < 3, 'mdi-check-circle': passwordStrength.level >= 3}"></i>
                                        <div>{{passwordStrength.message}}</div>
                                    </div>
                                    <div class="form-group mb-3">
                                        <label class="form-label">Konfirmasi Password</label>
                                        <div style="position: relative;">
                                            <Field :type="togglePasswordVisibility[1] ? 'text' : 'password'" name="password_confirm" class="form-control" placeholder="Masukan konfirmasi password" v-model="form.confirm_password" />
                                            <i class="mdi" v-if="form.confirm_password" :class="{'mdi-eye': togglePasswordVisibility[1], 'mdi-eye-off': !togglePasswordVisibility[1]}" style="position: absolute; top: 10px; right: 10px; cursor: pointer" @click="togglePasswordVisibility[1] = !togglePasswordVisibility[1]"></i>
                                        </div>
                                        <ErrorMessage name="password_confirm" :class="'text-danger'" />
                                    </div>
                                    <div class="alert alert-info custom-rounded-medium">
                                        <h6>
                                            <i class="mdi mdi-information me-2"></i>Rekomendasi kombinasi password :
                                        </h6>
                                        <ul class="mt-2 mb-0 font-size-12 text-dark">
                                            <li>Memiliki setidaknya 8 karakter</li>
                                            <li>Mengandung minimal satu huruf kecil (a-z).</li>
                                            <li>Mengandung minimal satu huruf besar (A-Z).</li>
                                            <li>Mengandung minimal satu angka (0-9).</li>
                                            <li>Mengandung minimal satu simbol (misalnya: !@#$%^&*()_+).</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="card-footer card-footer-custom-radius-medium">
                                    <div class="d-flex justify-content-end">
                                        <router-link to="/" class="btn border-light bg-white custom-rounded-medium me-2">Kembali</router-link>
                                        <button type="submit" class="btn btn-primary custom-rounded-medium">Simpan</button>
                                    </div>
                                </div>
                            </div>
                        </Form>
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

import { Field, Form, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

export default {
    name: 'MasterAreaForm',
    data() {
        return {
            isAllDay: false,
            form: {
                new_password: "",
                confirm_password: "",
            },
            togglePasswordVisibility: [false, false]
        }
    },
    components: {
        simplebar, Field, Form, ErrorMessage
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

            if (this.form.new_password) {
                const strength = rules.reduce((acc, rule) => acc + rule.regex.test(this.form.new_password), 0);
                return strength ? rules[strength - 1] : false;
            } else {
                return false
            }
        }
    },
    setup() {
        const schema = yup.object({
            password: yup.string().required('Masukan password baru'),
            password_confirm: yup.string().required('Masukan konfirmasi password'),
        });

        return {
            schema
        }
    },
    methods: {
        async handleSubmit() {
            try {
                this.fetch = true
                const result = await ApiCore.store(`${apiEndPoint.ACCOUNT}/profile/change_password`, this.form)
                this.fetch = false
                if (result.status) {
                    this.$router.push({name: 'home'})
                    this.$toast.success('Password berhasil diperbaharui!');
                } else {
                    this.$toast.error('Password gagal diperbaharui!');
                }
            } catch(error) {
                this.fetch = false
                this.$toast.error(error.message);
            }
        },
    }
}
</script>