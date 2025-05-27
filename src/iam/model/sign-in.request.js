export default class SignInRequest {
    constructor(email, password, roleId) {
        this.email = email;
        this.password = password;
        this.roleId = roleId;
    }
}