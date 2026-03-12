export interface User {
  id: string;
  email: string;
  fullName: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSession {
  user: {
    sub: string;
    email: string;
    name?: string;
    picture?: string;
  };
}
