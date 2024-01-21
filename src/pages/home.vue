<template>
   <div class="container flex justify-center items-center h-screen bg-primary">
      <Navbar />
      <div class="h-auto rounded-3xl fixed m-auto left-auto right-auto top-auto mx-4">
         <h4 class="text-black text-center text-2xl mb-7">
            Todos os seus arquivos em um <strong style="color: var(--color-secondary); 
            background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(12,36,97,1) 35%, rgba(0,212,255,1) 100%);
            -webkit-background-clip: text; 
            color: transparent;
            font-weight: 900
            ">Lugar seguro</strong>
         </h4>
         <div class="mt-1 shadow-3x1 bg-primary rounded-2xl sm:w-full">
            <div class="sm:flex flex-row divide-x">
               <div class="pr-5 justify-center hidden sm:auto sm:justify-center sm:flex sm:items-center">
                  <StorageSvg class="sm:w-9/12 md:w-8/12 lg:w-8/12 p-6 m-auto"/>
               </div>
               <div class="bg-white rounded-3xl">
                  <div class="grid items-center p-10 h-fit min-h-60">
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