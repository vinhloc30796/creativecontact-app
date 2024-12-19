import { StorageInterface } from "./infras";

class StorageUserCase {
  constructor(
    private storageInfras: StorageInterface
  ) { }

  getUserDataUsage(
    userId: string
  ) {
    return this.storageInfras.getUserDataUsage(userId);
  }
}

export {
  StorageUserCase
}