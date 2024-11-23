import moment from "moment-timezone";

export const handlePunchOut = async (recordId, location, API_URL, setMatchingRecords, matchingRecords) => {
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    // Fecha actual en la zona horaria local
    const currentDateLocal = moment()
      .tz("America/New_York")
      .format("YYYY-MM-DD");
    const punchOutData = {
      id: recordId, // Incluye el ID del registro
      punchOutTime: time,
      punchOutLocation: location,
      punchOutDate: currentDateLocal,
      open: false,
    };

    try {
      await fetch(`${API_URL}/timePunchOut`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(punchOutData),
      });

      // Actualizar el estado del componente para eliminar el registro del DOM
      setMatchingRecords(
        matchingRecords.filter((record) => record.id !== recordId)
      );
    } catch (error) {
      console.error("Error al registrar el punch-out:", error);
    }
  };