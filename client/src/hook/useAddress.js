import { useState, useEffect } from "react";

const useAddress = () => {
  const [address, setAddress] = useState("");
  const [userPosition, setUserPosition] = useState(null); // Initialize as null for better checking
  const [error, setError] = useState(null); // For error handling

  useEffect(() => {
    const fetchPosition = () => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser.");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          setError(`Error obtaining location: ${err.message}`);
        }
      );
    };
    fetchPosition();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!userPosition) return; // Wait until userPosition is set

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${userPosition.lat}&lon=${userPosition.lng}&addressdetails=1`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setAddress(data.display_name || "Address not found");
      } catch (error) {
        console.error("Error fetching location:", error);
        setError("Failed to fetch address.");
      }
    };

    fetchData();
  }, [userPosition]);

  return { address, userPosition, error }; // Return error for handling in components
};

export default useAddress;
