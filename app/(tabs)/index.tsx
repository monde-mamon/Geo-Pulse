import { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { BlurView } from 'expo-blur';
import { LocateFixedIcon } from 'lucide-react-native';

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const mapRef = useRef<MapView | null>(null);

  const [displayCurrentAddress, setDisplayCurrentAddress] = useState<
    string | null
  >(null);
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let { coords } = location;
      if (coords) {
        const { latitude, longitude } = coords;
        let response = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        for (let item of response) {
          let address = `${item.name}, ${item.street}, ${item.postalCode}, ${item.city}`;

          setDisplayCurrentAddress(address);
        }
      }
      setLocation(location);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  useEffect(() => {
    CheckIfLocationEnabled();
  }, []);

  const CheckIfLocationEnabled = async () => {
    let enabled = await Location.hasServicesEnabledAsync();

    if (!enabled) {
      Alert.alert(
        'Location Service not enabled',
        'Please enable your location services to continue',
        [{ text: 'OK' }],
        { cancelable: false }
      );
    } else {
      // setLocationServiceEnabled(enabled);
    }
  };

  const handleOnPressCenterOnUser = () => {
    if (location) {
      mapRef.current?.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={true}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
          />
        )}
      </MapView>

      {/* Location Info Panel */}
      <BlurView intensity={70} style={styles.locationInfo}>
        <View style={styles.locationContent}>
          <Text style={styles.locationTitle}>Current Location</Text>
          <Text style={styles.coordinates}>{displayCurrentAddress}</Text>
        </View>
      </BlurView>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleOnPressCenterOnUser}
        >
          <LocateFixedIcon size={24} color="#2563eb" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  locationInfo: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    overflow: 'hidden',
  },
  locationContent: {
    padding: 15,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  coordinates: {
    fontSize: 14,
    color: '#4b5563',
  },
  controls: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    gap: 10,
  },
  controlButton: {
    // width: 45,
    // height: 45,
    flex: 1,
    padding: 10,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 20,
  },
});
