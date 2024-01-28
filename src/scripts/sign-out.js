import { getAuth } from 'firebase/auth'
import app from './firebase'

const auth = getAuth(app);


//Função para o usuário sair da conta
export const userLogout = () => {
    return new Promise((resolve, reject) => {
        auth.signOut(auth.currentUser)
        .then(() => {
            resolve()
        })
        .catch(() => {
            reject()
        })
    })
}