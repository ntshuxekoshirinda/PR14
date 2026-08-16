import * as SQLite from 'expo-sqlite';

export interface Exercise {
    id: string;
    name: string;
    category: string;
    body_part: string;
    equipment: string;
    instructions_en: string;
    instructions_tr: string;
    muscle_group: string;
    secondary_muscles: string[];
    target: string;
    image: string;
    gif_url: string;
    created_at: string;
}

let dbCache: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
    if (dbCache) return dbCache;
    dbCache = await SQLite.openDatabaseAsync('gym.db');
    return dbCache;
}

export async function setupDatabase() {
    const db = await getDb();
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS exercises (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            category TEXT,
            body_part TEXT,
            equipment TEXT,
            instructions_en TEXT,
            instructions_tr TEXT,
            muscle_group TEXT,
            secondary_muscles TEXT,
            target TEXT,
            image TEXT,
            gif_url TEXT,
            created_at TEXT
        );
    `);
}

export async function fetchExercisesFromGitHub(): Promise<any[]> {
    const GITHUB_URL = 'https://raw.githubusercontent.com/ntshuxekoshirinda/exercises-dataset/main/data/exercises.json';
    const response = await fetch(GITHUB_URL);
    if (!response.ok) throw new Error('Failed to fetch data from GitHub');
    return await response.json();
}

export async function seedDatabase() {
    try {
        const db = await getDb();
        
        // Check if data already exists so we don't unnecessarily re-fetch every launch
        const rowCount = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM exercises');
        if (rowCount && rowCount.count > 0) {
            return; // Already seeded, skip fetch
        }

        // DROP the table to guarantee a fresh start if empty
        await db.execAsync('DROP TABLE IF EXISTS exercises');
        await setupDatabase();

        const exercises = await fetchExercisesFromGitHub();

        await db.withTransactionAsync(async () => {
            for (const item of exercises) {
                const instructionsEn = typeof item.instructions === 'object' && item.instructions !== null
                    ? (item.instructions as any).en || ''
                    : '';

                const instructionsTr = typeof item.instructions === 'object' && item.instructions !== null
                    ? (item.instructions as any).tr || ''
                    : '';

                await db.runAsync(
                    `INSERT INTO exercises (id, name, category, body_part, equipment, instructions_en, instructions_tr, muscle_group, secondary_muscles, target, image, gif_url, created_at) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        item.id, 
                        item.name, 
                        item.category, 
                        item.body_part, 
                        item.equipment,
                        instructionsEn, 
                        instructionsTr, 
                        item.muscle_group,
                        JSON.stringify(item.secondary_muscles || []), 
                        item.target, 
                        item.image, 
                        item.gif_url, 
                        item.created_at
                    ]
                );
            }
        });
        console.log("Database seeded successfully with instructions!");
    } catch (error) {
        console.error("Seeding failed (app will run with empty/existing local data):", error);
        // Prevent crash by catching the error gracefully
    }
}

export async function getExercisesByMuscle(muscle: string): Promise<Exercise[]> {
    const db = await getDb();
    const results = await db.getAllAsync<any>(
        'SELECT * FROM exercises WHERE LOWER(target) LIKE LOWER(?)', 
        [`%${muscle}%`] 
    );
    
    return results.map(item => ({
        ...item,
        secondary_muscles: item.secondary_muscles ? JSON.parse(item.secondary_muscles) : []
    }));
}