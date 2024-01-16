<template>
    <p>{{ error }}</p>
</template>
<script>
    import { inject } from 'vue'

    export default {
        data() {
            return {
                modal: inject('dialogRef'),
                error: null
            }
        },

        mounted() {
            this.error = this.modal.data.text;
        }
    }
</script>