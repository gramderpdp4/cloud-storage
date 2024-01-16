<template>
    <div class="flex fixed top-1 justify-start items-center gap-2">
        <img :src="vue_logo" width="32" alt="Vue">
        <img :src="vite_logo" width="32">
        <img :src="firebase_logo" width="32">
        <img :src="tailwindcss_logo" width="32">
        <img src="https://pinia.vuejs.org/logo.svg" width="25">
    </div>
</template>
<script setup>
 import vue_logo from '../assets/vue.svg';
 import vite_logo from '../assets/vite.svg';
 import firebase_logo from '../assets/firebase.svg';
 import tailwindcss_logo from '../assets/tailwind.svg';
</script>