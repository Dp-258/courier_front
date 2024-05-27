<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import Chart from 'chart.js/auto';
import * as XLSX from 'xlsx';

//Variables de los datos de paquetes
const prealertsToday = ref(0);
const percentagePrealertsToday = ref(0);
const packagesDeliveredToday = ref(0);
const percentagePackagesToday = ref(0);
const packagesWaiting = ref(0);
// Variable para calendario mal
const dataBadFormedVolume = ref(false);
const dataBadFormedPackages = ref(false);
//Creación de grafico de barras responsive
const canvas = ref(null)
let chartInstanceVolume = null
let chartInstancePackage = null
//Variables del grafico
const startDate_volumeSales = ref();
const endDate_volumeSales = ref();
const startDate_packagesClient = ref();
const endDate_packagesClient = ref();
const actualTopClientsVolume = ref();
const actualTopClientsVolumeNames = ref();
const actualTopClientsPackages = ref();
const actualTopClientsPackagesNames = ref();

// Fecha mínima (hace 5 años) y la fecha máxima (hoy)
const minDate = computed(() => {
    const today = new Date();
    const fiveYearsAgo = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate());
    return fiveYearsAgo.toISOString().split('T')[0];
});

const maxDate = computed(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
});

// Datos para el gráfico de barras de volumen de ventas
const chartDataVolume = reactive({
    labels: ['Data1', 'Data2', 'Data3', 'Data4', 'Data5'],
    datasets: [{
        label: 'Compras totales en dolares',
        backgroundColor: 'rgb(54, 162, 235)',
        borderColor: 'rgb(54, 162, 235)',
        data: [60, 40, 80, 40, 10]
    }],
    options: {
        responsive: true,
        maintainAspectRatio: false,
    },
});

// Datos para el gráfico de barras de volumen de ventas
const chartDataPackage = reactive({
    labels: ['Data1', 'Data2', 'Data3', 'Data4', 'Data5'],
    datasets: [{
        label: 'Cantidad de paquetes',
        backgroundColor: 'rgb(54, 162, 235)',
        borderColor: 'rgb(54, 162, 235)',
        data: [60, 40, 80, 40, 10]
    }],
    options: {
        responsive: true,
        maintainAspectRatio: false,
    },
});

onMounted(() => {
    loadInitialData();
    initChart();
});

