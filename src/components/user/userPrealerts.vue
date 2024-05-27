<script setup>
import { ref, onMounted, onBeforeMount } from 'vue'
import { useUserStore } from "@/stores/user.js";
import Swal from "sweetalert2";
import { storage } from '../../../firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { ref as fireStorageRef, uploadBytes, getDownloadURL } from 'firebase/storage';


const userStore = useUserStore();
const props = defineProps(['sidebarActive']);
console.log(props.sidebarActive);
const alertName = ref();
const description = ref();
const store = ref();
const carrier = ref();
const trackingCode = ref();
const packageValue = ref();
const address = ref();
const city = ref();
const postal_num = ref();
const billURL = ref();
const policyAccepted = ref(false);
//Subida de imagenes
const showFileSizeError = ref(false);
const files = ref(null);
//Carga de prealertas
const prealertas = ref();
const original_prealertas = ref();
const searchCode = ref('');
// Combo box de cargas
const stores = ref();
const carriers = ref();
//Current prealert
const currentPrealert = ref();
//Table navigation 
const currentPage = ref(1);
const rowsPerPage = ref(5);

onBeforeMount(async () => {
    if (!userStore.userData) {
        await userStore.getUserInfo();
        if (userStore.userData)
            alertName.value = await userStore.userData.first_names + " " + await userStore.userData.last_names;
    }

    const response = await fetch(`http://127.0.0.1:3000/pedidos/client/${userStore.userData.email}`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    await loadStores();
    await loadCarriers();
    if (!response.ok) {
        prealertas.value = [];
        original_prealertas.value = [];
    } else {
        prealertas.value = await response.json();
        original_prealertas.value = JSON.parse(JSON.stringify(prealertas.value));
    }
});

const searchByCode = async (code) => {
    if (code == null || code == '' || code == ' ')
        code = 'PAP';

    const response = await fetch(`http://127.0.0.1:3000/pedidos/code/${code}/email/${userStore.userData.email}`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Hubo un problema al obtener los datos del usuario.');
    }
    prealertas.value = await response.json();
}

const deletePrealert = (data) => {
    Swal.fire({
        title: `¿Estas seguro de que quieres eliminar la pre-alerta ${data.code}?`,
        text: "Esta acción no podrá ser recuperada",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        confirmButtonColor: "#d33",
        cancelButtonText: `Cancelar`
    }).then(async (result) => {
        if (result.isConfirmed) {
            const response = await fetch(`http://127.0.0.1:3000/pedidos/${data.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            Swal.fire("Prealerta eliminada correctamente!", "", "success").then(() => {
                window.location.reload();
            });
            if (!response.ok) {
                throw new Error('Hubo un problema al obtener los datos del usuario.');
            }
        }
    });

}

const loadStores = async () => {
    const response = await fetch(`http://127.0.0.1:3000/tiendas`, {
        headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
        throw new Error('Hubo un problema al obtener los datos de las tiendas.');
    }
    stores.value = await response.json();
    stores.value = stores.value.filter(store => store.active);
}

const loadCarriers = async () => {
    const response = await fetch(`http://127.0.0.1:3000/carriers`, {
        headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
        throw new Error('Hubo un problema al obtener los datos de los carriers.');
    }
    carriers.value = await response.json();
    carriers.value = carriers.value.filter(carrier => carrier.active);
}

const resetTable = () => {
    prealertas.value = JSON.parse(JSON.stringify(original_prealertas.value));
    searchCode.value = '';
}

const uploadPrealert = async () => {
    try {
        billURL.value = await uploadFiles();
    } catch (error) {
        console.error('Ocurrió un error al subir los archivos:', error);
    }

    const response = await fetch('http://127.0.0.1:3000/pedidos/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "receiver": alertName.value,
            "email": userStore.userData.email,
            "cliente": userStore.userData.id,
            "carrier": carrier.value,
            "store": store.value,
            "description": description.value,
            "tracking_code": trackingCode.value,
            "purchase_value": packageValue.value,
            "address": address.value,
            "city": city.value,
            "postal_num": postal_num.value,
            "bill": billURL.value[0],
        })
    });
    // Verificar si la primera petición fue correcta
    if (response.ok) {
        Swal.fire({
            title: "¡Éxito!",
            text: "Prealerta creada correctamente",
            icon: "success",
        }).then(() => {
            window.location.reload();
        });
    } else {
        console.error('Error al desarrollar la peticion:', response.status);
        return response;
    }
}

const allDataCompleted = () => {
    if (alertName.value == null || description.value == null || store.value == null || carrier.value == null
        || trackingCode.value == null || packageValue.value == null || files.value == null || !policyAccepted.value || showFileSizeError.value) {
        return false;
    } else
        return true;
}

//Verificar que el peso no sea mas de 25mb
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
        await Promise.all(filesArray.map(async file => {
            const fileName = uuidv4();
            const storageRef = fireStorageRef(storage, `bills/prealertsBills/${userStore.email}/${fileName}`)
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

const translateOrderStatus = (status) => {
    switch (status) {
        case 'waiting':
            return 'En espera de entrega'
        case 'received':
            return 'Recibido / Paquete generado'
        case 'deny':
            return 'Rechazado'

        default:
            break;
    }
}
</script>
<template>
    <div class="text-2xl flex items-center mb-2">
        <div>
            <i class="fa-solid fa-bell mr-2"></i>
            <span class="font-bold">Tus prealertas</span>
        </div>
        <div onclick="virtual_locker.showModal()" class="flex items-center ml-auto bg-amber-400 p-2 rounded-xl cursor-pointer
            transition-all duration-200 hover:scale-105 hover:shadow-xl">
            <div class="text-base font-medium">
                <i class="fa-solid fa-box fa-sm ml-2"></i>
                Tu casillero virtual: HFC03685
            </div>
        </div>
    </div>
    <div>
        <div title="Crear prealerta" onclick="create_prealert.showModal()" class="w-fit">
            <button
                class="flex items-center justify-center rounded-xl bg-amber-400 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl p-2 px-3">
                <i class="fa-solid fa-plus fa-sm mr-3"></i>
                <div class="font-medium">
                    Crear prealerta
                </div>
            </button>
        </div>

    </div>
    <br>
    <!-- Search bar -->
    <form @submit.prevent="searchByCode(searchCode)" class="flex items-center w-3/6 min-w-[420px]">
        <div class="flex w-full">
            <input type="text" v-model="searchCode"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-l-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-5 p-2.5"
                placeholder="Buscar en el directorio de prealerta por código...">
            <button type="submit"
                class="cursor-pointer bg-gray-200 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-r-lg px-3 content-center hover:bg-gray-300">
                <i class="fa-solid fa-magnifying-glass text-black"></i>
            </button>
            <div v-if="searchCode != ''" @click="resetTable()"
                class="cursor-pointer bg-gray-200 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg px-3 content-center hover:bg-gray-300 ml-5">
                <i class="fa-solid fa-arrows-rotate text-black"></i>
            </div>
        </div>
    </form>
    <br>
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg border border-gray-200">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                    <th scope="col" class="px-6 py-3">
                        Codigo
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Estatus
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Tienda
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Contenido
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                        Acciones
                    </th>
                </tr>
            </thead>
            <transition name="fadeTable">
                <tbody v-if="prealertas">
                    <tr v-for="(prealertaRow, rowIndex) in prealertas.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)"
                        :key="rowIndex" class="border-b">
                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            {{ prealertaRow.code }}
                        </th>
                        <td class="px-6 py-4">
                            {{ prealertaRow.order_status }}
                        </td>
                        <td class="px-6 py-4">
                            {{ prealertaRow.store_name }}
                        </td>
                        <td class="px-6 py-4">
                            {{ prealertaRow.description }}
                        </td>
                        <td class="px-6 py-4 text-center">
                            <i onclick="details_modal.showModal()" @click="currentPrealert = prealertaRow"
                                title="Detalle de la prealerta"
                                class="fa-solid fa-square-caret-down fa-2xl cursor-pointer hover:text-amber-600 transition-all duration-300 mr-3"></i>
                            <i v-if="prealertaRow.order_status != 'received'" @click="deletePrealert(prealertaRow)"
                                title="Eliminar prealerta"
                                class="fa-solid fa-trash-can fa-xl text-slate-700 cursor-pointer hover:text-red-600 transition-all duration-300"></i>
                        </td>
                    </tr>
                </tbody>
            </transition>

        </table>
        <transition v-if="prealertas" name="fadeTable">
            <div class="text-right mr-2 my-2">
                <button title="Página anterior" class="p-1 px-2 rounded-xl bg-gray-800 text-white disabled:bg-gray-300"
                    @click="currentPage--" :disabled="currentPage === 1">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                <span title="Página actual" class="p-1 px-2 rounded-xl border border-gray-800 mx-2 cursor-default">{{
                    currentPage }}</span>
                <button title="Siguiente página" class="p-1 px-2 rounded-xl bg-gray-800 text-white disabled:bg-gray-300"
                    @click="currentPage++" :disabled="currentPage === Math.ceil(prealertas.length / rowsPerPage)">
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
            </div>
        </transition>
    </div>
    <!--Modals-->
    <!--Create prealert modal-->
    <dialog id="create_prealert" class="modal">
        <div class="modal-box w-10/12 max-w-2xl">
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <div class="flex items-center text-center justify-center">
                <i class="fa-solid fa-box fa-xl text-amber-500 mr-5"></i>
                <h3 class="font-bold text-2xl">Alertar de un paquete</h3>
            </div>
            <p class="py-4 text-center">
                Rellena los siguientes datos una vez hayas comprado y enviado tu paquete
                <br>
                a tu <span class="text-amber-600 underline cursor-pointer hover:text-amber-700">casillero virtual</span>
                en USA.
            </p>
            <hr>
            <div class="flex mt-3">
                <div class="w-4/6">
                    <div class="mb-4">
                        <div class="font-medium">
                            • ¿Quien realiza la importación?
                        </div>
                        <span class="text-xs ml-3">La compra y factura, deben estar a nombre de esta persona.</span>
                        <div class="ml-3">
                            <input type="text" v-model="alertName"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-5/6 pl-2.5 p-2.5"
                                placeholder="Ex: Daniel Bonilla" required>
                        </div>
                    </div>
                    <div class="mb-4">
                        <div class="font-medium">
                            • Descripción de la compra
                        </div>
                        <div class="ml-3">
                            <input type="text" v-model="description"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-5/6 pl-2.5 p-2.5"
                                placeholder="Ex: Zapatos deportivos Nike" required>
                        </div>
                    </div>
                    <div class="mb-4">
                        <div class="font-medium">
                            • Tienda donde se realizo la compra
                        </div>
                        <div class="ml-3">
                            <select v-model="store"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-5/6 pl-2.5 p-2.5">
                                <option selected disabled>Seleccionar</option>
                                <option v-for="(store, index) in stores" :key="store" :value="store.id">{{ store.name }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="mb-4">
                        <div class="font-medium">
                            • Empresa de transporte
                        </div>
                        <div class="ml-3">
                            <select v-model="carrier"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-5/6 pl-2.5 p-2.5">
                                <option selected disabled>Seleccionar</option>
                                <option v-for="(carrier, index) in carriers" :key="carrier" :value="carrier.id">{{
                                    carrier.name }}</option>
                            </select>
                        </div>
                    </div>
                    <div class="mb-4">
                        <div class="font-medium">
                            • Dirección de entrega - Ciudad
                        </div>
                        <div class="ml-3">
                            <select v-model="city"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-5/6 pl-2.5 p-2.5"
                                placeholder="Ex: Av. Mariana de Jesus y 24 de mayo" required>
                                <option value="quito">Quito</option>
                                <option value="guayaquil">Guayaquil</option>
                                <option value="cuenca">Cuenca</option>
                                <option value="machala">Machala</option>
                                <option value="santo_domingo">Santo Domingo</option>
                                <option value="manta">Manta</option>
                            </select>
                        </div>
                    </div>
                    <div class="mb-4">
                        <div class="font-medium">
                            • Dirección de entrega - Código postal
                        </div>
                        <div class="ml-3">
                            <input type="number" v-model="postal_num"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-5/6 pl-2.5 p-2.5"
                                placeholder="Ex: 170152" required>
                        </div>
                    </div>
                    <div class="mb-4">
                        <div class="font-medium">
                            • Dirección de entrega - Detalle
                        </div>
                        <div class="ml-3">
                            <input type="text" v-model="address"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-5/6 pl-2.5 p-2.5"
                                placeholder="Ex: Av. Mariana de Jesus y 24 de mayo" required>
                        </div>
                    </div>
                    <div class="mb-4">
                        <div class="font-medium">
                            • Código de tracking
                        </div>
                        <div class="ml-3">
                            <input type="text" v-model="trackingCode"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-5/6 pl-2.5 p-2.5"
                                placeholder="Ex: RHLSU56825" required>
                        </div>
                    </div>
                    <div class="mb-4">
                        <div class="font-medium">
                            • Valor de la compra
                        </div>
                        <span class="text-xs ml-3">Es necesario colocar el valor en dolares</span>
                        <div class="ml-3 items-center flex">
                            <div
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-l-lg focus:ring-blue-500 focus:border-blue-500 block pl-2.5 p-2.5">
                                USD $
                            </div>
                            <input type="number" v-model="packageValue"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-r-lg focus:ring-blue-500 focus:border-blue-500 block w-4/6 pl-2.5 p-2.5"
                                placeholder="Ex: 12.35" required>
                        </div>
                    </div>
                    <div class="mb-4">
                        <div class="font-medium">
                            • Sube la factura de tu compra
                        </div>
                        <div class="ml-3 items-center flex">
                            <input type="file" accept="image/*" v-on:change="handleFileUpload"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-5/6 pl-2.5 p-2.5"
                                placeholder="Ex: 12.35" required>
                        </div>
                        <span v-if="showFileSizeError" class="ml-3 text-red-500">
                            El tamaño del archivo debe ser inferior a 10MB.
                        </span>
                    </div>
                </div>

                <div class="w-2/6 rounded-xl mr-5 content-center">
                    <img class="rounded-xl border border-amber-500 shadow-xl"
                        src="https://images.pexels.com/photos/4245934/pexels-photo-4245934.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1">
                    <br>
                    <img src="@/assets/SwiftShip_Logo.png">
                </div>
            </div>
            <div class="mb-4">
                <div class='text-black mb-[-5px] ml-3'>
                    <label class="flex">
                        <input class="mr-4" type="checkbox" v-model="policyAccepted" />
                        <p class="text-justify text-sm cursor-default select-none"> Al hacer clic,
                            reconozco y acepto que toda la información proporcionada es precisa y veraz.
                            Por lo tanto, asumo la responsabilidad total por el envío de mis paquetes
                            para su importación a Ecuador.
                        </p>
                    </label>
                </div>
            </div>
            <div class="text-center">
                <form method="dialog">
                    <button @click="uploadPrealert" class="rounded-xl bg-amber-300 cursor-pointer p-4
                     transition-all duration-200 hover:bg-amber-400 hover:scale-105 hover:shadow-xl
                     disabled:disabled:cursor-not-allowed disabled:text-gray-600 disabled:bg-slate-100"
                        :disabled="!allDataCompleted()">
                        <i class="fa-solid fa-bell"></i>
                        Crear prealerta
                    </button>
                </form>
            </div>
        </div>
        <!--Btn para cerrar-->
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
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
    <!--Details Modal-->
    <dialog id="details_modal" class="modal transition-all duration-500">
        <div class="modal-box min-w-[400px] sm:min-w-[700px] w-auto max-w-2xl">
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <div class="flex items-center text-center justify-center">
                <h3 class="font-bold text-2xl">DETALLE DE LA PREALERTA</h3>
            </div>
            <br>
            <div v-if="currentPrealert">
                <div class="flex items-center justify-between">
                    <div class="flex border border-gray-200 p-2 shadow shadow-amber-600 w-4/6">
                        <div class="content-center mr-5">
                            <i class="fa-solid fa-box fa-xl text-amber-600"></i>
                        </div>
                        <div class="text-lg font-medium w-fit">
                            <div>
                                Codigo de SwiftShip: {{ currentPrealert.code }}
                            </div>
                            <div class="w-fit">
                                Tracking Code: {{ currentPrealert.tracking_code }}
                            </div>
                        </div>
                    </div>
                    <div style="text-align: -webkit-center;" class="w-2/6">
                        <!-- Icono que representa el estado de la prealerta -->
                        <div class="transition ease-in-out duration-200 hover:scale-105 w-fit">
                            <div>
                                <i class="fa-solid text-[4em] text-amber-500 ml-2 mt-1" :class="{
                                    'fa-hourglass-half': currentPrealert.order_status == 'waiting',
                                    'fa-warehouse': currentPrealert.order_status == 'received',
                                    'fa-ban text-red-400': currentPrealert.order_status == 'deny',
                                    'fa-question-circle': !['waiting', 'received', 'deny'].includes(currentPrealert.order_status)
                                }">
                                </i>
                            </div>
                            <div class="cursor-default text-sm mt-1">
                                {{ translateOrderStatus(currentPrealert.order_status) }}
                            </div>
                        </div>
                    </div>
                </div>
                <br>
                <hr>
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
                            class="text-blue-600 hover:text-blue-800 hover:underline" :href="currentPrealert.bill"
                            target="_blank">Ver factura</a></div>

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
    </dialog>
</template>