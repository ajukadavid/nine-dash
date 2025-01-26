<script lang="ts" setup>
// import { onMounted } from "vue";

// onMounted(() => {
//     const linkUrl = "https://turndasix.company.site/";
//     window.location.replace(linkUrl);
// });
</script>

<template>
    <div class="text-red-700 w-full h-screen bg-black">
        <div class="px-8 pt-6">
            <span class="text-red-500 text-2xl">SHOP</span>
        </div>
        <div class="w-full space-y-10 h-[calc(100%-4rem)] flex flex-col items-center justify-center">
            <span class="text-red-500 text-2xl"> Select your location </span>
            <a href="https://turndasix.company.site/" target="_blank" class="cursor-pointer">
                <div class="flex space-x-10 justify-center items-center">
                    <span class="text-red-500 text-2xl"> > Nigeria </span>
                    <img src="/naija.png" class="logo-img w-16 h-10 cursor-pointer" />
                </div>
            </a>
            <a href="https://turndasixcnda.company.site/" target="_blank" class="cursor-pointer">
                <div class="flex space-x-10 justify-center items-center">
                    <span class="text-red-500 text-2xl"> > Canada </span>
                    <img src="/cana.jpg" class="logo-img w-16 h-10 cursor-pointer" />
                </div>
            </a>
         
            <a href="https://turndasix.company.site/" target="_blank" class="cursor-pointer">
                <div class="flex space-x-10 justify-center items-center">
                    <span class="text-red-500 text-2xl"> > Rest of the World </span>
                    <img src="/globe.png" class="logo-img w-16 h-16 cursor-pointer" />
                </div>
            </a>
        </div>
    </div>
</template>