//Método para traer los datos de las stats de arriba
const loadInitialData = async () => {
    await calculatePrealertsToday();
    await calculatePackagesToday();

    //Establecimiento de fecha actual y fecha hace 4 años
    const currentDate = new Date();
    const pastDate = new Date();
    pastDate.setFullYear(currentDate.getFullYear() - 4);
    const formattedCurrentDate = formatDate(currentDate);
    const formattedPastDate = formatDate(pastDate);

    //Generación de chart
    await generateChart(formattedPastDate, formattedCurrentDate, 'volume');
    await generateChart(formattedPastDate, formattedCurrentDate, 'packages');
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const calculatePrealertsToday = async () => {
    let todayDate = new Date();
    todayDate = todayDate.toISOString().slice(0, 10);
    todayDate = '2024-05-08';
    const todayDateObject = new Date(todayDate);
    const yesterdayDateObject = new Date(todayDateObject.setDate(todayDateObject.getDate() - 1));
    const yesterdayDate = yesterdayDateObject.toISOString().slice(0, 10);

    //Fetch de la catidad de prealertas de hoy 
    const response1 = await fetch(`http://127.0.0.1:3000/pedidos/date/${todayDate}`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    if (!response1.ok) {
        throw new Error('Hubo un problema al obtener los datos de las prealertas de hoy.');
    }
    prealertsToday.value = await response1.json();

    //Fetch de la catidad de prealertas de ayer 
    const response2 = await fetch(`http://127.0.0.1:3000/pedidos/date/${yesterdayDate}`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    if (!response2.ok) {
        throw new Error('Hubo un problema al obtener los datos de las prealertas de hoy.');
    }
    let prealertsYesterday = await response2.json();
    //Calculo del porcentaje de ganancia/perdida
    if (prealertsYesterday > 0 && prealertsToday.value > 0) {
        let diference = prealertsToday.value - prealertsYesterday;
        let percentageLarge = (diference / prealertsYesterday) * 100
        percentagePrealertsToday.value = percentageLarge.toFixed(2);
    }
    else {
        percentagePrealertsToday.value = 0;
    }
}

const calculatePackagesToday = async () => {
    let todayDate = new Date();
    todayDate = todayDate.toISOString().slice(0, 10);
    todayDate = '2024-05-22';
    const todayDateObject = new Date(todayDate);
    const yesterdayDateObject = new Date(todayDateObject.setDate(todayDateObject.getDate() - 1));
    const yesterdayDate = yesterdayDateObject.toISOString().slice(0, 10);

    //Fetch de la catidad de prealertas de hoy 
    const response1 = await fetch(`http://127.0.0.1:3000/paquetes/date/${todayDate}`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    if (!response1.ok) {
        throw new Error('Hubo un problema al obtener los datos de las prealertas de hoy.');
    }
    packagesDeliveredToday.value = await response1.json();

    //Fetch de la catidad de prealertas de ayer 
    const response2 = await fetch(`http://127.0.0.1:3000/paquetes/date/${yesterdayDate}`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    if (!response2.ok) {
        throw new Error('Hubo un problema al obtener los datos de las prealertas de hoy.');
    }
    let packagesYesterday = await response2.json();
    //Calculo del porcentaje de ganancia/perdida
    if (packagesYesterday > 0 && packagesDeliveredToday.value > 0) {
        let diference = packagesDeliveredToday.value - packagesYesterday;
        let percentageLarge = (diference / packagesYesterday) * 100
        percentagePackagesToday.value = percentageLarge.toFixed(2);
    }
    else {
        percentagePackagesToday.value = 0;
    }
}

const setReportData_Volume = async (pastDate, actualDate) => {
    const response1 = await fetch(`http://127.0.0.1:3000/clientestop-freightcost/inicio/${pastDate}/fin/${actualDate}`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    if (!response1.ok) {
        throw new Error('Hubo un problema al obtener los datos de los top clientes por volumen.');
    }
    let reportVolume = await response1.json();
    reportVolume = reportVolume.sort((a, b) => b.total_freight_cost - a.total_freight_cost);
    const totalFreightCosts = reportVolume.map(item => item.total_freight_cost);
    const users = reportVolume.map(item => item.first_names);
    actualTopClientsVolume.value = totalFreightCosts;
    actualTopClientsVolumeNames.value = users;
    return reportVolume;
}

const setReportData_Packages = async (pastDate, actualDate) => {
    const response1 = await fetch(`http://127.0.0.1:3000/clientestop-paquetes/inicio/${pastDate}/fin/${actualDate}`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    if (!response1.ok) {
        throw new Error('Hubo un problema al obtener los datos de los top clientes por cantidad de paquetes.');
    }
    let reportPackages = await response1.json();
    const clientes = reportPackages.clientes.map(item => { return item.first_names });
    const top_clientes = reportPackages.top_clientes.map(item => { return item.total_paquetes });
    actualTopClientsPackagesNames.value = clientes;
    actualTopClientsPackages.value = top_clientes;

    return reportPackages;
}

const setDatesFromStartOfTimes = async (params) => {
    const currentDate = new Date();
    const pastDate = new Date();
    pastDate.setFullYear(currentDate.getFullYear() - 4);
    const formattedCurrentDate = formatDate(currentDate);
    const formattedPastDate = formatDate(pastDate);

    switch (params) {
        case 'volume':
            startDate_volumeSales.value = formattedPastDate;
            endDate_volumeSales.value = formattedCurrentDate;
            break;
        case 'packages':
            startDate_packagesClient.value = formattedPastDate;
            endDate_packagesClient.value = formattedCurrentDate;
            break;
        default:
            break;
    }

    await updateChart(formattedPastDate, formattedCurrentDate, params);
}

// Método para hacer la actualización de datos
const generateChart = async (init, end, type) => {

    if (checkDates(init, end)) {
        await updateChart(init, end, type);
    } else {
        const currentDate = new Date();
        const pastDate = new Date();
        pastDate.setFullYear(currentDate.getFullYear() - 4);
        const formattedCurrentDate = formatDate(currentDate);
        const formattedPastDate = formatDate(pastDate);
        await updateChart(formattedPastDate, formattedCurrentDate, type);
    }
};

const updateChart = async (initDate, endDate, type) => {
    switch (type) {
        case 'volume':
            await setReportData_Volume(initDate, endDate);
            chartDataVolume.datasets[0].data = actualTopClientsVolume.value;
            chartDataVolume.labels = actualTopClientsVolumeNames.value;
            chartInstanceVolume.update();
            break;
        case 'packages':
            await setReportData_Packages(initDate, endDate);
            chartDataPackage.datasets[0].data = actualTopClientsPackages.value;
            chartDataPackage.labels = actualTopClientsPackagesNames.value;
            chartInstancePackage.update();
            break;
        default:
            console.error(`Tipo de gráfico desconocido: ${type}`);
            break;
    }
};

//Método para descargar canvas
const downloadChart = (type) => {
    const link = document.createElement('a');
    let canvasDataUrl;
    switch (type) {
        case 'volume':
            const canvas1 = document.getElementById('bar-chart-volume');
            canvasDataUrl = canvas1.toDataURL('image/png')
            break;
        case 'packages':
            const canvas2 = document.getElementById('bar-chart-package');
            canvasDataUrl = canvas2.toDataURL('image/png');
        default:
            break;
    }
    link.href = canvasDataUrl
    link.download = 'chart.png'
    link.click()
}

//Método para descargar csv
const downloadXlsx = async (type) => {
    const link = document.createElement('a');
    let xlsxDataUrl;
    let modifiedData;
    switch (type) {
        case 'volume':
            let dataV = await setReportData_Volume(startDate_volumeSales.value, endDate_volumeSales.value);
            // Eliminar la columna 'id' de cada objeto
            modifiedData = dataV.map(item => {
                const { id, ...rest } = item;
                return rest;
            });
            break;
        case 'packages':
            let resultsP = await setReportData_Packages(startDate_packagesClient.value, endDate_packagesClient.value);
            resultsP = combinarClientes(resultsP.clientes, resultsP.top_clientes);
            // Eliminar la columna 'id' de cada objeto
            modifiedData = resultsP.map(item => {
                const { id, cliente, ...rest } = item;
                return rest;
            });
            break;
        default:
            break;
    }

    // Crear una hoja de trabajo con encabezados
    const ws = XLSX.utils.json_to_sheet(modifiedData);

    // Crear un libro de trabajo
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');

    // Generar un archivo Excel
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    // Convertir el archivo binario a un Blob
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

    // Crear una URL para descargar el archivo
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'datos.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

}
const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
};

// Función para combinar los objetos en base al ID del cliente
function combinarClientes(clientes, top_clientes) {
  return top_clientes.map(top => {
    const cliente = clientes.find(cli => cli.id === top.cliente);
    return {...cliente, ...top};
  });
}

//Metodo para comprobra que las fechas esten entre el intervalo lógico
const checkDates = (initDate, finishDate) => {
    const today = new Date();
    const fiveYearsAgo = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate());
    const minDate = fiveYearsAgo.getTime();
    const maxDate = today.getTime();
    const startDate = new Date(initDate).getTime();
    const endDate = new Date(finishDate).getTime();
    // Verificar si las fechas están dentro del intervalo
    if (startDate >= minDate && endDate <= maxDate && startDate <= endDate) {
        return true;
    } else {
        return false;
    }
}

// Opciones del gráfico
const chartOptions = {
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    }
};

// Método para inicializar el gráfico
const initChart = () => {
    const canvas = document.getElementById('bar-chart-volume');
    const canvas2 = document.getElementById('bar-chart-package');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        chartInstanceVolume = new Chart(ctx, {
            type: 'bar',
            data: chartDataVolume,
            options: chartOptions
        });
    }
    if (canvas2) {
        const ctx = canvas2.getContext('2d');
        chartInstancePackage = new Chart(ctx, {
            type: 'bar',
            data: chartDataPackage,
            options: chartOptions
        });
    }
};

</script>
<template>
    <div>
        <div class="flex items-center">
            <h1 class="text-xl font-semibold mr-4">Informe del día </h1>
            <i class="fa-solid fa-sun fa-xl"></i>
        </div>
        <div class="flex flex-wrap">
            <div class="w-full md:w-1/2 lg:w-1/2 p-4">
                <div class="bg-white rounded-lg shadow-md flex items-center justify-between p-6 h-40">
                    <div>
                        <h2 class="text-lg font-semibold text-gray-800">Prealertas recibidas hoy</h2>
                        <p class="text-3xl text-center font-bold text-blue-500 m-2">{{ prealertsToday }}</p>
                    </div>
                    <div class="flex items-center">
                        <div class="w-20 h-20 text-white rounded-full flex items-center justify-center mr-1"
                            :class="{ 'bg-red-400 ': percentagePrealertsToday < 0, 'bg-blue-500 ': percentagePrealertsToday >= 0 }">
                            {{ percentagePrealertsToday > 0 ? "+" : "" }}{{ percentagePrealertsToday }}%
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-full  md:w-1/2 lg:w-1/2 p-4">
                <div class="bg-white rounded-lg shadow-md flex items-center justify-between p-6 h-40">
                    <div>
                        <h2 class="text-lg font-semibold text-gray-800">Paquetes entregados hoy</h2>
                        <p class="text-3xl text-center font-bold text-blue-500 m-2">{{ packagesDeliveredToday }}</p>
                    </div>
                    <div class="flex items-center">
                        <div class="w-20 h-20 text-white rounded-full flex items-center justify-center mr-1"
                            :class="{ 'bg-red-400 ': percentagePackagesToday < 0, 'bg-blue-500 ': percentagePackagesToday >= 0 }">
                            {{ percentagePackagesToday > 0 ? "+" : "" }}{{ percentagePackagesToday }}%
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <hr>
        <br>
        <div class="flex items-center">
            <h1 class="text-xl font-semibold mr-4">Informes de operaciones</h1>
            <i class="fa-solid fa-chart-column fa-xl"></i>
        </div>
        <br>
        <div class="flex flex-col mx-20 md:mx-0 md:flex-row">

            <!-- Reporte de clientes con mayor volumen de compras -->
            <div class="flex content-center flex-wrap place-content-center justify-center mr-10">
                <a
                    class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:max-w-xl hover:bg-gray-100">
                    <canvas id="bar-chart-volume"
                        class="w-full rounded-t-lg h-96 md:h-auto md:rounded-none md:rounded-s-lg bg-gray-200"></canvas>
                    <div class="flex flex-col justify-between p-4 leading-normal">
                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Reporte de clientes con mayor volumen de compras.
                        </h5>
                        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                            Top de clientes que han gastado más dinero en enviar paquetes mediante SwiftShip durante un
                            período específico.
                        </p>
                        <p class="mb-3 font-semibold text-xs text-center text-gray-700 underline">
                            {{ checkDates(startDate_volumeSales, endDate_volumeSales) ? `Periodo de tiempo:
                            ${startDate_volumeSales} - ${endDate_volumeSales}` : `Periodo de tiempo: Desde el inicio de
                            los tiempos a la actualidad` }}
                        </p>
                        <div class="flex justify-evenly">
                            <input type="date" v-model="startDate_volumeSales"
                                @input="generateChart(startDate_volumeSales, endDate_volumeSales, 'volume')"
                                class="border border-gray-300 rounded px-3 py-1" :min="minDate" :max="maxDate">
                            <input type="date" v-model="endDate_volumeSales"
                                @input="generateChart(startDate_volumeSales, endDate_volumeSales, 'volume')"
                                class="border border-gray-300 rounded px-3 py-1" :min="minDate" :max="maxDate">
                        </div>
                        <div
                            v-if="!checkDates(startDate_volumeSales, endDate_volumeSales) && (startDate_volumeSales || endDate_volumeSales)">
                            <p class="text-red-400 text-[0.6rem] mt-2 text-center">
                                El período de tiempo seleccionado no es válido. Se mostrarán los datos desde el inicio
                                del registro.
                            </p>
                        </div>
                        <div class="mt-4">
                            <div class="flex justify-center">
                                <button title="Descargar excel" @click="downloadXlsx('volume')"
                                    :disabled="!checkDates(startDate_volumeSales, endDate_volumeSales)"
                                    class="p-2 px-3 bg-blue-500 text-white rounded-l-xl disabled:bg-gray-400 hover:bg-blue-700">
                                    <i class="fa-solid fa-file-excel text-2xl"></i>
                                </button>
                                <button title="Periodo desde el inicio de los tiempos"
                                    @click="setDatesFromStartOfTimes('volume')"
                                    class="p-2 px-3 bg-blue-500 text-white border-x-2 disabled:bg-gray-400 border-white hover:bg-blue-700">
                                    <i class="fa-solid fa-calendar-days text-2xl"></i>
                                </button>
                                <button title="Descargar imágen" @click="downloadChart('volume')"
                                    :disabled="!checkDates(startDate_volumeSales, endDate_volumeSales)"
                                    class="p-2 px-3 bg-blue-500 text-white rounded-r-xl disabled:bg-gray-400 hover:bg-blue-700">
                                    <i class="fa-solid fa-image text-2xl "></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </a>
            </div>


            <!-- Reporte de clientes con mayor cantidad de paquetes -->
            <div class="flex content-center flex-wrap place-content-center justify-center">
                <a
                    class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:max-w-xl hover:bg-gray-100">
                    <canvas id="bar-chart-package"
                        class="w-full rounded-t-lg h-96 md:h-auto md:rounded-none md:rounded-s-lg bg-gray-200"></canvas>
                    <div class="flex flex-col justify-between p-4 leading-normal">
                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Reporte de clientes con mayor cantidad de paquetes.
                        </h5>
                        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                            Top de clientes que han solicitado la mayor cantidad de envíos de paquetes mediante
                            SwiftShip durante un período específico.
                        </p>
                        <p class="mb-3 font-semibold text-xs text-center text-gray-700 underline">
                            {{ checkDates(startDate_packagesClient, endDate_packagesClient) ? `Periodo de tiempo:
                            ${startDate_packagesClient} - ${endDate_packagesClient}` : `Periodo de tiempo: Desde el
                            inicio de los tiempos a la actualidad` }}
                        </p>
                        <div class="flex justify-center">
                            <input type="date" v-model="startDate_packagesClient"
                                @input="generateChart(startDate_packagesClient, endDate_packagesClient, 'packages')"
                                class="border border-gray-300 rounded px-3 py-1" :min="minDate" :max="maxDate">
                            <input type="date" v-model="endDate_packagesClient"
                                @input="generateChart(startDate_packagesClient, endDate_packagesClient, 'packages')"
                                class="border border-gray-300 rounded px-3 py-1" :min="minDate" :max="maxDate">
                        </div>
                        <div
                            v-if="!checkDates(startDate_packagesClient, endDate_packagesClient) && (startDate_packagesClient || endDate_packagesClient)">
                            <p class="text-red-400 text-[0.6rem] mt-2 text-center">
                                El período de tiempo seleccionado no es válido. Se mostrarán los datos desde el inicio
                                del registro.
                            </p>
                        </div>
                        <div class="mt-4">
                            <div class="flex justify-center">
                                <button title="Descargar excel" @click="downloadXlsx('packages')"
                                    :disabled="!checkDates(startDate_packagesClient, endDate_packagesClient)"
                                    class="p-2 px-3 bg-blue-500 text-white rounded-l-xl disabled:bg-gray-400 hover:bg-blue-700">
                                    <i class="fa-solid fa-file-excel text-2xl"></i>
                                </button>
                                <button title="Periodo desde el inicio de los tiempos"
                                    @click="setDatesFromStartOfTimes('packages')"
                                    class="p-2 px-3 bg-blue-500 text-white border-x-2 border-white hover:bg-blue-700">
                                    <i class="fa-solid fa-calendar-days text-2xl"></i>
                                </button>
                                <button title="Descargar imágen" @click="downloadChart('packages')"
                                    :disabled="!checkDates(startDate_packagesClient, endDate_packagesClient)"
                                    class="p-2 px-3 bg-blue-500 text-white rounded-r-xl disabled:bg-gray-400 hover:bg-blue-700">
                                    <i class="fa-solid fa-image text-2xl "></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        </div>

    </div>

</template>