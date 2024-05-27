<script setup>
import { ref, onBeforeMount } from 'vue'
import userDashboardTableBaseLayout from './userDashboardTableBaseLayout.vue'
import { useUserStore } from "@/stores/user.js";

const userStore = useUserStore();
const props = defineProps(['sidebarActive']);
const searchParams = ref('stored');
//Count of every state
const stored = ref(0);
const sent = ref(0);
const aduana = ref(0);
const onway = ref(0);

onBeforeMount(async () => {
    await countPackages();
})

const setSearchParams = (params) => [
    searchParams.value = params
]
const countPackages = async () => {
    await userStore.getUserInfo();

    const response = await fetch(`http://127.0.0.1:3000/paquetes/client/${userStore.userData.email}`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    if (!response.ok) {
        console.log('No se encontraron paquetes');
    } else{
        let paquetes = await response.json();
        paquetes.forEach((paquete) => {
            switch (paquete.package_status) {
                case 'stored':
                    stored.value++;
                    break;
                case 'sent':
                    sent.value++;
                    break;
                case 'aduana':
                    aduana.value++;
                    break;
                case 'onway':
                    onway.value++;
                    break;
                default:
                    break;
            }
        });
    }
}
</script>
<template>
    <div>
        <div class="text-2xl flex items-center">
            <div>
                <i class="fa-solid fa-box mr-2"></i>
                <span class="font-bold">Tus paquetes</span>
            </div>
            <div onclick="virtual_locker.showModal()" class="flex items-center ml-auto bg-amber-400 p-2 rounded-xl cursor-pointer
            transition-all duration-200 hover:scale-105 hover:shadow-xl">
                <div class="text-base font-medium">
                    <i class="fa-solid fa-box fa-sm ml-2"></i>
                    Tu casillero virtual: HFC03685
                </div>
            </div>
        </div>
        <br>
        <div class="grid gap-4 mb-5"
            :class="{ 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4': props.sidebarActive, 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4 ': !props.sidebarActive }">
            <div @click="setSearchParams('stored')" class="pt-3 pb-3 px-4 bg-white border border-gray-200 rounded-lg shadow transition ease-in-out duration-200 cursor-pointer
            hover:scale-105 hover:-translate-y-2 hover:shadow-amber-500"
                :class="{ 'shadow-amber-500': searchParams == 'stored' }">
                <div class="flex place-content-evenly mb-2 items-center">
                    <div class="h-12 rounded-full bg-white border border-amber-600 flex justify-center items-center"
                        :class="{ 'w-14 ': props.sidebarActive, 'w-12 mr-2': !props.sidebarActive }">
                        <i class="fa-solid fa-warehouse fa-lg text-amber-600"></i>
                    </div>
                    <h5 class="mb-2 text-xl leading-10 font-semibold tracking-tight text-gray-900 text-center">
                        Paquetes en bodega
                    </h5>
                </div>
                <p class="text-2xl font-bold text-black text-center mb-2">
                    {{ stored }}
                </p>
            </div>
            <div @click="setSearchParams('sent')" class="pt-3 pb-3 px-4 bg-white border border-gray-200 rounded-lg shadow transition ease-in-out duration-200 cursor-pointer
            hover:scale-105 hover:-translate-y-2 hover:shadow-amber-500"
                :class="{ 'shadow-amber-500': searchParams == 'sent' }">
                <div class="flex place-content-evenly mb-2 items-center">
                    <div class="h-12 rounded-full bg-white border border-amber-600 flex justify-center items-center"
                        :class="{ 'w-14 ': props.sidebarActive, 'w-12 mr-2': !props.sidebarActive }">
                        <i class="fa-solid fa-plane-departure fa-lg text-amber-600"></i>
                    </div>
                    <h5 class="mb-2 text-xl leading-10 font-semibold tracking-tight text-gray-900 text-center">
                        Enviados a Ecuador
                    </h5>
                </div>
                <p class="text-2xl font-bold text-black text-center mb-2">
                    {{ sent }}
                </p>
            </div>
            <div @click="setSearchParams('aduana')" class="pt-3 pb-3 px-4 bg-white border border-gray-200 rounded-lg shadow transition ease-in-out duration-200 cursor-pointer 
            hover:scale-105 hover:-translate-y-2 hover:shadow-amber-500"
                :class="{ 'shadow-amber-500': searchParams == 'aduana' }">
                <div class="flex place-content-evenly mb-2 items-center">
                    <div class="h-12 rounded-full bg-white border border-amber-600 flex justify-center items-center"
                        :class="{ 'w-14 ': props.sidebarActive, 'w-12 mr-2': !props.sidebarActive }">
                        <i class="fa-solid fa-passport fa-lg text-amber-600"></i>
                    </div>
                    <h5 class="mb-2 text-xl leading-10 font-semibold tracking-tight text-gray-900 text-center">
                        Paquetes en aduana
                    </h5>
                </div>
                <p class="text-2xl font-bold text-black text-center mb-2">
                    {{ aduana }}
                </p>
            </div>
            <div @click="setSearchParams('onway')" class="pt-3 pb-3 px-4 bg-white border border-gray-200 rounded-lg shadow transition ease-in-out duration-200 cursor-pointer 
            hover:scale-105 hover:-translate-y-2 hover:shadow-amber-500"
                :class="{ 'shadow-amber-500': searchParams == 'onway' }">
                <div class="flex place-content-evenly mb-2 items-center">
                    <div class="h-12 rounded-full bg-white border border-amber-600 flex justify-center items-center"
                        :class="{ 'w-14 ': props.sidebarActive, 'w-12 mr-2': !props.sidebarActive }">
                        <i class="fa-solid fa-people-carry-box fa-lg text-amber-600"></i>
                    </div>
                    <h5 class="mb-2 text-xl leading-10 font-semibold tracking-tight text-gray-900 text-center">
                        Paquetes en entrega
                    </h5>
                </div>
                <p class="text-2xl font-bold text-black text-center mb-2">
                    {{ onway }}
                </p>
            </div>
        </div>

        <div>
            <h1 class="text-xl font-semibold mb-4">
                {{ searchParams == 'stored' ? 'En bodega' :
                    searchParams == 'sent' ? 'En transito' :
                        searchParams == 'aduana' ? 'En aduana' :
                            searchParams == 'onway' ? 'Enviado a domicilio' :
                                'No registrado' }}
            </h1>
        </div>
        <div>
            <userDashboardTableBaseLayout :params="searchParams" />
        </div>


    </div>
    <!--Modals-->
    <!--Virtual locker modal-->
    <dialog id="virtual_locker" class="modal">
        <div class="modal-box w-10/12 max-w-2xl">
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <div class="flex items-center text-center justify-center">
                <i class="fa-solid fa-box fa-xl text-amber-600 mr-5"></i>
                <h3 class="font-bold text-2xl">Este es tu casillero vitual</h3>
                <i class="fa-solid fa-box fa-xl text-amber-600 ml-5"></i>
            </div>
            <p class="py-4">
                Recuerda que al comprar en línea te pedirán una dirección en Estados Unidos para enviar tu paquete,
                deberás llenar la información de envió con los siguientes datos:
            </p>
            <div class="text-center w-full flex justify-center">
                <div class="text-center py-4 border border-gray-300 px-4 w-fit">
                    <span>Eduardo Gonzales <span class="font-bold">HFC03685</span></span>
                    <br>
                    <span>101, County Road 447, Misuri, Douglas County</span>
                    <br>
                    <span>357-212-5814</span>
                    <br>
                </div>
            </div>
        </div>
        <!--Btn para cerrar-->
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
</template>