import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useUserStore = defineStore('user', () => {
    const email = ref();
    const userData = ref();
    const jwt = ref();
    const role = ref();

    const getUserInfo = async () => {
        const response = await fetch('http://127.0.0.1:8000/api/user', {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Hubo un problema al obtener los datos del usuario.');
        }
        userData.value = await response.json();
        email.value = userData.value.email;
        let response2 = await getClientInfo();
        if (response2.locker_code) {
            role.value = "client";
        } else {
            role.value = "employee";
        }
    }

    const getClientInfo = async () => {
        const response = await fetch(`http://127.0.0.1:3000/client/${email.value}`, {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        return await response.json();
    }

    const getClientInfoById = async (pk) => {
        console.log(pk);
        const response = await fetch(`http://127.0.0.1:3000/client/id/${pk}`, {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        return await response.json();
    }

    const uploadProofPayment = async (data,id) => {
        const response = await fetch(`http://127.0.0.1:3000/paquetes/edit/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'proof_payment_voucher':data,
            })
        });
        return response;
    }

    return {
        email, userData, jwt, role,
        getUserInfo, getClientInfo, getClientInfoById, uploadProofPayment,
    };
});