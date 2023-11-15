// // import React from "react";
// // import { TextInput, Text, View } from "react-native";

// // const ScanScreen= () => {
// //     return (
// //         <View>
// //             <Text>ScanScreen</Text>
// //             <TextInput placeholder = "Enter or Scan the Device ID" />
// //         </View>
// //     )
// // }
// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, PermissionsAndroid, Alert } from 'react-native';
// import { BleManager } from 'react-native-ble-plx';
// import axios from 'axios';

// export const manager = new BleManager();
// let scanning = false;

// const requestPermission = async () => {
//   try {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
//         title: "Request for Location Permission",
//         message: "Bluetooth Scanner requires access to Fine Location Permission",
//         buttonNeutral: "Ask Me Later",
//         buttonNegative: "Cancel",
//         buttonPositive: "OK"
//       }
//     );
//     return granted === PermissionsAndroid.RESULTS.GRANTED;
//   } catch (error) {
//     console.error('Error requesting location permission:', error);
//     return false;
//   }
// };

// const BeaconScanner = () => {
//   const [logData, setLogData] = useState([]);
//   const [logCount, setLogCount] = useState(0);
//   const [scannedDevices, setScannedDevices] = useState({});
//   const [deviceCount, setDeviceCount] = useState(0);
//   const [allowedDeviceIds, setAllowedDeviceIds] = useState([]);

//   // Define the RSSI threshold for your target distance
//   const rssiThreshold = -100; // Adjust this value based on your specific needs

//   useEffect(() => {
//     manager.onStateChange(async (state) => {
//       console.log(state);
//       const newLogData = [...logData, state];
//       setLogCount(newLogData.length);
//       setLogData(newLogData);
//     }, true);

//     // Fetch allowed device IDs from your API when the component mounts
//     fetchAllowedDeviceIds();
//   }, []);

//   // Function to fetch allowed device IDs from your API
//   const fetchAllowedDeviceIds = async () => {
//     try {
//       const apiResponse = await axios.get('http://66.169.158.106:5000/api/getAll');
//       const devices = apiResponse.data.data;
//       const deviceIds = devices.map((device) => device.deviceId.toLowerCase()); // Convert to lowercase for case-insensitive comparison
//       setAllowedDeviceIds(deviceIds);
//     } catch (error) {
//       console.error('Error fetching allowed device IDs:', error);
//     }
//   };

//   const handleDeviceDiscovery = async (error, device) => {
//     if (error) {
//       console.error(`BLE error: ${error}`);
//     //   alert("error")
//       return;
//     }

//     const deviceInfo = `${device.name} (MAC: ${device.id})`;
//     const rssi = device.rssi; // Received Signal Strength Indicator (RSSI)

//     console.log(`Found device: ${deviceInfo}, RSSI: ${rssi}`);
//     // alert("api call")
//     if (rssi >= rssiThreshold && allowedDeviceIds.includes(device.id.toLowerCase())) {
//       // alert("api");
//       await sendScannedDataToServer(deviceInfo);
//     }

//     const newScannedDevices = { ...scannedDevices };
//     newScannedDevices[device.id] = deviceInfo;
//     setDeviceCount(Object.keys(newScannedDevices).length);

//     setScannedDevices(newScannedDevices);
//   };

//   const startScanning = async () => {
//     const btState = await manager.state();

//     if (btState === "PoweredOn") {
//       const permission = await requestPermission();

//       if (permission) {
//         manager.startDeviceScan(null, { allowDuplicates: false }, handleDeviceDiscovery);
//         scanning = true;
//       } else {
//         console.error("Location permission denied.");
//       }
//     } else if (btState === "Unsupported") {
//       console.error("Bluetooth is not supported on this device.");
//     } else {
//       console.error("Bluetooth is not powered on.");
//     }
//   };

//   const stopScanning = () => {
//     if (scanning) {
//       manager.stopDeviceScan();
//       scanning = false;
//     }
//   };

//   const sendScannedDataToServer = async (deviceInfo) => {
//     try {
//       const serverUrl = 'http://66.169.158.106:5000/api/beacon/data';

//       const matches = deviceInfo.match(/^(.*?) \(MAC: (.*?)\)$/);

//       if (matches && matches.length === 3) {
//         const deviceName = matches[1];
//         const deviceId = matches[2];

//         const data = {
//           deviceName,
//           deviceId,
//           timestamp: new Date(),
//         };

