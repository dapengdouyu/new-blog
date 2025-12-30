interface User {
  id: number
  name: string
  email: string
  isActive: boolean
}

class UserService {
  private users: User[] = []

  addUser(user: User): void {
    this.users.push(user)
  }

  getActiveUsers(): User[] {
    return this.users.filter(user => user.isActive)
  }

  findUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id)
  }
}

export default UserService
