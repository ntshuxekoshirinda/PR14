import React, { Component, ReactNode, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { setupDatabase, seedDatabase } from '../services/dbService';

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>⚠️ Runtime Crash Caught</Text>
          <ScrollView style={styles.scroll}>
            <Text style={styles.errorText}>{this.state.error?.toString()}</Text>
            <Text style={styles.stackText}>{this.state.error?.stack}</Text>
          </ScrollView>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function RootLayout() {
  useEffect(() => {
    async function init() {
      try {
        await setupDatabase();
        await seedDatabase();
      } catch (e) {
        console.error("Database init error:", e);
      }
    }
    init();
  }, []);

  return (
    <ErrorBoundary>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Home', headerShown: false }} />
        <Stack.Screen name="workout" options={{ title: 'Workout Routine' }} />
        <Stack.Screen name="allworkouts" options={{ title: 'All Workouts' }} />
        <Stack.Screen name="abs-circuit" options={{ title: 'Abs Circuit Timer' }} />
        <Stack.Screen name="exercise" options={{ title: 'Exercise Details' }} />
      </Stack>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 25, justifyContent: 'center' },
  title: { color: '#ff5252', fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  scroll: { backgroundColor: '#1e1e1e', padding: 15, borderRadius: 8, maxHeight: '80%' },
  errorText: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginBottom: 10 },
  stackText: { color: '#aaa', fontSize: 11 },
});