import React from "react";
import { Button, View, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';


const MainScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.wrapper}>
                <Button
                    title="DEVICE"
                    onPress={() => navigation.navigate('Device')} // Navigate to the "Device" screen
                />
                <View style={{ marginTop: 10 }}>
                    <Button
                        title="SCAN"
                        onPress={() => navigation.navigate('Scan')}
                    />
                    <View style={{ marginTop: 10 }}>
                        <Button
                            title="Emergency"
                            onPress={() => navigation.navigate('Emergency')}
                        />
                    </View>
                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    wrapper: {
        width: "80%"
    }
})
export default MainScreen;