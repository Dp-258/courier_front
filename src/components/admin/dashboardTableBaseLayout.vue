<script setup>
import { onBeforeMount, ref, watch } from 'vue'
import { useEmployeeStore } from "@/stores/employee.js";
import { useUserStore } from "@/stores/user.js";
import Swal from "sweetalert2";
import { storage } from '../../../firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { ref as fireStorageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const employeeStore = useEmployeeStore();
const userStore = useUserStore();
const props = defineProps(['params']);
const type = ref('prealerts')
const receivedInfo = ref(false);
const denyInfo = ref(false);
const denyPackageCategory = ref();
const denyPackageDesc = ref();
const updatePackage = ref(false);
//Variables para prealerta aceptada
const tipePrealert = ref();
const extra_observations_prealert = ref();
const freightCost = ref();
const weight = ref();

//Variables para cambio de estado de paquete
const tipePackage = ref();
const new_observations = ref();

//Load prealerts & packages
const prealerts = ref([]);
const original_prealerts = ref();
const currentPrealert = ref();

const packages = ref([]);
const original_packages = ref();
const currentPackage = ref();

const currentList = ref();
//Variables for the change page table
const currentPage = ref(1);
const rowsPerPage = ref(5);

//Variables for upload payment voucher
const showFileSizeError = ref(false);
const files = ref();
const paymentVoucher = ref();

// Lista ordenada de estados posibles
const packageStatuses = [
    { value: 'stored', label: 'En bodega' },
    { value: 'sent', label: 'En tránsito' },
    { value: 'aduana', label: 'En aduana' },
    { value: 'onway', label: 'En proceso de entrega' },
    { value: 'received', label: 'Entregado' }
];

//Se vigila cuando se cambia los parametros
watch(() => props.params, () => {
    if (props.params) {
        type.value = props.params;
        changeList(type.value);
    }
});

onBeforeMount(async () => {
    //Carga de prealertas
    prealerts.value = await employeeStore.getPrealertsByStatus('waiting');
    original_prealerts.value = JSON.parse(JSON.stringify(prealerts.value));

    //Carga de paquetes
    packages.value = await employeeStore.getPackageByStatusExclude('received');
    original_packages.value = JSON.parse(JSON.stringify(packages.value));
    console.log(packages.value);

    changeList(props.params);
})

const openInfoDetail = (params) => {
    if (params == 'received') {
        if (receivedInfo.value)
            receivedInfo.value = false;
        else {
            receivedInfo.value = true;
            denyInfo.value = false;
        }
    } else {
        if (denyInfo.value)
            denyInfo.value = false;
        else {
            receivedInfo.value = false;
            denyInfo.value = true;
        }
    }
}

// Método para determinar si una opción debe estar deshabilitada
const isOptionDisabled = (optionValue) => {
    const currentIndex = packageStatuses.findIndex(status => status.value === currentPackage.value.package_status);
    const optionIndex = packageStatuses.findIndex(status => status.value === optionValue);

    return !(optionIndex === currentIndex - 1 || optionIndex === currentIndex + 1);
};

const validDenyPackage = () => {
    if (denyPackageCategory.value) {
        if (denyPackageCategory.value != 'C')
            return false;
        else
            return denyPackageDesc.value == null || denyPackageDesc.value == '';
    } else
        return true;
}

const changeList = async (option) => {
    switch (option) {
        case 'prealerts':
            currentList.value = prealerts.value;
            break;
        case 'packages':
            currentList.value = packages.value;
            break;
        default:
            currentList.value = packages.value;
            break;
    }
}

