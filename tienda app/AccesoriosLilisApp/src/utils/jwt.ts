// Utilidad para decodificar JWT
export const decodeJWT = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// Función para extraer el rol desde el JWT
export const extractRoleFromJWT = (token: string): 'admin' | 'user' => {
  try {
    const payload = decodeJWT(token);
    if (payload) {
      const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      console.log('🎫 JWT role extracted:', role);
      
      // Mapear el rol desde el JWT
      if (role === 'Admin' || role === 'admin' || role === 'ADMIN') {
        return 'admin';
      }
    }
  } catch (error) {
    console.error('Error extracting role from JWT:', error);
  }
  return 'user';
};
