<script setup>
import { ref, watch } from 'vue'
const props = defineProps(['params']);
const type = ref('store');
//Se vigila cuando se cambia los parametros
watch(() => props.params, () => {
    console.log(props.params);
    if (props.params) {
        type.value = props.params;
    }
});
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
            </thead>
            <transition name="fadeTable">

                <tbody v-if="type == 'store'">
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
                <tbody v-else-if="type == 'sent'">
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
                <tbody v-else-if="type == 'aduana'">
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
                <tbody v-else-if="type == 'onway'">
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
    <!--Modals-->
    <dialog id="details_modal" class="modal transition-all duration-500">
        <div class="flex ">
            <!--Details Modal-->
            <div>
                <div class="modal-box min-w-[400px] sm:min-w-[700px] w-auto max-w-2xl">
                    <form method="dialog">
                        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <div class="flex items-center text-center justify-center">
                        <h3 class="font-bold text-2xl">DETALLE DEL PAQUETE</h3>
                    </div>
                    <br>
                    <div>
                        <div class="flex items-center justify-between">
                            <div class="flex border border-gray-200 p-2 shadow shadow-amber-600 w-4/6">
                                <div class="content-center mr-5">
                                    <i class="fa-solid fa-box fa-xl text-amber-600"></i>
                                </div>
                                <div class="text-lg font-medium w-fit">
                                    <div>
                                        Codigo de SwiftShip: PCDS06345631
                                    </div>
                                    <div class="w-fit">
                                        Tracking Code: KADNAAA0657
                                    </div>
                                    <div class="flex items-center">
                                        Estado: En entrega
                                        <i class="fa-solid fa-truck-fast fa-xs text-amber-500 ml-2 mt-1"></i>
                                    </div>
                                </div>
                            </div>
                            <div style="text-align: -webkit-center;" class="w-2/6 mr-20">
                                <!-- línea vertical verde con un punto en el inicio y otro en el final, el class se cambia segun el estado -->
                                <div class="relative">
                                    <div class="h-2 w-2 bg-green-500 border border-green-500 rounded-full"></div>
                                    <div class="text-xs absolute -top-2 -right-10">En bodega: 14/05/2024</div>
                                </div>
                                <div class="h-[20px] w-1 bg-green-500"> </div>
                                <div class="relative">
                                    <div class="h-2 w-2 bg-white border border-green-500 rounded-full"></div>
                                    <div class="text-xs absolute -top-2 -right-10">En bodega: 14/05/2024</div>
                                </div>
                                <div class="h-[20px] w-1 bg-green-500"> </div>
                                <div class="relative">
                                    <div class="h-2 w-2 bg-white border border-green-500 rounded-full"></div>
                                    <div class="text-xs absolute -top-2 -right-10">En transito: 14/05/2024</div>
                                </div>
                                <div class="h-[20px] w-1 bg-green-500"> </div>
                                <div class="relative">
                                    <div class="h-2 w-2 bg-white border border-green-500 rounded-full"></div>
                                    <div class="text-xs absolute -top-2 -right-10">En aduana: 14/05/2024</div>
                                </div>
                                <div class="h-[20px] w-1 bg-green-500"> </div>
                                <div class="relative">
                                    <div class="h-2 w-2 bg-white border border-green-500 rounded-full"></div>
                                    <div class="text-xs absolute -top-2 -right-10">En entrega: 14/05/2024</div>
                                </div>
                            </div>
                        </div>
                        <br>
                        <hr>
                        <div class="mt-3 mx-5">
                            <div><span class="font-medium my-2"> Destinatario:</span> Jhoel Alejandro Muela</div>
                            <div><span class="font-medium my-2"> Contenido:</span> Audifonos inalámbricos redmi buds 2
                            </div>
                            <div><span class="font-medium my-2"> Peso:</span> 0.44 LB</div>
                            <div><span class="font-medium my-2"> Precio del flete:</span> $7.52</div>
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
        </div>
    </dialog>
</template>