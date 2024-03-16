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
        //Retorna dados do usuário
        returnUser() {
            return new Promise((resolve, reject) => {
                const path = ref(db, `users/${this.uid}`);

                onValue(path, (output) => {
                    resolve(output.val())
                })

                this.changedUser()
            })
        },

        //Retona o código de identificação do usuário
        returnUID() {
            return this.uid
        },

        //Evita erros nas trocas de conta
        changedUser() {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    this.uid = user.uid
                }
            })
        }
    }
})
