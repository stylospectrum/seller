class User {
  id?: string;
  name?: string;
  email: string;
  password?: string;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
  }
}

export default User;
