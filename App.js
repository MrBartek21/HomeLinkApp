import React, { useState, useEffect } from 'react';
import { View, Text, Button, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import DeviceInfo from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';

const App = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [location, setLocation] = useState(null);
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [wifiState, setWifiState] = useState(null);
  const [gsmState, setGsmState] = useState(null);
  const [isOptionsModalVisible, setOptionsModalVisible] = useState(false);

  useEffect(() => {
    // Pobieranie lokalizacji po kliknięciu user1 lub user2
    if (selectedOption === 'user1' || selectedOption === 'user2') {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setLocation(`Latitude: ${latitude}, Longitude: ${longitude}`);
        },
        error => alert(error.message),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    }

    // Pobieranie informacji o stanie baterii
    DeviceInfo.getBatteryLevel().then(level => {
      setBatteryLevel(`Battery Level: ${level * 100}%`);
    });

    // Pobieranie informacji o stanie WiFi
    NetInfo.fetch().then(state => {
      setWifiState(`Wi-Fi State: ${state.isConnected ? 'Connected' : 'Disconnected'}`);
    });

    // Pobieranie informacji o stanie GSM (dostępne tylko na niektórych platformach)
    DeviceInfo.getPhoneNumber().then(phoneNumber => {
      setGsmState(`GSM State: ${phoneNumber ? 'Connected' : 'Disconnected'}`);
    });
  }, [selectedOption]);

  const handleButtonClick = option => {
    // Zapamiętanie wybranej opcji
    setSelectedOption(option);
  };

  const handleOptionsPress = () => {
    // Pokazanie/ukrycie modala z opcjami
    setOptionsModalVisible(!isOptionsModalVisible);
  };

  const handleOptionChange = option => {
    // Zmiana opcji po kliknięciu w modalu
    setSelectedOption(option);
    setOptionsModalVisible(false);
  };

  return (
    <View>
      <Text>Wybierz opcję:</Text>
      <Button title="User1" onPress={() => handleButtonClick('user1')} />
      <Button title="User2" onPress={() => handleButtonClick('user2')} />
      <Button title="Tablet" onPress={() => handleButtonClick('tablet')} />
      {location && <Text>{location}</Text>}
      {batteryLevel && <Text>{batteryLevel}</Text>}
      {wifiState && <Text>{wifiState}</Text>}
      {gsmState && <Text>{gsmState}</Text>}

      <View style={styles.optionsBar}>
        <TouchableOpacity onPress={handleOptionsPress} style={styles.optionsButton}>
          <Text>Opcje</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isOptionsModalVisible}
        onRequestClose={() => setOptionsModalVisible(false)}>
        <View style={styles.modal}>
          <TouchableOpacity onPress={() => handleOptionChange('user1')} style={styles.modalOption}>
            <Text>User1</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleOptionChange('user2')} style={styles.modalOption}>
            <Text>User2</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleOptionChange('tablet')} style={styles.modalOption}>
            <Text>Tablet</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setOptionsModalVisible(false)} style={styles.modalOption}>
            <Text>Anuluj</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  optionsBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    marginRight: 10,
  },
  optionsButton: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOption: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    alignItems: 'center',
  },
});

export default App;
