<script setup lang="ts">
import { ref } from 'vue'
import { collection, addDoc, getDocs } from "firebase/firestore"
import db from '../composables/use-firebase'
// import { useRouter } from 'vue-router'

// const $router =  useRouter()

const email = ref('')
const isEmail = ref(false)
const emailSent = ref(false)
const isWrongCode = ref(false)

const handleRegisterClick = () => {
  if(isEmail.value) {
      if(!!email.value){
        createItem()
      }
  } else {
    isEmail.value = true
  }
}



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

    emailSent.value = true

    const querySnapshot = await getDocs(collection(db, "users"));

    querySnapshot.forEach((doc:any) => {

    console.log(doc.data());
})

}

</script>

<template>

    <div>
        <div class="flex justify-center items-center animate-bounce w-fullgit " v-if="emailSent">
            <p class="text-green-700 text-4xl lg:text-6xl lg:ml-0  leading-loose" >accepted.</p>
          </div>
        <input v-model="email"  type="text" placeholder="enter your email"
            class="w-full h-full bg-black border-white border text-white mb-5 p-4 rounded" />
            <div v-if="!isWrongCode && !emailSent" class="flex text-white w-full justify-center mt-5 cursor-pointer">
           <span @click="handleRegisterClick" class="text-xl">{{ isEmail ? 'Proceed' : 'apply' }}</span>
          </div>
    </div>
</template>