import { defineStore } from 'pinia'
import { getDatabase, onValue, ref } from "firebase/database";
import app from '../scripts/firebase';
import { sizeFile } from "../scripts/size-file";
import { userStore } from './user-store';

const user = userStore()
const db = getDatabase(app);

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

                const path = ref(db, `users/${uid}/files`);

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
    }
})

const calculatedPercent = (used, total) => {
   return new Promise((resolve, reject) => {
    const percent = ( used / total ) * 100;

    const lack_percent = 100 - percent

    resolve({ percent: percent, lack: lack_percent })
   })
}