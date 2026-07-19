import { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Pressable, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useExercises } from '../hooks/useExercises'; // Ensure this path matches your structure
import { ExerciseMain } from '../components/ExerciseMain'; // Ensure this path matches your structure
import { getDb } from '../services/dbService';




export default function HomeScreen() {
  const [muscle, setMuscle] = useState('triceps');
  // Our custom hook manages the DB logic and loading state
  const { data, loading, error } = useExercises(muscle);
  const router = useRouter();

  useEffect(() => {
      const debugTargets = async () => {
          try {
              const db = await getDb();
              const targets = await db.getAllAsync('SELECT DISTINCT target FROM exercises');
              console.log("Available targets in DB:", targets);
          } catch (e) {
              console.log("Debug failed:", e);
          }
      };
      debugTargets();
  }, []);
  // 1. Handle Loading
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10 }}>Loading {muscle} exercises...</Text>
      </View>
    );
  }

  // 2. Handle Error
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }
console.log("Current muscle:", muscle);
console.log("Data count:", data?.length);
  return (
    <View style={styles.container}>
      {/* Category Toggle Tabs */}
      <View style={styles.tabContainer}>
        <Pressable 
            onPress={() => setMuscle('triceps')} 
            style={[styles.tab, muscle === 'triceps' && styles.activeTab]}
        >
            <Text style={muscle === 'triceps' ? styles.activeTabText : styles.tabText}>triceps</Text>
        </Pressable>
        <Pressable 
            onPress={() => setMuscle('abs')} 
            style={[styles.tab, muscle === 'abs' && styles.activeTab]}
        >
            <Text style={muscle === 'abs' ? styles.activeTabText : styles.tabText}>Abs</Text>
        </Pressable>
      </View>

      {/* Exercise List */}
      <FlatList
  data={data}
  keyExtractor={(item) => item.id}
  contentContainerStyle={styles.listContent}
  renderItem={({ item }) => {
    // Construct the full URL
    const BASE_URL = 'https://raw.githubusercontent.com/ntshuxekoshirinda/exercises-dataset/main/';
    const imageUrl = `${BASE_URL}${item.image}`;

    return (
      <View style={styles.cardWrapper}>
        <ExerciseMain
          title={item.name}
          // Use the constructed URL here
          imageSource={{ uri: imageUrl }} 
          onPress={() => router.push({ 
            pathname: '/exercise', 
            params: { id: item.id } 
          })}
        />
      </View>
    );
  }}
/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5',
    paddingTop: 50 // Adjust based on your header needs
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  tabContainer: { 
    flexDirection: 'row', 
    paddingHorizontal: 20, 
    marginBottom: 20 
  },
  tab: { 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#ddd'
  },
  activeTab: { 
    backgroundColor: '#007AFF' 
  },
  tabText: { color: '#333' },
  activeTabText: { color: '#fff', fontWeight: 'bold' },
  listContent: { 
    paddingHorizontal: 20, 
    paddingBottom: 20 
  },
  cardWrapper: { 
    height: 150, // Matches the height defined in ExerciseMain
    marginBottom: 20,
    width: '100%'
  },
  errorText: { 
    color: 'red', 
    fontSize: 16 
  }
});