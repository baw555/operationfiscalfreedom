import bcrypt from "bcrypt";
import { storage } from "./storage";
import type { User } from "@shared/schema";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const user = await storage.getUserByEmail(email);
  if (!user) return null;
  
  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) return null;
  
  return user;
}

export async function createAdminUser(name: string, email: string, password: string): Promise<User> {
  const passwordHash = await hashPassword(password);
  return storage.createUser({ name, email, passwordHash, role: "admin" });
}

export async function createAffiliateUser(name: string, email: string, password: string): Promise<User> {
  const passwordHash = await hashPassword(password);
  return storage.createUser({ name, email, passwordHash, role: "affiliate" });
}
