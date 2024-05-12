declare module '#auth-utils' {
  // Use 'readonly' to ensure the role property cannot be modified after creation
  interface User {
    readonly role: 'admin' | 'user' | 'guest';
  }

  // Add types for optional properties and use 'Date' for timestamp
  interface UserSession {
    lastAttemptAt?: Date;
  }

  // Add a utility function to check if a user has a specific role
  function hasRole(user: User, role: 'admin' | 'user'): boolean;
}

export {};
