import Vuex from 'vuex';

export default new Vuex.Store({
    state: {
        user: null,
    },
    mutations: {
        setuser(state, value) {
            state.user = value;
        },
    },
    actions: {},
    modules: {},
    getters: {
        dataUser: (state) => {
            return state.user;
        },
        logout: (state) => {
            state.user = null
            localStorage.removeItem('token')
            return true
        }
    }
});
