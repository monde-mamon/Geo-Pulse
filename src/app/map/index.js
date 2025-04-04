import 'react-native-get-random-values';
import { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
  Button,
  ScrollView,
  AppState,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { BlurView } from 'expo-blur';
import { LocateFixedIcon, SunIcon, MoonIcon } from 'lucide-react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useDisplayAddress } from '../../hooks/useDisplayAddress';
import { mapCustomStyle } from '../../constants/map';
import { useTheme } from '../../hooks/useTheme';
import { styles } from './styles';

const GOOGLE_PLACES_API_KEY = ''; // never save your real api key in a snack!

const MapScreen = () => {
  const [markerLocation, setMarkerLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState(null);
  const [isLocationServiceEnabled, setLocationServiceEnabled] = useState(true);
  const mapRef = useRef(null);
  const autoCompleteRef = useRef(null);

  const { toggleTheme, theme } = useTheme();
  const { generateAddress } = useDisplayAddress();
  const appState = useRef(AppState.currentState);

  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async (nextAppState) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
            setLocationServiceEnabled(true);
          } else {
            setLocationServiceEnabled(false);
          }
        }

        appState.current = nextAppState;
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    checkIfLocationEnabled();
  }, [checkIfLocationEnabled]);

  const checkIfLocationEnabled = useCallback(async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLocationServiceEnabled(false);

      Alert.alert(
        'Location Service not enabled',
        'Please enable your location services to continue',
        [{ text: 'OK', onPress: handleOnPressGoToSettings }],
        { cancelable: false }
      );

      return;
    }
    setLocationServiceEnabled(true);

    const location = await Location.getCurrentPositionAsync({});
    const { coords } = location;
    const { latitude, longitude } = coords;

    if (latitude && longitude) {
      setCurrentLocation({
        latitude: latitude,
        longitude: longitude,
      });
      setRegion({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      handleCommonFunctions({ latitude, longitude });
    }
  }, [handleCommonFunctions, handleOnPressGoToSettings]);

  const handleOnPressCenterOnUser = async () => {
    if (currentLocation) {
      const latitude = currentLocation.latitude;
      const longitude = currentLocation.longitude;

      handleCommonFunctions({ latitude, longitude });
    }
  };

  const handleOnPressResults = (details) => {
    const latitude = details.geometry.location.lat;
    const longitude = details.geometry.location.lng;

    handleCommonFunctions({ latitude, longitude });
  };

  const handleCommonFunctions = useCallback(
    async ({ latitude, longitude }) => {
      setMarkerLocation({
        latitude: latitude,
        longitude: longitude,
      });

      mapRef?.current?.animateToRegion({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      const address = await generateAddress({ latitude, longitude });
      setDisplayCurrentAddress(address);
      autoCompleteRef?.current?.clear();
    },
    [generateAddress]
  );

  const handleOnPressGoToSettings = useCallback(() => {
    setLocationServiceEnabled(false);

    Linking.openSettings();
  }, []);

  if (!isLocationServiceEnabled) {
    return (
      <View style={styles.locationDisabledContainer}>
        <StatusBar style="dark" />
        <Text style={styles.errorText}>
          Please enable your location services to continue
        </Text>
        <Button
          title="Go to Settings to enable your location"
          onPress={handleOnPressGoToSettings}
        />
      </View>
    );
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps={'handled'}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={styles.container}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} animated />
        {/* Main component */}
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          showsUserLocation
          showsCompass={true}
          region={region}
          onRegionChangeComplete={setRegion}
          customMapStyle={theme === 'light' ? [] : mapCustomStyle}
          userInterfaceStyle={theme}
        >
          {markerLocation && (
            <Marker
              coordinate={{
                latitude: markerLocation.latitude,
                longitude: markerLocation.longitude,
              }}
            />
          )}
        </MapView>
        {/* Location Info Panel */}
        <BlurView intensity={70} style={styles.locationInfo}>
          <GooglePlacesAutocomplete
            ref={autoCompleteRef}
            placeholder="Search Places"
            onPress={(data, details = null) => {
              console.log(Platform.OS, data, details);
              handleOnPressResults(details);
            }}
            query={{
              key: GOOGLE_PLACES_API_KEY,
              language: 'en',
            }}
            GooglePlacesDetailsQuery={{ fields: 'geometry' }}
            fetchDetails={true}
            onFail={(error) => console.error(error)}
          />

          {displayCurrentAddress && (
            <View style={styles.locationContent}>
              <Text style={styles.locationTitle}>Current Location</Text>
              <Text style={styles.coordinates}>{displayCurrentAddress}</Text>
            </View>
          )}
        </BlurView>

        {/* Controls */}
        <View style={styles.controls}>
          {theme === 'dark' && (
            <>
              <TouchableOpacity
                style={styles.controlButtonLight}
                onPress={toggleTheme}
              >
                <SunIcon size={24} color="#2563eb" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.controlButtonLight}
                onPress={handleOnPressCenterOnUser}
              >
                <LocateFixedIcon size={24} color="#2563eb" />
              </TouchableOpacity>
            </>
          )}
          {theme === 'light' && (
            <>
              <TouchableOpacity
                style={styles.controlButtonDark}
                onPress={toggleTheme}
              >
                <MoonIcon size={24} color="#2563eb" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.controlButtonDark}
                onPress={handleOnPressCenterOnUser}
              >
                <LocateFixedIcon size={24} color="#2563eb" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
};
export default MapScreen;
