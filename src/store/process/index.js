import Vue from 'vue';
import createPersistedState from 'vuex-persistedstate'

// 没有用
const runningProcess = {
    namespace: true,
    state: {
        running: [],
    },
    getters: {
        GET_PROCESS(state) {
            return state.running
        },
    },
    mutations: {
        ADD_PROCESS(state, data){
            state.running.push(data);
            // Vue.set(state, 'running', data);
        },
        REMOVE_PROCESS(state, data) {
            state.running = data;
            // Vue.set(state, 'running', data);
        },
    },
    actions: {
    },
    plugins: [createPersistedState({
        storage: window.localStorage,
        paths: ['running']
    })],
}

export default runningProcess
    

