<template>
  <div class=" bg-black">

    <div @click="$router.back()" class="text-white mx-10 pt-10 cursor-pointer">
      Back
    </div>
    <div class="lg:flex lg:flex-row flex flex-col gap-4 justify-center text-red-700 h-screen items-center pt-10">
      <div class="flex items-center gap-4 flex-col">
        <iframe class="border-4 border-dotted p-2  border-red-700" width="200" height="215"
          src="https://www.youtube.com/embed/rkQh6CKMQc8">
        </iframe>
        <span class="text-white text-sm">Lagos, Nigeria. 2022.</span>

      </div>
      <div class="flex items-center gap-4 flex-col">
        <iframe class="border-4 border-dotted p-2 border-red-700" width="200" height="215"
          src="https://www.youtube.com/embed/Mkac8mQVNJ4">
        </iframe>
        <span class="text-white text-sm">Lagos, Nigeria. 2022.</span>

      </div>

      <div class="flex gap-4 flex-col">
        <iframe class="border-4 border-dotted p-2 border-red-700" width="200" height="215"
          src="https://www.youtube.com/embed/-J6k6zIDpnU">
        </iframe>

        <span class="text-white text-sm">God save 9ja</span>
      </div>


    </div>
  </div>
</template>

