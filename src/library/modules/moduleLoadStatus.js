export const moduleLoadStatus = {
    state: {
        testvariable: "hhere it is",
        update_counter: 0,
        count: 0,
        status_map: [],
    },namespaced: true,

    getters: {
        getCounter: (state) => (key = 'count') => {
            if (!key) return new Map(state.status_map);
            return new Map(state.status_map).get(key) ? new Map(state.status_map).get(key) : false
        },
        getStatus: (state) => (key) => {
            if (!key) return new Map(state.status_map);
            return new Map(state.status_map).get(key) ? new Map(state.status_map).get(key) : false
        }
    },
    mutations: {
        increment(state, value=0, counter_key= 'count' ) {
            console.log("counter_increment " ,value, counter_key, state[counter_key]);
            state[counter_key] = state[counter_key] + value
        },
        counter_reset(state, value,counter_key = 'count'  ) {
            console.log("counter_reset " ,value, counter_key, state[counter_key]);
            state[counter_key] = value;
        },
        addStatus(state, payload) { //requires key and status
            const {key = false, status = false} = payload
            if (key) {
                state.status_map = Array.from(new Map(state.status_map).set(key, status));
                console.log("addStatus complete", new Map(state.status_map),
                    " key:", key, " status: ", status)
            }
        }
    }
}
export default moduleLoadStatus