//         const response = await axios.post(serverUrl, data);
//         console.log('Data sent to server:', response.data);
//       } else {
//         console.error('Invalid deviceInfo format:', deviceInfo);
//       }
//     } catch (error) {
//       console.error('Error sending data to the server:', error);
//     //   alert('Error sending data to the server. Check the console for details.');
//     }
//   };

//   return (
//     <View style={{ flex: 1, padding: 10 }}>
//       <View style={{ flex: 1, padding: 10 }}>
//         <Text style={{ fontWeight: "bold", color:"black" }}>Bluetooth Log ({logCount})</Text>
//         <FlatList
//           data={logData}
//           renderItem={({ item }) => {
//             return <Text>{item}</Text>;
//           }}
//         />
//         <TouchableOpacity
//           style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5, margin: 10 }}
//           onPress={async () => {
//             const btState = await manager.state();
//             if (btState === "Unsupported") {
//               alert("Bluetooth is not supported");
//               return;
//             }
//             if (btState !== "PoweredOn") {
//               await manager.enable();
//             } else {
//               await manager.disable();
//             }
//           }}>
//           <Text style={{ color: 'white', fontWeight: 'bold' }}>Turn On/Off Bluetooth</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={{ flex: 2, padding: 10 }}>
//         <Text style={{ fontWeight: "bold", color:"black" }}>Scanned Devices ({deviceCount})</Text>
//         <FlatList
//           data={Object.values(scannedDevices)}
//           renderItem={({ item }) => {
//             return <Text>{item}</Text>;
//           }}
//         />
//         <TouchableOpacity
//           style={{ backgroundColor: 'green', padding: 10, borderRadius: 5, margin: 10 }}
//           onPress={startScanning}>
//           <Text style={{ color: 'white', fontWeight: 'bold' }}>Start Scanning</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={{ backgroundColor: 'red', padding: 10, borderRadius: 5, margin: 10 }}
//           onPress={stopScanning}>
//           <Text style={{ color: 'white', fontWeight: 'bold' }}>Stop Scanning</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default BeaconScanner;

// // export default ScanScreen;

// import React, { useState, useEffect, useCallback } from 'react';
// import { View, Text, FlatList, TouchableOpacity, PermissionsAndroid, Alert } from 'react-native';
// import { BleManager } from 'react-native-ble-plx';
// import axios from 'axios';
// import { Table, Row, Rows } from 'react-native-table-component';
// import DeviceInfo from 'react-native-device-info';

// export const manager = new BleManager();
// let scanning = false;

// const requestPermission = async () => {
//   try {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
//         title: "Request for Location Permission",
//         message: "Bluetooth Scanner requires access to Fine Location Permission",
//         buttonNeutral: "Ask Me Later",
//         buttonNegative: "Cancel",
//         buttonPositive: "OK"
//       }
//     );
//     return granted === PermissionsAndroid.RESULTS.GRANTED;
//   } catch (error) {
//     console.error('Error requesting location permission:', error);
//     return false;
//   }
// };

// const BeaconScanner = () => {
//   const [logData, setLogData] = useState([]);
//   const [logCount, setLogCount] = useState(0);
//   const [scannedData, setScannedData] = useState([]);
//   const [allowedDeviceIds, setAllowedDeviceIds] = useState([]);
  
//   // Define the RSSI threshold for your target distance
//   const rssiThreshold = -100; // Adjust this value based on your specific needs

//   useEffect(() => {
//     manager.onStateChange(async (state) => {
//       console.log(state);
//       const newLogData = [...logData, state];
//       setLogCount(newLogData.length);
//       setLogData(newLogData);
//     }, true);

//     // Fetch allowed device IDs from your API when the component mounts
//     fetchAllowedDeviceIds();
//   }, []);

//   const fetchAllowedDeviceIds = async () => {
//     try {
//       const apiResponse = await axios.get('http://66.169.158.106:5000/api/getAll');
//       const devices = apiResponse.data.data;
//       const deviceIds = devices.map((device) => device.deviceId.toLowerCase()); // Convert to lowercase for case-insensitive comparison
//       setAllowedDeviceIds(deviceIds);
//     } catch (error) {
//       console.error('Error fetching allowed device IDs:', error);
//     }
//   };

//   const handleDeviceDiscovery = async (error, device) => {
//     if (error) {
//       console.error(`BLE error: ${error}`);
//       return;
//     }

