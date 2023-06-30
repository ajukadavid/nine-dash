<script lang="ts" setup>

</script>

<template>
    <div class="wrapper flex bg-black items-center gap-5 justify-center flex-col">
        <img src="/mail.gif" class="w-96 h-60" />
        <div class="start-text flex text-red-700 gap-2">
            <span>></span>
            <span>Press start</span>
        </div>
    </div>
</template>

<style scoped>
@media only screen and (min-device-width: 375px) and (max-device-width: 812px) and (-webkit-device-pixel-ratio: 3) {

    /* Styles for iPhone X and newer */

}

.start-text {
    text-shadow: white 1px 0 4px;
}

.wrapper {
    background-image: url(/pressstartscreenclear.png);
    height: 100vh;
    width: 100vw;
    background-repeat: no-repeat;
    background-size: cover;
}
</style>