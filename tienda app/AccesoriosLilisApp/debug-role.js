// Script para debuggear el rol enviado por el backend
const API_BASE_URL = 'http://localhost:7147/api';

async function testLogin() {
    try {
        const response = await fetch(`${API_BASE_URL}/Auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'brayanstidcorteslombana@gmail.com',
                password: 'bscl2006'
            })
        });

        const data = await response.json();
        console.log('🔍 Login response:', JSON.stringify(data, null, 2));
        
        if (data.user) {
            console.log('👤 User object:', data.user);
            console.log('🔑 User role:', data.user.role);
            console.log('🔗 User rolId:', data.user.rolId);
        }
        
        // Decodificar el JWT para ver el rol
        if (data.token) {
            const token = data.token;
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log('🎫 JWT payload:', payload);
            console.log('🔐 JWT role:', payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

testLogin();
