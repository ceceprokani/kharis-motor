import { createApp } from 'vue'
import App from './App.vue'

// import store from './store'
import stores from './stores';

// load utils
import router from './router'

// load external library
// loader library
import {LoadingPlugin} from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

// sweetalert library
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// toast library
import Toast, {useToast} from "vue-toastification";
import "vue-toastification/dist/index.css";

// import datepicker
import VueFlatpickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css';

// moment library
import moment from 'moment'
import 'moment/dist/locale/id'

// import input mask
import {MaskInput} from 'maska';
import { vMaska } from "maska/vue"

// import crypto-js
import CryptoJS from 'crypto-js'

// load assets
import './assets/css/icons.min.css'
import './assets/css/bootstrap.min.css'
import './assets/css/app.min.css'
import './assets/css/custom.css'

import 'bootstrap'

// import components for global
import Pagination from './components/Pagination.vue'
// import EmptyState from './components/EmptyState.vue'

const app = createApp(App)

app.use(router)
app.use(stores)
app.use(VueSweetalert2)
app.use(LoadingPlugin, {
    color: '#fff',
    zIndex: 99999999,
    backgroundColor: '#000',
});
app.use(Toast, {
    transition: "Vue-Toastification__bounce",
    maxToasts: 1,
    newestOnTop: true,
    pauseOnHover: false,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnFocusLoss: false,
    timeout: 2000,
    position: "top-right",
});

app.directive("maska", vMaska)

app.directive('money-mask', {
    mounted(el) {
            new MaskInput(el, {
            number: {
                locale: 'id',
                fraction: 2,
            },
            postProcess: (val) => (val ? `${val}` : ''),
        });
    },
});

// Buat directive global untuk format nomor telepon
app.directive("phone-mask", {
    beforeMount(el, binding) {
        el.innerText = formatPhone(binding.value || el.innerText);
    },
    updated(el, binding) {
        el.innerText = formatPhone(binding.value || el.innerText);
    }
});

// Fungsi untuk format nomor telepon
function formatPhone(number) {
    if (!number) return "";
  
    // Hapus karakter non-digit
    let raw = number.toString().replace(/\D/g, "");
  
    // Ubah "0812..." jadi "62812..."
    if (raw.startsWith("0")) {
      raw = "62" + raw.slice(1);
    }
  
    // Format +62 812-3456-7890
    return raw.replace(/(\d{2})(\d{3})(\d{4})(\d{3,4})/, "+$1 $2-$3-$4");
}

app.config.productionTip = false

app.component(Pagination.name, Pagination)
// app.component(EmptyState.name, EmptyState)
app.component('flat-pickr', VueFlatpickr);

// global variables
app.config.globalProperties.$formatPhone = formatPhone
app.config.globalProperties.$moment = moment;
app.config.globalProperties.$toast = useToast()

app.config.globalProperties.$toCurrency = function (value, locale = 'id-ID', minimumFractionDigits = 2, maximumFractionDigits = 2) {
    if (typeof value !== "number") {
        return value;
    }

    // Format number with given decimals, always show minimumFractionDigits decimals
    return value.toLocaleString(locale, { minimumFractionDigits, maximumFractionDigits });
}

app.config.globalProperties.$changeFormatDate = function (date, format='DD MMMM YYYY HH:mm') {
    if (!date) return '-'
    moment.locale('id')
    return moment(date).format(format)
}

app.mount('#app')