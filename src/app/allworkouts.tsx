import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useExercises } from '../hooks/useExercises';
import { ExerciseMain } from '../components/ExerciseMain';

export default function AllWorkoutsScreen() {
  const [muscle, setMuscle] = useState('abs');
  const { data, loading, error } = useExercises(muscle);
  const router = useRouter();

  const BASE_URL = 'https://raw.githubusercontent.com/ntshuxekoshirinda/exercises-dataset/main/';

  return (
    <View style={styles.container}>
      {/* Muscle Filter Selector for Abs and Triceps */}
      <View style={styles.filterContainer}>
        <Pressable 
          style={[styles.filterButton, muscle === 'abs' && styles.activeFilterButton]}
          onPress={() => setMuscle('abs')}
        >
          <Text style={[styles.filterText, muscle === 'abs' && styles.activeFilterText]}>Abs</Text>
        </Pressable>

        <Pressable 
          style={[styles.filterButton, muscle === 'triceps' && styles.activeFilterButton]}
          onPress={() => setMuscle('triceps')}
        >
          <Text style={[styles.filterText, muscle === 'triceps' && styles.activeFilterText]}>Triceps</Text>
        </Pressable>
      
      <Pressable 
          style={[styles.filterButton, muscle === 'lats' && styles.activeFilterButton]}
          onPress={() => setMuscle('lats')}
        >
          <Text style={[styles.filterText, muscle === 'lats' && styles.activeFilterText]}>lats</Text>
        </Pressable>
     
      <Pressable 
          style={[styles.filterButton, muscle === 'pectorals' && styles.activeFilterButton]}
          onPress={() => setMuscle('pectorals')}
        >
          <Text style={[styles.filterText, muscle === 'pectorals' && styles.activeFilterText]}>pectorals</Text>
        </Pressable>
      </View>

      {/* Main Content Area */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#7CB342" />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const gifUrl = `${BASE_URL}${item.gif_url}`;

            return (
              <View style={styles.cardWrapper}>
                <ExerciseMain
                  title={item.name}
                  imageSource={{ uri: gifUrl }}
                  onPress={() => router.push({ 
                    pathname: '/exercise', 
                    params: { id: item.id } 
                  })}
                />
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f1f3f5',
    marginHorizontal: 8,
  },
  activeFilterButton: {
    backgroundColor: '#7CB342',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  activeFilterText: {
    color: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 20,
  },
  cardWrapper: {
    marginBottom: 15,
    width: '100%',
    paddingHorizontal: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});