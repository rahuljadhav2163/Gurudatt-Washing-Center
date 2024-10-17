import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Calendar } from 'react-native-calendars';

const TaskList = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [entries, setEntries] = useState([]);
    const [filteredEntries, setFilteredEntries] = useState([]);
    const [userId, setUserId] = useState('');
    const [selectedDate, setSelectedDate] = useState(formatDateForDisplay(new Date()));
    const [showCalendar, setShowCalendar] = useState(false);

    const [type, setType] = useState('');
    const [number, setNumber] = useState('');
    const [model, setModel] = useState('');
    const [price, setPrice] = useState('');
    const [payment, setPayment] = useState('');

    // Format date from ISO string to DD-MM-YYYY
    function formatDateForDisplay(date) {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    }

    // Format date for Calendar (YYYY-MM-DD)
    function formatDateForCalendar(dateStr) {
        const d = new Date(dateStr);
        return d.toISOString().split('T')[0];
    }

    // Compare two dates (ignoring time)
    function isSameDay(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return d1.getDate() === d2.getDate() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getFullYear() === d2.getFullYear();
    }

    useEffect(() => {
        const initialize = async () => {
            await getData();
            await loadVehicles();
        };
        initialize();
    }, []);

    useEffect(() => {
        if (entries.length > 0) {
            filterEntriesByDate();
        }
    }, [selectedDate, entries]);

    const getData = async () => {
        try {
            const storedUserData = await SecureStore.getItemAsync('userData');
            if (storedUserData) {
                const parsedUserData = JSON.parse(storedUserData);
                setUserId(parsedUserData._id);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            Alert.alert("Error", "Failed to load user data");
        }
    };

    const loadVehicles = async () => {
        try {
            const storedUserData = await SecureStore.getItemAsync('userData');
            if (!storedUserData) {
                Alert.alert("Error", "Please login first");
                return;
            }

            const parsedUserData = JSON.parse(storedUserData);
            const response = await axios.get(
                `https://washcenter-backend.vercel.app/api/getVehicles/user/${parsedUserData._id}`
            );

            if (response?.data?.success) {
                const processedEntries = response.data.data.map(entry => ({
                    ...entry,
                    displayDate: formatDateForDisplay(entry.createdAt)
                }));
                setEntries(processedEntries);
            } else {
                Alert.alert("Error", "Failed to load vehicles");
            }
        } catch (error) {
            console.error("Error loading vehicles:", error);
            Alert.alert("Error", "Failed to load vehicles");
        }
    };

    const filterEntriesByDate = () => {
        const filtered = entries.filter(entry => 
            formatDateForDisplay(entry.createdAt) === selectedDate
        );
        setFilteredEntries(filtered);
    };

    const addVehicle = async () => {
        if (!type || !number || !model || !price || !payment) {
            Alert.alert("Error", "Please fill all fields");
            return;
        }
    
        try {
            const response = await axios.post(
                "https://washcenter-backend.vercel.app/api/addVehicle",
                {
                    user: userId,
                    type,
                    number,
                    model,
                    price,
                    payment
                }
            );
    
            if (response?.data?.success) {
                Alert.alert("Success", "Vehicle added successfully");
                setModalVisible(false);
                
                // Create the new entry
                const newEntry = {
                    type,
                    number,
                    model,
                    price,
                    payment,
                    createdAt: new Date().toISOString(), // Assuming the vehicle creation is the current date
                    displayDate: formatDateForDisplay(new Date()) // Format for display
                };
    
                // Prepend the new entry to the existing list
                setEntries([newEntry, ...entries]);
    
                // Clear form
                setType('');
                setNumber('');
                setModel('');
                setPrice('');
                setPayment('');
            } else {
                Alert.alert("Error", response?.data?.message || "Failed to add vehicle");
            }
        } catch (error) {
            console.error("Error adding vehicle:", error);
            Alert.alert("Error", "Failed to add vehicle");
        }
    };
    

    const getMarkedDates = () => {
        const marked = {};
        entries.forEach(entry => {
            if (entry.createdAt) {
                const formattedDate = formatDateForCalendar(entry.createdAt);
                marked[formattedDate] = {
                    marked: true,
                    dotColor: 'black'
                };
            }
        });

        // Mark selected date
        const selectedDateObj = new Date(selectedDate.split('-').reverse().join('-'));
        const formattedSelectedDate = formatDateForCalendar(selectedDateObj);
        marked[formattedSelectedDate] = {
            ...marked[formattedSelectedDate],
            selected: true,
            selectedColor: 'black',
        };

        return marked;
    };

    const onDayPress = (day) => {
        const formattedDate = formatDateForDisplay(new Date(day.dateString));
        setSelectedDate(formattedDate);
        setShowCalendar(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Vehicle Data Entry</Text>
                <TouchableOpacity 
                    style={styles.dateSelector}
                    onPress={() => setShowCalendar(!showCalendar)}
                >
                    <Text style={styles.headerDate}>Date: {selectedDate}</Text>
                    <Icon name="calendar-today" size={24} color="white" style={styles.calendarIcon} />
                </TouchableOpacity>
            </View>

            {showCalendar && (
                <View style={styles.calendarContainer}>
                    <Calendar
                        markedDates={getMarkedDates()}
                        onDayPress={onDayPress}
                        theme={{
                            todayTextColor: 'black',
                            selectedDayBackgroundColor: 'black',
                            selectedDayTextColor: 'white',
                        }}
                    />
                </View>
            )}

            <ScrollView style={styles.scrollView}>
                
                {filteredEntries.length > 0 ? (
                    filteredEntries.map((entry, index) => (
                        <View key={index} style={styles.card}>
                            <Text style={styles.sdate}>Date : {selectedDate}</Text>
                            <View style={styles.infoRow}>
                                <Icon name="directions-car" size={20} color="#000" />
                                <Text style={styles.infoText}>Type: {entry.type}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Icon name="tag" size={20} color="#000" />
                                <Text style={styles.infoText}>Number: {entry.number}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Icon name="local-offer" size={20} color="#000" />
                                <Text style={styles.infoText}>Model: {entry.model}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Icon name="attach-money" size={20} color="#000" />
                                <Text style={styles.infoText}>Price: ₹{entry.price}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Icon name="payment" size={20} color="#000" />
                                <Text style={styles.infoText}>Payment: {entry.payment}</Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.noDataContainer}>
                        <Text style={styles.noDataText}>No entries for {selectedDate}</Text>
                    </View>
                )}
            </ScrollView>

            <TouchableOpacity 
                style={styles.addButton}
                onPress={() => setModalVisible(true)}
            >
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
                        <Text style={styles.modalTitle}>New Entry</Text>
                        
                        <TextInput
                            style={styles.input}
                            placeholder="Vehicle Type"
                            value={type}
                            onChangeText={setType}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Vehicle Number"
                            value={number}
                            onChangeText={setNumber}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Model"
                            value={model}
                            onChangeText={setModel}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Price"
                            value={price}
                            keyboardType="numeric"
                            onChangeText={setPrice}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Payment Method"
                            value={payment}
                            onChangeText={setPayment}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity 
                                style={styles.addEntryButton}
                                onPress={addVehicle}
                            >
                                <Text style={styles.buttonText}>Add Entry</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={styles.cancelButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    sdate:{
        position:"absolute",
        top:5,
        right:10
    },
    header: {
        backgroundColor: 'black',
        padding: 20,
        paddingTop: 10,
        marginTop:-30
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    dateSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerDate: {
        fontSize: 16,
        color: 'white',
    },
    calendarIcon: {
        marginLeft: 10,
    },
    calendarContainer: {
        backgroundColor: 'white',
        margin: 10,
        borderRadius: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    card: {
        backgroundColor: 'white',
        margin: 10,
        padding: 15,
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    infoText: {
        marginLeft: 10,
        fontSize: 16,
    },
    noDataContainer: {
        padding: 20,
        alignItems: 'center',
    },
    noDataText: {
        fontSize: 20,
        color: '#666',
        marginTop:210
    },
    addButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    addButtonText: {
        fontSize: 30,
        color: 'white',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    addEntryButton: {
        flex: 1,
        backgroundColor: 'black',
        padding: 15,
        borderRadius: 8,
        marginRight: 10,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#ff4444',
        padding: 15,
        borderRadius: 8,
        marginLeft: 10,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
export default TaskList;