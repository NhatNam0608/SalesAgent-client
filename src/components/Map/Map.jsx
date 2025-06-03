import axios from 'axios';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker, Circle, Autocomplete } from '@react-google-maps/api';
import './Map.css';


const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 10.8576088,
  lng: 106.6961099,
};

const MAP_KEY = process.env.REACT_APP_MAP_KEY;
const BASE_URL = process.env.REACT_APP_API_BASE;

const GGMap = ({ toast }) => {
  const [center, setCenter] = useState(defaultCenter);
  const [mainMarkerPosition, setMainMarkerPosition] = useState(defaultCenter);
  const [factoryMarkers, setFactoryMarkers] = useState([]);
  const [hasChecked, setHasChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const autocompleteRef = useRef(null);
  const navigate = useNavigate(); 

  const onPlaceChanged = () => {
    if (!autocompleteRef.current) return;
  
    const place = autocompleteRef.current.getPlace();
  
    if (!place || !place.geometry || typeof place.geometry.location?.lat !== 'function') {
      return;
    }
  
    const location = place.geometry.location;
    const newCenter = {
      lat: location.lat(),
      lng: location.lng(),
  };
  
    setCenter(newCenter);
    setMainMarkerPosition(newCenter);
  };

  const handleMapLoad = (map) => {
    map.setOptions({
      mapTypeControl: true,
      mapTypeId: 'roadmap',
      mapTypeControlOptions: {
        style: window.google.maps.MapTypeControlStyle.DEFAULT,
        position: window.google.maps.ControlPosition.TOP_RIGHT
      }
    });
  };

  const createIcon = (url) => {
    if (window.google && window.google.maps) {
      return {
        url,
        scaledSize: new window.google.maps.Size(38, 38),
      };
    }
    return { url };
  };

  const fetchFactories = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${BASE_URL}/map-factories/get-nearby`,
          '',
          {
            params: {
              lat: mainMarkerPosition.lat,
              lon: mainMarkerPosition.lng,
              radius: 1000,
            },
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setFactoryMarkers(response.data);
        setHasChecked(false);
        toast.success('Fetched nearby factories!');
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error("Session expired. Redirecting to login...");
          navigate('/login'); // hoặc '/auth' tùy route
        } else {
          toast.error("Can't get factories. Please try again!");
        }
      } finally {
        setLoading(false);
      }
    };

  const checkSolarPanels = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/map-factories/check-solar-panels`,
        factoryMarkers,
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setFactoryMarkers(response.data);
      setHasChecked(true);
      toast.success('Solar panel check completed!');
    } catch (error) {
      toast.error("Can't check solar panels!");
    } finally {
      setLoading(false);
    }
  };

  const saveFactories = async () => {
    const factoriesWithoutSolar = factoryMarkers.filter(f => f.with_solar_panel === 0);
    if (factoriesWithoutSolar.length === 0) {
      toast.info('No factories without solar panels to save.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/linkedin-factories/add-new`,
        factoriesWithoutSolar,
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (res.status === 200) {
        const message = `Added ${res.data?.total_added} new factories, ${res.data?.total_skipped} existed`;
        toast.success(message || "Factories saved successfully");
      } else {
        toast.error("Unexpected response from server");
      }
      setFactoryMarkers([]);
      setHasChecked(false);
    } catch (error) {
      toast.error("Can't save factories!");
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = (e) => {
    const newPosition = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setMainMarkerPosition(newPosition);
  };

  const getFactoryMarkerIcon = (factory) => {
    if (factory.with_solar_panel === 1) {
      return 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
    } else if (factory.with_solar_panel === 0) {
      return 'https://maps.google.com/mapfiles/ms/icons/green-dot.png';
    }
    return 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';
  };

  return (
    <LoadScript googleMapsApiKey={MAP_KEY} libraries={['places']} language="en">
      <div className="map-wrapper">
        {loading && (
          <div className="map-loading-overlay">
            <div className="map-loader"></div>
          </div>
        )}

        <div className="map-search">
          <Autocomplete
            onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
            onPlaceChanged={onPlaceChanged}
          >
            <input
              type="text"
              placeholder="Search for a location"
              className="map-input"
            />
          </Autocomplete>
        </div>
        <div className='map'>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15}
            onClick={handleMapClick}
            onLoad={handleMapLoad}
          >
            <Marker
              position={mainMarkerPosition}
              icon={createIcon('https://maps.google.com/mapfiles/ms/icons/red-dot.png')}
            />
            <Circle
              center={mainMarkerPosition}
              radius={1000} // 1000 meters = 1 km
              options={{
                strokeColor: '#0088ff',
                strokeOpacity: 0.8,
                strokeWeight: 1,
                fillColor: '#0088ff',
                fillOpacity: 0.1,
                clickable: false,
                draggable: false,
                editable: false,
                visible: true,
                zIndex: 1,
              }}
            />
            {factoryMarkers.map((factory, index) => (
              <Marker
                key={index}
                position={factory.location}
                title={factory.name}
                icon={createIcon(getFactoryMarkerIcon(factory))}
              />
            ))}
          </GoogleMap>
        </div>

        <div className="map-controls">
          <button onClick={fetchFactories} className="map-button">
            Get Nearby Factories
          </button>
          <button
            onClick={checkSolarPanels}
            className="map-button"
            disabled={factoryMarkers.length === 0}
          >
            Check Factories
          </button>
          <button
            onClick={saveFactories}
            className="map-button"
            disabled={!hasChecked}
          >
            Save Factories
          </button>
        </div>
      </div>
    </LoadScript>
  );
};

export default GGMap;
