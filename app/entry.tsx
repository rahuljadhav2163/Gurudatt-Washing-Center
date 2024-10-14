import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TaskList = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [entries, setEntries] = useState({});
    const [newEntry, setNewEntry] = useState({
        vehicleType: '',
        vehicleNo: '',
        contactNo: '',
        payment: ''
    });

    const getCurrentDate = () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const addEntry = () => {
        if (!newEntry.vehicleType || !newEntry.vehicleNo || !newEntry.contactNo || !newEntry.payment) {
            Alert.alert("Error", "Please fill all fields");
            return;
        }
        const currentDate = getCurrentDate();
        setEntries(prevEntries => ({
            ...prevEntries,
            [currentDate]: [...(prevEntries[currentDate] || []), newEntry]
        }));
        setNewEntry({ vehicleType: '', vehicleNo: '', contactNo: '', payment: '' });
        setModalVisible(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Vehicle Data Entry</Text>
                <Text style={styles.headerDate}>Today's Date: {getCurrentDate()}</Text>
            </View>
            <ScrollView style={styles.scrollView}>
                {Object.entries(entries).map(([date, dayEntries]) => (
                    <View key={date} style={styles.section}>
                        <Text style={styles.sectionTitle}>{date}</Text>
                        {dayEntries.map((entry, index) => (
                            <View key={index} style={styles.card}>
                                <View style={styles.infoRow}>
                                    <Icon name="two-wheeler" size={20} color="#000" />
                                    <Text style={styles.infoText}>Vehicle Type: {entry.vehicleType}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Icon name="directions-car" size={20} color="#000" />
                                    <Text style={styles.infoText}>Vehicle No: {entry.vehicleNo}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Icon name="add-call" size={20} color="#000" />
                                    <Text style={styles.infoText}>Contact No: {entry.contactNo}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Icon name="money" size={20} color="#000" />
                                    <Text style={styles.infoText}>Payment: {entry.payment}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                ))}
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
                            value={newEntry.vehicleType}
                            onChangeText={(text) => setNewEntry({...newEntry, vehicleType: text})}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Vehicle No"
                            value={newEntry.vehicleNo}
                            onChangeText={(text) => setNewEntry({...newEntry, vehicleNo: text})}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Contact No"
                            value={newEntry.contactNo}
                            onChangeText={(text) => setNewEntry({...newEntry, contactNo: text})}
                            keyboardType="phone-pad"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Payment"
                            value={newEntry.payment}
                            onChangeText={(text) => setNewEntry({...newEntry, payment: text})}
                        />
                        <TouchableOpacity style={styles.addEntryButton} onPress={addEntry}>
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
    section: {
        marginTop: 20,
        marginHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
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
        width:370,
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
        fontSize:20
    },
    addEntryButton: {
        backgroundColor: 'black',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 10,
        paddingLeft:60,
        paddingRight:60,
    
    },
    addEntryButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    cancelButton: {
        backgroundColor: '#f44336',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 10,
        paddingLeft:70,
        paddingRight:70,
    },
    cancelButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default TaskList;