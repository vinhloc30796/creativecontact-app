import { db } from "@/lib/db";
import { StorageInfras } from "./infras";
import { StorageUserCase } from "./usecase";

export function getStorageUserCase() {
  const storageInfras = new StorageInfras(db);
  return new StorageUserCase(storageInfras);
}