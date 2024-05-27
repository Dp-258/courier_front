import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useEmployeeStore = defineStore('employee', () => {
    const getPrealertsByStatus = async (status) => {
        const response = await fetch(`http://127.0.0.1:3000/pedidos/status/${status}`, {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        if (!response.ok) {
            console.log('No se encontraron paquetes pendientes');
        }
        let prealerts = await response.json();
        return prealerts;
    }

    const getPackageByStatusExclude = async (status) => {
        const response = await fetch(`http://127.0.0.1:3000/paquetes/notStatus/${status}`, {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        if (!response.ok) {
            console.log('No se encontraron paquetes pendientes');
        }
        let packages = await response.json();
        return packages;
    }

    const modifyPrealert = async (id, cliente_id, employee_email, freightCost , weight , tipePackage , status, observation, paymentVoucher,address,city, postal_num) => {
        const response = await fetch(`http://127.0.0.1:3000/pedidos/changestatus/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "cliente_id": cliente_id,
                "employee_email": employee_email,
                "freight_cost": freightCost,
                "weight": weight,
                "category": tipePackage,
                "order_status": status,
                "observation":observation,
                "payment_voucher":paymentVoucher,
                "address": address,
                "city": city,
                "postal_num": postal_num,
            })
        });
        return response;
    }

    const modifyPackageStatus = async (id, status, employee_email, observation ) => {
        const response = await fetch(`http://127.0.0.1:3000/paquetes/changestatus/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "employee_email":employee_email,
                "package_status": status,
                "observation": observation
            })
        });
        return response;
    }

    return {
        getPrealertsByStatus, getPackageByStatusExclude, modifyPrealert, modifyPackageStatus,
    };
});