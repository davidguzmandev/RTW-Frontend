export const fetchLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          resolve(location); // Resuelve la promesa con la ubicación
        },
        (error) => {
          reject(`Error al obtener la ubicación: ${error.message}`);
        }
      );
    } else {
      reject("La geolocalización no es soportada en este navegador.");
    }
  });
};
