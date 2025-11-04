
export const environment = {
  production: false,
  apiUrl:
    window && window.location && window.location.hostname === 'localhost'
      ? 'http://localhost:3000'
      : 'https://uavdocx.policloudservices.ipm.edu.ar/'
};
