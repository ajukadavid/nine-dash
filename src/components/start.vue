<script lang="ts" setup>

</script>

<template>
    <div class="flex flex-col m-0 w-full items-center justify-center bg-black  h-screen">
            <img src="/mail.gif" class="w-60 h-30" />
            <div @click="$router.push('/menu')" class="flex cursor-pointer lg:text-4xl text-base gap-3 mt-6 ml-8 start-text text-red-500">
                <span>></span>
                <span >press startwww</span>
            </div>
    </div>
</template>

<style scoped>


.bg-img {
    height: 100%;
    z-index: 10;
    position: fixed;
}


.start-text {
    text-shadow: white 1px 0 4px;
}


</style>