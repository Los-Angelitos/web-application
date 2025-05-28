export class User {
    constructor(id, name, surname, phone, email, state, roleId, photoURL) {
        this.id = id;
        this.name = name;
        this.surname = surname || "N/A";
        this.phone = phone;
        this.email = email;
        this.state = state;
        this.roleId = roleId;
        this.photoURL = photoURL || ''; // Default to null if photoURL is not provided
    }

    static fromDisplayableUser(displayableUser) {
        return new User(
            displayableUser.id,
            displayableUser.name,
            displayableUser.surname || "N/A", // Default to "N/A" if surname is not provided
            displayableUser.phone,
            displayableUser.email,
            displayableUser.state,
            displayableUser.roleId,
            displayableUser.photoURL || '' // Default to '' if photoURL is not provided
        );
    }

    static toDisplayableUser(displayableUser) {
        return {
            id: displayableUser.id,
            name: displayableUser.name,
            surname: displayableUser.surname || "N/A", // Default to "N/A" if surname is not provided
            phone: displayableUser.phone,
            email: displayableUser.email,
            state: displayableUser.state,
            roleId: displayableUser.roleId,
            photoURL: displayableUser.photoURL || '' // Default to '' if photoURL is not provided
        };
    }
}