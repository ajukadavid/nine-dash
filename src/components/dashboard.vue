<script setup lang="ts">
import { ref } from 'vue'
import gsap from 'gsap'



const passcode = ref('')
const isWrongCode = ref(false)

const handlePass = () => {
  if (passcode.value === 'turndasix') {
    window.location.href = 'https://nine.company.site/'
  } else {
    gsap.from(".logo", { 
      x: -60,
      fill: 'blue',
      repeat: 3,
      yoyo: true,
      ease: "rough({ strength: 1, points: 20, template: none.out, taper: none, randomize: true, clamp: false })",
      onComplete: function(){
        gsap.set('.logo', {
          x: 0
        })
      }
     })

  }
  isWrongCode.value = true
}


</script>

<template>
  <div class="h-screen">
    <h3 class="font-extrabold	 text-xl ml-5 font-joystix">turndasix.</h3>
    <div class="justify-center flex bg-black items-center h-screen">
      <div class="img-wrapper flex flex-col justify-center items-center">
        <div class="flex">
          <img src="../assets/blackgif.gif" class="h-full w-full logo" />
          <div>

          </div>
        </div>
        <div class="flex flex-col justify-between w-full px-10">
          <input v-model="passcode" type="text" placeholder="enter passcode"
            class="w-full bg-black border-white border text-white mb-5 p-4 rounded" />
          <button @click="handlePass" class="text-white  border border-white p-2 cursor-pointer">
            enter
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.img-wrapper {
  height: 400px;
  width: 400px;
}
</style>
