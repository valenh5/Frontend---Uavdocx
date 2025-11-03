
export const environment = {
  production: false,
  apiUrl:
    window && window.location && window.location.hostname === 'localhost'
      ? 'http://localhost:3000'
      : 'http://uavdocx-backend-2nzhgo-1718e0-186-153-57-93.traefik.me'
};
