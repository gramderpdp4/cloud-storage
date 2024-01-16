<template>
    <form @submit.prevent="signUp" id="signup" class="grid gap-5">
        <InputText class="border-2 p-3 bg-gray-100" name="name" id="value" type="text" placeholder="Nome completo" required />
        <InputText class="border-2 p-3 bg-gray-100" name="email" type="email" placeholder="Seu melhor e-mail" required />
        <InputText class="border-2 p-3 bg-gray-100" name="password" id="value" placeholder="Senha" type="password" required />
        <Button type="submit" class="p-2 text-white fill" label="Criar conta" icon="pi pi-search" :loading="loading" />
    </form>
    <div class="divide-y divide-yellow-500 divide-dashed my-4 relative"></div>
    <p class="text-center">
        Já possui uma conta? 
        <Button class="btn-signin" label="Entrar" @click="changeBeetwenPage" />
    </p>
</template>
<script>
import { createUser } from '../scripts/sign-up.js';

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
                }, this.$toast )
                .then(success => {
                    this.$toast.add({
                        severity: 'success',
                        summary: 'Conta criada',
                        detail: 'Faça login',
                        life: 2500,
                    })

                    this.$router.push({ name: 'signin' })
                })
                .catch(error => {
                    console.log(`Houve algum erro ao criar o usuário`, error)
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