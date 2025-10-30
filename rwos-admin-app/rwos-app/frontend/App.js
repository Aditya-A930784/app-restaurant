import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';

export default function App() {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState('');

  const addOrder = () => {
    if (newOrder.trim()) {
      setOrders([...orders, { id: Date.now().toString(), item: newOrder, status: 'Pending' }]);
      setNewOrder('');
    }
  };

  const updateOrderStatus = (id) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: order.status === 'Pending' ? 'Completed' : 'Pending' } : order
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍽️ Restaurant Work Orders</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter new order"
          value={newOrder}
          onChangeText={setNewOrder}
        />
        <TouchableOpacity style={styles.addButton} onPress={addOrder}>
          <Text style={styles.buttonText}>Add Order</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.orderItem, item.status === 'Completed' && styles.completed]}
            onPress={() => updateOrderStatus(item.id)}
          >
            <Text style={styles.orderText}>{item.item}</Text>
            <Text style={styles.statusText}>{item.status}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  completed: {
    backgroundColor: '#e8f5e8',
  },
  orderText: {
    fontSize: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
});