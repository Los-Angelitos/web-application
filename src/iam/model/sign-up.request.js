export default class SignUpRequest {
    constructor(id, name, surname, phone, email, password) {
        this.id = id; // Optional, can be null for new users
        this.name = name;
        this.surname = surname;
        this.phone = phone;
        this.email = email;
        this.password = password; // Password should be hashed before sending to the server
    }
}