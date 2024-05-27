<script setup>
import { ref } from 'vue';
import { useUserStore } from "@/stores/user.js";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

const router = useRouter();
const email = ref(null);
const password = ref(null);
const loading = ref(false);
const userStore = useUserStore();

const handleSubmit = async () => {
    //Habilita el boton de loading
    loading.value = true;
    //Peticion al microservicio
    const response = await fetch('http://127.0.0.1:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
            'email': email.value,
            'password': password.value,
        })
    });
    let respuesta = await response.json();
    if (response.ok) {
        await userStore.getUserInfo();
        await redirectToTheirView(userStore.userData, response);

        Swal.fire({
            title: "¡Éxito!",
            text: "¡Bienvenido a SwiftShip!",
            icon: "success",
        });
    } else {
        if (respuesta.error == 'Contraseña equivocada') {
            Swal.fire({
                title: "Error",
                text: "La contraseña no es correcta",
                icon: "error",
            })
        } else if (respuesta.error == 'Credenciales inválidas') {
            Swal.fire({
                title: "Error",
                text: "Usario no registrado",
                icon: "error",
            })
        } else {
            Swal.fire({
                title: "Error",
                text: "La petición fallo, por favor, intentelo de nuevo",
                icon: "error",
            })
        }
    }
    //Deshabilita el boton de loading
    loading.value = false;

};

const redirectToTheirView = async(data, respuesta) => {
    userStore.email = email.value;
    userStore.jwt = respuesta;
    let response = await userStore.getClientInfo();
    if(response.locker_code)
    {
        userStore.role = "client";
        router.push({ path: "/userPrealerts" })
    } else{
        userStore.role = "employee";
        router.push({ path: "/adminPackages" })
    }
}
</script>

<template>
    <div class="p-5 sm:p-10 min-h-[100vh] flex items-center justify-center bg-slate-100 ">
        <div class="overflow-hidden lg:w-[75%]">
            <div class="w-full sm:p-5 lg:hidden">
                <img src="../assets/SwiftShip_Logo.png" alt="Logo"
                    class="w-[75%] mx-auto py-5 transition ease-in-out duration-200 hover:scale-105">
            </div>
            <form @submit.prevent="handleSubmit">
                <div class="flex space-between items-center justify-center">
                    <div class="lg:w-[75%] hidden lg:block">
                        <div class="p-5 h-full w-full justify-center mr-10">
                            <img src="../assets/SwiftShip_Logo.png" alt="Logo"
                                class="p-3 max-w-xs mx-auto transition ease-in-out duration-200 hover:scale-105">
                            <div class="w-[85%] mx-auto py-5">
                                <img src="https://images.pexels.com/photos/5025496/pexels-photo-5025496.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                    alt="package" class="rounded-xl ">
                            </div>
                        </div>
                    </div>
                    <div
                        class="bg-white shadow-lg border-2 border-amber-600 rounded-lg xs:w-[50%] sm:w-full p-5 sm:p-10 font-Orbitron">
                        <div class="text-center">
                            <b class="text-2xl text-black ">Inicio de sesión para empleados</b>

                        </div>
                        <br>
                        <div>
                            <div class="flex flex-col">
                                <span class="font-bold mb-1 text-black">
                                    <i class="fa-solid fa-envelope  mr-3 text-amber-500"></i>Email
                                </span>
                                <input type="email" v-model="email" name="email" placeholder="example@example.com"
                                    class="p-4 ml-1.5 input input-bordered border border-gray-200 rounded-xl input-primary w-full">
                            </div>
                        </div>
                        <br>
                        <div>
                            <div class="flex flex-col">
                                <span class="font-bold mb-1 text-black">
                                    <i class="fa-solid fa-lock mr-3 text-amber-500"></i>Contraseña
                                </span>
                                <input type="password" v-model="password" name="password" placeholder="•••••••••••"
                                    class="p-4 ml-1.5 input input-bordered border border-gray-200 rounded-xl input-primary w-full">
                            </div>
                        </div>

                        <br>
                        <button type="submit"
                            :disabled="loading || email == null || email == '' || password == null || password == ''"
                            class="text-black bg-amber-400 rounded-xl p-4 mx-2 w-full text-center place-content-center flex items-center content-center 
                            disabled:cursor-not-allowed disabled:text-gray-600 disabled:bg-slate-100 transition-all duration-200">
                            <b v-if="!loading">Iniciar sesión</b>
                            <div v-else class="flex justify-center items-center">
                                <div style="border-top-color:transparent"
                                    class="w-8 h-8 border-4 border-primary rounded-full animate-spin">
                                </div>
                                <p class="ml-2 text-primary">Cargando...</p>
                            </div>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>