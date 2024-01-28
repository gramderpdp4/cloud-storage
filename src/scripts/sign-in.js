import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import app from './firebase'

const auth = getAuth(app);

//Função de autenticação do Firebase Auth
export const loginUser = (email, password) => {
    return new Promise((resolve, reject) => {
        signInWithEmailAndPassword(auth, email, password)
        .then(user => {
            resolve()
        })
        .catch(error => {
            reject(error)
        })
    })
}