//     // const deviceInfo = `${device.name} (MAC: ${device.id})`;
//     // const rssi = device.rssi; // Received Signal Strength Indicator (RSSI)
//     // const uniqueAppId = DeviceInfo.getUniqueId();

//     // console.log(`Found device: ${deviceInfo}, RSSI: ${rssi}, Unique: ${uniqueAppId}`);
//     const deviceInfo = `${device.name ? device.name : 'Unknown Device'} (MAC: ${device.id})`;
// const rssi = device.rssi; // Received Signal Strength Indicator (RSSI)
// const uniqueAppId = DeviceInfo.getUniqueId().toString();

// console.log(`Found device: ${deviceInfo}, RSSI: ${rssi}, Unique: ${uniqueAppId}`);


//     if (rssi >= rssiThreshold && allowedDeviceIds.includes(device.id.toLowerCase())) {
//       sendScannedDataToServer(deviceInfo);
//     }
//   };

//   const startScanning = async () => {
//     const btState = await manager.state();
   
//     if (btState === "PoweredOn") {
//       const permission = await requestPermission();

//       if (permission) {
//         manager.startDeviceScan(null, { allowDuplicates: false }, handleDeviceDiscovery);
//         scanning = true;
//       } else {
//         console.error("Location permission denied.");
//       }
//     } else if (btState === "Unsupported") {
//       console.error("Bluetooth is not supported on this device.");
//     } else {
//       console.error("Bluetooth is not powered on.");
//     }
//   };

//   const stopScanning = () => {
//     if (scanning) {
//       manager.stopDeviceScan();
//       scanning = false;
//     }
//   };
  
//   const sendScannedDataToServer = async (deviceInfo,uniqueAppId) => {
//     try {
//       const serverUrl = 'http://66.169.158.106:5000/api/beacon/data';

//       const matches = deviceInfo.match(/^(.*?) \(MAC: (.*?)\)$/);

//       if (matches && matches.length === 3) {
//         const deviceName = matches[1];
//         const deviceId = matches[2];

//         const data = {
//           deviceName,
//           deviceId,
//           timestamp: new Date(),
//           uniqueAppId,
//         };

//         const response = await axios.post(serverUrl, data);
//         console.log('Data sent to server:', response.data);
//       } else {
//         console.error('Invalid deviceInfo format:', deviceInfo);
//       }
//     } catch (error) {
//       console.error('Error sending data to the server:', error);
//     }
//   };

//   const fetchScannedData = useCallback(async () => {
//     try {
//       const response = await axios.get('http://66.169.158.106:5000/api/beacon/getAll');
//       setScannedData(response.data.data);
//     } catch (error) {
//       console.error('Error fetching scanned data:', error);
//     }
//   }, []);

//   useEffect(() => {
//     fetchScannedData();
//   }, [fetchScannedData]);
//   const itemsPerPage = 5; // Number of items per page
//   const [currentPage, setCurrentPage] = useState(0);

//   const startItem = currentPage * itemsPerPage;
//   const endItem = Math.min(startItem + itemsPerPage, scannedData.length);

//   const tableData = scannedData.slice(startItem, endItem).map((item) => [
//     item.deviceName,
//     item.deviceId,
//     item.timestamp,
//   ]);

//   const tableHead = ['Device Name', 'Device ID', 'TimeStamp'];

