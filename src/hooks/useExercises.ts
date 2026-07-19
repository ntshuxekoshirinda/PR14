import { useState, useEffect } from 'react';
import { getExercisesByMuscle, Exercise } from '../services/dbService';

export function useExercises(muscle: string) {
    const [data, setData] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                const results = await getExercisesByMuscle(muscle);
                console.log(`Debug: Querying for muscle "${muscle}" returned:`, results);
                setData(results);
            } catch (err) {
                setError('Failed to load exercises');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [muscle]);

    return { data, loading, error };
}