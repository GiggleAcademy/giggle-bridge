"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreferencePluginImpl = void 0;
class PreferencePluginImpl {
    constructor(callNative) {
        this.callNative = callNative;
    }
    async readValues(keys) {
        try {
            const data = await this.callNative('Preference', 'readValues', { keys });
            return data || {};
        }
        catch (error) {
            console.error('Failed to read platform values:', error);
            throw error;
        }
    }
}
exports.PreferencePluginImpl = PreferencePluginImpl;
