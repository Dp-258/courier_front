<script setup>

import { ref } from 'vue';
import Swal from "sweetalert2";
import { useRouter } from "vue-router";

const name = ref(null);
const idDoc = ref(null);
const email = ref(null);
const password = ref(null);
const v_pass = ref(null);
const policyAccepted = ref(false);
const router = useRouter();

const handleSubmit = () => {
    // Accede al almacén de autenticación
    // Llama a la función register del almacén
};

const validateFields = () => {

    if (name.value !== null && idDoc.value !== '' && email.value !== null && password.value !== null && v_pass.value !== null) {
        
        if (!checkEmail(email.value)) {
            console.log("Error: Por favor, proporcione un correo electrónico valido");
            Swal.fire({
                title: "Error",
                text: "Proporcione un correo electrónico valido",
                icon: "error",
            });
            return false;
        } else if (password.value !== v_pass.value) {
            console.log("Error: Las contraseñas no coinciden");
            Swal.fire({
                title: "Error",
                text: "Las contraseñas no coinciden",
                icon: "error",
            });
            return false;
        } else if (!policyAccepted.value) {
            console.log("Error: Por favor, acepte nuestra política de privacidad");
            Swal.fire({
                title: "Error",
                text: "Por favor, acepte nuestra política de privacidad",
                icon: "error",
            });
            return false;
        } else if (password.value === v_pass.value && policyAccepted.value) {
            console.log("Success: Usuario creado");
            Swal.fire({
                title: "¡Éxito!",
                text: "Usuario creado correctamente",
                icon: "success",
            });
            return true;
        } else {
            console.log("Error: Por favor, verifique los campos");
            Swal.fire({
                title: "Error",
                text: "Por favor, verifique los campos",
                icon: "error",
            });
            return false;
        }
    } else {
        console.log("Error: Por favor, llene todos los campos");
        Swal.fire({
            title: "Error",
            text: "Por favor, llene todos los campos",
            icon: "error",
        })
        return false;
    }
};

