<template>
    <header id="page-topbar">
        <div class="navbar-header">
            <div class="d-flex">
                <!-- LOGO -->
                <div class="navbar-brand-box text-center">
                    <a href="/" class="logo logo-dark">
                        <span class="logo-sm">
                            <img src="@/assets/images/logo/logo.png" alt="logo-sm-dark" height="22">
                        </span>
                        <span class="logo-lg">
                            <img src="@/assets/images/logo/logo.png" alt="logo-dark" height="50">
                            <span class="ms-3 h5 text-primary fw-bold">SWAT APP</span>
                        </span>
                    </a>
                </div>

                <button type="button" class="btn btn-sm px-3 font-size-24 d-lg-none header-item" data-bs-toggle="collapse"
                    data-bs-target="#topnav-menu-content">
                    <i class="ri-menu-2-line align-middle"></i>
                </button>
            </div>

            <div class="d-flex">
                <div class="dropdown d-inline-block">
                    <button type="button" class="btn header-item noti-icon waves-effect"
                        id="page-header-notifications-dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="ri-notification-3-line"></i>
                        <span class="noti-dot"></span>
                    </button>
                    <div class="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                        aria-labelledby="page-header-notifications-dropdown">
                        <div class="p-3">
                            <div class="row align-items-center">
                                <div class="col">
                                    <h6 class="m-0"> Notifications </h6>
                                </div>
                                <div class="col-auto">
                                    <a href="#!" class="small"> View All</a>
                                </div>
                            </div>
                        </div>
                        <simplebar data-simplebar style="max-height: 230px;">
                            <a href="" class="text-reset notification-item">
                                <div class="d-flex">
                                    <div class="flex-shrink-0 me-3">
                                        <div class="avatar-xs">
                                            <span class="avatar-title bg-primary rounded-circle font-size-16">
                                                <i class="ri-shopping-cart-line"></i>
                                            </span>
                                        </div>
                                    </div>                                
                                    <div class="flex-grow-1">
                                        <h6 class="mb-1">Your order is placed</h6>
                                        <div class="font-size-12 text-muted">
                                            <p class="mb-1">If several languages coalesce the grammar</p>
                                            <p class="mb-0"><i class="mdi mdi-clock-outline"></i> 3 min ago</p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </simplebar>
                        <div class="p-2 border-top">
                            <div class="d-grid">
                                <a class="btn btn-sm btn-link font-size-14 text-center" href="javascript:void(0)">
                                    <i class="mdi mdi-arrow-right-circle me-1"></i> View More..
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="dropdown d-inline-block user-dropdown">
                    <button type="button" class="btn header-item waves-effect" id="page-header-user-dropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <img class="rounded-circle header-profile-user" :src="$store.state.user.picture" alt="Header Avatar" v-if="$store.state.user.picture">
                        <img class="rounded-circle header-profile-user" src="@/assets/images/default-avatar.png" alt="Header Avatar" v-else>
                        <span class="d-block d-xl-inline-block ms-1">{{$store.state.user.name}}</span>
                        <i class="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
                    </button>
                    <div class="dropdown-menu dropdown-menu-end">
                        <!-- item-->
                        <a class="dropdown-item" href="#"><i class="ri-user-line align-middle me-1"></i> Profil</a>
                        <a class="dropdown-item" href="#"><i class="ri-lock-line align-middle me-1"></i> Ubah Password</a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item text-danger" href="#" @click="logout()"><i class="ri-shut-down-line align-middle me-1 text-danger"></i> Logout</a>
                    </div>
                </div>
            </div>
        </div>
    </header>
    <div class="topnav">
        <div class="container-fluid">
            <nav class="navbar navbar-light navbar-expand-lg topnav-menu">
                <div class="collapse navbar-collapse" id="topnav-menu-content">
                    <ul class="navbar-nav">
                        <template v-for="item in listMenu">
                            <li class="nav-item" :class="{'dropdown': item.child.length}" v-if="item.role.indexOf($store.state.user.role.toLowerCase()) != -1 || item.role == 'all'">
                                <router-link v-if="item.url" :to="item.url" class="nav-link" :class="{'dropdown-toggle arrow-none': item.child.length}">
                                    <div class="d-flex align-items-center">
                                        <i class="me-2 font-size-20" :class="item.icon"></i> {{item.title}} <div class="arrow-down" v-if="item.child.length"></div>
                                    </div>
                                </router-link>
                                <a href="javascript:void(0)" v-else class="nav-link" :class="{'dropdown-toggle arrow-none': item.child.length, 'active': urlContained}">
                                    <div class="d-flex align-items-center">
                                        <i class="me-2 font-size-20" :class="item.icon"></i> {{item.title}} <div class="arrow-down" v-if="item.child.length"></div>
                                    </div>
                                </a>
                                <div class="dropdown-menu" aria-labelledby="topnav-apps" v-if="item.child.length">
                                    <template v-for="child in item.child">
                                        <router-link :to="child.url" class="dropdown-item d-flex align-items-center justify-content-between" v-if="child.role.indexOf($store.state.user.role.toLowerCase()) != -1 || child.role == 'all'">{{child.title}} <i class="mdi mdi-arrow-right ms-2" v-if="item.child.length"></i></router-link>
                                    </template>
                                </div>
                            </li>
                        </template>
                    </ul>
                </div>
            </nav>
        </div>
    </div>