//   return (
//     <View style={{ flex: 1, padding: 10 }}>
//       <View style={{ flex: 1, padding: 10 }}>
//         <Text style={{ fontWeight: "bold", color: "black" }}>Bluetooth Log ({logCount})</Text>
//         <FlatList 
//           data={logData}
//           renderItem={({ item }) => {
//             return <Text style={{ fontWeight: "bold", color: "black" }}>{item}</Text>;
//           }}
//         />
//         <TouchableOpacity
//           style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5, margin: 60 }}
//           onPress={async () => {
//             const btState = await manager.state();
//             if (btState === "Unsupported") {
//               alert("Bluetooth is not supported");
//               return;
//             }
//             if (btState !== "PoweredOn") {
//               await manager.enable();
//             } else {
//               await manager.disable();
//             }
//           }}>
//           <Text style={{ color: 'white', fontWeight: 'bold' }}>Turn On/Off Bluetooth</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={{ flex: 2, padding: 10, paddingTop:-20 }}>
//         <Text style={{ fontWeight: 'bold', color: 'black' }}>Scanned Devices ({scannedData.length})</Text>
//         <Table borderStyle={{ borderWidth: 2, borderColor: 'black' }}>
//           <Row data={tableHead} style={{ height: 40, backgroundColor: '#f1f8ff' }} textStyle={{ fontWeight: 'bold', margin: 6, textAlign: 'center', color: 'black' }} />
//           <Rows data={tableData} textStyle={{ margin: 6, textAlign: 'center' }} />
//         </Table>
//         {scannedData.length > itemsPerPage && (
//           <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//             <TouchableOpacity
//               style={{ backgroundColor: 'green', padding: 10, borderRadius: 5, margin: 10 }}
//               onPress={() => setCurrentPage(Math.max(currentPage - 1, 0))}
//             >
//               <Text style={{ color: 'white', fontWeight: 'bold' }}>Previous Page</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={{ backgroundColor: 'green', padding: 10, borderRadius: 5, margin: 10 }}
//               onPress={() => setCurrentPage(currentPage + 1)}
//             >
//               <Text style={{ color: 'white', fontWeight: 'bold' }}>Next Page</Text>
//             </TouchableOpacity>
//             </View>
//         )}
//         <TouchableOpacity
//         style={{ backgroundColor: 'green', padding: 10, borderRadius: 5, margin: 10 }}
//         onPress={startScanning}
//         disabled={scanning} // Disable the "Start Scanning" button when scanning is in progress
//       >
//         <Text style={{ color: 'white', fontWeight: 'bold' }}>Start Scanning</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={{ backgroundColor: 'red', padding: 10, borderRadius: 5, margin: 10 }}
//         onPress={stopScanning}
//         disabled={!scanning} // Disable the "Stop Scanning" button when scanning is not in progress
//       >
//         <Text style={{ color: 'white', fontWeight: 'bold' }}>Stop Scanning</Text>
//       </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default BeaconScanner;


import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, PermissionsAndroid } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import axios from 'axios';
import { Table, Row, Rows } from 'react-native-table-component';

export const manager = new BleManager();
let scanning = false;

const requestPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        title: "Request for Location Permission",
        message: "Bluetooth Scanner requires access to Fine Location Permission",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