const checkPassword = (password) => {
    const tamanioValid = /^(?=.{8,15})/;
    const minusculaValid = /^(?=.*[a-z])/;
    const mayusculaValid = /^(?=.*[A-Z])/;
    const numeroValid = /^(?=.*[0-9])/;
    const caracterValid = /^(?=.*[!@/#$%^&*])/;

    return (
        tamanioValid.test(password) &&
        minusculaValid.test(password) &&
        mayusculaValid.test(password) &&
        numeroValid.test(password) &&
        caracterValid.test(password)
    );
};

const checkEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const allDataCompleted = () => {
    if (name.value !== null && birthYear.value !== '' && email.value !== null && password.value !== null && v_pass.value !== null && policyAccepted.value)
        return true;
    else
        return false
}

const navigateToLogin = () =>{
    router.push({ path: "/" });
}
</script>


<template>
    <div class="bg-slate-100 p-5 sm:p-10 min-h-[100vh] flex items-center justify-center">
        <div class="overflow-hidden w-full xl:w-[80%]" name="formRegistro">
            <div class="w-full sm:p-5logo lg:hidden cursor-pointer transition ease-in-out duration-200 hover:scale-105" @click="navigateToLogin()">
                <img src="../assets/SwiftShip_Logo.png" alt="Logo" class="w-[75%] mx-auto py-5">
            </div>
            <form @submit.prevent="handleSubmit">
                <div class="flex items-center justify-center mb-10">
                    <div class="flex-none lg:w-[415px] hidden lg:block mx-10">
                        <div class="p-10 h-full flex justify-center items-center flex-col mb-60">
                            <img src="../assets/SwiftShip_Logo.png" @click="navigateToLogin()" alt="Logo" class="max-w-xs mb-10 cursor-pointer  transition ease-in-out duration-200 hover:scale-105">
                            <img src="https://images.pexels.com/photos/2552131/pexels-photo-2552131.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                alt="package" class="rounded-xl">
                        </div>

                    </div>
                    <div class="bg-white shadow-lg rounded-lg xs:w-[50%] sm:w-full p-5 sm:p-10 font-Orbitron">
                        <div>
                            <b class="text-2xl text-black">Registrarse</b>

                        </div>
                        <br>
                        <div>
                            <div class="flex flex-col">
                                <span class="font-bold mb-1 text-black">
                                    <i class="fa-solid fa-user  mr-3 text-[#18BFA4]"></i>Nombre
                                </span>
                                <input type="text" v-model="name" name="name" placeholder="Nombre completo"
                                    class="p-4 ml-1.5 input input-bordered border border-gray-200 rounded-xl w-full">
                            </div>
                        </div>
                        <br>
                        <div>
                            <div class="flex flex-col">
                                <span class="font-bold mb-1 text-black">
                                    <i class="fa-solid fa-calendar  mr-3 text-[#18BFA4]"></i>Tipo de documento de
                                    identificación
                                </span>
                                <select id="tipeDoc"
                                    class="bg-gray-50 ml-1.5 mt-2 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4">
                                    <option selected disabled>Seleccionar</option>
                                    <option value="CI">Cédula de identidad</option>
                                    <option value="RUC">RUC</option>
                                </select>
                            </div>
                        </div>
                        <br>
                        <div>
                            <div class="flex flex-col">
                                <span class="font-bold mb-1 text-black">
                                    <i class="fa-solid fa-calendar  mr-3 text-[#18BFA4]"></i>Número de identificación
                                </span>
                                <input type="number" v-model="idDoc" name="idDoc" placeholder="1226697194"
                                    class="p-4 ml-1.5 input input-bordered border border-gray-200 rounded-xl w-full" />
                            </div>
                        </div>
                        <br>
                        <div>
                            <div class="flex flex-col">
                                <span class="font-bold mb-1 text-black">
                                    <i class="fa-solid fa-envelope  mr-3 text-[#18BFA4]"></i>Correo electrónico
                                </span>
                                <input type="email" v-model="email" name="email" placeholder="ejemplo@ejemplo.com"
                                    class="p-4 ml-1.5 input input-bordered border border-gray-200 rounded-xl w-full">
                            </div>
                        </div>
                        <br>
                        <div>
                            <div class="flex flex-col">
                                <span class="font-bold mb-1 text-black">
                                    <i class="fa-solid fa-lock  mr-3 text-[#18BFA4]"></i>Contraseña
                                </span>
                                <input type="password" v-model="password" id="password" name="password"
                                    placeholder="•••••••••••" minlength="8"
                                    maxlength="15" required
                                    class="p-4 ml-1.5 input input-bordered border border-gray-200 rounded-xl w-full">
                            </div>
                        </div>
                        <br>
                        <div>
                            <div class="flex flex-col">
                                <span class="font-bold mb-1 text-black">
                                    <i class="fa-solid fa-check-double  mr-3 text-[#18BFA4]"></i>Verificación de
                                    contraseña
                                </span>
                                <input type="password" v-model="v_pass" id="v_pswd" name="v_pswd"
                                    placeholder="•••••••••••" @input="checkPassword($event.target.value)" minlength="8"
                                    maxlength="15" required
                                    class="p-4 input ml-1.5 input-bordered border border-gray-200 rounded-xl w-full">
                            </div>
                        </div>
                        <div>
                            <div class='flex flex-col text-black mt-5 mb-[-5px] ml-3'>
                                <label><input type="checkbox" v-model="policyAccepted" id="cbox1" />
                                    <span class="font-medium text-sm cursor-default select-none"> Al hacer clic,
                                        reconozco y acepto las
                                        <a :href="`https://retolia.com/privacypolicy`"
                                            class="text-blue-400 hover:text-blue-500 hover:underline cursor-pointer">políticas
                                            de privacidad
                                        </a>
                                        establecidas.</span>
                                </label><br />
                            </div>
                        </div>
                        <button @click="validateFields"
                            class="transition p-4 w-full bg-amber-400 hover:bg-amber-500 text-black rounded-lg mx-2
                            disabled:cursor-not-allowed disabled:text-gray-600 disabled:bg-slate-100 transition-all duration-200"
                            :disabled="!allDataCompleted()">

                            <b>Registrarse<i class="fa fa-log-in"></i></b>
                        </button>
                        <br>
                        <br>
                        <div class="text-center ml-5">
                            <router-link to="/" class="text-black hover:text-amber-400 cursor-pointer">
                                <b>¿Ya tienes cuenta?</b>
                            </router-link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>


<style scoped>
.validation ul {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.validation ul li {
    list-style: none;
    font-size: 0.9em;
    transition: 0.5s;
}

.validation ul li.valid {
    color: #11727C;
    display: inline;
}

.validation ul li .valid i.text-green-500 {
    display: inline;
    /* Mostrar el ícono verde */

}

/* Estilo para los íconos rojos */
.validation ul li .valid i.text-red-500 {
    display: none;
    /* Ocultar el ícono rojo */
}

/* Estilos checkbox*/
.custom-checkbox {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 16px;
    height: 16px;
    border: 2px solid black;
    border-radius: 2px;
    margin-right: 5px;
    margin-left: 5px;
    cursor: pointer;
    position: relative;
    vertical-align: middle;
}

/* Estilos para el visto dentro del checkbox */
.custom-checkbox:checked::after {
    content: '✔';
    font-size: 16px;
    line-height: 16px;
    color: #14b8a6;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: center;
}
</style>