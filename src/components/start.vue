<script lang="ts" setup>

</script>

<template>
    <div class="box h-screen w-full gap-8 bg-black flex flex-col items-center justify-center">
        <div class="flex h-fit w-fit items-center justify-center">
            <img src="/mail.gif" class="lg:h-[290px] lg:w-[400px] logo" />

        </div>
        <div class="flex text-red-700 start cursor-pointer">
            <span class="mr-4">></span>
            <span>press start</span>

        </div>
    </div>
</template>

<style scoped>
.start {
    text-shadow: white 1px 0px 2px;
}

.box {
    border: 20px solid #C80BDE;
    border-radius: 40px;
}
</style>