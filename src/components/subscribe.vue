<script lang="ts" setup>
import { ref } from "vue";
import { makeRequest } from "../composables/email-service";
import { collection, addDoc } from "firebase/firestore";
import db from "../composables/use-firebase";

const email = ref("");
const emailSent = ref(false);
const handleRegisterClick = () => {
    createItem();
};

const createItem = async () => {
    const colRef = collection(db, "users");
    // data to send
    const dataObj = {
        email: email.value,
    };
    makeRequest(email.value);
    // create document and return reference to it
    const docRef = await addDoc(colRef, dataObj);

    // access auto-generated ID with '.id'
    console.log("Document was created with ID:", docRef.id);

    emailSent.value = true;
};
</script>

<template>
    <div
        class="flex flex-col h-screen items-center justify-center w-full px-5 bg-black"
    >
        <div v-if="!emailSent">
            <input
                v-model="email"
                type="text"
                placeholder="enter your email"
                class="w-full h-[50px] bg-black border-white border text-white mb-5 p-4 rounded"
            />
            <div
                class="flex text-white text-[9px] lg:text-base w-full justify-center mt-5"
            >
                <div class="mx-10 lg:m-0">
                    <span
                        @click="handleRegisterClick"
                        class="text-red-500 ml-3 text-base lg:ml-1 mb-4 cursor-pointer"
                        >apply here.</span
                    >
                </div>
            </div>
        </div>

        <div
            class="flex justify-center items-center animate-bounce w-fullgit"
            v-else
        >
            <p
                class="text-green-700 text-4xl lg:text-6xl lg:ml-0 leading-loose"
            >
                accepted.
            </p>
        </div>
    </div>
</template>
