<template>
    something
   
  </template>
  
  <script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
    const appDoc = document.getElementById('app')
    appDoc!.style.display =  'none'
    const store = document.getElementById('store')
  store!.style.display =  'block'
})
  </script>