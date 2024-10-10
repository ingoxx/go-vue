import createPersistedState from 'vuex-persistedstate'

const menuTabs = {
    namespace: true,
    state: {
        menuTabList: [],
    },
    getters: {
    },
    mutations: {
        UPDATE_TABS(state, data){
            state.menuTabList = data;
            window.sessionStorage.setItem('menuTabList', JSON.stringify(data));
        },
    },
    actions: {
    },
    plugins: [createPersistedState({
        storage: window.localStorage,
        key: 'menuTabList'
    })],
}

export default menuTabs
    

