import { getStorage, ref, listAll, list, getMetadata } from "firebase/storage"
import app from "./firebase"
import { userStore } from '../stores/user-store';

const storage = getStorage(app);
const user = userStore();

export const listFiles = () => {
    return new Promise((resolve, reject) => {
        const uid = user.returnUID();

        const storageRef = ref(storage, `${uid}/`)

        listAll(storageRef)
        .then( async (output) => {
            const filesPromise = output.items.map(item => {
                return getMetadata(item).then(metadata => {  
                    return {
                        metadata
                    };
                })
            })

            const promise = await Promise.all(filesPromise)

            resolve({ files: promise })
        })
        .catch(error => {
            alert("Erro ao buscar arquivos")
            console.log(error)
            reject(error)
        })
    })
}