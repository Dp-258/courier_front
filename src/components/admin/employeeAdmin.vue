<script setup>
import { ref, onMounted, onBeforeMount, watch } from 'vue'
import { useUserStore } from "@/stores/user.js";
import { useEmployeeStore } from "@/stores/employee.js";
import Swal from "sweetalert2";
const props = defineProps(['sidebarActive']);
console.log(props.sidebarActive);


const userStore = useUserStore();
const employeeStore = useEmployeeStore();
const searchCode = ref();
const usersData = ref();
const currentUser = ref();
const currentEmail = ref();
const newPassword = ref();
const isEditing = ref(false);

//Variables for the change page table
const currentPage = ref(1);
const rowsPerPage = ref(5);

//VARIABLES FOR CREATING A NEW EMPLOYEE
const first_names = ref();
const last_names = ref();
const email = ref();
const id_card = ref();
const password = ref();
const city = ref();
const address = ref();
const phone = ref();
const occupation = ref();
const is_staff = ref(false);

watch(() => occupation.value, () => {
    if (occupation.value == 'Administrador') {
        is_staff.value = true;
    } else {
        is_staff.value = false;
    }
})

watch(() => currentUser.value, () => {
    if(currentUser.value){
        console.log(currentUser.value)
        if (currentUser.value.occupation == 'Administrador') {
            currentUser.value.user.is_staff = true;
        } else {
            currentUser.value.user.is_staff = false;
        }
    }
},{deep:true})

onBeforeMount(async () => {
    const response = await fetch(`http://127.0.0.1:3000/empleados`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Hubo un problema al obtener los datos de los empleados.');
    }
    usersData.value = await response.json();
})

const openDisableEmployeeSwal = (user, activate) => {
    const action = activate ? "deshabilitar" : "habilitar";
    const actionColor = activate ? "#d33" : "#008000";

    Swal.fire({
        title: `¿Estás seguro de que quieres ${action} al usuario: ${user.user.last_names}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: action.charAt(0).toUpperCase() + action.slice(1),
        confirmButtonColor: actionColor,
        cancelButtonText: "Cancelar"
    }).then(async (result) => {
        if (result.isConfirmed) {
            const response = await fetch(`http://127.0.0.1:3000/empleados/disable/${user.user.email}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    'active': !activate,
                })
            });
            if (response.ok) {
                Swal.fire("Petición realizada correctamente!", "", "success").then(() => {
                    window.location.reload();
                });
            } else {
                throw new Error('Hubo un problema al obtener los datos del usuario.');
            }
        }
    });
}


const updateEmployee = async (user) => {
    let closeBtn = document.getElementById('btn-close-modal');
    closeBtn.click();
    const response = await fetch(`http://127.0.0.1:3000/empleados/edit/${currentEmail.value}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        //Me falta password
        body: JSON.stringify({
            'first_names': user.user.first_names,
            'last_names': user.user.last_names,
            'employee_email': user.user.email,
            'city': user.user.city,
            'address': user.user.address,
            'id_card': user.user.id_card,
            "phone": user.user.phone,
            "active": user.user.active,
            "is_staff": user.user.is_staff,
            "occupation": user.occupation
        })
    });

    if (!response.ok) {
        Swal.fire("Hubo un problema al actualizar los datos del usuario.", "", "error").then(() => {
            window.location.reload();
        });
        throw new Error('Hubo un problema al actualizar los datos del usuario.');
    } else {
        Swal.fire("Empleado actualizado correctamente!", "", "success").then(() => {
            window.location.reload();
        });
    }
}

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const createEmployee = async () => {
    const response = await fetch(`http://127.0.0.1:3000/registerEmployee/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            'first_names': first_names.value,
            'last_names': last_names.value,
            'email': email.value,
            'password': password.value,
            'city': city.value,
            'address': address.value,
            'id_card': id_card.value,
            "phone": phone.value,
            "is_staff": is_staff.value,
            "occupation": occupation.value
        })
    });
    Swal.fire("Empleado creado correctamente!", "", "success").then(() => {
        window.location.reload();
    });
    if (!response.ok) {
        throw new Error('Hubo un problema al obtener los datos del empleado.');
    }
}

