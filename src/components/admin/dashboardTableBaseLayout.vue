<script setup>
import { ref, watch } from 'vue'
const props = defineProps(['params']);
const type = ref('prealerts')
const receivedInfo = ref(false);
const denyInfo = ref(false);
const denyPackageCategory = ref();
const denyPackageDesc = ref();

//Se vigila cuando se cambia los parametros
watch(() => props.params, () => {
    if (props.params) {
        type.value = props.params;
    }
});

const openInfoDetail = (params) => {
    if (params == 'recived') {
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

const validDenyPackage = () =>{
    if(denyPackageCategory.value){
        if(denyPackageCategory.value!='C')
            return false;
        else
            return denyPackageDesc.value == null || denyPackageDesc.value == '';
    } else
        return true;
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
                                Codigo
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Estatus
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Tienda
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Carrier
                            </th>
                            <th scope="col" class="px-6 py-3 text-center">
                                Detalle
                            </th>
                        </tr>
                        <tr v-else>
                            <th scope="col" class="px-6 py-3">
                                Codigo
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Estatus
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Peso
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Valor declarado
                            </th>
                            <th scope="col" class="px-6 py-3 text-center">
                                Detalle
                            </th>
                        </tr>
                    </transition>
                </thead>
                <transition name="fadeTable">
                    <tbody v-if="type == 'prealerts'">
                        <tr class="border-b">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                Apple MacBook Pro 17"
                            </th>
                            <td class="px-6 py-4">
                                Silver
                            </td>
                            <td class="px-6 py-4">
                                Laptop
                            </td>
                            <td class="px-6 py-4">
                                $2999
                            </td>
                            <td class="px-6 py-4 text-center">
                                <i onclick="details_modal.showModal()"
                                    class="fa-solid fa-square-caret-down fa-2xl cursor-pointer hover:text-amber-600 transition-all duration-300"></i>
                            </td>
                        </tr>
                        <tr class="border-b">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                Microsoft Surface Pro
                            </th>
                            <td class="px-6 py-4">
                                White
                            </td>
                            <td class="px-6 py-4">
                                Laptop PC
                            </td>
                            <td class="px-6 py-4">
                                $1999
                            </td>
                            <td class="px-6 py-4 text-center">
                                <i onclick="details_modal.showModal()"
                                    class="fa-solid fa-square-caret-down fa-2xl cursor-pointer hover:text-amber-600 transition-all duration-300"></i>
                            </td>
                        </tr>
                        <tr class="border-b">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                Magic Mouse 2
                            </th>
                            <td class="px-6 py-4">
                                Black
                            </td>
                            <td class="px-6 py-4">
                                Accessories
                            </td>
                            <td class="px-6 py-4">
                                $99
                            </td>
                            <td class="px-6 py-4 text-center">
                                <i onclick="details_modal.showModal()"
                                    class="fa-solid fa-square-caret-down fa-2xl cursor-pointer hover:text-amber-600 transition-all duration-300"></i>
                            </td>
                        </tr>
                        <tr class="border-b">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                Google Pixel Phone
                            </th>
                            <td class="px-6 py-4">
                                Gray
                            </td>
                            <td class="px-6 py-4">
                                Phone
                            </td>
                            <td class="px-6 py-4">
                                $799
                            </td>
                            <td class="px-6 py-4 text-center">
                                <i onclick="details_modal.showModal()"
                                    class="fa-solid fa-square-caret-down fa-2xl cursor-pointer hover:text-amber-600 transition-all duration-300"></i>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                Apple Watch 5
                            </th>
                            <td class="px-6 py-4">
                                Red
                            </td>
                            <td class="px-6 py-4">
                                Wearables
                            </td>
                            <td class="px-6 py-4">
                                $999
                            </td>
                            <td class="px-6 py-4 text-center">
                                <i onclick="details_modal.showModal()"
                                    class="fa-solid fa-square-caret-down fa-2xl cursor-pointer hover:text-amber-600 transition-all duration-300"></i>
                            </td>
                        </tr>
                    </tbody>

                    <tbody v-else>
                        <tr class="border-b">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                Apple MacBook Pro 17"
                            </th>
                            <td class="px-6 py-4">
                                Silver
                            </td>
                            <td class="px-6 py-4">
                                Laptop
                            </td>
                            <td class="px-6 py-4">
                                $2999
                            </td>
                            <td class="px-6 py-4 text-center">
                                <i onclick="details_modal.showModal()"
                                    class="fa-solid fa-square-caret-down fa-2xl cursor-pointer hover:text-amber-600 transition-all duration-300"></i>
                            </td>
                        </tr>
                        <tr class="border-b">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                Microsoft Surface Pro
                            </th>
                            <td class="px-6 py-4">
                                White
                            </td>
                            <td class="px-6 py-4">
                                Laptop PC
                            </td>
                            <td class="px-6 py-4">
                                $1999
                            </td>
                            <td class="px-6 py-4 text-center">
                                <i onclick="details_modal.showModal()"
                                    class="fa-solid fa-square-caret-down fa-2xl cursor-pointer hover:text-amber-600 transition-all duration-300"></i>
                            </td>
                        </tr>
                        <tr class="border-b">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                Magic Mouse 2
                            </th>
                            <td class="px-6 py-4">
                                Black
                            </td>
                            <td class="px-6 py-4">
                                Accessories
                            </td>
                            <td class="px-6 py-4">
                                $99
                            </td>
                            <td class="px-6 py-4 text-center">
                                <i onclick="details_modal.showModal()"
                                    class="fa-solid fa-square-caret-down fa-2xl cursor-pointer hover:text-amber-600 transition-all duration-300"></i>
                            </td>
                        </tr>
                        <tr class="border-b">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                Google Pixel Phone
                            </th>
                            <td class="px-6 py-4">
                                Gray
                            </td>
                            <td class="px-6 py-4">
                                Phone
                            </td>
                            <td class="px-6 py-4">
                                $799
                            </td>
                            <td class="px-6 py-4 text-center">
                                <i onclick="details_modal.showModal()"
                                    class="fa-solid fa-square-caret-down fa-2xl cursor-pointer hover:text-amber-600 transition-all duration-300"></i>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                Apple Watch 5
                            </th>
                            <td class="px-6 py-4">
                                Red
                            </td>
                            <td class="px-6 py-4">
                                Wearables
                            </td>
                            <td class="px-6 py-4">
                                $999
                            </td>
                            <td class="px-6 py-4 text-center">
                                <i onclick="details_modal.showModal()"
                                    class="fa-solid fa-square-caret-down fa-2xl cursor-pointer hover:text-amber-600 transition-all duration-300"></i>
                            </td>
                        </tr>
                    </tbody>

                </transition>
            </table>
        </div>

    </div>
    <!--Modals-->
    <dialog id="details_modal" class="modal transition-all duration-500">
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
                    <div>
                        <div class="flex items-center justify-between">
                            <div class="flex border border-gray-200 p-2 w-fit shadow shadow-amber-600">
                                <div class="content-center mr-5">
                                    <i class="fa-solid fa-box fa-xl text-amber-600"></i>
                                </div>
                                <div class="text-lg font-medium w-fit">
                                    <div class="w-fit">
                                        Tracking Code: KADNAAA0657
                                    </div>
                                </div>
                            </div>
                            <div class="flex mx-5">
                                <button @click="openInfoDetail('recived')" class="btn btn-warning mr-4 "
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
                        <div class="mx-5">
                            <div><span class="font-medium my-2"> Tienda:</span> </div>
                            <div><span class="font-medium my-2"> Carrier:</span> </div>
                            <div><span class="font-medium my-2"> Valor de la compra:</span> </div>
                            <div><span class="font-medium my-2"> Factura:</span> </div>
                            <div><span class="font-medium my-2"> Descripción:</span> </div>
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
                                                <select id="tipePackage"
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
                                                    <input type="number" v-model="weight" placeholder="24,35"
                                                        class="text-sm text-center px-2 input input-bordered border border-gray-200 rounded-xl w-full">
                                                </div>

                                            </div>
                                            <br>
                                            <div class="flex items-center w-3/6 ml-4">
                                                <div class="w-3/6">
                                                    <span class="font-medium">Costo del flete:</span>
                                                </div>
                                                <div class="w-3/6">
                                                    <input type="number" v-model="freightCost" placeholder="24,35"
                                                        class="text-center text-sm px-2 input input-bordered border border-gray-200 rounded-xl w-full">
                                                </div>

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
</template>