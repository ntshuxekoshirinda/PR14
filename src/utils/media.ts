const BASE_URL = 'https://raw.githubusercontent.com/ntshuxekoshirinda/exercises-dataset/main';

export function getMediaUrl(filename: string): string {
    if (!filename) return '';
    if (filename.endsWith('.gif')) {
        return `${BASE_URL}/videos/${filename}`;
    }
    return `${BASE_URL}/images/${filename}`;
}