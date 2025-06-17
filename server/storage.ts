// Simple storage interface for potential future server-side operations
// Currently using Supabase for all user management and authentication

export interface IStorage {
  // Placeholder for future server-side operations if needed
}

export class SimpleStorage implements IStorage {
  constructor() {
    console.log('Storage initialized (using Supabase for auth)');
  }
}

export const storage = new SimpleStorage();
