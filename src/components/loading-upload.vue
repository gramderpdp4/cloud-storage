<template>
    <div v-if="files.length > 0" v-for="(file, index) in files" :key="index" :id="index"
        class="border-2 rounded-md p-2 mb-2">
        <template class="grid w-full">
            <div class="flex justify-between items-center">
                <p class="mt-1 max-w-52 text-ellipsis overflow-hidden whitespace-nowrap"><strong>{{ file.name }}</strong>
                </p>
                <small>{{ file.fileSize }}</small>
            </div>
            <small class="uppercase">{{ file.fileType }}</small>
        </template>

        <ProgressBar v-if="!file.finished" mode="indeterminate" class="mt-2" style="height: 6px"></ProgressBar>
        <div v-else-if="file.finished == 'error'" class="flex gap-2 mt-2 items-center">
            <img :src="error_svg" />
            <span class="text-sm">Houve um erro</span>
        </div>
        <div v-else-if="file.finished == 'exceeded_storage'" class="flex gap-2 mt-2 items-center">
            <img :src="info_svg" />
            <span class="text-sm">Armazenamento excedido</span>
        </div>
        <div v-else-if="file.finished == 'file_exists'" class="flex gap-2 mt-2 items-center">
            <img :src="info_svg" />
            <span class="text-sm">O arquivo já existe</span>
        </div>
        <div v-else class="flex gap-2 mt-2 items-center">
            <img :src="check_svg" />
            <span class="text-sm">concluído</span>
        </div>
    </div>
</template>
<script>
import { inject } from 'vue';
import { sizeFile } from '../scripts/size-file.js';
import check_svg from '../assets/check.svg';
import error_svg from '../assets/error.svg';
import info_svg from '../assets/info.svg';
import app from '../scripts/firebase';
import { getStorage, ref, uploadBytes, updateMetadata } from 'firebase/storage'
import { getAuth } from "firebase/auth";
import { getDatabase, ref as refDatabase, onValue, push, query, orderByChild, equalTo } from 'firebase/database';
import { userStore } from '../stores/user-store.js';
import { usedStorage } from '../stores/used-storage';

const storage = getStorage(app);
const db = getDatabase(app)
const auth = getAuth(app)
const store = usedStorage();
const storeUser = userStore()
const uid = storeUser.returnUID()

export default {
    data() {
        return {
            check_svg: check_svg,
            info_svg: info_svg,
            error_svg: error_svg,
            modal: inject("dialogRef"),
            files: []
        }
    },

    methods: {
        async uploadFiles(files) {
            const element_title = document.querySelector(".p-dialog-title");

            let count_upload_files = 0;

            let sum_size_current_uploads = store.used;

            console.log('files size', this.files.length)

            for (const f in this.files) {
                const file = this.files[f];

                console.log('file', f)

                sum_size_current_uploads += file.size;

                console.log('store used', store.used)

                if (sum_size_current_uploads < store.total_storage) {
                    console.log('passou 1')
                    this.checkFileExistsDatabase(file.name, file)
                        .then( async () => {
                            try {
                                await this.upload(file)
                                .then(() => {
                                    this.files[f].finished = true
                                })
                                .catch(() => {
                                    this.files[f].finished = 'error'
                                })
                            } catch (error) {
                                console.log('error upload', error.message)
                            }
                        })
                        .catch((error) => {
                            console.log('erro ao checar database', error)
                            this.files[f].finished = 'file_exists'
                            console.log('error file exists', error)
                        })
                        .finally(() => {
                            count_upload_files++

                            setTimeout(() => {
                                if (count_upload_files == this.files.length) {

                                    if ( this.files.filter(filter => filter.finished == "file_exists").length == 0 ) {

                                        const text_finished_upload = this.files.length > 1 ? 'Uploads concluídos' : 'Upload concluído';
                                        element_title.innerText = text_finished_upload
                                    } else {
                                        element_title.innerText = 'Alguns arquivos já existem'
                                    }

                                    this.modal.data.updated()
                                }
                            }, 100)
                        })
                } else {
                    console.log('limite excedido')
                    this.files[f].finished = 'exceeded_storage'
                    element_title.innerText = 'Armazenamento cheio'
                }
            }
        },

        checkFileExistsDatabase(id, obj) {
            return new Promise((resolve, reject) => {

                id = this.removeSpecialCaracteres(id);

                const obj_add_id = { ...obj, id: id }

                const path = refDatabase(db, `users/${uid}/files`)

                onValue(path, (output) => {
                    if (!output.exists()) {
                        push(path, obj_add_id)

                        resolve()
                    } else {
                        const data = output.val();
                        const keys = Object.keys(data);

                        const exists = keys.find(key => data[key].id === id);

                        if (!exists) {
                            push(path, obj_add_id)

                            resolve()
                        } else {
                            reject()
                        }
                    }
                }, { onlyOnce: true })
            })
        },

        removeSpecialCaracteres(txt) {
            return txt.replace(/[^\w\s]/gi, '').replaceAll(" ", "")
        },

        async upload(file) {
            return new Promise((resolve, reject) => {
                const { fileType, fileSize, ...rest } = file

                const fileUpload = new File([rest], file.name, { type: file.type })

                const storageRef = ref(storage, `${uid}/${file.name}`)

                const metadata = {
                    customMetadata: {
                        sizeCustom: fileSize,
                        typeCustom: fileType
                    }
                }

                uploadBytes(storageRef, fileUpload, metadata)
                    .then(output => {
                        console.log('upload bem sucedido')
                        resolve()
                    })
                    .catch(error => {
                        console.log("erro ao fazer upload")
                        reject()
                    })
            })
        },

        organizeFiles() {
            this.modal.data.files.forEach(file => {
                const type = file.name.split('.')[1];

                const obj_file = {
                    lastModified: file.lastModified,
                    type: file.type,
                    size: file.size,
                    webkitRelativePath: file.webkitRelativePath,
                    lastModifiedDate: file.lastModifiedDate,
                    name: file.name
                }

                const add = { ...obj_file, finished: false, fileType: type, fileSize: sizeFile(file.size) };

                this.files.push(add)
            })

            this.uploadFiles()
        }
    },

    mounted() {
        if (typeof this.modal.data.files === "object") {
            this.organizeFiles()
        }
    }
}
</script>