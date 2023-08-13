<script lang="ts" setup>
import { useRouter } from "vue-router";

const $router = useRouter();
</script>

<template>
    <div class="flex justify-center bg-black h-fit px-16">
        <div class="flex-col  flex items-center h-screen bg-black pb-32 lg:pb-10">
            <img src="/updated.gif" class="h-[400px] mt-10" />
            <div class="flex-col lg:flex hidden items-center justify-center w-fit bg-black px-36">
                <div class="flex items-center cursor-pointer justify-center">
                    <img @click="$router.push('/skate')" src="/skate.png" class="w-[150px] h-[200px] hover:scale-110"
                        alt="" />
                    <img @click="$router.push('/shop')" src="/shop.png" class="w-[150px] h-[200px] hover:scale-110"
                        alt="" />
                    <img @click="$router.push('/music')" src="/music.png" class="w-[150px] h-[200px] hover:scale-110"
                        alt="" />
                    <img @click="$router.push('/contact')" src="/contact.png" class="w-[150px] h-[200px] hover:scale-110"
                        alt="" />
                    <img @click="$router.push('/subscribe')" src="/subscribe.png"
                        class="w-[150px] h-[200px] hover:scale-110" alt="" />
                    <img @click="$router.push('/about')" src="/about.png" class="w-[150px] h-[200px] hover:scale-110"
                        alt="" />
                </div>
            </div>
            <div class="lg:hidden flex flex-col">
                <div class="flex items-center cursor-pointer justify-center">
                    <img @click="$router.push('/skate')" src="/skate.png" class="w-[100px] h-[150px]" alt="" />
                    <img @click="$router.push('/shop')" src="/shop.png" class="w-[100px] h-[150px]" alt="" />
                    <img @click="$router.push('/music')" src="/music.png" class="w-[100px] h-[150px]" alt="" />
                </div>
                <div class="flex items-center cursor-pointer justify-center">
                    <img @click="$router.push('/contact')" src="/contact.png" class="w-[100px] h-[150px]" alt="" />
                    <img @click="$router.push('/subscribe')" src="/subscribe.png" class="w-[100px] h-[150px]" alt="" />
                    <img @click="$router.push('/about')" src="/about.png" class="w-[100px] h-[150px]" alt="" />
                </div>
            </div>
        </div>
    </div>
</template>
