import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const TaskList = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [entries, setEntries] = useState([]); // Ensure this is an array
    const [userId, setUserId] = useState('');

    const [type, setType] = useState('');
    const [number, setNumber] = useState('');
    const [model, setModel] = useState('');
    const [price, setPrice] = useState('');
    const [payment, setPayment] = useState('');

    const getData = async () => {
        try {
            const storedUserData = await SecureStore.getItemAsync('userData');
            if (storedUserData) {
                const parsedUserData = JSON.parse(storedUserData); 
                setUserId(parsedUserData._id);
            }
        } catch (error) {
            console.error("Error fetching user data", error);
        }
    };

    useEffect(() => {
        getData();
        loadveh(); // Load vehicles after user data is retrieved
    }, [userId]); // Make sure this runs after `userId` is set

    const addVehicle = async () => {
        try {
            const response = await axios.post("http://192.168.1.9:5000/api/addVehicle", {
                user: userId, 
                type, price, model, number, payment
            });

            if (response?.data?.success === true) {
                Alert.alert(response?.data?.message);
                setModalVisible(false);
                loadveh();
            } else {
                Alert.alert(response?.data?.message);
            }
        } catch (error) {
            console.log("Error while adding vehicle:", error);
        }
    };

    const loadveh = async () => {
        if (!userId) return;

        try {
            const response = await axios.get(`http://192.168.1.9:5000/api/getVehicles/user/${userId}`);
            if (response?.data?.success) {
                setEntries(response.data.data); // Assuming data.data is an array of vehicle objects
            } else {
                Alert.alert("Failed to load vehicles");
            }
        } catch (error) {
            console.log("Error loading vehicles:", error);
        }
    };

    const getCurrentDate = () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Vehicle Data Entry</Text>
                <Text style={styles.headerDate}>Today's Date: {getCurrentDate()}</Text>
            </View>

            <ScrollView style={styles.scrollView}>
                {entries.length > 0 ? (
                    entries.map((entry, index) => (
                        <View key={index} style={styles.card}>
                            <View style={styles.infoRow}>
                                <Icon name="two-wheeler" size={20} color="#000" />
                                <Text style={styles.infoText}>Vehicle Type: {entry.type}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Icon name="directions-car" size={20} color="#000" />
                                <Text style={styles.infoText}>Vehicle No: {entry.number}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Icon name="money" size={20} color="#000" />
                                <Text style={styles.infoText}>Price: {entry.price}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Icon name="payment" size={20} color="#000" />
                                <Text style={styles.infoText}>Payment: {entry.payment}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Icon name="directions-car" size={20} color="#000" />
                                <Text style={styles.infoText}>Model: {entry.model}</Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text>No entries available</Text>
                )}
            </ScrollView>

            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Add New Entry</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Vehicle Type"
                            value={type}
                            onChangeText={(text) => setType(text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Vehicle No"
                            value={number}
                            onChangeText={(text) => setNumber(text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Model"
                            value={model}
                            onChangeText={(text) => setModel(text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Price"
                            value={price}
                            onChangeText={(text) => setPrice(text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Payment"
                            value={payment}
                            onChangeText={(text) => setPayment(text)}
                        />
                        <TouchableOpacity style={styles.addEntryButton} onPress={addVehicle}>
                            <Text style={styles.addEntryButtonText}>Add Entry</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    dateHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        backgroundColor: '#e6e6e6',
        padding: 10,
        marginTop: 10,
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: 'black',
        padding: 20,
        marginTop: -28
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    headerDate: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 5,
    },
    scrollView: {
        flex: 1,
        backgroundColor: "#cce6ff"
    },
    card: {
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        padding: 20,
        margin: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 1, height: 3 },
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        fontSize: 19,
    },
    infoText: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    addButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 40,
        color: 'white',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalView: {
        width: 370,
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        height: 50,
        width: 250,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
        fontSize: 20
    },
    addEntryButton: {
        backgroundColor: 'black',
        borderRadius: 20,
        padding: 10,
        marginVertical: 10,
    },
    addEntryButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    cancelButton: {
        backgroundColor: '#ff4d4d',
        borderRadius: 20,
        padding: 10,
        marginTop: 10,
    },
    cancelButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export default TaskList;
