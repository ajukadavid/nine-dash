<script lang="ts" setup>

</script>

<template>
    <div class="main m-0 w-full items-center justify-center  h-screen">
        <img src="/pressstartscreenclear.png" class="bg-img" />

        <div class="wrapper flex-col gap-3 items-center h-screen justify-center">
            <img src="/mail.gif" class="w-60 h-30" />
            <div @click="$router.push('/menu')" class="flex gap-3 mt-6 ml-8 start-text text-red-500">
                <span>></span>
                <span>press start</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.main {
    z-index: 20;
    background: black;
}

.bg-img {
    height: 100%;
    z-index: 10;
    position: fixed;
}


.start-text {
    text-shadow: white 1px 0 4px;
}

.wrapper {
    z-index: 20;
    position: fixed;
    top: 30%;
    left: 20%;

}
</style>