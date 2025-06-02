<template>
    <div class="main-content">
        <div class="page-content">
            <div class="container-fluid">
                <!-- title of page -->
                <div class="row justify-content-center">
                    <div class="col-6">
                        <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                            <h4 class="mb-sm-0">Profile</h4>
                        </div>
                    </div>
                </div>
                <div class="row justify-content-center">
                    <div class="col-md-6">
                        <div class="card custom-rounded-medium">
                            <div class="card-body">
                                <div class="form-group mb-3">
                                    <label class="form-label">Nama Lengkap</label>
                                    <input type="text" class="form-control custom-rounded-medium" :value="$store.state.user.name || '-'" disabled />
                                </div>
                                <div class="form-group row mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label">NIP</label>
                                        <input type="text" class="form-control custom-rounded-medium" :value="$store.state.user.nip || '-'" disabled />
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">NIK</label>
                                        <input type="text" class="form-control custom-rounded-medium" :value="$store.state.user.nik || '-'" disabled />
                                    </div>
                                </div>
                                <div class="form-group row mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label">Email</label>
                                        <input type="text" class="form-control custom-rounded-medium" :value="$store.state.user.email || '-'" disabled />
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">No. Telepon</label>
                                        <input type="text" class="form-control custom-rounded-medium" :value="$store.state.user.phone || '-'" disabled />
                                    </div>
                                </div>
                                <div class="form-group mb-3">
                                    <label class="form-label">Alamat</label>
                                    <textarea class="form-control custom-rounded-medium" :value="$store.state.user.address || '-'" disabled></textarea>
                                </div>
                            </div>
                            <div class="card-footer card-footer-custom-radius-medium">
                                <div class="d-flex justify-content-end">
                                    <button type="button" @click="back" class="btn border-light bg-white custom-rounded-medium">Kembali</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Profile',
    data() {
        return {
        }
    },
    methods: {
        back() {
            this.$router.go(-1);
        }
    },
}
</script>