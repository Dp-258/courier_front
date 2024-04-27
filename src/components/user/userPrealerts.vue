<script setup>
import { ref, watch } from 'vue'
const toUppercase = () => {

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
            <button class="flex items-center justify-center rounded-xl bg-amber-400 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl p-2 px-3">
                <i class="fa-solid fa-plus fa-sm mr-3"></i>
                <div class="font-medium">
                    Crear prealerta
                </div>
            </button>
        </div>

    </div>
    <br>
    <!-- Search bar -->
    <form class="flex items-center w-3/6 min-w-[420px]">
        <div class="flex w-full">
            <input type="text" id="voice-search"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-l-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-5 p-2.5"
                placeholder="Buscar en el directorio de prealerta por código..." required>
            <div
                class="cursor-pointer bg-gray-200 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-r-lg px-3 content-center hover:bg-gray-300">
                <i class="fa-solid fa-magnifying-glass text-black"></i>
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
                        Carrier
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                        Acciones
                    </th>
                </tr>
            </thead>
            <transition name="fadeTable">
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
                        <i onclick="details_modal.showModal()" title="Editar prealerta"
                            class="fa-solid fa-pencil fa-xl text-slate-950 cursor-pointer hover:text-amber-600 transition-all duration-300 mr-3"></i>
                        <i onclick="details_modal.showModal()" title="Ver detalle"
                            class="fa-solid fa-square-caret-down fa-2xl cursor-pointer hover:text-amber-600 transition-all duration-300"></i>

                    </td>
                </tr>
            </transition>

        </table>
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
                            <input type="text"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-5/6 pl-2.5 p-2.5"
                                placeholder="Daniel Bonilla" required>
                        </div>
                    </div>
                    <div class="mb-4">
                        <div class="font-medium">
                            • Descripción de la compra
                        </div>
                        <div class="ml-3">
                            <input type="text"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-5/6 pl-2.5 p-2.5"
                                placeholder="Ex: Zapatos deportivos Nike" required>
                        </div>
                    </div>
                    <div class="mb-4">
                        <div class="font-medium">
                            • Tienda donde se realizo la compra
                        </div>
                        <div class="ml-3">
                            <select
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-5/6 pl-2.5 p-2.5">
                                <option selected disabled>Seleccionar</option>
                                <option value="A">Amazon</option>
                                <option value="B">E-bay</option>
                                <option value="C">Target</option>
                                <option value="D">Shein</option>
                                <option value="E">Victoria Secret</option>
                                <option value="F">Otras</option>
                            </select>
                        </div>
                    </div>
                    <div class="mb-4">
                        <div class="font-medium">
                            • Empresa de transporte
                        </div>
                        <div class="ml-3">
                            <select
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-5/6 pl-2.5 p-2.5">
                                <option selected disabled>Seleccionar</option>
                                <option value="A">Amazon</option>
                                <option value="B">DHL</option>
                                <option value="C">Fedex</option>
                                <option value="D">USPS</option>
                                <option value="F">Otros</option>
                            </select>
                        </div>
                    </div>
                    <div class="mb-4">
                        <div class="font-medium">
                            • Código de tracking
                        </div>
                        <div class="ml-3">
                            <input type="text"
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
                            <input type="text"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-r-lg focus:ring-blue-500 focus:border-blue-500 block w-4/6 pl-2.5 p-2.5"
                                placeholder="Ex: 12.35" required>
                        </div>
                    </div>
                    <div class="mb-4">
                        <div class="font-medium">
                            • Sube la factura de tu compra
                        </div>
                        <div class="ml-3 items-center flex">
                            <input type="file"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-5/6 pl-2.5 p-2.5"
                                placeholder="Ex: 12.35" required>
                        </div>
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
                <button class="rounded-xl bg-amber-300 cursor-pointer p-4
                 transition-all duration-200 hover:bg-amber-400 hover:scale-105 hover:shadow-xl">
                    <i class="fa-solid fa-bell"></i>
                    Crear prealerta
                </button>
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
        <div class="flex ">
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