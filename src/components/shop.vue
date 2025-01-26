<script lang="ts" setup>
// import { onMounted } from "vue";

// onMounted(() => {
//     const linkUrl = "https://turndasix.company.site/";
//     window.location.replace(linkUrl);
// });
</script>

<template>
    <div class="text-red-700 w-full h-screen bg-black">
        <div class="px-4 sm:px-8 pt-6">
            <span class="text-red-500 text-xl sm:text-2xl">SHOP</span>
        </div>
        <div class="w-full space-y-6 sm:space-y-10 h-[calc(100%-4rem)] flex flex-col items-center justify-center px-4 sm:px-8">
            <span class="text-red-500 text-xl sm:text-2xl text-center"> Select your location </span>
            
            <a href="https://turndasix.company.site/" target="_blank" class="w-full sm:w-auto">
                <div class="flex space-x-4 sm:space-x-10 justify-center items-center">
                    <span class="text-red-500 text-lg sm:text-2xl"> > Nigeria </span>
                    <img src="/naija.png" class="logo-img w-12 sm:w-16 h-8 sm:h-10" />
                </div>
            </a>
            
            <a href="https://turndasixcnda.company.site/" target="_blank" class="w-full sm:w-auto">
                <div class="flex space-x-4 sm:space-x-10 justify-center items-center">
                    <span class="text-red-500 text-lg sm:text-2xl"> > Canada </span>
                    <img src="/cana.jpg" class="logo-img w-12 sm:w-16 h-8 sm:h-10" />
                </div>
            </a>
         
            <a href="https://turndasix.company.site/" target="_blank" class="w-full sm:w-auto">
                <div class="flex space-x-4 sm:space-x-10 justify-center items-center">
                    <span class="text-red-500 text-base sm:text-2xl"> > Rest of the World </span>
                    <img src="/globe.png" class="logo-img w-12 sm:w-16 h-12 sm:h-16" />
                </div>
            </a>
        </div>
    </div>
</template>
