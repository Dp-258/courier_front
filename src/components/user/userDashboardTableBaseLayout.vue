<script setup>
import { ref, watch, onBeforeMount, onMounted } from 'vue'
import { useUserStore } from "@/stores/user.js";
import Swal from "sweetalert2";
import { storage } from '../../../firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { ref as fireStorageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const userStore = useUserStore();
const props = defineProps(['params']);
const type = ref('stored');
const packages = ref([]);
const original_packages = ref();
const currentPackage = ref();

//Variables for the change page table
const currentPage = ref(1);
const rowsPerPage = ref(5);

//Variables for the upload of the proof of payment voucher
const showFileSizeError = ref(false);
const files = ref();

//Se vigila cuando se cambia los parametros
watch(() => props.params, () => {
    console.log(props.params);
    if (props.params) {
        type.value = props.params;
        filterPackages(type.value);
    }
});

onBeforeMount(async () => {
    await userStore.getUserInfo();
    const response = await fetch(`http://127.0.0.1:3000/paquetes/client/${userStore.userData.email}`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    if (!response.ok) {
        packages.value = [];
        original_packages.value = [];
    } else {
        packages.value = await response.json();
        original_packages.value = JSON.parse(JSON.stringify(packages.value));
        filterPackages(type.value);
    }
});

const filterPackages = (state) => {
    packages.value = [];
    original_packages.value.forEach((pack) => {
        if (pack.package_status == state) {
            packages.value.push(pack);
        }
    });
}

const translateStatus = (status) => {
    switch (status) {
        case 'stored':
            return 'En bodega'

        case 'sent':
            return 'En tránsito al país'

        case 'stored':
            return 'En bodega'

        case 'aduana':
            return 'En aduana'

        case 'onway':
            return 'En proceso de entrega'

        default:
            break;
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
        let userInfo = await userStore.getClientInfoById(currentPackage.value.cliente_id)
        await Promise.all(filesArray.map(async file => {
            const fileName = uuidv4();
            const storageRef = fireStorageRef(storage, `bills/proofPaymentVouchers/${userInfo.email}/${fileName}`)
            // Reducir la imagen si es una imagen
            const metadata = {
                contentType: file.type
            }
            await uploadBytes(storageRef, file, metadata)
            const downloadURL = await getDownloadURL(storageRef);
            uploadedFileURLs.push(downloadURL);
        })).then(async () => {
            let response = await userStore.uploadProofPayment(uploadedFileURLs[0], currentPackage.value.id);
            if (response.ok) {
                Swal.fire({
                    title: "¡Éxito!",
                    text: "Comprobante de pago subido correctamente",
                    icon: "success",
                }).then(() => {
                    window.location.reload();
                });
            } else {
                console.error('Error al desarrollar la peticion:', response.status);
                return response;
            }
        })
    } catch (error) {
        console.error(error);
        alert('Error subiendo las imágenes');
    }

}

</script>
<template>
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg border border-gray-200">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                    <th scope="col" class="px-6 py-3">
                        Codigo
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Categoría
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Peso
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
            </thead>
            <transition name="fadeTable">

                <tbody>
                    <tr v-for="(packageRow, rowIndex) in packages.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)"
                        :key="rowIndex" class="border-b">
                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            {{ packageRow.code }}
                        </th>
                        <td class="px-6 py-4">
                            {{ packageRow.category }}
                        </td>
                        <td class="px-6 py-4">
                            {{ packageRow.weight }}
                        </td>
                        <td class="px-6 py-4">
                            $ {{ packageRow.freight_cost }}
                        </td>
                        <td class="px-6 py-4">
                            {{ packageRow.description }}
                        </td>
                        <td class="px-6 py-4 text-center">
                            <i v-if="!packageRow.proof_payment_voucher" onclick="details_modal.showModal()"
                                @click="currentPackage = packageRow" title="Pagar costos de envio"
                                class="fa-solid fa-receipt fa-2xl text-amber-600 cursor-pointer hover:text-amber-700 transition-all duration-300 mr-3"></i>
                            <i onclick="details_modal.showModal()" @click="currentPackage = packageRow"
                                title="Detalle de la prealerta"
                                class="fa-solid fa-square-caret-down fa-2xl cursor-pointer hover:text-amber-600 transition-all duration-300 mr-3"></i>

                        </td>
                    </tr>
                </tbody>
            </transition>
        </table>
        <transition v-if="packages" name="fadeTable">
            <div class="text-right mr-2 my-2">
                <button title="Página anterior" class="p-1 px-2 rounded-xl bg-gray-800 text-white disabled:bg-gray-300"
                    @click="currentPage--" :disabled="currentPage === 1">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                <span title="Página actual" class="p-1 px-2 rounded-xl border border-gray-800 mx-2 cursor-default">{{
                    currentPage }}</span>
                <button title="Siguiente página" class="p-1 px-2 rounded-xl bg-gray-800 text-white disabled:bg-gray-300"
                    @click="currentPage++" :disabled="currentPage === Math.ceil(packages.length / rowsPerPage)">
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
            </div>
        </transition>
    </div>
    <!--Modals-->
    <dialog id="details_modal" class="modal">
        <!--Details Modal-->
        <div v-if="currentPackage" class="modal-box min-w-[400px] sm:min-w-[700px] w-auto max-w-2xl">
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <div class="flex items-center text-center justify-center">
                <h3 class="font-bold text-2xl">DETALLE DEL PAQUETE</h3>
            </div>
            <br>
            <div class="font-medium" v-if="!currentPackage.proof_payment_voucher">
                Su paquete se encuentra listo para ser enviado, por favor realice el pago del flete
                corresponiente dando click
                <a class="text-amber-500 hover:text-amber-600 underline cursor-pointer" target="_blank" :href="currentPackage.payment_voucher">
                    aquí.
                </a>
            </div>
            <br>
            <div v-if="currentPackage">
                <div class="flex items-center justify-between">
                    <div class="flex border border-gray-200 p-2 shadow shadow-amber-600 w-4/6">
                        <div class="content-center mr-5">
                            <i class="fa-solid fa-box fa-xl text-amber-600"></i>
                        </div>
                        <div class="text-lg font-medium w-fit">
                            <div>
                                Codigo de SwiftShip: {{ currentPackage.code }}
                            </div>
                            <div class="w-fit">
                                Tracking Code: {{ currentPackage.tracking_code }}
                            </div>
                            <div class="flex items-center">
                                Estado: {{ translateStatus(currentPackage.package_status) }}
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
                            <div class="text-right text-amber-500 hover:text-amber-600 underline cursor-pointer"
                                v-if="!currentPackage.proof_payment_voucher">
                                <a :href="currentPackage.payment_voucher" target="_blank">Por pagar: $  {{ currentPackage.freight_cost }} </a>
                            </div>
                        </div>
                    </div>
                    <div style="text-align: -webkit-center;" class="w-2/6 mr-20 min-h-[100px]">
                        <!-- línea vertical verde con un punto en el inicio y otro en el final, el class se cambia segun el estado -->
                        <div class="relative">
                            <div class="h-2 w-2 bg-green-500 border border-green-500 rounded-full"></div>
                            <div class="text-xs absolute -top-2 -right-10">En bodega: {{
                                currentPackage.recieved_date }}</div>
                        </div>
                        <div class="h-[20px] w-1"
                            :class="{ 'bg-green-500': currentPackage.transit_date, 'border border-green-500': !currentPackage.transit_date }">
                        </div>
                        <div class="relative">
                            <div class="h-2 w-2 border border-green-500 rounded-full"
                                :class="{ 'bg-green-500': currentPackage.transit_date, 'bg-white': !currentPackage.transit_date }">
                            </div>
                            <div class="text-xs absolute -top-2 -right-10">En transito: {{
                                currentPackage.transit_date ? currentPackage.transit_date : '-------------' }}
                            </div>
                        </div>
                        <div class="h-[20px] w-1"
                            :class="{ 'bg-green-500': currentPackage.duty_date, 'border border-green-500': !currentPackage.duty_date }">
                        </div>
                        <div class="relative">
                            <div class="h-2 w-2 border border-green-500 rounded-full"
                                :class="{ 'bg-green-500': currentPackage.duty_date, 'bg-white': !currentPackage.duty_date }">
                            </div>
                            <div class="text-xs absolute -top-2 -right-10">En aduana: {{
                                currentPackage.duty_date ? currentPackage.duty_date : '-------------' }}</div>
                        </div>
                        <div class="h-[20px] w-1"
                            :class="{ 'bg-green-500': currentPackage.delivery_date, 'border border-green-500': !currentPackage.delivery_date }">
                        </div>
                        <div class="relative">
                            <div class="h-2 w-2  border border-green-500 rounded-full"
                                :class="{ 'bg-green-500': currentPackage.delivery_date, 'bg-white': !currentPackage.delivery_date }">
                            </div>
                            <div class="text-xs absolute -top-2 -right-10">En entrega: {{
                                currentPackage.delivery_date ? currentPackage.delivery_date : '-------------' }}
                            </div>
                        </div>
                    </div>
                </div>
                <br>
                <hr>
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
                            :href="currentPackage.payment_voucher" target="_blank">
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

                    <div v-if="!currentPackage.proof_payment_voucher" class="border-b border-slate-400 py-1 content-center">
                        <span class="font-medium" style="display: inline-block">Comprobante de pago:</span>
                    </div>
                    <div v-if="!currentPackage.proof_payment_voucher"
                        class="border-b border-slate-400  items-center flex">
                        <input type="file" accept="image/*" v-on:change="handleFileUpload"
                            class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 my-2"
                            required>
                            <form method="dialog">
                                <button v-if="files" @click="uploadFiles" class="text-xs text-white bg-sky-600 p-2 rounded-xl m-2 cursor-pointer text-center
                                transition ease-in-out duration-200 hover:scale-105 hover:bg-sky-700">
                                    Subir comprobante
                                </button>
                            </form>
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
    </dialog>
</template>