const translateStatus = (data, mode) => {
    if (mode == 'prealert') {
        switch (data) {
            case 'waiting':
                return 'En espera de entrega'
            case 'received':
                return 'En bodega'
            case 'deny':
                return 'Denegado'
            default:
                break;
        }
    } else {
        switch (data) {
            case 'stored':
                return 'En bodega'
            case 'sent':
                return 'En transito'
            case 'aduana':
                return 'En Aduana'
            case 'onway':
                return 'En proceso de entrega'
            case 'received':
                return 'Entregado'
            default:
                return 'No info';
        }
    }
}
//Manjeo input de img
const handleFileUpload = async (event) => {
    const selectedFiles = event.target.files;
    let totalFileSize = 0;
    showFileSizeError.value = false;

    for (let i = 0; i < selectedFiles.length; i++) {
        const fileSize = selectedFiles[i].size / (1024 * 1024); // Convertir bytes a megabytes
        totalFileSize += fileSize;

        if (totalFileSize > 10) {
            showFileSizeError.value = true;
            totalFileSize -= fileSize;
            return; // Mostrar el mensaje de error si la suma supera el límite
        }
    }

    if (!showFileSizeError.value) {
        files.value = Array.from(selectedFiles);
    }
}
//Subir archivos a storage
const uploadFiles = async () => {
    const uploadedFileURLs = [];
    try {
        const filesArray = [...files.value]
        console.log(currentPrealert.value);
        let userInfo = await userStore.getClientInfoById(currentPrealert.value.cliente_id)
        await Promise.all(filesArray.map(async file => {
            const fileName = uuidv4();
            const storageRef = fireStorageRef(storage, `bills/paymentVouchers/${userInfo.email}/${fileName}`)
            // Reducir la imagen si es una imagen
            const metadata = {
                contentType: file.type
            }
            await uploadBytes(storageRef, file, metadata)
            const downloadURL = await getDownloadURL(storageRef);
            uploadedFileURLs.push(downloadURL);
        }));
        return uploadedFileURLs;
    } catch (error) {
        console.error(error);
        alert('Error subiendo las imágenes');
    }

}

const completePreAlert = async () => {
    try {
        paymentVoucher.value = await uploadFiles();
    } catch (error) {
        console.error('Ocurrió un error al subir los archivos:', error);
    }
    //Hacer petición modificando la prealerta, en el back además que cree el paquete con los datos.
    let response = await employeeStore.modifyPrealert(currentPrealert.value.id, currentPrealert.value.cliente_id, userStore.userData.email, freightCost.value, weight.value, tipePrealert.value, 'received', extra_observations_prealert.value, paymentVoucher.value[0], currentPrealert.value.address, currentPrealert.value.city, currentPrealert.value.postal_num);
    // Verificar si la primera petición fue correcta
    if (response.ok) {
        Swal.fire({
            title: "¡Éxito!",
            text: "Prealerta compleatada correctamente",
            icon: "success",
        }).then(() => {
            window.location.reload();
        });
    } else {
        console.error('Error al desarrollar la peticion:', response.status);
        return response;
    }
}

const denyPreAlert = async () => {
    //Hacer petición RECHAZANDO la prealerta
    let response;
    if (denyPackageDesc != null && denyPackageDesc != '' && denyPackageDesc != ' ')
        response = await employeeStore.modifyPrealert(currentPrealert.value.id, currentPrealert.value.cliente_id, userStore.userData.id, freightCost.value, weight.value, tipePrealert.value, 'deny', denyPackageDesc.value, currentPrealert.value.address, currentPrealert.value.city, currentPrealert.value.postal_num);
    else
        response = await employeeStore.modifyPrealert(currentPrealert.value.id, currentPrealert.value.cliente_id, userStore.userData.id, freightCost.value, weight.value, tipePrealert.value, 'deny', denyPackageCategory.value, currentPrealert.value.address, currentPrealert.value.city, currentPrealert.value.postal_num);
    // Verificar si la primera petición fue correcta
    if (response.ok) {
        Swal.fire({
            title: "¡Éxito!",
            text: "Prealerta rechazada correctamente",
            icon: "success",
        }).then(() => {
            window.location.reload();
        });
    } else {
        console.error('Error al desarrollar la peticion:', response.status);
        return response;
    }
}

