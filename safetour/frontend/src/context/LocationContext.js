import { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
          setLoading(false);
        },
        (err) => {
          setLocationError('Location access denied. Some features limited.');
          setLoading(false);
        }
      );
    } else {
      setLocationError('Geolocation not supported.');
      setLoading(false);
    }
  }, []);

  return (
    <LocationContext.Provider value={{ location, locationError, loading }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
