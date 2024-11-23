export const calculateElapsedTime = (hourOpen) => {
    // Crear un objeto Date con la hora de punch-in
    const [hour, minute] = hourOpen.split(':').map(Number); // Si el formato es HH:mm
    const punchInTime = new Date();
    punchInTime.setHours(hour, minute, 0, 0); // Añadir horas y minutos
  
    // Hora actual
    const now = new Date();
  
    // Diferencia en milisegundos
    const elapsedMs = now - punchInTime;
  
    // Convertir a horas y minutos
    const elapsedHours = Math.floor(elapsedMs / (1000 * 60 * 60));
    const elapsedMinutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
  
    return `${elapsedHours}h ${elapsedMinutes}m`;
};