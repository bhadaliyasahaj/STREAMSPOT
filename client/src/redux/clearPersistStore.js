import {persistor, store} from "./store.js"

export const clearePersister = async () =>{
    
    await persistor.purge()
    store.dispatch({type:"RESET_STATE"})    
}