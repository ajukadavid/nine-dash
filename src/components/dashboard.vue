<script setup lang="ts">
import { ref } from 'vue'
import gsap from 'gsap'
import { collection, addDoc, getDocs } from "firebase/firestore"
import db from '../composables/use-firebase'

// import { sendEmail } from '../composables/email-service'

const passcode = ref('')
const email = ref('')
const isWrongCode = ref(false)
const isEmail = ref(false)

const createItem = async () => {
  const colRef = collection(db, 'users')
      // data to send
      const dataObj = {
        email: email.value
      }

      // create document and return reference to it
      const docRef = await addDoc(colRef, dataObj)

      // access auto-generated ID with '.id'
      console.log('Document was created with ID:', docRef.id)

      const querySnapshot = await getDocs(collection(db, "users"));

      querySnapshot.forEach((doc:any) => {

      console.log(doc.data());
})

} 

const handleRegisterClick = () => {
  if(isEmail.value) {
      if(!!email.value){
        createItem()
      }
  } else {
    isEmail.value = true
  }
}
const handlePass = () => {
  if (passcode.value === 'turndasix') {
    // window.location.href = 'https://nine.company.site/'
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
  passcode.value = ''
  setTimeout(() => {
    isWrongCode.value = false
}, 9000);
  return
}


</script>

<template>
  <div class="h-screen">
    <div class="justify-center flex bg-black items-center h-screen overflow-hidden">
      <div class="img-wrapper flex flex-col justify-center items-center">
        <div class="flex h-fit w-fit items-center justify-center">
          <div class="flex justify-center items-center animate-bounce w-fullgit " v-if="isWrongCode">
            <p class="text-red-700 text-4xl lg:text-6xl lg:ml-0  leading-loose" >keep off</p>
          </div>
          <img v-else src="../assets/updated.gif" class="h-full w-full logo" />
        </div>
        <div class="flex flex-col items-center justify-center w-full px-10">
          <input v-if="isEmail" v-model="email"  type="text" placeholder="enter your email"
            class="w-full h-full bg-black border-white border text-white mb-5 p-4 rounded" />
            <input v-else-if="!isEmail && !isWrongCode" v-model="passcode"  type="password" placeholder="enter passcode"
            class="w-full h-full bg-black border-red-400 border text-white mb-5 p-4 rounded" />
          <button v-if="!isEmail && !isWrongCode" @click="handlePass" class="text-white text-2xl p-2 cursor-pointer">
            JOIN
          </button>

          <div v-if="!isWrongCode" class="flex text-white w-full justify-end cursor-pointer">
           <span @click="handleRegisterClick" class="text-sm">{{ isEmail ? 'Proceed' : 'Register' }}</span>
          </div>
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
