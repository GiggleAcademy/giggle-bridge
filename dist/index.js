"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bridge = void 0;
require("./native-bridge");
const router_plugin_1 = require("./router-plugin");
const preference_plugin_1 = require("./preference-plugin");
const IS_TEST = process.env.NODE_ENV === 'test';
const IS_DEV = process.env.NODE_ENV === 'development';
class Bridge {
    constructor() {
        this.platformInfo = {
            platform: 'web',
            userId: IS_TEST ? '624100027826245' : IS_DEV ? '669347175456837' : '',
            kidId: IS_TEST ? '658400463949893' : IS_DEV ? '695694780444741' : '',
            kidName: 'me',
            appBaseUrl: IS_DEV ? '/api' : '',
            token: IS_TEST
                ? 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0aW1lU3RhbXAiOjE3NDc4OTcyNDk0ODEsInVzZXJJZCI6NjI0MTAwMDI3ODI2MjQ1LCJlbWFpbCI6IjE1OTc4ODc2MjBAcXEuY29tIiwidXNlcm5hbWUiOiJkYXJyZW4ifQ.FDgTG2t5pvrhdbmqS3MItA2-eyk3YUYB0DDYdrI4X4U'
                : IS_DEV
                    ? 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0aW1lU3RhbXAiOjE3NTM3NTY0MzMwNTUsInVzZXJJZCI6NjY5MzQ3MTc1NDU2ODM3LCJlbWFpbCI6Imp1bi5sQGdpZ2dsZWFjYWRlbXkubWUiLCJ1c2VybmFtZSI6ImwganVuIn0.Fyal_HiQu5HB3T2py3svD_4i_NTd8uY6wZ0Npg5tnRc'
                    : '',
            storyQuiz: '',
            language: 'en',
            pointsDescDoneBtn: '0,0,0,0',
            appVersion: IS_DEV ? '999.0.0' : '1.16.0',
            greyScaleMode: '',
        };
        this.isPlatformInited = false;
        this.router = new router_plugin_1.RouterPluginImpl(this.callNative.bind(this));
        this.preference = new preference_plugin_1.PreferencePluginImpl(this.callNative.bind(this));
    }
    callNative(plugin, method, params) {
        console.log(`🚀 GiggleBridge.callNative: ${plugin}.${method}`, params);
        if (typeof window !== 'undefined' && window.GiggleBridge?.callNative) {
            return window.GiggleBridge.callNative(plugin, method, params);
        }
        console.warn('Native bridge not available, using fallback');
        return Promise.resolve(null);
    }
    async inviteFriends() {
        await this.router.route('giggleacademy://unity/inviteFriends');
    }
    async playGame() {
        await this.router.route('giggleacademy://unity/playGame');
    }
    async finishChallenge() {
        await this.router.route('giggleacademy://unity/finishChallenge');
    }
    async flashcardLearning() {
        await this.router.route('giggleacademy://unity/flashcardLearning');
    }
    async dismissLoading() {
        await this.router.dismissLoading();
    }
    async dismiss() {
        await this.router.dismiss();
    }
    async _fetchPlatformInfo() {
        const info = await this.preference.readValues();
        this.platformInfo = { ...this.platformInfo, ...info };
        this.isPlatformInited = true;
        return this.platformInfo;
    }
    async requestPlatformInfoAsync() {
        if (this.isPlatformInited) {
            console.log('🚀 Platform info already initialized, returning cached data', this.platformInfo);
            return this.platformInfo;
        }
        try {
            await this._fetchPlatformInfo();
            console.log('✅ Platform info initialized successfully', this.platformInfo);
            return this.platformInfo;
        }
        catch (error) {
            console.error('❌ Failed to request platform info:', error);
            throw error;
        }
    }
    requestPlatformInfo(success, fail) {
        this.requestPlatformInfoAsync().then(success).catch(fail);
    }
    async forceRefreshPlatformInfo() {
        console.log('🔄 Force refreshing platform info...');
        try {
            await this._fetchPlatformInfo();
            console.log('✅ Platform info force refreshed successfully');
            return this.platformInfo;
        }
        catch (error) {
            console.error('❌ Failed to force refresh platform info:', error);
            throw error;
        }
    }
    get pointsDescDoneBtn() {
        return this.platformInfo.pointsDescDoneBtn;
    }
}
exports.Bridge = Bridge;
const bridge = new Bridge();
exports.default = bridge;
