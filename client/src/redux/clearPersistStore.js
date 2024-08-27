import {persistor, store} from "./store"

export const clearePersister = ()=>{
    persistor.purge()
    store.dispatch({type:"RESET_STATE"})
}