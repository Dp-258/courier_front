<script setup>
import { ref, onMounted, onBeforeMount, watch } from 'vue'
import Swal from "sweetalert2";
const props = defineProps(['sidebarActive']);
console.log(props.sidebarActive);

//Variables para manejar la concurrencia del objeto
const storesData = ref();
const carriersData = ref();
const currentObject = ref();
const isEditingStore = ref(false);
const isEditingCarrier = ref(false);

//Variables for the change page table
const currentPageStore = ref(1);
const rowsPerPageStore = ref(5);
const currentPageCarrier = ref(1);
const rowsPerPageCarrier = ref(5);

//VARIABLES FOR CREATING A NEW Store & carrier
const store_name = ref();
const store_email = ref();
const store_description = ref();
const store_phone = ref();

const carrier_name = ref();
const carrier_email = ref();
const carrier_description = ref();
const carrier_phone = ref();

onBeforeMount(async () => {
    const response = await fetch(`http://127.0.0.1:3000/tiendas`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Hubo un problema al obtener los datos de las tiendas.');
    }
    storesData.value = await response.json();

    const response1 = await fetch(`http://127.0.0.1:3000/carriers`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    if (!response1.ok) {
        throw new Error('Hubo un problema al obtener los datos de los carriers.');
    }
    carriersData.value = await response1.json();
});

const createStore = async () => {
    const response = await fetch(`http://127.0.0.1:3000/tiendas/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            'name': store_name.value,
            'description': store_description.value,
            'email': store_email.value,
            'phone': store_phone.value,
        })
    });
    Swal.fire("Tienda creada correctamente!", "", "success").then(() => {
        window.location.reload();
    });
    if (!response.ok) {
        throw new Error('Hubo un problema al obtener los datos de la tienda.');
    }
}

const createCarrier = async () => {
    const response = await fetch(`http://127.0.0.1:3000/carriers/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            'name': carrier_name.value,
            'description': carrier_description.value,
            'email': carrier_email.value,
            'phone': carrier_phone.value,
        })
    });
    Swal.fire("Carrier creado correctamente!", "", "success").then(() => {
        window.location.reload();
    });
    if (!response.ok) {
        throw new Error('Hubo un problema al obtener los datos del carrier.');
    }
}

const updateStore = async (data) => {
    let closeBtn = document.getElementById('btn-close-store-modal');
    closeBtn.click();
    console.log(data);
    const response = await fetch(`http://127.0.0.1:3000/tiendas/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            'name': data.name,
            'description': data.description,
            'email': data.email,
            'phone': data.phone,
        })
    });
    Swal.fire("Tienda actualizada correctamente!", "", "success").then(() => {
        window.location.reload();
    });
    if (!response.ok) {
        throw new Error('Hubo un problema al obtener los datos de la tienda.');
    }
}

const updateCarrier = async (data) => {
    let closeBtn = document.getElementById('btn-close-carrier-modal-detail');
    closeBtn.click();
    console.log(data);
    const response = await fetch(`http://127.0.0.1:3000/carriers/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            'name': data.name,
            'description': data.description,
            'email': data.email,
            'phone': data.phone,
        })
    });
    Swal.fire("Carrier actualizado correctamente!", "", "success").then(() => {
        window.location.reload();
    });
    if (!response.ok) {
        throw new Error('Hubo un problema al obtener los datos de la tienda.');
    }
}

