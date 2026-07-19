import { View, Text, StyleSheet, Switch } from 'react-native';
import { useState } from 'react';

export default function ProfileScreen() {
  const [notifications, setNotifications] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>
      
      <View style={styles.section}>
        <Text style={styles.label}>Workout Notifications</Text>
        <Switch 
          value={notifications} 
          onValueChange={setNotifications} 
        />
      </View>

      <Text style={styles.footer}>Gym Tracker v1.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
  },
  footer: {
    marginTop: 50,
    textAlign: 'center',
    color: '#888',
  },
});