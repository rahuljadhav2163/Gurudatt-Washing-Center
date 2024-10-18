import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    TouchableOpacity, 
    StyleSheet, 
    Modal, 
    TextInput, 
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';

const TaskList = () => {
    const [expandedCards, setExpandedCards] = useState({});
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
    const [searchQuery, setSearchQuery] = useState('');
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isAddingVehicle, setIsAddingVehicle] = useState(false);
    const [isDeletingVehicle, setIsDeletingVehicle] = useState({});
    const [vehicleSummary, setVehicleSummary] = useState({
        '2 Wheeler': { count: 0, totalPrice: 0 },
        '3 Wheeler': { count: 0, totalPrice: 0 },
        '4 Wheeler': { count: 0, totalPrice: 0 },
        'Other': { count: 0, totalPrice: 0 },
    });

    function formatDateForDisplay(date) {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    }

    function formatDateForCalendar(dateStr) {
        const d = new Date(dateStr);
        return d.toISOString().split('T')[0];
    }

    function isSameDay(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear();
    }

    useEffect(() => {
        const initialize = async () => {
            setIsInitialLoading(true);
            try {
                await getData();
                await loadVehicles();
            } catch (error) {
                console.error("Initialization error:", error);
                Alert.alert("Error", "Failed to initialize application");
            } finally {
                setIsInitialLoading(false);
            }
        };
        initialize();
    }, []);

    useEffect(() => {
        if (entries.length > 0) {
            filterEntriesByDate();
        }
    }, [selectedDate, entries, searchQuery]);

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
            throw error;
        }
    };

    const toggleCard = (index) => {
        setExpandedCards(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
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
            throw error;
        }
    };

    const filterEntriesByDate = () => {
        const filtered = entries.filter(entry =>
            formatDateForDisplay(entry.createdAt) === selectedDate
        );
        const searched = filtered.filter(entry =>
            entry.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.type.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredEntries(searched);

        // Calculate summary
        const summary = {
            '2 Wheeler': { count: 0, totalPrice: 0 },
            '3 Wheeler': { count: 0, totalPrice: 0 },
            '4 Wheeler': { count: 0, totalPrice: 0 },
            'Other': { count: 0, totalPrice: 0 },
        };

        searched.forEach(entry => {
            if (summary[entry.type]) {
                summary[entry.type].count += 1;
                summary[entry.type].totalPrice += Number(entry.price);
            } else {
                summary['Other'].count += 1;
                summary['Other'].totalPrice += Number(entry.price);
            }
        });

        setVehicleSummary(summary);
    };

    const VehicleSummary = () => (
        <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Vehicle Summary</Text>
            {Object.entries(vehicleSummary).map(([type, data]) => (
                <View key={type} style={styles.summaryRow}>
                    <Text style={styles.summaryText}>{type}: {data.count}</Text>
                    <Text style={styles.summaryText}>₹{data.totalPrice}</Text>
                </View>
            ))}
            <View style={styles.summaryRow}>
                <Text style={styles.summaryTotalText}>Total Vehicles: {
                    Object.values(vehicleSummary).reduce((acc, curr) => acc + curr.count, 0)
                }</Text>
                <Text style={styles.summaryTotalText}>Total Price: ₹{
                    Object.values(vehicleSummary).reduce((acc, curr) => acc + curr.totalPrice, 0)
                }</Text>
            </View>
        </View>
    );


    const addVehicle = async () => {
        if (!type || !number || !model || !price || !payment) {
            Alert.alert("Error", "Please fill all fields");
            return;
        }

        setIsAddingVehicle(true);
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

                const newEntry = {
                    type,
                    number,
                    model,
                    price,
                    payment,
                    createdAt: new Date().toISOString(),
                    displayDate: formatDateForDisplay(new Date())
                };

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
        } finally {
            setIsAddingVehicle(false);
        }
    };

    const deleteTransaction = async (id) => {
        Alert.alert(
            "Delete Confirmation",
            "Are you sure you want to delete this transaction?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Deletion canceled"),
                    style: "cancel"
                },
                {
                    text: "OK", 
                    onPress: async () => {
                        setIsDeletingVehicle(prev => ({ ...prev, [id]: true }));
                        try {
                            const response = await axios.delete(
                                `https://washcenter-backend.vercel.app/api/delentry/${id}`
                            );
                            if (response.data.success) {
                                Alert.alert("Success", response.data.message);
                                await loadVehicles();
                            } else {
                                Alert.alert("Error", response.data.message);
                            }
                        } catch (error) {
                            console.error("Error deleting transaction:", error);
                            Alert.alert("Error", "Failed to delete vehicle");
                        } finally {
                            setIsDeletingVehicle(prev => ({ ...prev, [id]: false }));
                        }
                    }
                }
            ],
            { cancelable: false }
        );
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

    const handleSearch = (text) => {
        setSearchQuery(text);
    };

    if (isInitialLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="black" />
                <Text style={styles.loadingText}>Loading vehicles...</Text>
            </View>
        );
    }

    

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.nameofheader}>Vehicle Data Entry</Text>
                <Text style={styles.headerTitle}>Gurudatt Washing Center</Text>
                <TouchableOpacity
                    style={styles.dateSelector}
                    onPress={() => setShowCalendar(!showCalendar)}
                >
                    <Text style={styles.headerDate}>Date: {selectedDate}</Text>
                    <Icon name="calendar-today" size={24} color="white" style={styles.calendarIcon} />
                    
                </TouchableOpacity>
                <Icon name="download" size={24} color="white" style={styles.dawnload}/>
            </View>

            <TextInput
                style={styles.searchInput}
                placeholder="Search by vehicle number or type"
                value={searchQuery}
                onChangeText={handleSearch}
            />

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
            <VehicleSummary />
                {filteredEntries.length > 0 ? (
                    filteredEntries.map((entry, index) => (
                        <View key={index} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <View style={styles.cardTitleContainer}>
                                    <Text style={styles.vehicleNumber}>
                                        Vehicle No : {entry.number.toUpperCase()}
                                    </Text>
                                    <TouchableOpacity 
                                        onPress={() => toggleCard(index)}
                                        style={styles.arrowButton}
                                    >
                                        <Icon 
                                            name={expandedCards[index] ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                                            size={24} 
                                            color="#000" 
                                        />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.sdate}>{selectedDate}</Text>
                            </View>

                            {expandedCards[index] && (
                                <View style={styles.cardDetails}>
                                    <View style={styles.infoRow}>
                                        <Icon name="directions-car" size={20} color="#000" />
                                        <Text style={styles.infoText}>Type: {entry.type}</Text>
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
                                    
                                    <View style={styles.cardActions}>
                                        <TouchableOpacity>
                                                <Icon name="edit-square" size={24} color="white" style={styles.deleteText}/>
                                        </TouchableOpacity>
                                        <Text style={styles.nameofc}>Gurudatt Washing Center</Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    ))
                ) : (
                    <View style={styles.noDataContainer}>
                        <Text style={styles.noDataText}>
                            {searchQuery ? `No results found for "${searchQuery}"` : `No entries for ${selectedDate}`}
                        </Text>
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

          {/* Picker for Vehicle Type */}
         

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
 <Picker
            selectedValue={type}
            style={styles.input}
            onValueChange={(itemValue) => setType(itemValue)}
          >
            <Picker.Item label="Select vehicle" value="car" />
            <Picker.Item label="2 Wheeler" value="2 Wheeler" />
            <Picker.Item label="3 Wheeler" value="3 Wheeler" />
            <Picker.Item label="4 Wheeler" value="4 Wheeler" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
          {/* Picker for Payment Method */}
          <Picker
            selectedValue={payment}
            style={styles.picker}
            onValueChange={(itemValue) => setPayment(itemValue)}
          >
            <Picker.Item label="Payment Mode" value="car" />
            <Picker.Item label="Cash" value="cash" />
            <Picker.Item label="Online" value="online" />
          </Picker>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[
                styles.addEntryButton,
                isAddingVehicle && styles.disabledButton
              ]}
              onPress={addVehicle}
              disabled={isAddingVehicle}
            >
              {isAddingVehicle ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.buttonText}>Add Entry</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.cancelButton,
                isAddingVehicle && styles.disabledButton
              ]}
              onPress={() => setModalVisible(false)}
              disabled={isAddingVehicle}
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
    summaryContainer: {
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
    summaryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    summaryText: {
        fontSize: 14,
    },
    summaryTotalText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    nameofheader:{
        textAlign:'center',
        color:"white",
        marginBottom:10,
        fontSize:16
    },
    nameofc:{
        position:"absolute",
        left:0,
        top:10,
        color:"#bfbfbf"
    },
    dawnload:{
        position:"absolute",
        top:81,
        right:80,
        fontSize:29
        },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    vehicleNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
    },
    arrowButton: {
        padding: 5,
    },
    cardDetails: {
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    actionButton: {
        marginLeft: 20,
    },
    deleteText: {
        color: '#00cc00',
        fontSize: 24,
        fontWeight: '500',
    },
    editText: {
        color: 'green',
        fontSize: 14,
        fontWeight: '500',
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: 'black',
    },
    searchInput: {
        height: 40,
        margin: 10,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    sdate: {
        position: "absolute",
        top: 9,
        right: 50,
        fontSize:12
    },
    header: {
        backgroundColor: 'black',
        padding: 20,
        paddingTop: 10,
        marginTop: -30
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10
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
        marginTop: 210
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
    sdel: {
        position: "absolute",
        right: 5,
        bottom: 5,
        color: "red",
        fontSize: 15
    },
    sedit: {
        position: "absolute",
        right: 65,
        bottom: 10,
        color: "green",
        fontSize: 15
    }
});
export default TaskList;