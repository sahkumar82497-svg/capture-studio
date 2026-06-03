import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'mock-db.json');

// Initialize if it doesn't exist
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ bookings: [], galleries: [] }));
}

export function getDb() {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return { bookings: [], galleries: [] };
  }
}

export function saveDb(data: any) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}