</template>
<script>
import simplebar from 'simplebar-vue';
import 'simplebar-core/dist/simplebar.css';

import { map, filter, size } from 'lodash'

export default {
    name: 'NavBar',
    data() {
        return {
            listMenu: [
                {
                    title: 'Dashboard',
                    icon: 'mdi mdi-view-dashboard-outline',
                    url: '/',
                    role: 'all',
                    child: []
                },
                // Menu for admin & super admin
                {
                    title: 'Master Data',
                    icon: 'mdi mdi-database-outline',
                    url: '',
                    role: ['superadmin', 'admin'],
                    child: [
                        {
                            title: 'Area',
                            url: '/master-area',
                            role: ['superadmin', 'admin']
                        },
                        {
                            title: 'Divisi',
                            url: '/master-division',
                            role: ['superadmin', 'admin']
                        },
                        {
                            title: 'Management Mesin',
                            url: '/devices',
                            role: ['superadmin', 'admin']
                        },
                        // {
                        //     title: 'Jenis Kehadiran',
                        //     url: '/master-attendance-type',
                        //     role: ['superadmin', 'admin']
                        // },
                    ]
                },
                {
                    title: 'Karyawan',
                    icon: 'mdi mdi-card-account-details-outline',
                    url: '/employee',
                    role: ['superadmin', 'admin'],
                    child: []
                },
                {
                    title: 'Jadwal & Kehadiran',
                    icon: 'mdi mdi-calendar-month-outline',
                    url: '/schedule',
                    role: ['superadmin', 'admin'],
                    child: []
                },
                // {
                //     title: 'Kehadiran',
                //     icon: 'mdi mdi-alarm',
                //     url: '/signin',
                //     role: ['superadmin', 'admin'],
                //     child: []
                // },
                // Menu for supervisor
                {
                    title: 'Pelaporan Kerja',
                    icon: 'mdi mdi-clipboard-check-outline',
                    url: '/todolist',
                    role: ['coordinator', 'admin'],
                    child: []
                },
                {
                    title: 'Indikator Kinerja',
                    icon: 'mdi-order-bool-descending-variant',
                    url: '/signin',
                    role: ['coordinator'],
                    child: []
                },
                {
                    title: 'Penggajian Karyawan',
                    icon: 'mdi mdi-cash-usd-outline',
                    url: '/payroll',
                    role: ['admin', 'coordinator'],
                    child: []
                },
            ],
        }
    },
    computed: {
        urlContained() {
            return map(filter((map(this.listMenu, 'child')), size)[0], 'url').indexOf(this.$route.path) !== -1;
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
        }
    }
}
</script>