const openDeleteSwal = async (data, type) => {
    const action = data.active ? 'deshabilitar' : 'habilitar';
    const value = data.active ? false : true;
    Swal.fire({
        title: `¿Estás seguro de que quieres ${action} a ${data.name}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: `${action}`,
        cancelButtonText: "cancelar"
    }).then(async (result) => {
        if (result.isConfirmed) {
            console.log(!data.active);
            switch (type) {
                case 'tienda':
                    const response = await fetch(`http://127.0.0.1:3000/tiendas/disable/${data.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            'name': data.name,
                            'description': data.description,
                            'email': data.email,
                            'phone': data.phone,
                            'active':!data.active,
                        })
                    });
                    if (response.ok) {
                        Swal.fire(`¡${data.name} modificado correctamente!`, "", "success").then(() => {
                            window.location.reload();
                        });
                    } else {
                        throw new Error('Hubo un problema al eliminar los datos.');
                    }
                    break;

                case 'carrier':
                    const response1 = await fetch(`http://127.0.0.1:3000/carriers/disable/${data.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            'name': data.name,
                            'description': data.description,
                            'email': data.email,
                            'phone': data.phone,
                            'active':!data.active,
                        })
                    });
                    if (response1.ok) {
                        Swal.fire(`¡${data.name} modificado correctamente!`, "", "success").then(() => {
                            window.location.reload();
                        });
                    } else {
                        throw new Error('Hubo un problema al eliminar los datos.');
                    }
                    break;

                default:
                    break;
            }
        }

    });
}

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

</script>
<template>
    <div>
        <div class="flex items-center">
            <h1 class="text-xl font-semibold mr-4">Administración de tiendas</h1>
            <i class="fa-solid fa-store fa-xl"></i>
        </div>
        <div>
            <div>
                <div title="Crear empleado" onclick="create_store_modal.showModal()" class="w-fit">
                    <button
                        class="flex items-center justify-center rounded-xl bg-amber-400 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl p-2 px-3 mt-3">
                        <i class="fa-solid fa-store fa-sm mr-3"></i>
                        <div class="font-medium">
                            Crear tienda
                        </div>
                    </button>
                </div>

            </div>
            <br>

            <div class="relative overflow-x-auto shadow-md sm:rounded-lg border border-gray-200">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Nombre
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Descripción
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Email
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Teléfono
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Activo
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Acciones
                            </th>
                        </tr>
                    </thead>

                    <transition name="fadeTable">
                        <tbody v-if="storesData">
                            <tr v-for="(store, userIndex) in storesData.slice((currentPageStore - 1) * rowsPerPageStore, currentPageStore * rowsPerPageStore)"
                                :key="store" class="border-b">
                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 max-w-[100px]">
                                    {{ store.name }}
                                </th>
                                <td class="px-6 py-4">
                                    {{ store.description }}
                                </td>
                                <td class="px-6 py-4">
                                    {{ store.email }}
                                </td>
                                <td class="px-6 py-4">
                                    {{ store.phone }}
                                </td>
                                <td class="px-6 py-4">
                                    <div v-if="store.active == true">
                                        <i class="fa-solid fa-check text-green-400"></i>
                                    </div>
                                    <div v-else>
                                        <i class="fa-solid fa-xmark fa-lg text-red-600"></i>
                                    </div>
                                </td>
                                <td class="py-4 text-center items-center justify-center content-center">
                                    <i @click="currentObject = store;" onclick="details_store_modal.showModal()"
                                        title="Detalle de la tienda"
                                        class="fa-solid fa-square-caret-down fa-lg cursor-pointer hover:text-amber-600 transition-all duration-300 mr-3"></i>
                                    <i @click="currentObject = store; isEditingStore = true;"
                                        onclick="details_store_modal.showModal()" title="Editar tienda"
                                        class="fa-solid fa-pencil fa-lg cursor-pointer hover:text-amber-600 transition-all duration-300 mr-3"></i>
                                    <i v-if="store.active == true"
                                        @click="currentUser = user; openDeleteSwal(store, 'tienda')"
                                        title="Deshabilitar tienda"
                                        class="fa-solid fa-ban fa-lg text-red-600 cursor-pointer hover:text-red-700 transition-all duration-300 mr-3"></i>
                                    <i v-else @click="currentUser = user; openDeleteSwal(store, 'tienda')"
                                        title="Habilitar tienda"
                                        class="fa-solid fa-check fa-lg text-green-400 cursor-pointer hover:text-green-700 transition-all duration-300 mr-3"></i>

                                </td>
                            </tr>
                        </tbody>
                    </transition>
                </table>
                <transition name="fadeTable">
                    <div v-if="storesData" class="text-right mr-2 my-2">
                        <button title="Página anterior"
                            class="p-1 px-2 rounded-xl bg-gray-800 text-white disabled:bg-gray-300"
                            @click="currentPageStore--" :disabled="currentPageStore === 1">
                            <i class="fa-solid fa-chevron-left"></i>
                        </button>
                        <span title="Página actual"
                            class="p-1 px-2 rounded-xl border border-gray-800 mx-2 cursor-default">{{
                                currentPageStore }}</span>
                        <button title="Siguiente página"
                            class="p-1 px-2 rounded-xl bg-gray-800 text-white disabled:bg-gray-300"
                            @click="currentPageStore++"
                            :disabled="currentPageStore === Math.ceil(storesData.length / rowsPerPageStore)">
                            <i class="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                </transition>
            </div>

            <!--Modals-->
            <!--Details Modal-->
            <dialog id="details_store_modal" class="modal">
                <!--Details Modal-->
                <div v-if="currentObject" class="modal-box min-w-[400px] sm:min-w-[700px] w-auto max-w-2xl">
                    <form method="dialog" @click="isEditingStore = !isEditingStore">
                        <button id="btn-close-store-modal"
                            class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <div class="flex items-center text-center justify-center">
                        <transition name="fade" mode="out-in">
                            <h3 v-if="isEditingStore" class="font-bold text-2xl">EDICIÓN DE LA TIENDA</h3>
                            <h3 v-else class="font-bold text-2xl">DETALLE DE LA TIENDA</h3>
                        </transition>
                    </div>
                    <br>
                    <div v-if="currentObject">
                        <div class="relative flex items-center justify-center">
                            <div class="flex">
                                <div class="content-center mr-5">
                                    <div class="rounded-full border-2 border-amber-600 p-5">
                                        <i class="fa-solid fa-store fa-2xl text-amber-600"></i>
                                    </div>
                                </div>

                                <div class="text-lg font-medium w-fit"
                                    style="display: grid; grid-template-columns: 150px 1fr;">
                                    <div>
                                        Nombre:
                                    </div>
                                    <div class="font-normal">
                                        {{ currentObject.name }}
                                    </div>
                                    <div class="w-fit">
                                        Teléfono:
                                    </div>
                                    <div class="font-normal">
                                        {{ currentObject.email }}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div v-if="!isEditingStore" title="Editar información"
                                    @click="isEditingStore = !isEditingStore"
                                    class="absolute bottom-0 right-0 w-fit content-center mr-5 hover:scale-105 transition-all duration-200 cursor-pointer">
                                    <div class="rounded-full bg-sky-600 h-10 w-10 content-center text-center">
                                        <i class="fa-solid fa-pencil fa-lg text-white"></i>
                                    </div>
                                </div>
                                <div v-else>
                                    <div title="Guardar cambios"
                                        @click="isEditingStore = !isEditingStore; updateStore(currentObject)"
                                        class="absolute bottom-0 right-12 w-fit content-center mr-5 hover:scale-105 transition-all duration-200 cursor-pointer">
                                        <div class="rounded-full bg-sky-600 h-10 w-10 content-center text-center">
                                            <i class="fa-regular fa-floppy-disk fa-lg text-white"></i>
                                        </div>
                                    </div>
                                    <div title="Cancelar cambios" @click="isEditingStore = false;"
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
                                    style="display: inline-block">Nombre:</span></div>
                            <div class="border-b border-slate-400 py-1 content-center">
                                <input v-if="isEditingStore" type="text" v-model="currentObject.name"
                                    class="border border-gray-400 px-2 py-1 rounded">
                                <span v-else class="text-gray-500">{{ currentObject.name }}</span>
                            </div>

                            <div class="border-b border-slate-400 py-1 content-center"><span class="font-medium"
                                    style="display: inline-block">Descripción:</span></div>
                            <div class="border-b border-slate-400 py-1 content-center">
                                <input v-if="isEditingStore" type="text" v-model="currentObject.description"
                                    class="border border-gray-400 px-2 py-1 rounded">
                                <span v-else class="text-gray-500">{{ currentObject.description }}</span>
                            </div>

                            <div class="border-b border-slate-400 py-1 content-center"><span class="font-medium"
                                    style="display: inline-block">Email:</span></div>
                            <div class="border-b border-slate-400 py-1 content-center">
                                <input v-if="isEditingStore" type="email" v-model="currentObject.email"
                                    class="border border-gray-400 px-2 py-1 rounded">
                                <span v-else class="text-gray-500">{{ currentObject.email }}</span>
                            </div>

                            <div class="border-b border-slate-400 py-1 content-center"><span class="font-medium"
                                    style="display: inline-block">Teléfono:</span></div>
                            <div class="border-b border-slate-400 py-1 content-center">
                                <input v-if="isEditingStore" type="text" v-model="currentObject.phone"
                                    class="border border-gray-400 px-2 py-1 rounded">
                                <span v-else class="text-gray-500">{{ currentObject.phone }}</span>
                            </div>

                        </div>
                    </div>
                </div>
                <br>
                <!--Btn para cerrar-->
                <form method="dialog" @click="isEditingStore = !isEditingStore" class="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            <!--Create Modal-->
            <dialog id="create_store_modal" class="modal">
                <!--Details Modal-->
                <div class="modal-box min-w-[400px] sm:min-w-[700px] w-auto max-w-2xl">
                    <form method="dialog">
                        <button id="btn-close-store-modal"
                            class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <div class="flex items-center text-center justify-center mb-2">
                        <transition name="fade" mode="out-in">
                            <h3 class="font-bold text-2xl text-amber-500">CREAR NUEVA TIENDA</h3>
                        </transition>
                    </div>
                    <div class="ml-5 flex">
                        <div>
                            <i class="fa-solid fa-store"></i>
                        </div>
                        <div class="ml-3">
                            Complete los siguientes datos para crear la tienda
                        </div>
                    </div>
                    <div>
                        <div class="my-3 mx-5" style="display: grid; grid-template-columns: 180px 1fr;">
                            <div class="py-1 content-center my-1"><span class="font-medium"
                                    style="display: inline-block">Nombre:</span></div>
                            <div class="py-1 content-center my-1">
                                <input type="text" v-model="store_name" placeholder="Ex: Shein"
                                    class="border border-gray-400 px-2 py-1 rounded w-full">
                            </div>

                            <div class="py-1 content-center my-1"><span class="font-medium"
                                    style="display: inline-block">Descripción:</span></div>
                            <div class="py-1 content-center my-1">
                                <input type="text" v-model="store_description"
                                    placeholder="Ex: Tienda de ropa a nivel mundial"
                                    class="border border-gray-400 px-2 py-1 rounded w-full">
                            </div>

                            <div class="py-1 content-center my-1"><span class="font-medium"
                                    style="display: inline-block">Email:</span></div>
                            <div class="py-1 content-center my-1">
                                <input type="email" v-model="store_email" placeholder="Ex: example@example.com"
                                    class="border border-gray-400 px-2 py-1 rounded w-full">
                                <span v-if="store_email && !validateEmail(store_email)" class="text-red-500">Por favor,
                                    ingresa un correo
                                    electrónico válido.</span>
                            </div>

                            <div class="py-1 content-center my-1"><span class="font-medium"
                                    style="display: inline-block">Teléfono:</span></div>
                            <div class="py-1 content-center my-1">
                                <input type="tel" v-model="store_phone" placeholder="Ex: 0959936153"
                                    class="border border-gray-400 px-2 py-1 rounded w-full">
                            </div>

                        </div>
                        <form method="dialog" class="modal-backdrop text-center">
                            <div>
                                <button @click="createStore()"
                                    :disabled="store_name == null || store_name == '' || store_phone == null || store_phone == '' || store_description == null || store_description == '' || !validateEmail(store_email)"
                                    class="btn cursor-pointer bg-amber-400 rounded-lg px-3 content-center hover:bg-amber-500 hover:scale-105">
                                    <i class="fa-solid fa-user"></i>
                                    Crear Tienda
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <br>
                <!--Btn para cerrar-->
                <form method="dialog" @click="isEditingStore = !isEditingStore" class="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    </div>
    <br>
    <hr>
    <br>

    <div>
        <div class="flex items-center">
            <h1 class="text-xl font-semibold mr-4">Administración de carriers</h1>
            <i class="fa-solid fa-truck-fast fa-xl"></i>
        </div>

        <div>
            <div>
                <div title="Crear carrier" onclick="create_carrier_modal.showModal()" class="w-fit">
                    <button
                        class="flex items-center justify-center rounded-xl bg-amber-400 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl p-2 px-3 mt-3">
                        <i class="fa-solid fa-truck-fast fa-sm mr-3"></i>
                        <div class="font-medium">
                            Crear carrier
                        </div>
                    </button>
                </div>

            </div>
            <br>

            <div class="relative overflow-x-auto shadow-md sm:rounded-lg border border-gray-200">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Nombre
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Descripción
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Email
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Teléfono
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Activo
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Acciones
                            </th>
                        </tr>
                    </thead>

                    <transition name="fadeTable">
                        <tbody v-if="carriersData">
                            <tr v-for="(carrier, userIndex) in carriersData.slice((currentPageCarrier - 1) * rowsPerPageCarrier, currentPageCarrier * rowsPerPageCarrier)"
                                :key="carrier" class="border-b">
                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 max-w-[100px]">
                                    {{ carrier.name }}
                                </th>
                                <td class="px-6 py-4">
                                    {{ carrier.description }}
                                </td>
                                <td class="px-6 py-4">
                                    {{ carrier.email }}
                                </td>
                                <td class="px-6 py-4">
                                    {{ carrier.phone }}
                                </td>
                                <td class="px-6 py-4">
                                    <div v-if="carrier.active == true">
                                        <i class="fa-solid fa-check text-green-400"></i>
                                    </div>
                                    <div v-else>
                                        <i class="fa-solid fa-xmark fa-lg text-red-600"></i>
                                    </div>
                                </td>
                                <td class="py-4 text-center items-center justify-center content-center">
                                    <i @click="currentObject = carrier;" onclick="details_carrier_modal.showModal()"
                                        title="Detalle del carrier"
                                        class="fa-solid fa-square-caret-down fa-lg cursor-pointer hover:text-amber-600 transition-all duration-300 mr-3"></i>
                                    <i @click="currentObject = carrier; isEditingCarrier = true;"
                                        onclick="details_carrier_modal.showModal()" title="Editar carriers"
                                        class="fa-solid fa-pencil fa-lg cursor-pointer hover:text-amber-600 transition-all duration-300 mr-3"></i>
                                    <i v-if="carrier.active == true"
                                        @click="currentUser = user; openDeleteSwal(carrier, 'carrier')"
                                        title="Deshabilitar carrier"
                                        class="fa-solid fa-ban fa-lg text-red-600 cursor-pointer hover:text-red-700 transition-all duration-300 mr-3"></i>
                                    <i v-else @click="currentUser = user; openDeleteSwal(carrier, 'carrier')"
                                        title="Habilitar carrier"
                                        class="fa-solid fa-check fa-lg text-green-400 cursor-pointer hover:text-green-700 transition-all duration-300 mr-3"></i>

                                </td>
                            </tr>
                        </tbody>
                    </transition>
                </table>
                <transition name="fadeTable">
                    <div v-if="carriersData" class="text-right mr-2 my-2">
                        <button title="Página anterior"
                            class="p-1 px-2 rounded-xl bg-gray-800 text-white disabled:bg-gray-300"
                            @click="currentPageCarrier--" :disabled="currentPageCarrier === 1">
                            <i class="fa-solid fa-chevron-left"></i>
                        </button>
                        <span title="Página actual"
                            class="p-1 px-2 rounded-xl border border-gray-800 mx-2 cursor-default">{{
                                currentPageCarrier }}</span>
                        <button title="Siguiente página"
                            class="p-1 px-2 rounded-xl bg-gray-800 text-white disabled:bg-gray-300"
                            @click="currentPageCarrier++"
                            :disabled="currentPageCarrier === Math.ceil(carriersData.length / rowsPerPageCarrier)">
                            <i class="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                </transition>
            </div>

            <!--Modals-->
            <!--Details Modal-->
            <dialog id="details_carrier_modal" class="modal">
                <!--Details Modal-->
                <div v-if="currentObject" class="modal-box min-w-[400px] sm:min-w-[700px] w-auto max-w-2xl">
                    <form method="dialog" @click="isEditingCarrier = !isEditingCarrier">
                        <button id="btn-close-carrier-modal-detail"
                            class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <div class="flex items-center text-center justify-center">
                        <transition name="fade" mode="out-in">
                            <h3 v-if="isEditingCarrier" class="font-bold text-2xl">EDICIÓN DEL CARRIER</h3>
                            <h3 v-else class="font-bold text-2xl">DETALLE DEL CARRIER</h3>
                        </transition>
                    </div>
                    <br>
                    <div v-if="currentObject">
                        <div class="relative flex items-center justify-center">
                            <div class="flex">
                                <div class="content-center mr-5">
                                    <div class="rounded-full border-2 border-amber-600 p-5">
                                        <i class="fa-solid fa-truck-fast fa-2xl text-amber-600"></i>
                                    </div>
                                </div>

                                <div class="text-lg font-medium w-fit"
                                    style="display: grid; grid-template-columns: 150px 1fr;">
                                    <div>
                                        Nombre:
                                    </div>
                                    <div class="font-normal">
                                        {{ currentObject.name }}
                                    </div>
                                    <div class="w-fit">
                                        Teléfono:
                                    </div>
                                    <div class="font-normal">
                                        {{ currentObject.email }}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div v-if="!isEditingCarrier" title="Editar información"
                                    @click="isEditingCarrier = !isEditingCarrier"
                                    class="absolute bottom-0 right-0 w-fit content-center mr-5 hover:scale-105 transition-all duration-200 cursor-pointer">
                                    <div class="rounded-full bg-sky-600 h-10 w-10 content-center text-center">
                                        <i class="fa-solid fa-pencil fa-lg text-white"></i>
                                    </div>
                                </div>
                                <div v-else>
                                    <div title="Guardar cambios"
                                        @click="isEditingCarrier = !isEditingCarrier; updateCarrier(currentObject)"
                                        class="absolute bottom-0 right-12 w-fit content-center mr-5 hover:scale-105 transition-all duration-200 cursor-pointer">
                                        <div class="rounded-full bg-sky-600 h-10 w-10 content-center text-center">
                                            <i class="fa-regular fa-floppy-disk fa-lg text-white"></i>
                                        </div>
                                    </div>
                                    <div title="Cancelar cambios" @click="isEditingCarrier = false;"
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
                                    style="display: inline-block">Nombre:</span></div>
                            <div class="border-b border-slate-400 py-1 content-center">
                                <input v-if="isEditingCarrier" type="text" v-model="currentObject.name"
                                    class="border border-gray-400 px-2 py-1 rounded">
                                <span v-else class="text-gray-500">{{ currentObject.name }}</span>
                            </div>

                            <div class="border-b border-slate-400 py-1 content-center"><span class="font-medium"
                                    style="display: inline-block">Descripción:</span></div>
                            <div class="border-b border-slate-400 py-1 content-center">
                                <input v-if="isEditingCarrier" type="text" v-model="currentObject.description"
                                    class="border border-gray-400 px-2 py-1 rounded">
                                <span v-else class="text-gray-500">{{ currentObject.description }}</span>
                            </div>

                            <div class="border-b border-slate-400 py-1 content-center"><span class="font-medium"
                                    style="display: inline-block">Email:</span></div>
                            <div class="border-b border-slate-400 py-1 content-center">
                                <input v-if="isEditingCarrier" type="email" v-model="currentObject.email"
                                    class="border border-gray-400 px-2 py-1 rounded">
                                <span v-else class="text-gray-500">{{ currentObject.email }}</span>
                            </div>

                            <div class="border-b border-slate-400 py-1 content-center"><span class="font-medium"
                                    style="display: inline-block">Teléfono:</span></div>
                            <div class="border-b border-slate-400 py-1 content-center">
                                <input v-if="isEditingCarrier" type="text" v-model="currentObject.phone"
                                    class="border border-gray-400 px-2 py-1 rounded">
                                <span v-else class="text-gray-500">{{ currentObject.phone }}</span>
                            </div>

                        </div>
                    </div>
                </div>
                <br>
                <!--Btn para cerrar-->
                <form method="dialog" @click="isEditingCarrier = !isEditingCarrier" class="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            <!--Create Modal-->
            <dialog id="create_carrier_modal" class="modal">
                <!--Details Modal-->
                <div class="modal-box min-w-[400px] sm:min-w-[700px] w-auto max-w-2xl">
                    <form method="dialog">
                        <button id="btn-close-carrier-modal"
                            class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <div class="flex items-center text-center justify-center mb-2">
                        <transition name="fade" mode="out-in">
                            <h3 class="font-bold text-2xl text-amber-500">CREAR NUEVO CARRIER</h3>
                        </transition>
                    </div>
                    <div class="ml-5 flex">
                        <div>
                            <i class="fa-solid fa-truck-fast"></i>
                        </div>
                        <div class="ml-3">
                            Complete los siguientes datos para crear el carrier
                        </div>
                    </div>
                    <div>
                        <div class="my-3 mx-5" style="display: grid; grid-template-columns: 180px 1fr;">
                            <div class="py-1 content-center my-1"><span class="font-medium"
                                    style="display: inline-block">Nombre:</span></div>
                            <div class="py-1 content-center my-1">
                                <input type="text" v-model="carrier_name" placeholder="Ex: UPS"
                                    class="border border-gray-400 px-2 py-1 rounded w-full">
                            </div>

                            <div class="py-1 content-center my-1"><span class="font-medium"
                                    style="display: inline-block">Descripción:</span></div>
                            <div class="py-1 content-center my-1">
                                <input type="text" v-model="carrier_description"
                                    placeholder="Ex: Compañía de entrega de paquetes"
                                    class="border border-gray-400 px-2 py-1 rounded w-full">
                            </div>

                            <div class="py-1 content-center my-1"><span class="font-medium"
                                    style="display: inline-block">Email:</span></div>
                            <div class="py-1 content-center my-1">
                                <input type="email" v-model="carrier_email" placeholder="Ex: example@example.com"
                                    class="border border-gray-400 px-2 py-1 rounded w-full">
                                <span v-if="carrier_email && !validateEmail(carrier_email)" class="text-red-500">Por
                                    favor, ingresa un correo
                                    electrónico válido.</span>
                            </div>

                            <div class="py-1 content-center my-1"><span class="font-medium"
                                    style="display: inline-block">Teléfono:</span></div>
                            <div class="py-1 content-center my-1">
                                <input type="tel" v-model="carrier_phone" placeholder="Ex: 0959936153"
                                    class="border border-gray-400 px-2 py-1 rounded w-full">
                            </div>

                        </div>
                        <form method="dialog" class="modal-backdrop text-center">
                            <div>
                                <button @click="createCarrier()"
                                    :disabled="carrier_name == null || carrier_name == '' || carrier_phone == null || carrier_phone == '' || carrier_description == null || carrier_description == '' || !validateEmail(carrier_email)"
                                    class="btn cursor-pointer bg-amber-400 rounded-lg px-3 content-center hover:bg-amber-500 hover:scale-105">
                                    <i class="fa-solid fa-truck-fast"></i>
                                    Crear Carrier
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <br>
                <!--Btn para cerrar-->
                <form method="dialog" @click="isEditingCarrier = !isEditingCarrier" class="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    </div>
    <br>
</template>