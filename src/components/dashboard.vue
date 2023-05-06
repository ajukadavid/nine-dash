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
  return
}


</script>

<template>
  <div class="h-screen">
    <div class="justify-center flex bg-black items-center h-screen overflow-hidden">
      <div class="img-wrapper flex flex-col justify-center items-center">
        <div class="">
          <div class="ml-20 mb-10 lg:ml-24 leading-loose" v-if="isWrongCode">
            <span class="text-red-700 text-4xl" >you not welcome</span>
          </div>
          <img v-else src="../assets/updated.gif" class="h-full w-full logo" />
          
        </div>
        <div class="flex flex-col justify-between w-full px-10">
          <input v-model="passcode"  type="password" placeholder="enter passcode"
            class="w-full bg-black border-red-400 border text-white mb-5 p-4 rounded" />
          <button @click="handlePass" class="text-white text-3xl    p-2 cursor-pointer">
            🔞
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
