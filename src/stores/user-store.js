import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { defineStore } from 'pinia'
import app from '../scripts/firebase'
import { getDatabase, ref, onValue } from 'firebase/database';

const auth = getAuth(app);
const db = getDatabase(app);

export const userStore = defineStore('user', {
    state: () => ({
        uid: auth.currentUser.uid
    }),

    actions: {
        returnUser() {
            return new Promise((resolve, reject) => {
                const path = ref(db, `users/${this.uid}`);

                onValue(path, (output) => {
                    resolve(output.val())
                })

                this.changedUser()
            })
        },

        returnUID() {
            return this.uid
        },

        changedUser() {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    this.uid = user.uid
                }
            })
        }
    }
})