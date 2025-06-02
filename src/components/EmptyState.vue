<template>
    <div class="empty-state text-center mt-5">
        <img src="@/assets/images/illustration/no-data.svg" alt="Belum Ada Data" aria-hidden="true" />
        <h3 class="mt-3 par-1-5em" v-if="showTitle">{{title}}</h3>
        <div class="mt-3 text-muted mt-3">{{message}}</div>
    </div>
</template>
<script>
export default {
    name: 'EmptyState',
    props: {
        showTitle: {
            default: true
        },
        title: {
            default: 'Oops!'
        },
        message: {
            default: 'Data tidak tersedia'
        }
    },
    data() {
        return {
            
        }
    }
}
</script>