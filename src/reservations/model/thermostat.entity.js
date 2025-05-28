export class Thermostat {
    constructor(roomId, ipAddress, macAddress, temperature, state, lastUpdate) {
        this.roomId = roomId;
        this.ipAddress = ipAddress;
        this.macAddress = macAddress;
        this.temperature = temperature;
        this.state = state;
        this.lastUpdate = lastUpdate;
    }

    static fromDisplayableThermostat(displayableThermostat) {
        return new Thermostat(
            displayableThermostat.roomId,
            displayableThermostat.ipAddress,
            displayableThermostat.macAddress,
            displayableThermostat.temperature,
            displayableThermostat.state,
            displayableThermostat.lastUpdate
        );
    }

    static toDisplayableThermostat(thermostat) {
        return {
            roomId: thermostat.roomId,
            ipAddress: thermostat.ipAddress,
            macAddress: thermostat.macAddress,
            temperature: thermostat.temperature,
            state: thermostat.state,
            lastUpdate: thermostat.lastUpdate
        };
    }
}
