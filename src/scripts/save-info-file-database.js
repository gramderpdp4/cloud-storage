import app from "./firebase";
import { getDatabase, ref, push } from 'firebase/database'
import moment from "moment-timezone";

const db = getDatabase(app);

//Após upload no firebase storage, salva as informações do arquivo e outras informações adicionais no banco
export const saveInfoFileDatabase = (file, uid) => {
    const path = ref(db, `users/${uid}/files/`);

    const obj = { ...file, created_at: moment().format("DD/MM/YYYY HH:mm:ss") }

    push(path, obj)
};