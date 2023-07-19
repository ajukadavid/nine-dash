<script lang="ts" setup>
import { useRouter } from "vue-router";

const $router = useRouter();
</script>

<template>
    <div class="flex justify-center bg-black h-screen pb-40">
        <div class="flex-col gap-10 h-screen bg-black">
            <img src="/updated.gif" class="h-[400px] mt-10" />

            <div
                class="flex-col items-center justify-center w-full bg-black px-36"
            >
                <div class="flex items-center justify-center">
                    <img
                        @click="$router.push('/skate')"
                        src="/skate.png"
                        class="w-[150px] h-[200px] hover:w-[190px] hover:h-[220px]"
                        alt=""
                    />
                    <img
                        @click="$router.push('/shop')"
                        src="/shop.png"
                        class="w-[150px] h-[200px]"
                        alt=""
                    />
                    <img
                        @click="$router.push('/music')"
                        src="/music.png"
                        class="w-[150px] h-[200px]"
                        alt=""
                    />
                </div>
                <div class="flex items-center justify-center mb-20 bg-black">
                    <img
                        @click="$router.push('/contact')"
                        src="/contact.png"
                        class="w-[150px] h-[200px]"
                        alt=""
                    />
                    <img
                        @click="$router.push('/subscribe')"
                        src="/subscribe.png"
                        class="w-[150px] h-[200px]"
                        alt=""
                    />
                    <img
                        @click="$router.push('/about')"
                        src="/about.png"
                        class="w-[150px] h-[200px]"
                        alt=""
                    />
                </div>
            </div>
        </div>
    </div>
</template>