</script>
<template>
    <div class="text-2xl flex items-center mb-2">
        <div>
            <i class="fa-solid fa-users mr-2"></i>
            <span class="font-bold">Administración de empleados</span>
        </div>
    </div>
    <div>
        <div title="Crear empleado" onclick="create_employee_modal.showModal()" class="w-fit">
            <button
                class="flex items-center justify-center rounded-xl bg-amber-400 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl p-2 px-3">
                <i class="fa-solid fa-plus fa-sm mr-3"></i>
                <div class="font-medium">
                    Crear empleado
                </div>
            </button>
        </div>

    </div>
    <br>
    <!-- Search bar -->
    <!--
        <form @submit.prevent="searchByCode(searchCode)" class="flex items-center w-3/6 min-w-[420px]">
            <div class="flex w-full">
                <input type="text" v-model="searchCode"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-l-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-5 p-2.5"
                    placeholder="Buscar en el directorio de usuarios...">
                <button type="submit"
                    class="cursor-pointer bg-gray-200 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-r-lg px-3 content-center hover:bg-gray-300">
                    <i class="fa-solid fa-magnifying-glass text-black"></i>
                </button>
            </div>
        </form>
        <br>
    -->
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg border border-gray-200">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                    <th scope="col" class="px-6 py-3">
                        Nombre
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Identificación
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Email
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Cargo
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Activo
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                        Acciones
                    </th>
                </tr>
            </thead>

            <transition name="fadeTable">
                <tbody v-if="usersData">
                    <tr v-for="(user, userIndex) in usersData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)"
                        :key="user" class="border-b">
                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 max-w-[100px]">
                            {{ user.user.first_names }} {{ user.user.last_names }}
                        </th>
                        <td class="px-6 py-4">
                            {{ user.user.id_card }}
                        </td>
                        <td class="px-6 py-4">
                            {{ user.user.email }}
                        </td>
                        <td class="px-6 py-4">
                            {{ user.occupation }}
                        </td>
                        <td class="px-6 py-4 text-center">
                            <div v-if="user.user.active == true">
                                <i class="fa-solid fa-check text-green-400"></i>
                            </div>
                            <div v-else>
                                <i class="fa-solid fa-xmark fa-lg text-red-600"></i>
                            </div>
                        </td>
                        <td class="py-4 text-center items-center justify-center content-center">
                            <i @click="currentUser = user; currentEmail = currentUser.user.email; originalUser = JSON.parse(JSON.stringify(user));"
                                onclick="details_modal.showModal()" title="Detalle del empleado"
                                class="fa-solid fa-square-caret-down fa-lg cursor-pointer hover:text-amber-600 transition-all duration-300 mr-3"></i>
                            <i @click="currentUser = user; isEditing = true; currentEmail = currentUser.user.email; originalUser = JSON.parse(JSON.stringify(user));"
                                onclick="details_modal.showModal()" title="Editar empleado"
                                class="fa-solid fa-pencil fa-lg cursor-pointer hover:text-amber-600 transition-all duration-300 mr-3"></i>
                            <i v-if="user.user.active == true" @click="currentUser = user; openDisableEmployeeSwal(user,user.user.active)" title="Deshabilitar empleado"
                                class="fa-solid fa-ban fa-lg text-red-600 cursor-pointer hover:text-red-700 transition-all duration-300 mr-3"></i>
                                <i v-else @click="currentUser = user; openDisableEmployeeSwal(user,user.user.active)" title="Habilitar empleado"
                                class="fa-solid fa-check fa-lg text-green-400 cursor-pointer hover:text-green-700 transition-all duration-300 mr-3"></i>
                        </td>
                    </tr>
                </tbody>
            </transition>
        </table>
        <transition name="fadeTable">
            <div v-if="usersData" class="text-right mr-2 my-2">
                <button title="Página anterior" class="p-1 px-2 rounded-xl bg-gray-800 text-white disabled:bg-gray-300"
                    @click="currentPage--" :disabled="currentPage === 1">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                <span title="Página actual" class="p-1 px-2 rounded-xl border border-gray-800 mx-2 cursor-default">{{
                    currentPage }}</span>
                <button title="Siguiente página" class="p-1 px-2 rounded-xl bg-gray-800 text-white disabled:bg-gray-300"
                    @click="currentPage++" :disabled="currentPage === Math.ceil(usersData.length / rowsPerPage)">
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
            </div>
        </transition>
    </div>

    <!--Modals-->
    <!--Details Modal-->
    <dialog id="details_modal" class="modal">
        <!--Details Modal-->
        <div v-if="currentUser" class="modal-box min-w-[400px] sm:min-w-[700px] w-auto max-w-2xl">
            <form method="dialog" @click="isEditing = !isEditing">
                <button id="btn-close-modal" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <div class="flex items-center text-center justify-center">
                <transition name="fade" mode="out-in">
                    <h3 v-if="isEditing" class="font-bold text-2xl">EDICIÓN DEL EMPLEADO</h3>
                    <h3 v-else class="font-bold text-2xl">DETALLE DEL EMPLEADO</h3>
                </transition>
            </div>
            <br>
            <div v-if="currentUser">
                <div class="relative flex items-center justify-center">
                    <div class="flex">
                        <div class="content-center mr-5">
                            <div class="rounded-full border-2 border-amber-600 p-5">
                                <i class="fa-solid fa-user fa-2xl text-amber-600"></i>
                            </div>
                        </div>

                        <div class="text-lg font-medium w-fit" style="display: grid; grid-template-columns: 150px 1fr;">
                            <div>
                                Nombre:
                            </div>
                            <div class="font-normal">
                                {{ currentUser.user.first_names }} {{ currentUser.user.last_names }}
                            </div>
                            <div class="w-fit">
                                Identificación:
                            </div>
                            <div class="font-normal">
                                {{ currentUser.user.id_card }}
                            </div>
                            <div class="w-fit">
                                Cargo:
                            </div>
                            <div class="font-normal">
                                {{ currentUser.occupation }}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div v-if="!isEditing" title="Editar información" @click="isEditing = !isEditing"
                            class="absolute bottom-0 right-0 w-fit content-center mr-5 hover:scale-105 transition-all duration-200 cursor-pointer">
                            <div class="rounded-full bg-sky-600 h-10 w-10 content-center text-center">
                                <i class="fa-solid fa-pencil fa-lg text-white"></i>
                            </div>
                        </div>
                        <div v-else>
                            <div title="Guardar cambios" @click="isEditing = !isEditing; updateEmployee(currentUser)"
                                class="absolute bottom-0 right-12 w-fit content-center mr-5 hover:scale-105 transition-all duration-200 cursor-pointer">
                                <div class="rounded-full bg-sky-600 h-10 w-10 content-center text-center">
                                    <i class="fa-regular fa-floppy-disk fa-lg text-white"></i>
                                </div>
                            </div>
                            <div title="Cancelar cambios" @click="isEditing = false; currentUser = JSON.parse(JSON.stringify(originalUser))"
                                class="absolute bottom-0 right-0 w-fit content-center mr-5 hover:scale-105 transition-all duration-200 cursor-pointer">
                                <div class="rounded-full bg-red-600 h-10 w-10 content-center text-center">
                                    <i class="fa-solid fa-xmark fa-lg text-white"></i>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <br>
                <hr>
                <div class="mt-3 mx-5" style="display: grid; grid-template-columns: 180px 1fr;">
                    <div class="border-b border-slate-400 py-1 content-center"><span class="font-medium"
                            style="display: inline-block">Nombres:</span></div>
                    <div class="border-b border-slate-400 py-1 content-center">
                        <input v-if="isEditing" type="text" v-model="currentUser.user.first_names"
                            class="border border-gray-400 px-2 py-1 rounded">
                        <span v-else class="text-gray-500">{{ currentUser.user.first_names }}</span>
                    </div>

                    <div class="border-b border-slate-400 py-1 content-center"><span class="font-medium"
                            style="display: inline-block">Apellidos:</span></div>
                    <div class="border-b border-slate-400 py-1 content-center">
                        <input v-if="isEditing" type="text" v-model="currentUser.user.last_names"
                            class="border border-gray-400 px-2 py-1 rounded">
                        <span v-else class="text-gray-500">{{ currentUser.user.last_names }}</span>
                    </div>

                    <div class="border-b border-slate-400 py-1 content-center"><span class="font-medium"
                            style="display: inline-block">Email:</span></div>
                    <div class="border-b border-slate-400 py-1 content-center">
                        <input v-if="isEditing" type="email" v-model="currentUser.user.email"
                            class="border border-gray-400 px-2 py-1 rounded">
                        <span v-else class="text-gray-500">{{ currentUser.user.email }}</span>
                    </div>

                    <div class="border-b border-slate-400 py-1 content-center"><span class="font-medium"
                            style="display: inline-block">Cargo:</span></div>
                    <div class="border-b border-slate-400 py-1 content-center">
                        <select v-if="isEditing" v-model="currentUser.occupation" placeholder="Seleccione una de las opciones"
                            class="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[200px] p-2">
                            <option selected disabled>Seleccionar</option>
                            <option value="Operativo">Operativo</option>
                            <option value="Transportista">Transportista</option>
                            <option value="Administrador">Administrador</option>
                        </select>
                        <span v-else class="text-gray-500">{{ currentUser.occupation }}</span>
                    </div>

                    <div class="hidden">
                        <div class="py-1 my-1"><span class="font-medium" style="display: inline-block">Administrador
                                :</span></div>
                        <div class="py-1 my-1">
                            <label class="inline-flex items-center cursor-pointer">
                                <input type="checkbox" class="sr-only peer" v-model="currentUser.user.is_staff">
                                <div
                                    class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
                                </div>
                            </label>
                        </div>
                    </div>

                    <div class="border-b border-slate-400 py-1 content-center"><span class="font-medium"
                            style="display: inline-block">Identificación:</span></div>
                    <div class="border-b border-slate-400 py-1 content-center">
                        <input v-if="isEditing" type="text" v-model="currentUser.user.id_card"
                            class="border border-gray-400 px-2 py-1 rounded">
                        <span v-else class="text-gray-500">{{ currentUser.user.id_card }}</span>
                    </div>

                    <div class="border-b border-slate-400 py-1 content-center"><span class="font-medium"
                            style="display: inline-block">Ciudad:</span></div>
                    <div class="border-b border-slate-400 py-1 content-center">
                        <input v-if="isEditing" type="text" v-model="currentUser.user.city"
                            class="border border-gray-400 px-2 py-1 rounded">
                        <span v-else class="text-gray-500">{{ currentUser.user.city }}</span>
                    </div>

                    <div class="border-b border-slate-400 py-1 content-center"><span class="font-medium"
                            style="display: inline-block">Dirección:</span></div>
                    <div class="border-b border-slate-400 py-1 content-center">
                        <input v-if="isEditing" type="text" v-model="currentUser.user.address"
                            class="border border-gray-400 px-2 py-1 rounded">
                        <span v-else class="text-gray-500">{{ currentUser.user.address }}</span>
                    </div>

                    <div class="border-b border-slate-400 py-1 content-center"><span class="font-medium"
                            style="display: inline-block">Teléfono:</span></div>
                    <div class="border-b border-slate-400 py-1 content-center">
                        <input v-if="isEditing" type="tel" v-model="currentUser.user.phone"
                            class="border border-gray-400 px-2 py-1 rounded">
                        <span v-else class="text-gray-500">{{ currentUser.user.phone }}</span>
                    </div>

                    <div class="border-b border-slate-400 py-1"><span class="font-medium"
                            style="display: inline-block">Habilitado:</span></div>
                    <div v-if="isEditing" class="border-b border-slate-400 pl-10 py-1">
                        <label class="inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="sr-only peer" v-model="currentUser.user.active">
                            <div
                                class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
                            </div>
                        </label>
                    </div>
                    <div v-else class="border-b border-slate-400 py-1 pl-5">
                        <i v-if="currentUser.user.active == true" class="fa-solid fa-check text-green-400"></i>
                        <i v-else class="fa-solid fa-x-mark text-red-600"></i>
                    </div>
                </div>
            </div>
        </div>
        <br>
        <!--Btn para cerrar-->
        <form method="dialog" @click="isEditing = !isEditing" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>

    <!--Create Modal-->
    <dialog id="create_employee_modal" class="modal">
        <!--Details Modal-->
        <div class="modal-box min-w-[400px] sm:min-w-[700px] w-auto max-w-2xl">
            <form method="dialog">
                <button id="btn-close-modal" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <div class="flex items-center text-center justify-center mb-2">
                <transition name="fade" mode="out-in">
                    <h3 class="font-bold text-2xl text-amber-500">CREAR NUEVO EMPLEADO</h3>
                </transition>
            </div>
            <div class="ml-5 flex">
                <div>
                    <i class="fa-solid fa-user"></i>
                </div>
                <div class="ml-3">
                    Complete los siguientes datos para crear el empleado
                </div>
            </div>
            <div>
                <div class="my-3 mx-5" style="display: grid; grid-template-columns: 180px 1fr;">
                    <div class="py-1 content-center my-1"><span class="font-medium"
                            style="display: inline-block">Nombres:</span></div>
                    <div class="py-1 content-center my-1">
                        <input type="text" v-model="first_names" placeholder="Ex: Eduardo Gabriel"
                            class="border border-gray-400 px-2 py-1 rounded w-full">
                    </div>

                    <div class="py-1 content-center my-1"><span class="font-medium"
                            style="display: inline-block">Apellidos:</span></div>
                    <div class="py-1 content-center my-1">
                        <input type="text" v-model="last_names" placeholder="Gonzales Veintimilla"
                            class="border border-gray-400 px-2 py-1 rounded w-full">
                    </div>

                    <div class="py-1 content-center my-1"><span class="font-medium"
                            style="display: inline-block">Email:</span></div>
                    <div class="py-1 content-center my-1">
                        <input type="email" v-model="email" placeholder="Ex: example@example.com"
                            class="border border-gray-400 px-2 py-1 rounded w-full">
                        <span v-if="email && !validateEmail(email)" class="text-red-500">Por favor, ingresa un correo
                            electrónico válido.</span>
                    </div>

                    <div class="py-1 content-center my-1"><span class="font-medium"
                            style="display: inline-block">Cargo:</span></div>
                    <div class="py-1 content-center my-1">
                        <select v-model="occupation" placeholder="Seleccione una de las opciones"
                            class="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2">
                            <option selected disabled>Seleccionar</option>
                            <option value="Operativo">Operativo</option>
                            <option value="Transportista">Transportista</option>
                            <option value="Administrador">Administrador</option>
                        </select>
                    </div>

                    <div class="py-1 content-center my-1"><span class="font-medium"
                            style="display: inline-block">Identificación:</span></div>
                    <div class="py-1 content-center my-1">
                        <input type="text" v-model="id_card" placeholder="Ex: 1726697194"
                            class="border border-gray-400 px-2 py-1 rounded w-full">
                    </div>

                    <div class="py-1 content-center my-1"><span class="font-medium"
                            style="display: inline-block">Ciudad:</span></div>
                    <div class="py-1 content-center">
                        <input type="text" v-model="city" placeholder="Ex: Quito"
                            class="border border-gray-400 px-2 py-1 rounded w-full">
                    </div>

                    <div class="py-1 content-center my-1"><span class="font-medium"
                            style="display: inline-block">Dirección:</span></div>
                    <div class="py-1 content-center my-1">
                        <input type="text" v-model="address" placeholder="Ex: Av. 24 de Agosto"
                            class="border border-gray-400 px-2 py-1 rounded w-full">
                    </div>

                    <div class="py-1 content-center my-1"><span class="font-medium"
                            style="display: inline-block">Teléfono:</span></div>
                    <div class="py-1 content-center my-1">
                        <input type="tel" v-model="phone" placeholder="Ex: 0959936153"
                            class="border border-gray-400 px-2 py-1 rounded w-full">
                    </div>

                    <div class="py-1 content-center my-1"><span class="font-medium"
                            style="display: inline-block">Contraseña:</span></div>
                    <div class="py-1 content-center my-1">
                        <input type="password" placeholder="••••••••••••••" v-model="password"
                            class="border border-gray-400 px-2 py-1 rounded w-full">
                    </div>
                    <div class="hidden">
                        <div class="py-1 my-1"><span class="font-medium" style="display: inline-block">Administrador
                                :</span></div>
                        <div class="py-1 my-1">
                            <label class="inline-flex items-center cursor-pointer">
                                <input type="checkbox" class="sr-only peer" v-model="is_staff">
                                <div
                                    class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
                <form method="dialog" class="modal-backdrop text-center">
                    <div>
                        <button @click="createEmployee"
                            :disabled="first_names == null || first_names == '' || last_names == null || last_names == '' || email == null || email == '' || !validateEmail(email) || id_card == null || id_card == '' || password == null || password == '' || address == null || address == '' || phone == null || phone == ''"
                            class="btn cursor-pointer bg-amber-400 rounded-lg px-3 content-center hover:bg-amber-500 hover:scale-105">
                            <i class="fa-solid fa-user"></i>
                            Crear empleado
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <br>
        <!--Btn para cerrar-->
        <form method="dialog" @click="isEditing = !isEditing" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
</template>