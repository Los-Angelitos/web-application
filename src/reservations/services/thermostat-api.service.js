import http from "../../shared/services/http-common.js";
import {Thermostat} from "../model/thermostat.entity.js";

export class ThermostatApiService {
    createThermostat(thermostat) {
        return http.post('/thermostat/create-thermostat', Thermostat.toDisplayableThermostat(thermostat));
    }

    getThermostatById(thermostatId) {
        return http.get(`/thermostat/get-thermostat-by-id?id=${thermostatId}`);
    }

    getAllThermostats() {
        return http.get('/thermostat/get-all-thermostats');
    }

    updateThermostat(thermostat) {
        return http.put('/thermostat/update-thermostat', thermostat);
    }

    updateThermostatState(thermostatId, state) {
        return http.put('/thermostat/update-thermostat-state', {
            id: thermostatId,
            state: state
        });
    }

    updateThermostatTemperature(thermostatId, temperature) {
        return http.put('/thermostat/update-thermostat-temperature', {
            id: thermostatId,
            temperature: temperature
        });
    }
}
