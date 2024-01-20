<template>
    <div class="p-3">
        <div class="grid justify-center items-center self-center mx-auto">
            <Avatar class="mx-auto" image="https://tailwindcss.com/_next/static/media/ryan-florence.3af9c9d9.jpg"
                size="xlarge" shape="circle" />
            <div v-if="!username">
                <Skeleton width="100%" height="1rem" class="rounded-xl mt-2"></Skeleton>
            </div>
            <h4 v-else class="mt-2 text-center text-white sm:text-black font-semibold">{{ username }}</h4>
        </div>
    </div>
    <div class="relative md:mt-72vh md:align-center md:justify-center md:grid sm:hidden md:-ml-3">
        <ul class="flex flex-col gap-3 text-white">
          <a class="flex items-center cursor-pointer" @click="logout">
            <span class="material-symbols-outlined">
              logout
            </span>
            <span href="#" class="ml-2 font-normal md:hidden lg:block md:justify-center md-flex">Sair</span>
          </a>
        </ul>
    </div>
</template>
<script>
    import { userLogout } from '../scripts/sign-out.js'
    import exitUser from './user-exit.vue'

    export default {
        data() {
            return {
                username: undefined
            }
        },
        
        props: {
            name: String
        },

        watch: {
            name(newValue) {
                this.username = newValue
            }
        },

        methods: {
            logout() {
                const dialog = this.$dialog.open(exitUser, {
                    props: {
                    header: 'Sair?',
                    style: {
                        width: '30vw',
                    },
                    breakpoints: {
                        '640px': '90vw'
                    },
                    modal: true,
                    },
                    data: {
                    close: function () {
                        dialog.close()
                    },
                    exit: () => {
                        dialog.close()
                        userLogout()
                        .then(this.$router.push({ name: 'home' }))
                    }
                    },
                })
            },
        }
    }
</script>