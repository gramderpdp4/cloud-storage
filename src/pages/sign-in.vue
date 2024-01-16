<template>
    <form @submit.prevent="signIn" class="grid gap-5" id="signin">
        <InputText name="email" class="border-2 p-3 bg-gray-100" id="value" type="text" placeholder="E-mail" required />
        <InputText class="border-2 p-3 bg-gray-100" id="value" placeholder="Senha" name="password" type="password"
            required />
        <Button type="submit" class="p-2 text-white fill" label="Entrar" icon="pi pi-search" :loading="loading" />
    </form>
    <Button class="btn-signin mt-6" label="Criar conta" @click="changeBeetwenPage" />
</template>
<script>
import { defineAsyncComponent } from 'vue';
import { loginUser } from '../scripts/sign-in';
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
            this.loading = true;
        },

        changeBeetwenPage() {
            this.changedPage()
        },

        signIn() {
            const form = document.forms.signin;
            const email = form.email;
            const password = form.password;

            if (email.value.length > 0 && password.value.length > 0) {
                this.loading = true;

                loginUser(email.value, password.value)
                    .then(success => {
                        this.$router.push({ name: 'panel' })
                    })
                    .catch(error => {
                        const code = error.code;

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
                                text: this.signInErrors(code)
                            }
                        })
                    })
                    .finally(() => {
                        this.loading = false;
                    })
            } else {
                alert('preencha todos os campos')
            }
        },

        signInErrors(code) {
            let text;

            switch (code) {
                case 'auth/invalid-credential':
                    text = 'E-mail ou senha incorretos'
                    break;
            }

            return text;
        }
    }


}
</script>