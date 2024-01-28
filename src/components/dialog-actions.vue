<template>
   <BlockUI :blocked="blocked" fullscreen>
    <Listbox :options="menu">
        <template #option="slots">
         <div @click="removeFile">{{ slots.option.title }}</div>
        </template>
     </Listbox>
   </BlockUI>
</template>
<script>
import { inject } from 'vue';
import { usedStorage } from '../stores/storage';
import { dialogSpinner } from '../scripts/dialog-block';

const storeStorage = usedStorage()

export default {
    data() {
        return {
            blocked: false,
            modal: inject("dialogRef"),
            menu: [
                {
                    title: 'Excluir'
                },
            ]
        }
    },

    methods: {
        removeFile() {
            dialogSpinner(true)

            const file_fullname = this.modal.data.fullname;

            storeStorage.removeFile(file_fullname, this.modal.data.filename)
            .then(() => {
                this.modal.data.updated()
                this.$toast.add({
                    severity: 'info',
                    summary: 'Arquivo removido',
                    detail: `${file_fullname} foi removido`,
                    life: 3000
                })
            })
            .catch((error) => {
                this.$toast.add({
                    severity: 'error',
                    detail: 'Houve um erro ao remover o arquivo',
                    life: 2500
                })
            })
            .finally(() => {
                dialogSpinner(false)
            })
        }
    },

}
</script>