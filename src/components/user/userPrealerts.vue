<script setup>
const props = defineProps(['sidebarActive']);
</script>
<template>
    <div>
        <div class="text-2xl font-bold mb-5 flex items-center">
            <div>
                ¡Bienvenido a SwiftShip!
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
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            <div class="pt-3 pb-3 px-4 bg-white border border-gray-200 rounded-lg shadow transition ease-in-out duration-200 
            hover:scale-105 hover:-translate-y-2 hover:shadow-xl">
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
                    25
                </p>
            </div>
            <div class="pt-3 pb-3 px-4 bg-white border border-gray-200 rounded-lg shadow transition ease-in-out duration-200 
            hover:scale-105 hover:-translate-y-2 hover:shadow-xl">
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
                    2
                </p>
            </div>
            <div class="pt-3 pb-3 px-4 bg-white border border-gray-200 rounded-lg shadow transition ease-in-out duration-200 
            hover:scale-105 hover:-translate-y-2 hover:shadow-xl">
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
                    0
                </p>
            </div>
            <div class="pt-3 pb-3 px-4 bg-white border border-gray-200 rounded-lg shadow transition ease-in-out duration-200 
            hover:scale-105 hover:-translate-y-2 hover:shadow-xl">
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
                    2
                </p>
            </div>
        </div>

        <div>
            <h1 class="text-xl font-semibold mb-4">Mis paquetes</h1>
        </div>
        <div>
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg border border-gray-200">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Product name
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Color
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Category
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Price
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
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
                            <td class="px-6 py-4">
                                <a href="#" class="font-medium text-blue-600 hover:underline">Edit</a>
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
                            <td class="px-6 py-4">
                                <a href="#" class="font-medium text-blue-600 hover:underline">Edit</a>
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
                            <td class="px-6 py-4">
                                <a href="#"
                                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
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
                            <td class="px-6 py-4">
                                <a href="#"
                                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
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
                            <td class="px-6 py-4">
                                <a href="#"
                                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

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