const updatePackageState = async () => {
    let response = await employeeStore.modifyPackageStatus(currentPackage.value.id, tipePackage.value, userStore.userData.email, new_observations.value);
    if (response.ok) {
        Swal.fire({
            title: "¡Éxito!",
            text: "Paquete actualizado correctamente",
            icon: "success",
        }).then(() => {
            window.location.reload();
        });
    } else {
        console.error('Error al desarrollar la peticion:', response.status);
        return response;
    }
}
</script>
<template>
    <div>
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg border border-gray-200">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                    <transition name="fadeTable">
                        <tr v-if="type == 'prealerts'">
                            <th scope="col" class="px-6 py-3">
                                Codigo SwiftShip
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Tracking code
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Detalle
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Tienda
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Carrier
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Estado
                            </th>
                            <th scope="col" class="px-6 py-3 text-center">
                                Acciones
                            </th>
                        </tr>
                        <tr v-else>
                            <th scope="col" class="px-6 py-3">
                                Codigo
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Estado
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Categoría
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Costo del flete
                            </th>
                            <th scope="col" class="px-6 py-3 text-center">
                                Detalle
                            </th>
                            <th scope="col" class="px-6 py-3 text-center">
                                Acciones
                            </th>
                        </tr>
                    </transition>
                </thead>
                <transition v-if="currentList" name="fadeTable">
                    <tbody v-if="type == 'prealerts'">
                        <tr v-for="(row, rowIndex) in currentList.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)"
                            :key="rowIndex" class="border-b">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {{ row.code }}
                            </th>
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {{ row.tracking_code }}
                            </th>
                            <td class="px-6 py-4">
                                {{ row.description }}
                            </td>
                            <td class="px-6 py-4">
                                {{ row.store_name }}
                            </td>
                            <td class="px-6 py-4">
                                {{ row.carrier_name }}
                            </td>
                            <td class="px-6 py-4">
                                {{ translateStatus(row.order_status, 'prealert') }}
                            </td>
                            <td class="px-6 py-4 text-center">
                                <i onclick="prealert_details_modal.showModal()" @click="currentPrealert = row"
                                    title="Detalle de la prealerta"
                                    class="fa-solid fa-square-caret-down fa-2xl cursor-pointer hover:text-amber-600 transition-all duration-300 mr-3"></i>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr v-for="(packageRow, rowIndex) in currentList.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)"
                            :key="rowIndex" class="border-b">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {{ packageRow.code }}
                            </th>
                            <td class="px-6 py-4">
                                {{ translateStatus(packageRow.package_status, 'packages') }}
                            </td>
                            <td class="px-6 py-4">
                                {{ packageRow.category }}
                            </td>
                            <td class="px-6 py-4">
                                $ {{ packageRow.freight_cost }}
                            </td>
                            <td class="px-6 py-4">
                                {{ packageRow.description }}
                            </td>
                            <td class="px-6 py-4 text-center">
                                <i onclick="package_details_modal.showModal()" @click="currentPackage = packageRow"
                                    title="Detalle del paquete"
                                    class="fa-solid fa-square-caret-down fa-2xl cursor-pointer hover:text-amber-600 transition-all duration-300 mr-3"></i>

                            </td>
                        </tr>
                    </tbody>
                </transition>
            </table>
            <transition v-if="currentList" name="fadeTable">
                <div class="text-right mr-2 my-2">
                    <button title="Página anterior"
                        class="p-1 px-2 rounded-xl bg-gray-800 text-white disabled:bg-gray-300" @click="currentPage--"
                        :disabled="currentPage === 1">
                        <i class="fa-solid fa-chevron-left"></i>
                    </button>
                    <span title="Página actual"
                        class="p-1 px-2 rounded-xl border border-gray-800 mx-2 cursor-default">{{
                            currentPage }}</span>
                    <button title="Siguiente página"
                        class="p-1 px-2 rounded-xl bg-gray-800 text-white disabled:bg-gray-300" @click="currentPage++"
                        :disabled="currentPage === Math.ceil(currentList.length / rowsPerPage)">
                        <i class="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            </transition>
        </div>

    </div>
    <!--Modals-->
    <!--Prealert Modal-->
    <dialog id="prealert_details_modal" class="modal transition-all duration-500">
        <div class="mx-4 flex">
            <!--Details Modal-->
            <div :class="{ 'lg:block hidden': receivedInfo || denyInfo }">
                <div class="modal-box min-w-[400px] max-w-fit">
                    <form method="dialog">
                        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <div class="flex items-center text-center justify-center">
                        <h3 class="font-bold text-2xl">DETALLE DE LA PREALERTA</h3>
                    </div>
                    <br>
                    <div v-if="currentPrealert">
                        <div class="flex items-center justify-between">
                            <div class="flex border border-gray-200 p-2 w-fit shadow shadow-amber-600">
                                <div class="content-center mr-5">
                                    <i class="fa-solid fa-box fa-xl text-amber-600"></i>
                                </div>
                                <div class="text-lg font-medium w-fit">
                                    <div class="w-fit">
                                        Tracking code: {{ currentPrealert.tracking_code }}
                                    </div>
                                    <div class="w-fit text-sm">
                                        Swift code: {{ currentPrealert.code }}
                                    </div>
                                </div>
                            </div>
                            <div class="flex mx-5">
                                <button @click="openInfoDetail('received')" class="btn btn-warning mr-4 "
                                    :class="{ 'scale-110 shadow shadow-yellow-500 bg-yellow-500': receivedInfo, 'scale-100 shadow-0': !receivedInfo, }">
                                    <i class="fa-solid fa-box-open"></i> Recibido
                                </button>
                                <button @click="openInfoDetail('deny')" class="btn btn-error"
                                    :class="{ 'scale-110 shadow shadow-red-500 bg-red-500': denyInfo, 'scale-100 shadow-0': !denyInfo, }">
                                    <i class="fa-solid fa-ban"></i>Negado
                                </button>
                            </div>
                        </div>
                        <br>
                        <div class="mt-3 mx-5" style="display: grid; grid-template-columns: 180px 1fr;">
                            <div class="border-b border-slate-400 py-1"><span class="font-medium"
                                    style="display: inline-block">Destinatario:</span></div>
                            <div class="border-b border-slate-400 py-1">{{ currentPrealert.cliente_name }}</div>

                            <div class="border-b border-slate-400 py-1"><span class="font-medium"
                                    style="display: inline-block">Contenido:</span></div>
                            <div class="border-b border-slate-400 py-1">{{ currentPrealert.description }}</div>

                            <div class="border-b border-slate-400 py-1"><span class="font-medium"
                                    style="display: inline-block">Tienda:</span></div>
                            <div class="border-b border-slate-400 py-1">{{ currentPrealert.store_name }}</div>

                            <div class="border-b border-slate-400 py-1"><span class="font-medium"
                                    style="display: inline-block">Carrier:</span></div>
                            <div class="border-b border-slate-400 py-1">{{ currentPrealert.carrier_name }}</div>

                            <div class="border-b border-slate-400 py-1"><span class="font-medium"
                                    style="display: inline-block">Valor declarado:</span></div>
                            <div class="border-b border-slate-400 py-1">{{ currentPrealert.purchase_value }}</div>

                            <div class="border-b border-slate-400 py-1"><span class="font-medium"
                                    style="display: inline-block">Factura:</span></div>
                            <div class="border-b border-slate-400 py-1"><a
                                    class="text-blue-600 hover:text-blue-800 hover:underline"
                                    :href="currentPrealert.bill" target="_blank">Ver factura</a></div>

                            <div v-if="currentPrealert.observation" class="border-b border-slate-400 py-1"><span
                                    class="font-medium" style="display: inline-block">Observaciones:</span></div>
                            <div class="border-b border-slate-400 py-1" v-if="currentPrealert.observation">{{
                                currentPrealert.observation }}</div>
                        </div>
                    </div>
                </div>
                <br>
                <!--Btn para cerrar-->
                <form method="dialog" class="modal-backdrop">
                    <button>close</button>
                </form>
            </div>
            <!--Modify prealert Modal-->
            <div v-if="receivedInfo || denyInfo">
                <div class="max-w-2xl transition-all duration-500">
                    <div class="modal-box">
                        <div>
                            <button @click="() => { receivedInfo = false; denyInfo = false }"
                                class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </div>
                        <div class="mx-5">
                            <div class="mt-2">
                                <div v-if="receivedInfo">
                                    <div class="text-center underline">
                                        Llene la siguiente información para marcar el paquete como recibido
                                    </div>
                                    <div class="my-5">
                                        <div class="flex items-center w-full">
                                            <div class="w-2/6">
                                                <span class="font-medium"> Categoría del paquete:</span>
                                            </div>
                                            <div class="w-4/6">
                                                <select v-model="tipePrealert"
                                                    class="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2">
                                                    <option selected disabled>Seleccionar</option>
                                                    <option value="A">A</option>
                                                    <option value="B">B</option>
                                                    <option value="C">C</option>
                                                    <option value="D">D</option>
                                                    <option value="E">E</option>
                                                    <option value="F">F</option>
                                                    <option value="G">G</option>
                                                </select>
                                            </div>
                                        </div>
                                        <br>
                                        <div class="flex">
                                            <div class="flex items-center w-3/6">
                                                <div class="w-3/6">
                                                    <span class="font-medium">Peso en libras:</span>
                                                </div>
                                                <div class="w-3/6">
                                                    <input type="number" v-model="weight" placeholder="1.5"
                                                        class="text-sm text-center px-2 input input-bordered border border-gray-200 rounded-xl w-full">
                                                </div>

                                            </div>
                                            <br>
                                            <div class="flex items-center w-3/6 ml-4">
                                                <div class="w-3/6">
                                                    <span class="font-medium">Costo del flete:</span>
                                                </div>
                                                <div class="w-3/6">
                                                    <input type="number" v-model="freightCost" placeholder="7.25"
                                                        class="text-center text-sm px-2 input input-bordered border border-gray-200 rounded-xl w-full">
                                                </div>

                                            </div>
                                        </div>
                                        <br>
                                        <div class="flex">
                                            <div class="w-2/6">
                                                <span class="font-medium">Comprobante de pago: </span>
                                            </div>
                                            <div class="ml-6 items-center flex">
                                                <input type="file" accept="image/*" v-on:change="handleFileUpload"
                                                    class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                                                    required>
                                            </div>
                                        </div>
                                        <br>
                                        <div class="flex items-center w-full">
                                            <div class="w-2/6">
                                                <span class="font-medium"> Observaciones:</span>
                                            </div>
                                            <div class="w-4/6">
                                                <input v-model="extra_observations_prealert"
                                                    placeholder="Ex: Caja dañada"
                                                    class="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2">

                                            </div>
                                        </div>
                                    </div>
                                    <div class="text-center">
                                        <form method="dialog">
                                            <button @click="completePreAlert()" class="btn btn-warning">
                                                <i class="fa-solid fa-box-open"></i> Completar
                                            </button>
                                        </form>
                                    </div>
                                </div>
                                <div v-if="denyInfo">
                                    <div class="text-center underline">
                                        Seleccione la razón por la que el paquete fue rechazado.
                                    </div>
                                    <br>
                                    <div class="flex items-center w-full">
                                        <div class="w-full">
                                            <select id="DenyPackage" v-model="denyPackageCategory"
                                                class="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2">
                                                <option selected disabled>Seleccionar</option>
                                                <option value="A">Factura no correspondiente</option>
                                                <option value="B">Producto no apto para importación</option>
                                                <option value="C">Otra</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div v-if="denyPackageCategory == 'C'" class="my-5">
                                        <div class="font-medium">
                                            Detalle por que el producto fue rechazado.
                                        </div>
                                        <br>
                                        <textarea v-model="denyPackageDesc"
                                            class="text-sm p-2 input input-bordered border border-gray-200 rounded-xl w-full h-fit">
                                        </textarea>
                                        <br>
                                    </div>
                                    <br>
                                    <div class="text-center">
                                        <form method="dialog">
                                            <button @click="denyPreAlert()" class="btn btn-warning"
                                                :disabled="validDenyPackage()">
                                                <i class="fa-solid fa-box-open"></i> Completar
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </dialog>
    <!--Package Modal-->
    <dialog id="package_details_modal" class="modal transition-all duration-500">
        <div class="mx-4 flex">
            <!--Details Modal-->
            <div :class="{ 'lg:block hidden': updatePackage }">
                <div class="modal-box min-w-[400px] max-w-fit">
                    <form method="dialog">
                        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <div class="flex items-center text-center justify-center">
                        <h3 class="font-bold text-2xl">DETALLE DEL PAQUETE</h3>
                    </div>
                    <br>
                    <div v-if="currentPackage">
                        <div class="flex items-center justify-between">
                            <div class="flex border border-gray-200 p-2 w-fit shadow shadow-amber-600">
                                <div class="text-lg font-medium w-fit mx-5">
                                    <div>
                                        Codigo de SwiftShip: <span class="font-normal">{{ currentPackage.code }}</span>
                                    </div>
                                    <div class="w-fit">
                                        Tracking Code: <span class="font-normal">{{ currentPackage.tracking_code
                                            }}</span>
                                    </div>
                                    <div class="flex items-center">
                                        Estado: <span class="font-normal ml-1">{{
                                            translateStatus(currentPackage.package_status, 'packages') }}</span>
                                        <i class="fa-solid fa-xs text-amber-500 ml-2 mt-1" :class="{
                                            'fa-warehouse': currentPackage.package_status == 'stored',
                                            'fa-plane-departure': currentPackage.package_status == 'sent',
                                            'fa-passport': currentPackage.package_status == 'aduana',
                                            'fa-people-carry-box': currentPackage.package_status == 'onway',
                                            'fa-box-open': currentPackage.package_status == 'received',
                                            'fa-question-circle': !['stored', 'sent', 'aduana', 'onway', 'received'].includes(currentPackage.package_status)
                                        }">
                                        </i>
                                    </div>
                                </div>
                            </div>
                            <div class="flex mx-5">
                                <button @click="updatePackage = !updatePackage" class="btn btn-warning mr-4 "
                                    :class="{ 'scale-110 shadow shadow-yellow-500 bg-yellow-500': updatePackage, 'scale-100 shadow-0': !receivedInfo, }">
                                    <i class="fa-solid fa-box-open"></i> Actualizar estado
                                </button>
                            </div>
                        </div>
                        <br>
                        <div class="mt-3 mx-5" style="display: grid; grid-template-columns: 180px 1fr;">
                            <div class="border-b border-slate-400 py-1"><span class="font-medium"
                                    style="display: inline-block">Destinatario:</span></div>
                            <div class="border-b border-slate-400 py-1">{{ currentPackage.cliente_name }}</div>

                            <div class="border-b border-slate-400 py-1"><span class="font-medium"
                                    style="display: inline-block">Contenido:</span></div>
                            <div class="border-b border-slate-400 py-1">{{ currentPackage.description }}</div>

                            <div class="border-b border-slate-400 py-1"><span class="font-medium"
                                    style="display: inline-block">Dirección de entrega:</span></div>
                            <div class="border-b border-slate-400 py-1">{{ currentPackage.address }}</div>

                            <div class="border-b border-slate-400 py-1"><span class="font-medium"
                                    style="display: inline-block">Categoría:</span></div>
                            <div class="border-b border-slate-400 py-1">{{ currentPackage.category }}</div>

                            <div class="border-b border-slate-400 py-1"><span class="font-medium"
                                    style="display: inline-block">Peso:</span></div>
                            <div class="border-b border-slate-400 py-1">{{ currentPackage.weight }}</div>

                            <div class="border-b border-slate-400 py-1"><span class="font-medium"
                                    style="display: inline-block">Costo del flete:</span></div>
                            <div class="border-b border-slate-400 py-1">{{ currentPackage.freight_cost }}</div>

                            <div v-if="currentPackage.payment_voucher" class="border-b border-slate-400 py-1"><span
                                    class="font-medium" style="display: inline-block">Factura:</span></div>
                            <div v-if="currentPackage.payment_voucher" class="border-b border-slate-400 py-1"><a
                                    class="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                                    target="_blank" :href="currentPackage.payment_voucher">
                                    Ver documento
                                </a>
                            </div>

                            <div v-if="currentPackage.proof_payment_voucher"
                                class="border-b border-slate-400 py-1 content-center">
                                <span class="font-medium" style="display: inline-block">Comprobante de pago:</span>
                            </div>
                            <div v-if="currentPackage.proof_payment_voucher" class="border-b border-slate-400 py-1"><a
                                    class="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                                    :href="currentPackage.proof_payment_voucher" target="_blank">
                                    Ver documento
                                </a>
                            </div>

                            <div v-if="currentPackage.observation" class="border-b border-slate-400 py-1"><span
                                    class="font-medium" style="display: inline-block">Observaciones:</span></div>
                            <div v-if="currentPackage.observation" class="border-b border-slate-400 py-1">
                                {{ currentPackage.observation }}
                            </div>
                        </div>
                    </div>
                </div>
                <br>
                <!--Btn para cerrar-->
                <form method="dialog" class="modal-backdrop">
                    <button>close</button>
                </form>
            </div>
            <!--Modify package Modal-->
            <div v-if="updatePackage">
                <div class="max-w-2xl min-w-[500px] transition-all duration-500">
                    <div class="modal-box">
                        <div>
                            <button @click="() => { updatePackage = false }"
                                class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </div>
                        <div class="mx-5">
                            <div class="mt-2">
                                <div>
                                    <div class="text-center underline">
                                        ¿Cuál es el estado actual del paquete?
                                    </div>
                                    <div class="my-5">
                                        <div class="items-center w-full">
                                            <div>
                                                <span class="font-medium"> Actualización de estado:</span>
                                            </div>
                                            <div class="mt-2 w-full">
                                                <select v-model="tipePackage"
                                                    class="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2">
                                                    <option selected disabled>Seleccionar</option>
                                                    <option v-for="status in packageStatuses" :key="status.value"
                                                        :value="status.value"
                                                        :disabled="isOptionDisabled(status.value)">
                                                        {{ status.label }}
                                                    </option>
                                                </select>
                                            </div>
                                            <div v-if="tipePackage == currentPackage.package_status">
                                                <p class="text-red-400 underline">
                                                    {{ translateStatus(currentPackage.package_status, 'packages') }} es
                                                    la
                                                    opción que se encuentra actualmente seleccionada </p>
                                            </div>
                                        </div>
                                        <br>
                                        <div class="items-center w-full" v-if="tipePackage">
                                            <div>
                                                <span class="font-medium">Observaciones o avisos (opcional) :</span>
                                            </div>
                                            <div>
                                                <input type="text" v-model="new_observations"
                                                    placeholder="Ex: posible retraso en el envio del paquete"
                                                    class="text-sm  px-2 input input-bordered border border-gray-200 rounded-xl w-full">
                                            </div>

                                        </div>

                                    </div>
                                    <div class="text-center" v-if="tipePackage">
                                        <form method="dialog">
                                            <button @click="updatePackageState()" class="btn btn-warning">
                                                <i class="fa-solid fa-box-open"></i> Completar
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </dialog>
</template>