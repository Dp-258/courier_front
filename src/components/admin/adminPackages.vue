<script setup>
import { onBeforeMount, ref } from 'vue'
import { useEmployeeStore } from "@/stores/employee.js";
import DashboardTableBaseLayout from './dashboardTableBaseLayout.vue';

const employeeStore = useEmployeeStore();
const props = defineProps(['sidebarActive']);
const searchParams = ref('prealerts');
const prealerts_waiting = ref();
const packages_waiting = ref();

onBeforeMount(async () => {
    await countPrealertsWaiting();
    await countPackagesWaiting();
})

const countPrealertsWaiting = async () => {
    let prealerts = await employeeStore.getPrealertsByStatus('waiting');
    prealerts_waiting.value = prealerts.length;
}
const countPackagesWaiting = async () => {
    let packages = await employeeStore.getPackageByStatusExclude('received');
    packages_waiting.value = packages.length;
}

const setSearchParams = (params) => {
    searchParams.value = params;
}
</script>
<template>
    <div>
        <div class="text-2xl font-bold mb-6">
            Clasificación de paquetes
        </div>
        <div class="grid grid-cols-2 gap-4 mb-6">
            <div @click="setSearchParams('prealerts')" class="py-5 h-fit bg-white border border-gray-200 rounded-lg shadow transition ease-in-out duration-200 
            hover:scale-105 hover:-translate-y-2 hover:shadow-amber-500 cursor-pointer"
                :class="{ 'shadow-amber-500': searchParams == 'prealerts' }">
                <div class="flex place-content-evenly items-center">
                    <div class="h-12 rounded-full bg-white border border-amber-600 flex justify-center items-center"
                        :class="{ 'w-14 ': props.sidebarActive, 'w-12 mr-2': !props.sidebarActive }">
                        <i class="fa-solid fa-cube fa-lg text-amber-600"></i>
                    </div>
                    <h5 class="mb-2 text-xl leading-10 font-semibold tracking-tight text-gray-900 text-center">
                        Prealertas pendientes
                    </h5>
                    <p class="text-2xl font-bold text-black text-center mb-2">
                        {{ prealerts_waiting }}
                    </p>
                </div>
            </div>
            <div @click="setSearchParams('packages')" class="py-5 h-fit bg-white border border-gray-200 rounded-lg shadow transition ease-in-out duration-200 
            hover:scale-105 hover:-translate-y-2 hover:shadow-amber-500 cursor-pointer"
                :class="{ 'shadow-amber-500': searchParams == 'packages' }">
                <div class="flex place-content-evenly items-center">
                    <div class="h-12 rounded-full bg-white border border-amber-600 flex justify-center items-center"
                        :class="{ 'w-14 ': props.sidebarActive, 'w-12 mr-2': !props.sidebarActive }">
                        <i class="fa-solid fa-boxes-packing fa-lg text-amber-600"></i>
                    </div>
                    <h5 class="mb-2 text-xl leading-10 font-semibold tracking-tight text-gray-900 text-center">
                        Paquetes por clasificar
                    </h5>
                    <p class="text-2xl font-bold text-black text-center mb-2">
                        {{ packages_waiting }}
                    </p>
                </div>
            </div>
        </div>

        <div>
            <div>
                <h1 class="text-xl font-semibold mb-4">
                    {{ searchParams == 'prealerts' ? 'Listado de prealertas' : 'Listado de paquetes' }}
                </h1>
            </div>
            <DashboardTableBaseLayout :params="searchParams" />
        </div>


    </div>
</template>