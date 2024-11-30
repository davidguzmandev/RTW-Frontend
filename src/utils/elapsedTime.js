export const calculateElapsedTime = (hourOpen, openDate) => {
  // Crear un objeto Date con la fecha y hora de punch-in
  const [hour, minute] = hourOpen.split(":").map(Number);
  const [year, month, day] = openDate.split("-").map(Number); // Si el formato es YYYY-MM-DD

  const punchInTime = new Date(year, month - 1, day, hour, minute, 0); // Crear la fecha/hora de punch-in

  // Hora actual
  const now = new Date();

  // Diferencia en milisegundos
  const elapsedMs = now - punchInTime;

  if (elapsedMs < 0) {
    return "Punch-in time is in the future";
  }

  // Convertir a horas y minutos
  const totalMinutes = Math.floor(elapsedMs / (1000 * 60));
  const elapsedHours = Math.floor(totalMinutes / 60);
  const elapsedMinutes = totalMinutes % 60;

  return `${elapsedHours}h ${elapsedMinutes}m`;
};
