import { ref, getStorage,  deleteObject} from 'firebase/storage'
import app from './firebase'
import { userStore } from '../stores/user-store';
import { getDatabase, refDatabase as ref, remove} from 'firebase/database';

const user = userStore();
const db = getDatabase(app);
const storage = getStorage(app);

export const deleteFile = (filename) => {
    return new Promise( async (resolve, reject) => {
        const path_database = refDatabase(db, `users/${user.uid}/files`)
        const path = ref(storage, `${user.uid}/${filename}`)

        try {
            await deleteObject(path)
            await remove(path_database)

            resolve()
        } catch (error) {
            reject(error)
        }
    })
};
