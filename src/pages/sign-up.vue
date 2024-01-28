<template>
    <form @submit.prevent="signUp" id="signup" class="grid gap-5">
        <InputText class="border-2 p-3 bg-gray-100" name="name" id="value" type="text" placeholder="Nome completo" required />
        <InputText class="border-2 p-3 bg-gray-100" name="email" type="email" placeholder="Seu melhor e-mail" required />
        <InputText class="border-2 p-3 bg-gray-100" name="password" id="value" placeholder="Senha" type="password" required />
        <Button type="submit" class="p-2 text-white fill" label="Criar conta" icon="pi pi-search" :loading="loading" />
    </form>
    <Divider type="solid" />
    <p class="text-center">
        Já possui uma conta? 
        <Button class="btn-signin" label="Entrar" @click="changeBeetwenPage" />
    </p>
</template>
<script>
import { defineAsyncComponent } from 'vue';
import { createUser } from '../scripts/sign-up.js';
const signInMessages = defineAsyncComponent(() => import('../components/sign-in-messages.vue'))

export default {
    data() {
        return {
            loading: false,
        }
    },

    props: {
        changedPage: Function,
    },

    methods: {
        signUp() {
            const form_signup = document.forms.signup;
            const inputs = Array.from(form_signup.querySelectorAll('input'));
            
            const is_input_empty = inputs.filter(filter => filter.value.length == 0).length

            if ( is_input_empty == 0 ) {
                this.loading = true;

                createUser({
                    email: form_signup.email.value, 
                    password: form_signup.password.value, 
                    name: form_signup.name.value
                })
                .then((success) => {
                    this.$router.push({ name: 'signin' })
                })
                .catch((error) => {
                    const { message } = error;

                    this.$dialog.open(signInMessages, {
                        props: {
                            header: 'Ops !',
                            modal: true,
                            style: {
                                width: '30vw',
                            },
                            breakpoints: {
                                '640px': '90vw'
                            },
                        },
                        data: {
                            text: message
                        }
                    })
                })
                .finally(() => {
                    this.loading = false;
                })
            }
         
        },

        changeBeetwenPage() {
            this.changedPage()
        }
    }
}
</script>
<style>
    @media (max-width: 300px) {
        .p-inputtext {
            width: 100%
        }
    }
</style>
