<template>
    <nav>
        <ul class="d-flex p-0" style="gap: 0.5rem;">
            <button type="button" class="btn btn-secondary border btn-square" 
            :class="{ disabled: !prev }"
            :disabled="!prev"
            @click="fetch('prev')">
                <i class="mdi mdi-chevron-left fs-3"></i>
            </button>
            <div class="d-flex align-items-center justify-content-center bg-white pagination-number">
                <div class="fs-5 fw-bold">{{ page }}</div>
            </div>
            <button type="button" class="btn btn-primary border btn-square"
            :class="{ disabled: !next }"
            :disabled="!next"
            @click="fetch('next')">
                <i class="mdi mdi-chevron-right fs-3"></i>
            </button>
        </ul>
    </nav>
</template>
<script>
export default {
    name: 'Pagination',
    props: {
        params: {
            type: Object
        },
        prev: {
            type: Boolean,
            default: false
        },
        next: {
            type: Boolean,
            default: false
        },
        page: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            currentPage: 1
        }
    },
    watch: {
        currentPage(value) {
            this.currentPage = value
        },
    },
    updated() {
        this.currentPage = this.page
    },
    methods: {
        fetch(type=null) {
            if (type == 'next')
                this.currentPage += 1
            else
                this.currentPage -= 1
            
            this.$emit('fetchData', this.currentPage);
        }
    },
};
</script>