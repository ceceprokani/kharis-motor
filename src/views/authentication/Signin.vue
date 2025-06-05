<template>
    <div class="bg-overlay"></div>
    <div class="account-pages my-5 pt-5">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-xl-8 col-lg-8 col-md-8">
                    <div class="card custom-rounded shadow-lg">
                        <div class="card-body p-0">
                            <div class="row p-0">
                                <div class="col-md-6">
                                    <div class="p-4">
                                        <div class="text-start mb-3">
                                            <router-link to="/signin" class="">
                                                <img src="@/assets/images/logo/logo.png" alt="" height="80" class="img-fluid mx-auto">
                                            </router-link>
                                        </div>
                                        <!-- end row -->
                                        <h4 class="font-size-20 mt-2 text-start text-black">Login</h4>
                                        <p class="mb-5 text-start">Silahkan masukan username dan password.</p>
                                        <Form :validation-schema="schema" @submit="handleSubmit" class="form-horizontal">
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <div class="mb-4">
                                                        <label class="form-label" for="username">Username</label>
                                                        <Field type="text" class="form-control" id="username" name="username" placeholder="Enter username" v-model="username" />
                                                        <ErrorMessage name="username" :class="'text-danger'" />
                                                    </div>
                                                    <div class="mb-4">
                                                        <label class="form-label" for="userpassword">Password</label>
                                                        <div style="position: relative;">
                                                            <Field :type="togglePasswordVisibility ? 'text' : 'password'" name="password" class="form-control" placeholder="Masukkan password" v-model="password" />
                                                            <i class="mdi" v-if="password" :class="{'mdi-eye': togglePasswordVisibility, 'mdi-eye-off': !togglePasswordVisibility}" style="position: absolute; top: 10px; right: 10px; cursor: pointer" @click="togglePasswordVisibility = !togglePasswordVisibility"></i>
                                                        </div>
                                                        <ErrorMessage name="password" :class="'text-danger'" />
                                                    </div>
        
                                                    <div class="mt-3 mt-md-0">
                                                        <a href="javascript:void(0)" class="text-muted"><i class="mdi mdi-lock"></i> Forgot your password?</a>
                                                    </div>
                                                    <div class="d-grid mt-4">
                                                        <button class="btn btn-primary button-rounded waves-effect waves-light" type="submit">Login</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Form>
                                    </div>
                                </div>
                                <div class="col-md-6 banner-login"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- end row -->
        </div>
    </div>
</template>
<script>
import apiEndPoint from '@/services/api-endpoint'
import {ApiCore} from '@/services/core'

import { Field, Form, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

export default {
    name: 'Signin',
    data() {
        return {
            loader: null,
            username: '',
            password: '',
            fetch: false,
            togglePasswordVisibility: false
        }
    },
    setup() {
        const schema = yup.object({
            username: yup.string().required('Masukan username'),
            password: yup.string().required('Masukan password'),
        });

        return {
            schema
        }
    },
    components: {Field, Form, ErrorMessage},
    methods: {
        async handleSubmit() {
            try {
                this.fetch = true
                const signin = await ApiCore.store(`${apiEndPoint.AUTHENTICATION}/signin`, {username: this.username, password: this.password})
                this.fetch = false
                if (signin.status) {
                    this.$toast.success(signin.message);
                    localStorage.removeItem('token')
                    localStorage.setItem('token', signin.token)
                    setTimeout(() => {
                        window.location.href = '/'
                    }, 1000);
                } else {
                    this.$toast.error(signin.message);
                }
            } catch(error) {
                this.fetch = false
                this.$toast.error(error.message);
            }
        }
    }
}
</script>