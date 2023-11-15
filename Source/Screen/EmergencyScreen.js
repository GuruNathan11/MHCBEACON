// import React, { useState, useEffect } from 'react';
// import { View, Text, Button } from 'react-native';
// import { BleManager } from 'react-native-ble-plx';
// import Sound from 'react-native-sound';
// import axios from 'axios';
// import io from 'socket.io-client';

// const App = () => {
//   const [targetDevice, setTargetDevice] = useState(null);
//   const [beaconStatus, setBeaconStatus] = useState('Searching for beacon...');
//   const [alarmPlaying, setAlarmPlaying] = useState(false);
//   const [lastAlarmTime, setLastAlarmTime] = useState(null);

//   const socket = io('http://66.169.158.106:3000'); // Replace with your server's URL

//   // Function to send an emergency alert to the server
//   const sendEmergencyAlert = () => {
//     if (targetDevice) {
//       socket.emit('emergency-alert');
//     }
//   };

//   // Function to start scanning
//   const startScanning = () => {
//     const manager = new BleManager();
//     manager.startDeviceScan(null, null, (error, device) => {
//       if (error) {
//         console.error('Error scanning for devices:', error);
//         return;
//       }

//       if (targetDevice && device.id === targetDevice.deviceId) {
//         console.log(`Found your target device with MAC address: ${targetDevice.deviceId}`);
//         if (!alarmPlaying) {
//           const currentTime = new Date().getTime();
//           if (!lastAlarmTime || currentTime - lastAlarmTime >= 60000) {
//             setAlarmPlaying(true);
//             setBeaconStatus('Target device detected!');

//             // Play the emergency alarm sound
//             const alarmSound = new Sound(require('./assets/guru.mp3'), (error) => {
//               if (error) {
//                 console.error('Error playing alarm sound:', error);
//                 setAlarmPlaying(false); // Reset alarm playing state on error
//               } else {
//                 alarmSound.play((success) => {
//                   if (success) {
//                     console.log('Emergency alarm sound played.');
//                     setAlarmPlaying(false);
//                     setLastAlarmTime(currentTime);
//                   } else {
//                     console.error('Error playing alarm sound.');
//                     setAlarmPlaying(false);
//                   }
//                 });
//               }
//             });
//           }
//         }
//       }
//     });

//     // Clean up the manager when the component is unmounted
//     return () => {
//       manager.stopDeviceScan(); // Stop scanning when the component unmounts
//       manager.destroy();
//     };
//   };

//   // Function to fetch target device information from the API
//   const fetchTargetDevice = () => {
//     axios
//       .get('http://66.169.158.106:5000/api/getAll')
//       .then((response) => {
//         const data = response.data.data;
//         if (data.length > 0) {
//           setTargetDevice(data[0]);
//         }
//       })
//       .catch((error) => {
//         console.error('Error fetching target device information:', error);
//       });
//   };

//   useEffect(() => {
//     fetchTargetDevice(); // Fetch target device information when the component mounts
//   }, []);

//   useEffect(() => {
//     if (targetDevice) {
//       const cleanup = startScanning(); // Start scanning when targetDevice is set
//       return cleanup; // Return the cleanup function to stop scanning
//     }
//   }, [targetDevice]);

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>{beaconStatus}</Text>
//       <Button title="Emergency" onPress={sendEmergencyAlert} />
//     </View>
//   );
// };

// export default App;

import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import Sound from 'react-native-sound';
import axios from 'axios';

const App = () => {
  const [targetDevice, setTargetDevice] = useState(null);
  const [beaconStatus, setBeaconStatus] = useState('Searching for beacon...');
  const [alarmPlaying, setAlarmPlaying] = useState(false);
  const [lastAlarmTime, setLastAlarmTime] = useState(null);

  // Function to start scanning
  const startScanning = () => {
    const manager = new BleManager();
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Error scanning for devices:', error);
        return;
      }
  
      if (targetDevice && device.id === targetDevice.deviceId) {
        console.log(`Found your target device with MAC address: ${targetDevice.deviceId}`);
        if (!alarmPlaying) {
          const currentTime = new Date().getTime();
          if (!lastAlarmTime || currentTime - lastAlarmTime >= 60000) {
            setAlarmPlaying(true);
            setBeaconStatus('Target device detected!');
  
            // Play the emergency alarm sound
            const alarmSound = new Sound(require('./assets/guru.mp3'), (error) => {
              if (error) {
                console.error('Error playing alarm sound:', error);
                setAlarmPlaying(false); // Reset alarm playing state on error
              } else {
                alarmSound.play((success) => {
                  if (success) {
                    console.log('Emergency alarm sound played.');
                    setAlarmPlaying(false);
                    setLastAlarmTime(currentTime);
  
                    // Send data to the API
                    const dataToSend = {
                      deviceId: targetDevice.deviceId,
                      timestamp: new Date().toISOString(),
                    };
  
                    axios
                      .post('http://66.169.158.106:5000/api/beacon/data', dataToSend)
                      .then((response) => {
                        console.log('Data sent to the API:', response.data);
                      })
                      .catch((error) => {
                        console.error('Error sending data to the API:', error);
                      });
                  } else {
                    console.error('Error playing alarm sound.');
                    setAlarmPlaying(false);
                  }
                });
              }
            });
          }
        }
      }
    });
  
    // Clean up the manager when the component is unmounted
    return () => {
      manager.stopDeviceScan(); // Stop scanning when the component unmounts
      manager.destroy();
    };
  };
  
  // Function to fetch target device information from the API
  const fetchTargetDevice = () => {
    axios
      .get('http://66.169.158.106:5000/api/emergency/getAll')
      .then((response) => {
       
        const data = response.data.data;
        // console.log(data)
        if (data.length > 0) {
          setTargetDevice(data[0]);
        }
      })
      .catch((error) => {
        console.error('Error fetching target device information:', error);
      });
  };

  useEffect(() => {
    fetchTargetDevice(); // Fetch target device information when the component mounts
  }, []);

  useEffect(() => {
    if (targetDevice) {
      const cleanup = startScanning(); // Start scanning when targetDevice is set
      return cleanup; // Return the cleanup function to stop scanning
    }
  }, [targetDevice]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{beaconStatus}</Text>
    </View>
  );
};

export default App;