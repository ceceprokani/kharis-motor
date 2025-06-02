<template>
    <header id="page-topbar">
        <div class="navbar-header">
            <div class="d-flex">
                <!-- LOGO -->
                <div class="navbar-brand-box text-center bg-primary">
                    <router-link to="/" class="logo logo-light">
                        <span class="logo-sm">
                            <img src="@/assets/images/logo/logo-small.png" alt="logo-sm-light" height="20">
                        </span>
                        <span class="logo-lg">
                            <img src="@/assets/images/logo/logo-horizontal.png" class="img-fluid" alt="logo-light" height="auto">
                        </span>
                    </router-link>
                </div>

                <button type="button" class="btn btn-sm px-3 font-size-24 header-item waves-effect" id="vertical-menu-btn" @click="toggleMenu">
                    <i class="ri-menu-2-line align-middle"></i>
                </button>
            </div>
            <div class="d-flex">
                <div class="dropdown d-inline-block user-dropdown">
                    <button type="button" class="btn header-item waves-effect" id="page-header-user-dropdown"
                        data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <img class="rounded-circle header-profile-user" src="@/assets/images/user.png" alt="Header Avatar">
                        <span class="d-none d-xl-inline-block mx-2">{{$store.state.user?.name}}</span>
                        <i class="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
                    </button>
                    <div class="dropdown-menu dropdown-menu-end">
                        <!-- item-->
                        <a class="dropdown-item" href="#/profile"><i class="ri-user-line align-middle me-1"></i> Profile</a>
                        <router-link class="dropdown-item" :to="'/change-password'"><i class="ri-lock-line align-middle me-1"></i> Ubah Password</router-link>
                        <div class="dropdown-divider"></div>
                        <button class="dropdown-item text-danger" @click="logout"><i class="ri-shut-down-line align-middle me-1 text-danger"></i> Logout</button>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>
<script>
import simplebar from 'simplebar-vue';
import 'simplebar-core/dist/simplebar.css';

export default {
    name: 'NavBar',
    data() {
        return {
        }
    },
    components: {
        simplebar,
    },
    methods: {
        async logout() {
            this.$swal
                .fire({
                    title: 'Apakah kamu yakin ?',
                    text: 'Kamu akan keluar dari aplikasi',
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
                        this.$store.getters.logout
                        window.location.href='/'
                    }
                });
        },
        toggleMenu() {
            document.body.classList.toggle('sidebar-enable')
            document.body.classList.toggle('vertical-collpsed')
            
            const isShowMenu = localStorage.getItem('show-menu')
            
            localStorage.setItem('show-menu', isShowMenu == 1 ? 0 : 1)
        }
    }
}
</script>