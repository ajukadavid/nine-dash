<script setup lang="ts">
// import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import gsap from 'gsap'
// import { makeRequest } from '../composables/email-service'
// import { collection, addDoc } from "firebase/firestore"
// import db from '../composables/use-firebase'

// const codeInput = ref<HTMLInputElement | null>(null)
// const passcode = ref('')
// const emailSent = ref(false)
// const email = ref('')
// const isWrongCode = ref(false)
// const isEmail = ref(false)
const $router = useRouter()

// const createItem = async () => {


//   const colRef = collection(db, 'users')
//   // data to send
//   const dataObj = {
//     email: email.value
//   }
//   makeRequest(email.value)
//   // create document and return reference to it
//   const docRef = await addDoc(colRef, dataObj)

//   // access auto-generated ID with '.id'
//   console.log('Document was created with ID:', docRef.id)

//   emailSent.value = true



// }

// const handleRegisterClick = () => {
//   if (isEmail.value) {
//     if (!!email.value) {
//       createItem()
//       setTimeout(() => {
//         emailSent.value = true
//         email.value = ''
//         location.reload()
//       }, 4000);
//     }
//   } else {
//     isEmail.value = true
//   }
// }
// const handlePass = () => {
//   if (passcode.value === '9316') {
//     $router.push('/start')

//     isWrongCode.value = false
//   } else {
//     gsap.from(".logo", {
//       x: -60,
//       fill: 'blue',
//       repeat: 3,
//       yoyo: true,
//       ease: "rough({ strength: 1, points: 20, template: none.out, taper: none, randomize: true, clamp: false })",
//       onComplete: function () {
//         gsap.set('.logo', {
//           x: 0
//         })
//       }
//     })
//     isWrongCode.value = true

//   }

//   passcode.value = ''
//   codeInput.value?.blur()
//   setTimeout(() => {
//     isWrongCode.value = false
//   }, 5000);
//   return
// }

</script>

<template>
 <!-- <div class="flex items-center justify-center h-screen overflow-hidden bg-black">
    <div class="w-full justify-center flex bg-black items-center mb-[90px] overflow-hidden">
      <div class="img-wrapper flex flex-col justify-center items-center">
        <div class="flex h-fit w-fit items-center justify-center">
          <div class="flex justify-center items-center animate-bounce w-fullgit" v-if="isWrongCode">
            <p class="text-red-700 text-2xl lg:text-6xl lg:ml-0 mt-3 mr-r lg:mr-0 lg:mt-0 leading-loose">access denied.
            </p>
          </div>
          <img v-else-if="!emailSent && !isWrongCode" src="/mail.gif" class="h-full w-full logo" />
          <div class="flex justify-center items-center animate-bounce w-fullgit " v-if="emailSent">
            <p class="text-green-700 text-4xl lg:text-6xl lg:ml-0  leading-loose">accepted.</p>
          </div>
        </div>
        <div class="flex flex-col items-center justify-center w-full px-6 mt-4">
          <div class="flex justify-between items-center w-full" v-if="!isEmail">
            <input ref="codeInput" v-if="!isWrongCode" v-model="passcode" type="password" placeholder="enter passcode"
              class="w-full h-[45px] bg-black outline-red-500 border-red-500 border text-sm mx-4 text-white mb-1 p-4 rounded" />
            <button v-if="!isEmail && !isWrongCode" @click="handlePass"
              class="text-white text-xl my-2 px-2 cursor-pointer">
              JOIN
            </button>
          </div>
          <input v-if="isEmail && !emailSent" v-model="email" type="text" placeholder="enter your email"
            class="w-full h-[50px] bg-black border-white border text-white mb-5 p-4 rounded" />
          <div v-if="!isWrongCode && !emailSent"
            class="flex text-white text-[9px] lg:text-base  w-full justify-center mt-5 ">
            <span class="cursor-pointer" @click="handleRegisterClick" v-if="isEmail">Submit</span>
            <div v-else class="mx-10 lg:m-0">
              <span>no passcode? </span>
              <span @click="handleRegisterClick" class="text-red-500 ml-3 lg:ml-1 mb-4 cursor-pointer">apply here.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
   </div>  -->

   <div class="flex flex-col m-0 w-full items-center justify-center bg-black  h-screen">
    <div class="flex h-fit flex-col  w-fit items-center justify-center">
      <img src="/mail.gif" class="w-full h-full" />
      
    </div>
    <div class="flex flex-col items-center justify-center w-full px-6 mt-4">

    </div>
    <div @click="$router.push('/menu')"
      class="flex cursor-pointer lg:text-3xl text-base gap-3 mt-6 start-text text-red-500">
      <span>></span>
      <span>press start</span>
    </div>
  </div>  
  
</template>


<style scoped>
.img-wrapper {
  height: fit-content;
  width: 400px;
}

.logo {
  margin-block: 50px;
}

.logo-img {
  transition: all 0.3s ease;
}

.logo-img:hover {
  transform: scale(1.1) rotate(5deg);
  filter: brightness(1.2);
  box-shadow: 0 0 15px rgba(255, 0, 0, 0.5);
}
</style>