const BeaconScanner = () => {
  const [logData, setLogData] = useState([]);
  const [logCount, setLogCount] = useState(0);
  const [scannedData, setScannedData] = useState([]);
  const [allowedDeviceIds, setAllowedDeviceIds] = useState([]);
  const [btState, setBtState] = useState("Unknown"); // Bluetooth state

  // Define the RSSI threshold for your target distance
  const rssiThreshold = -100; // Adjust this value based on your specific needs

  useEffect(() => {
    manager.onStateChange(async (state) => {
      console.log(state);
      setBtState(state);
      const newLogData = [...logData, state];
      setLogCount(newLogData.length);
      setLogData(newLogData); 
    }, true);

    // Fetch allowed device IDs from your API when the component mounts
    fetchAllowedDeviceIds();
  }, []);

  const fetchAllowedDeviceIds = async () => {
    try {
      const apiResponse = await axios.get('http://66.169.158.106:5000/api/getAll');
      const devices = apiResponse.data.data;
      const deviceIds = devices.map((device) => device.deviceId.toLowerCase()); // Convert to lowercase for case-insensitive comparison
      setAllowedDeviceIds(deviceIds);
    } catch (error) {
      console.error('Error fetching allowed device IDs:', error);
    }
  };

  const handleDeviceDiscovery = async (error, device) => {
    if (error) {
      console.error(`BLE error: ${error}`);
      return;
    }

    const deviceInfo = `${device.name } (MAC: ${device.id})`;
    const rssi = device.rssi; // Received Signal Strength Indicator (RSSI)
 

    console.log(`Found device: ${deviceInfo}, RSSI: ${rssi}`);

    if (rssi >= rssiThreshold && allowedDeviceIds.includes(device.id.toLowerCase())) {
      sendScannedDataToServer(deviceInfo);
    }
  };

  const startScanning = async () => {
    setBtState("Starting...");
    const permission = await requestPermission();

    if (permission) {
      manager.startDeviceScan(null, { allowDuplicates: false }, handleDeviceDiscovery);
      scanning = true;
    } else {
      console.error("Location permission denied.");
      setBtState("Location Permission Denied");
    }
  };

  const stopScanning = () => {
    if (scanning) {
      manager.stopDeviceScan();
      scanning = false;
      setBtState("Stopped");
    }
  };

  const sendScannedDataToServer = async (deviceInfo) => {
    try {
      const serverUrl = 'http://66.169.158.106:5000/api/beacon/data';

      const matches = deviceInfo.match(/^(.*?) \(MAC: (.*?)\)$/);

      if (matches && matches.length === 3) {
        const deviceName = matches[1];
        const deviceId = matches[2];

        const data = {
          deviceName,
          deviceId,
          timestamp: new Date(),
        };

        const response = await axios.post(serverUrl, data);
        console.log('Data sent to server:', response.data);
      } else {
        console.error('Invalid deviceInfo format:', deviceInfo);
      }
    } catch (error) {
      console.error('Error sending data to the server:', error);
    }
  };

  const fetchScannedData = useCallback(async () => {
    try {
      const response = await axios.get('http://66.169.158.106:5000/api/beacon/getAll');
      setScannedData(response.data.data);
    } catch (error) {
      console.error('Error fetching scanned data:', error);
    }
  }, []);

  useEffect(() => {
    fetchScannedData();
  }, [fetchScannedData]);
  const itemsPerPage = 5; // Number of items per page
  const [currentPage, setCurrentPage] = useState(0);

  const startItem = currentPage * itemsPerPage;
  const endItem = Math.min(startItem + itemsPerPage, scannedData.length);

  const tableData = scannedData.slice(startItem, endItem).map((item) => [
    item.deviceName,
    item.deviceId,
    item.timestamp,
  ]);

  const tableHead = ['Device Name', 'Device ID', 'TimeStamp'];

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <View style={{ flex: 1, padding: 10 }}>
        <Text style={{ fontWeight: "bold", color: "black" }}>Bluetooth Log ({logCount})</Text>
        <FlatList
          data={logData}
          renderItem={({ item }) => {
            return <Text style={{ fontWeight: "bold", color: "black" }}>{item}</Text>;
          }}
        />
        <TouchableOpacity
          style={{
            backgroundColor: btState === "PoweredOn" ? 'red' : 'green',
            padding: 10,
            borderRadius: 5,
            margin: 60
          }}
          onPress={async () => {
            if (btState === "Unsupported") {
              alert("Bluetooth is not supported");
              return;
            }
            if (btState !== "PoweredOn") {
              await manager.enable();
            } else {
              await manager.disable();
            }
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            {btState !== "PoweredOn" ? 'Turn On Bluetooth' : 'Turn Off Bluetooth'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 2, padding: 10 }}>
        <Text style={{ fontWeight: 'bold', color: 'black' }}>Scanned Devices ({scannedData.length})</Text>
        {scannedData.length === 0 ? (
          <Text>No data available</Text>
        ) : (
          <Table borderStyle={{ borderWidth: 2, borderColor: 'black' }}>
            <Row data={tableHead} style={{ height: 40, backgroundColor: '#f1f8ff' }} textStyle={{ fontWeight: 'bold', margin: 6, textAlign: 'center', color: 'black' }} />
            <Rows data={tableData} textStyle={{ margin: 6, textAlign: 'center', color:"black" }} />
          </Table>
        )}
        {scannedData.length > itemsPerPage && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              style={{ backgroundColor: 'green', padding: 10, borderRadius: 5, margin: 10 }}
              onPress={() => setCurrentPage(Math.max(currentPage - 1, 0))}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Previous Page</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: 'green', padding: 10, borderRadius: 5, margin: 10 }}
              onPress={() => setCurrentPage(currentPage+1)}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Next Page</Text>
            </TouchableOpacity>
          </View>
        )}
        </View>
        <TouchableOpacity
          style={{ backgroundColor: 'green', padding: 10, borderRadius: 5, margin: 10 }}
          onPress={startScanning}
          // disabled={scanning} // Disable the "Start Scanning" button when scanning is in progress
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Start Scanning</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ backgroundColor: 'red', padding: 10, borderRadius: 5, margin: 10 }}
          onPress={stopScanning}
          // disabled={!scanning} // Disable the "Stop Scanning" button when scanning is not in progress
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Stop Scanning</Text>
        </TouchableOpacity>
      
    </View>
  );
};

export default BeaconScanner;
