import { getDatabase, update, ref } from 'firebase/database'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import app from './firebase'

const auth = getAuth(app);
const db = getDatabase(app);

export const createUser = (obj) => {
    return new Promise((resolve, reject) => {
        const { email, password, name } = obj;

        createUserWithEmailAndPassword(auth, email, password)
        .then(user => {
            resolve()

            createUserInDatabase(user.user.uid, obj)
        })
        .catch(error => {
            const code = error.code;

            let message;

            switch (code) {
                case 'auth/email-already-in-use':
                    message = 'Essa conta já existe';
                break;

                case 'auth/weak-password':
                    message = 'Sua senha está muito curta';
                break;

            }
            
            reject({ message: message })
        })
    })
}

const createUserInDatabase = (uid, obj) => {
    const path = ref(db, `users/${uid}`);

    obj.uid = uid;

    update(path, obj)
}