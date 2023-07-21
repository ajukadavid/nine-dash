<script lang="ts" setup>
import { onMounted } from "vue";

onMounted(() => {
    const linkUrl = "https://turndasix.company.site/";
    window.location.replace(linkUrl);
});
</script>

<template>
    <div class="text-red-700 w-full h-screen bg-black flex  items-center justify-center">
        loading...
    </div>

</template>
