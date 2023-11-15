// import React, { useState, useEffect } from "react";
// import { Text, TextInput, View, Button, Alert, StyleSheet } from "react-native";
// import axios from "axios";
// import { Table, Row } from 'react-native-table-component';

// const DeviceScreen = () => {
//   const [deviceName, setDeviceName] = useState("");
//   const [macAddress, setMacAddress] = useState("");
//   const [devices, setDevices] = useState([]);
//   const tableHead = ['Id', 'Device Name', 'Device ID'];
//   const tableData = devices.map((item) => [item.id, item.deviceName, item.deviceId]);

//   useEffect(() => {
//     // Fetch the list of devices when the component mounts
//     fetchDevices();
//   }, []);

//   const fetchDevices = async () => {
//     try {
//       const response = await axios.get('http://66.169.158.106:5000/api/getAll');
//       setDevices(response.data.data); // Assuming the response is an array of devices
//     } catch (error) {
//       console.error('Error fetching devices:', error);
//     }
//   };

//   const addDevice = async () => {
//     if (!deviceName || !macAddress) {
//       Alert.alert("Error", "Device name and MAC address cannot be empty");
//       return;
//     }

//     try {
//       // Send a POST request to add the device
//       const response = await axios.post('http://66.169.158.106:5000/api/add', {
//         deviceName: deviceName,
//         deviceId: macAddress,
//       });

//       setDeviceName(''); // Clear the deviceName input
//       setMacAddress(''); // Clear the MAC address input
//       fetchDevices(); // Fetch the updated list of devices
//       console.log('Device added successfully:', response.data); // Log the response
//     } catch (error) {
//       console.error('Error adding device:', error);
//       Alert.alert("Error", "Failed to add the device. Check the console for details.");
//     }
//   };

//   return (
//     <View>
//         <View style={styles.input}>
//       <TextInput 
//        style={{ color: "purple", width: "50%"}}
//         placeholder="Enter Device Name"
//         placeholderTextColor="darkgrey"
//         value={deviceName}
//         onChangeText={(text) => setDeviceName(text)}
//       />
//       </View>
//       <View style={styles.input}>
//       <TextInput
//       style={{ color: "purple", width: "50%"}}
//         placeholder="Enter MAC address"
//         placeholderTextColor="darkgrey"
//         value={macAddress}
//         onChangeText={(text) => setMacAddress(text)}
//       />
//       </View>
//       <View style={styles.wrapper}>
//       <Button title="Add" onPress={addDevice} />
//       </View>
      
//       <Text style={{ height: 30, color:"midnightblue" , fontWeight: 'bold',marginTop:10,  textAlign:"center"}}>Added Devices:</Text>
// <Table borderStyle={{ borderWidth: 1, borderColor: 'black' }}>
//   <Row data={tableHead} style={{ height: 40, backgroundColor: '#f1f8ff' }} textStyle={{ fontWeight: 'bold', margin: 6, textAlign: 'center', color: 'blue' }} />
//   {tableData.map((rowData, index) => (
//     <Row
//       key={index}
//       data={rowData}
//       style={{ height: 50 , width:"100%"}}
//       textStyle={{ margin: 6, textAlign: 'left', color: 'black', fontWeight: 'bold', justifyContent:"center" }}
//     />
//   ))}
// </Table>

//     </View>
//   );
// };

// const styles = StyleSheet.create({
//     container:{
//         flex:1,
//         alignItems: "center"
//     },
//     wrapper : {
//         width : "80%",
//         marginLeft:40
//     },
//     input: {
//         marginBottom: 12,
//         borderWidth: 1,
//         borderColor: "blue",
//         borderRadius: 5,
//         width : "80%",
//         marginLeft:40,
//     }
// })

// export default DeviceScreen;


import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Alert, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import { Table, Row } from 'react-native-table-component';
import { RNCamera } from 'react-native-camera';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const DeviceScreen = () => {
  const [deviceName, setDeviceName] = useState('');
  const [macAddress, setMacAddress] = useState('');
  const [devices, setDevices] = useState([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const cameraRef = useRef(null);

  const tableHead = ['Id', 'Device Name', 'Device ID'];
  const tableData = devices.map((item) => [item.id, item.deviceName, item.deviceId]);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await axios.get('http://66.169.158.106:5000/api/getAll');
      setDevices(response.data.data);
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  };

  const addDevice = async () => {
    if (!deviceName || !macAddress) {
      Alert.alert('Error', 'Device name and MAC address cannot be empty');
      return;
    }

    try {
      const response = await axios.post('http://66.169.158.106:5000/api/add', {
        deviceName: deviceName,
        deviceId: macAddress,
      });

      setDeviceName('');
      setMacAddress('');
      fetchDevices();
      console.log('Device added successfully:', response.data);
    } catch (error) {
      console.error('Error adding device:', error);
      Alert.alert('Error', 'Failed to add the device. Check the console for details.');
    }
  };

  const handleBarCodeScanned = ({ data }) => {
    setMacAddress(data);
    setIsCameraOpen(false);
  };

  const openCamera = () => {
    setIsCameraOpen(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isCameraOpen ? (
        <View style={styles.cameraContainer}>
          <RNCamera
            ref={cameraRef}
            style={styles.cameraPreview}
            onBarCodeRead={handleBarCodeScanned}
          >
            <Text style={styles.cameraText}>Scan the barcode</Text>
          </RNCamera>
        </View>
      ) : (
        <View>
          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.inputField}
              placeholder="Enter MAC address"
              placeholderTextColor="darkgrey"
              value={macAddress}
              onChangeText={(text) => setMacAddress(text)}
            />
            <TouchableOpacity onPress={openCamera} style={styles.scanIcon}>
              <Text>📷</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.input}>
            <TextInput
              style={{ color: 'purple', width: '100%' }}
              placeholder="Enter Device Name"
              placeholderTextColor="darkgrey"
              value={deviceName}
              onChangeText={(text) => setDeviceName(text)}
            />
          </View>
          <View style={{paddingTop:10}}> 
          <Button title="Add" onPress={addDevice}  />
          </View>
        </View>
      )}

      <Text style={styles.header}>Added Devices:</Text>
      <Table borderStyle={{ borderWidth: 1, borderColor: 'black' }}>
        <Row data={tableHead} style={styles.tableHeader} textStyle={styles.headerText} />
        {tableData.map((rowData, index) => (
          <Row key={index} data={rowData} style={styles.tableRow} textStyle={styles.rowText} />
        ))}
      </Table>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputField: {
    flex: 1,
    color: 'purple',
    // width: '100%',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    height: 40,
  },
  scanIcon: {
    width: '20%',
    alignItems: 'right',
    justifyContent: 'center',
  },
  input: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    // width: '100%',
    height: 40,
  },
  tableHeader: {
    height: 40,
    backgroundColor: '#f1f8ff',
  },
  headerText: {
    fontWeight: 'bold',
    margin: 6,
    textAlign: 'center',
    color: 'blue',
  },
  header: {
    height: 30,
    color: 'midnightblue',
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  tableRow: {
    height: 30,
    width: '100%',
  },
  rowText: {
    margin: 6,
    textAlign: 'left',
    color: 'black',
    fontWeight: 'bold',
    justifyContent: 'center',
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraPreview: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  cameraText: {
    position: 'absolute',
    top: 10,
    left: 10,
    color: 'white',
  },
});

export default DeviceScreen;

