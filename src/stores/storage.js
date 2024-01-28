import { defineStore } from 'pinia'
import { equalTo, getDatabase, onValue, orderByChild, query, ref as refDatabase, remove } from "firebase/database";
import { ref as refStorage, getStorage, deleteObject} from 'firebase/storage'
import app from '../scripts/firebase';
import { sizeFile } from "../scripts/size-file";
import { userStore } from './user-store';

const user = userStore()
const db = getDatabase(app);
const storage = getStorage(app);

export const usedStorage = defineStore('storage', {
    state: () => ({
        used: 0,
        total_storage: 104857600,
        used_percent: 0
    }),
    actions: {
        returnStoredUsed() {
            return new Promise((resolve, reject) => {
                const uid = user.returnUID();

                const path = refDatabase(db, `users/${uid}/files`);

                let total_size = 0,
                all_size = 0;

                onValue(path, async (output) => {
                    if (output.exists()) {
                        const data = output.val(),
                        keys = Object.keys(data);

                        keys.forEach(file => {
                            const file_size = data[file].size;
                            
                            if (file_size) {
                                total_size += file_size;
                                all_size += file_size
                            }
                        })

                        this.used = all_size

                        const { percent, lack } = await calculatedPercent(this.used, this.total_storage);

                        this.used_percent = percent

                        resolve({ 
                            used: sizeFile(total_size),
                            percent: this.used_percent,
                            lack: lack
                        })
                    } else {
                        resolve({ 
                            used: 0,
                            percent: 0,
                            lack: 100
                        })
                    }

                }, { onlyOnce: true })
            })
        },

        removeFile(fullname, filename) {
            return new Promise( async (resolve, reject) => {
                const database_ref = refDatabase(db, `users/${user.returnUID()}/files`)
                const database_query = query(database_ref, orderByChild("id"), equalTo(this.removeSpecialCaracteres(fullname)))
                const delete_storage = refStorage(storage, `${user.returnUID()}/${fullname}`)
         
                    onValue(database_query, async (output) => {
                        if(output.exists()) {
                            const database_item_key = Object.keys(output.val());
                            const path_to_remove_file_database = refDatabase(db, `users/${user.returnUID()}/files/${database_item_key}`)
                            
                           try {
                            await deleteObject(delete_storage)
                            await remove(path_to_remove_file_database)
                                    
                            resolve()
                           } catch (error) {
                            reject({
                                error: error,
                                message: error.message
                            })
                           }
                        }else{
                            reject({
                                error: 'Arquivo não existe no banco de dados do usuário',
                                message: 'Arquivo não existe no banco de dados do usuário'
                            })
                        }
                    }, { onlyOnce: true })
            })
        },

        removeSpecialCaracteres(id) {
            return id.replace(/[^\w\s]/gi, '').replaceAll(" ", "")
        }
    }
})

const calculatedPercent = (used, total) => {
   return new Promise((resolve, reject) => {
    const percent = ( used / total ) * 100;

    const lack_percent = 100 - percent

    resolve({ percent: percent, lack: lack_percent })
   })
}