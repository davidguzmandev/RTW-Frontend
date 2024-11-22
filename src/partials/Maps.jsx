import { useLoadScript } from "@react-google-maps/api";
import { useState, useEffect, useRef } from "react";
import { fetchLocation } from '../functions/fetchLocation'; // Asegúrate de que la función fetchLocation esté bien importada

// Define las bibliotecas como una constante fuera del componente
const libraries = ["places", "geometry", "marker"]; // Agrega otras si las necesitas

const Maps = () => {
  const API_MAPS = import.meta.env.VITE_API_KEY_MAPS;

  const [center, setCenter] = useState({ lat: -73.5626686, lng: 45.5032363 }); // Estado inicial

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: API_MAPS,
    libraries, // Usa la constante estática definida fuera
    version: "weekly",
  });

  const mapRef = useRef(null);

  useEffect(() => {
    // Obtener ubicación del usuario
    const getLocation = async () => {
      try {
        const { latitude, longitude } = await fetchLocation();
        // Actualizar el estado con la ubicación obtenida
        setCenter({ lat: latitude, lng: longitude });
      } catch (error) {
        console.error("Error al obtener la ubicación:", error);
      }
    };

    getLocation(); // Llamamos a la función asíncrona para obtener la ubicación

  }, []); // Solo se ejecuta al montar el componente

  useEffect(() => {
    if (!isLoaded || !window.google) return;

    // Inicializa el mapa manualmente con los valores de center
    const map = new google.maps.Map(mapRef.current, {
      center,
      zoom: 14,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      scaleControl: false,
      rotateControl: false,
      disableDefaultUI: true,
    });

    // Agregar marcador en el centro del mapa
    new google.maps.Marker({
      position: center,
      map,
      title: "Ubicación del usuario",
    });
  }, [isLoaded, center]); // El efecto se ejecutará cuando isLoaded o center cambien

  if (!isLoaded) return <div>Loading...</div>;

  return <div ref={mapRef} className="w-full h-[600px] fixed bg-cover bg-center"/>;
};

export default Maps;
