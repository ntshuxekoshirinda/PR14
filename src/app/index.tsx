import React from 'react';
import { ScrollView, Text, StyleSheet, Pressable, ImageBackground, View } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const startFailureWorkout = (groupName: string) => {
    router.push({
      pathname: '/failure-workout',
      params: { group: groupName }
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerTitle}>Select Your Path</Text>

      {/* Button Card: Hypertrophy Workout */}
      <Pressable 
        style={styles.cardContainer} 
        onPress={() => router.push('/workout')}
      >
        <ImageBackground 
          source={require('../../assets/images/equip.jpg')} 
          style={styles.backgroundImage}
          imageStyle={styles.imageStyle}
        >
          <View style={styles.overlay}>
            <Text style={styles.cardTitle}>Hypertrophy Workout</Text>
            <Text style={styles.cardSubtitle}>Skinny-Fat Recomp Routine & Structured Exercises</Text>
          </View>
        </ImageBackground>
      </Pressable>

      {/* Button Card: Hypertrophy Body Weight Workout */}
      <Pressable 
        style={styles.cardContainer} 
        onPress={() => router.push('/bodyweight-workout')}
      >
        <ImageBackground 
          source={require('../../assets/images/hyper.jpg')} 
          style={styles.backgroundImage}
          imageStyle={styles.imageStyle}
        >
          <View style={styles.overlay}>
            <Text style={styles.cardTitle}>Hypertrophy Body Weight Workout</Text>
            <Text style={styles.cardSubtitle}>Zero Equipment Required • 20 Reps / 120s Timer</Text>
          </View>
        </ImageBackground>
      </Pressable>

      {/* Button Card: Chest Workout (To Failure) */}
      <Pressable 
        style={styles.cardContainer} 
        onPress={() => startFailureWorkout('Chest')}
      >
        <ImageBackground 
          source={require('../../assets/images/chest.jpg')} 
          style={styles.backgroundImage}
          imageStyle={styles.imageStyle}
        >
          <View style={styles.overlay}>
            <Text style={styles.cardTitle}>Chest Workout (To Failure)</Text>
            <Text style={styles.cardSubtitle}>Pectoral Focus • Train to Failure / 120s Timer</Text>
          </View>
        </ImageBackground>
      </Pressable>

      {/* Button Card: Back Workout (To Failure) */}
      <Pressable 
        style={styles.cardContainer} 
        onPress={() => startFailureWorkout('Back')}
      >
        <ImageBackground 
          source={require('../../assets/images/back.jpg')} 
          style={styles.backgroundImage}
          imageStyle={styles.imageStyle}
        >
          <View style={styles.overlay}>
            <Text style={styles.cardTitle}>Back Workout (To Failure)</Text>
            <Text style={styles.cardSubtitle}>Lats & Upper Back Focus • Train to Failure</Text>
          </View>
        </ImageBackground>
      </Pressable>

      {/* Button Card: Legs Workout (To Failure) */}
      <Pressable 
        style={styles.cardContainer} 
        onPress={() => startFailureWorkout('Legs')}
      >
        <ImageBackground 
          source={require('../../assets/images/leg.jpg')} 
          style={styles.backgroundImage}
          imageStyle={styles.imageStyle}
        >
          <View style={styles.overlay}>
            <Text style={styles.cardTitle}>Legs Workout (To Failure)</Text>
            <Text style={styles.cardSubtitle}>Quads, Glutes & Hamstrings • Train to Failure</Text>
          </View>
        </ImageBackground>
      </Pressable>

      {/* Button Card: Shoulders Workout (To Failure) */}
      <Pressable 
        style={styles.cardContainer} 
        onPress={() => startFailureWorkout('Shoulders')}
      >
        <ImageBackground 
          source={require('../../assets/images/shoulder.jpg')} 
          style={styles.backgroundImage}
          imageStyle={styles.imageStyle}
        >
          <View style={styles.overlay}>
            <Text style={styles.cardTitle}>Shoulders Workout (To Failure)</Text>
            <Text style={styles.cardSubtitle}>Delts Focus • Train to Failure</Text>
          </View>
        </ImageBackground>
      </Pressable>

      {/* Button Card: Arms Workout (To Failure) */}
      <Pressable 
        style={styles.cardContainer} 
        onPress={() => startFailureWorkout('Arms')}
      >
        <ImageBackground 
          source={require('../../assets/images/arm.jpg')} 
          style={styles.backgroundImage}
          imageStyle={styles.imageStyle}
        >
          <View style={styles.overlay}>
            <Text style={styles.cardTitle}>Arms Workout (To Failure)</Text>
            <Text style={styles.cardSubtitle}>Biceps & Triceps • Train to Failure</Text>
          </View>
        </ImageBackground>
      </Pressable>

      {/* Button Card: Core Workout (To Failure) */}
      <Pressable 
        style={styles.cardContainer} 
        onPress={() => startFailureWorkout('Core')}
      >
        <ImageBackground 
          source={require('../../assets/images/abs.jpg')} 
          style={styles.backgroundImage}
          imageStyle={styles.imageStyle}
        >
          <View style={styles.overlay}>
            <Text style={styles.cardTitle}>Core Workout (To Failure)</Text>
            <Text style={styles.cardSubtitle}>Abs Focus • Train to Failure</Text>
          </View>
        </ImageBackground>
      </Pressable>

      {/* Button Card: Abs 60s Circuit Timer */}
      <Pressable 
        style={styles.cardContainer} 
        onPress={() => router.push('/abs-circuit')}
      >
        <ImageBackground 
          source={require('../../assets/images/abs.jpg')} 
          style={styles.backgroundImage}
          imageStyle={styles.imageStyle}
        >
          <View style={styles.overlay}>
            <Text style={styles.cardTitle}>Abs 60s Circuit Timer</Text>
            <Text style={styles.cardSubtitle}>6 Exercises • Automated 60-Second Countdown</Text>
          </View>
        </ImageBackground>
      </Pressable>

      {/* Button Card: All Workouts Database */}
      <Pressable 
        style={styles.cardContainer} 
        onPress={() => router.push('/allworkouts')}
      >
        <ImageBackground 
          source={require('../../assets/images/all.jpg')} 
          style={styles.backgroundImage}
          imageStyle={styles.imageStyle}
        >
          <View style={styles.overlay}>
            <Text style={styles.cardTitle}>All Workouts Database</Text>
            <Text style={styles.cardSubtitle}>Browse All Exercises by Muscle Category</Text>
          </View>
        </ImageBackground>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#212529',
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  cardContainer: {
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    height: '100%',
  },
  imageStyle: {
    borderRadius: 16,
    resizeMode: 'cover',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    padding: 16,
    justifyContent: 'flex-end',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#e9ecef',
  },
});