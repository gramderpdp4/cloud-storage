<template>
    <div class="container">
        <div class="row row-col">
            <p>Deseja sair da sua conta?</p>
            <div class="flex justify-end gap-5 mt-7">
                <button @click="closeModal">Cancelar</button>
                <button @click="signOut">Sair</button>
            </div>
        </div>
    </div>
</template>
<script>
    import { inject } from 'vue'

    export default {
        data() {
            return {
                modal: inject("dialogRef")
            }
        },

        props: [ 'eventClose' ],

        methods: {
            closeModal() {
                this.modal.data.close()
            },

            signOut() {
                this.modal.data.exit()
            }
        },

        mounted() {
          
        }
    }
</script>