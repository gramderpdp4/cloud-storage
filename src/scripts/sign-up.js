import { getDatabase, update, ref } from 'firebase/database'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import app from './firebase'

const auth = getAuth(app);
const db = getDatabase(app);

export const createUser = (obj, toast) => {
    return new Promise((resolve, reject) => {
        const { email, password, name } = obj;

        createUserWithEmailAndPassword(auth, email, password)
        .then(user => {
            resolve()

            createUserInDatabase(user.user.uid, obj)
        })
        .catch(error => {
            const code = error.code;

            console.log(code)

            switch (code) {
                case 'auth/email-already-in-use':
                    toast.add({
                        summary: 'Ops',
                        detail: 'Essa conta já existe',
                        severity: 'warn',
                        life: 2500
                    })
                break;

                case 'auth/weak-password':
                    toast.add({
                        summary: 'Ops',
                        detail: 'Sua senha deve conter no mínimo 6 caracteres',
                        severity: 'warn',
                        life: 4000
                    })
                break;

            }
            reject(error)
        })
    })
}

const createUserInDatabase = (uid, obj) => {
    const path = ref(db, `users/${uid}`);

    obj.uid = uid;

    update(path, obj)
}