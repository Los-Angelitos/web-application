export class User {
    constructor(id, name, surname, phone, email, state, roleId) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.phone = phone;
        this.email = email;
        this.state = state;
        this.roleId = roleId;
    }

    static fromDisplayableUser(displayableUser) {
        return new User(
            displayableUser.id,
            displayableUser.name,
            displayableUser.surname,
            displayableUser.phone,
            displayableUser.email,
            displayableUser.state,
            displayableUser.roleId
        );
    }

    static toDisplayableUser(displayableUser) {
        return {
            id: displayableUser.id,
            name: displayableUser.name,
            surname: displayableUser.surname,
            phone: displayableUser.phone,
            email: displayableUser.email,
            state: displayableUser.state,
            roleId: displayableUser.roleId
        };
    }
}