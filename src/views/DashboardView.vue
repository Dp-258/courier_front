<script setup>
import { ref, onBeforeMount, onMounted } from 'vue'
import { useUserStore } from "@/stores/user.js";
import { RouterView, RouterLink, useRouter } from "vue-router";
import Swal from "sweetalert2";

const router = useRouter();
const showDropDown = ref(false);
const showSide = ref(true);
const userStore = useUserStore();
const isStaff = ref(false);
const role = ref(false);

onBeforeMount(async () => {
  try {
    await userStore.getUserInfo();
  } catch (error) {
    if (error) {
      console.error('Error de autenticación:', error.message);
      Swal.fire({
        title: "Error de autenticación",
        text: "Tiempo de sesión expirado, vuelva a iniciar su sesión",
        icon: "error",
      });
      router.push({ path: '/login' })
    } else {
      console.error('Error al realizar la solicitud:', error.message);
      router.push({ path: '/login' })
    }
    userStore.userData = null;
    userStore.email = null;
    userStore.jwt = null;
  }
  console.log('Inicializaciones realizadas');
})


const signOut = async () => {
  await fetch('http://127.0.0.1:3000/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  
  if(userStore.role == 'client')
    router.replace({ path: "/login" })
  else
    router.replace({path:'/loginEmployee'})
  
  userStore.userData = null;
  userStore.email = null;
  userStore.jwt = null;
  userStore.role = null;
}

const toggleSideBar = () => {
  showSide.value = !showSide.value
}
const toggleDrop = () => {
  showDropDown.value = !showDropDown.value
}

const printRole = (rol) =>{
  if(userStore.userData){
    if(userStore.userData.is_staff)
      return 'Admin'
    
    if(rol == 'client')
      return 'Cliente';
    else
      return 'Empleado';
  }
}

const getName = (name) =>{
  if(name)
    return name.first_names
}
</script>
<template>
  <div class="w-screen h-screen flex">
    <!-- Side bar -->
    <div class="w-[260px] bg-gray-900 text-white fixed" style="height: -webkit-fill-available;" v-show="showSide">
      <div class="h-[50px] bg-gray-100 flex justify-start  items-center text-left">
        <div class="p-[30px]">
          <img src="../assets/SwiftShip_Logo.png" alt="Logo"
            class="w-[75%] mx-auto py-5 transition ease-in-out duration-200 hover:scale-105">
        </div>
      </div>
      <div class="bg-gray-900 py-[20px]" style="height: -webkit-fill-available;">
        <div class="flex flex-col justify-between h-[83vh] px-[20px] space-y-[10px]">
          <div class=" flex flex-col justify-between space-y-[10px]">
            <router-link v-if="userStore.role == 'employee'" to="/adminPackages"
              class="inline-flex relative items-center py-[10px] px-[10px] w-full text-sm font-medium rounded-md border-gray-200 hover:bg-gray-200 hover:text-gray-800  transition duration-400 ease-in-out">
              <i
                class="fa-solid fa-boxes-packing fa-xl mr-2 w-[25px] h-[25px] fill-current content-center text-center"></i>
              Clasificación de paquetes
            </router-link>
            <router-link v-if="userStore.role == 'client'" to="/userPrealerts"
              class="inline-flex relative items-center py-[10px] px-[10px] w-full text-sm font-medium rounded-md border-gray-200 hover:bg-gray-300  hover:text-gray-800 transition duration-400 ease-in-out">
              <i class="fa-regular fa-bell fa-xl mr-2 w-[25px] h-[25px] fill-current content-center text-center"></i>
              Mis prealertas
            </router-link>
            <router-link v-if="userStore.role == 'client'" to="/userDashboard"
              class="inline-flex relative items-center py-[10px] px-[10px] w-full text-sm font-medium rounded-md border-gray-200 hover:bg-gray-300  hover:text-gray-800 transition duration-400 ease-in-out">
              <i class="fa-solid fa-box fa-xl mr-2 w-[25px] h-[25px] fill-current content-center text-center"></i>
              Mis paquetes
            </router-link>
            <router-link v-if="userStore.role == 'client'" to="/listUserPackages"
              class="inline-flex relative items-center py-[10px] px-[10px] w-full text-sm font-medium rounded-md rounded-b-lg hover:bg-gray-300  hover:text-gray-800 transition duration-400 ease-in-out">
              <i
                class="fa-solid fa-boxes-stacked fa-xl mr-2 w-[25px] h-[25px] fill-current content-center text-center"></i>
              Historial de paquetes
            </router-link>
            <router-link v-if="userStore.role == 'employee'" to="/listPackages"
              class="inline-flex relative items-center py-[10px] px-[10px] w-full text-sm font-medium rounded-md rounded-b-lg hover:bg-gray-300  hover:text-gray-800 transition duration-400 ease-in-out">
              <i
                class="fa-solid fa-boxes-stacked fa-xl mr-2 w-[25px] h-[25px] fill-current content-center text-center"></i>
              Historial de paquetes
            </router-link>
            <router-link v-if="userStore.role == 'employee' && userStore.userData.is_staff == true" to="/employeeAdmin"
              class="inline-flex relative items-center py-[10px] px-[10px] w-full text-sm font-medium rounded-md rounded-b-lg hover:bg-gray-300  hover:text-gray-800 transition duration-400 ease-in-out">
              <i
                class="fa-solid fa-users-gear fa-xl mr-2 w-[25px] h-[25px] fill-current content-center text-center"></i>
              Administración de empleados
            </router-link>
            <router-link v-if="userStore.role == 'employee' && userStore.userData.is_staff == true" to="/reports"
              class="inline-flex relative items-center py-[10px] px-[10px] w-full text-sm font-medium rounded-md rounded-b-lg hover:bg-gray-300  hover:text-gray-800 transition duration-400 ease-in-out">
              <i class="fa-solid fa-square-poll-vertical fa-xl mr-2 w-[25px] h-[25px] fill-current content-center text-center"></i>
              Generación de informes
            </router-link>
            <router-link v-if="userStore.role == 'employee' && userStore.userData.is_staff == true" to="/partners"
              class="inline-flex relative items-center py-[10px] px-[10px] w-full text-sm font-medium rounded-md rounded-b-lg hover:bg-gray-300  hover:text-gray-800 transition duration-400 ease-in-out">
              <i class="fa-solid fa-handshake fa-xl mr-2 w-[25px] h-[25px] fill-current content-center text-center"></i>
              Administración de socios
            </router-link>

          </div>
          <div @click="signOut">
            <router-link to="/"
              class="inline-flex relative items-center py-[10px] px-[10px] w-full text-sm font-medium rounded-md border-gray-200 hover:bg-gray-300 hover:text-gray-800  transition duration-400 ease-in-out">
              <i class="fa-solid fa-door-open fa-xl mr-2 w-[25px] h-[25px] fill-current content-center text-center"></i>
              Cerrar sesión
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="min-w-[261px]" v-show="showSide">sasd</div>
    <div class="w-full h-full bg-gray-400">
      <div
        class="h-[50px] bg-gray-100 flex items-center shadow-sm px-[20px] w-full py-[10px] z-10 border-b space-between">
        <!-- Hambuger menu -->
        <div class="cursor-pointer w-[30px]" @click="toggleSideBar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class=" w-[25px] h-[25px]">
            <!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
            <path
              d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
          </svg>
        </div>

        <!-- User login -->
        <div class="w-[200px] mr-5 ml-auto">
          <div class="flex items-center justify-start space-x-4 cursor-pointer" @click="toggleDrop">
            <div class="w-10 h-10 rounded-full border-2 border-gray-50 flex justify-center items-center">
              <i class="fa-solid fa-user"></i>
            </div>
            <div class="font-semibold dark:text-white text-left">
              <div>{{getName(userStore.userData)}}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">{{printRole(userStore.role)}}</div>
            </div>
          </div>
          <!-- Drop down -->
          <div v-show="showDropDown"
            class="absolute right-[10px] z-10 mt-2 mr-5 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
            <div class="py-1 text-left" role="none">
              <form @click="signOut">
                <button
                  class="text-gray-700 block w-full px-4 py-2 text-left text-sm hover:bg-slate-800 hover:text-white"
                  role="menuitem" tabindex="-1" id="menu-item-3">Cerrar sesión</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 p-[20px]">
        <div class="border border-gray-300 rounded-md p-[20px] h-full min-h-[83.5vh]">
          <router-view :sidebarActive="showSide"></router-view>
        </div>
      </div>
    </div>
    <!-- Main  -->
  </div>
</template>