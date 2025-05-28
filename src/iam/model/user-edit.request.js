export default class UserEditRequest {
    constructor(name, surname, phone, email, state, roleId, photoURL) {
        this.name = name;
        this.surname = surname;
        this.phone = phone;
        this.email = email;
        this.state = state;
        this.roleId = roleId;
        this.photoURL = photoURL;
    }
}