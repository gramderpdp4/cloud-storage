<template>
   <div class="container flex justify-center items-center h-screen">
      <Navbar />
      <div class="h-auto rounded-3xl fixed m-auto left-auto right-auto top-auto sm:mx-12 md:mx-12">
         <h4 class="text-black text-center md:text-3xl sm:text-2xl mb-7">
            Todos os seus arquivos em um <strong style="color: var(--color-secondary); 
            background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(12,36,97,1) 35%, rgba(0,212,255,1) 100%);
            -webkit-background-clip: text; 
            color: transparent;
            font-weight: 900
            ">Lugar seguro</strong>
         </h4>
         <div class="shadow-xl bg-gray-100">
            <div class="xl:flex md:flex lg:flex sm:grid flex-row divide-x md:max-w-3xl xl:max-w-4xl h-full">
               <div class="pr-5 flex justify-center sm:hidden">
                  <StorageSvg class="md:w-9/12 lg:w-6/12 xl:w-6/12 p-6 m-auto"/>
               </div>
               <div class="bg-white">
                  <div class="grid items-center p-10 xl:h-96 md:h-max">
                     <SignUpPage v-if="isSignUp" :changedPage="changedSignInSignUp" />
                     <SignInPage v-else :changedPage="changedSignInSignUp" />
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>
<script>
import { RouterView } from 'vue-router';
import StorageSvg from '../components/storage-svg.vue';
import SignUpPage from './sign-up.vue';
import SignInPage from './sign-in.vue';
import { defineAsyncComponent } from 'vue';
const Navbar = defineAsyncComponent(() => import('../components/navbar.vue'))

export default {
   data() {
      return {
         loading: false,
         isSignUp: true
      }
   },

   components: {
      SignUpPage, SignInPage, Navbar, StorageSvg
   },

   methods: {
      changedSignInSignUp() {
         const path = this.isSignUp ? 'signin' : 'signup'

         this.isSignUp = !this.isSignUp

         this.$router.push({ name: path })
      }
   },

   mounted() {
      if (this.$route.path == "/signin") {
         this.isSignUp = false
      }
   },

   beforeRouteUpdate(to, from, next) {
      const path = to.path == "/signup" || to.path == "/";

      path ? this.$data.isSignUp = true : this.$data.isSignUp = false

      next()
   },

}
</script>
<style scoped>
.btn-signin {
   color: var(--color-primary)
}
</style>