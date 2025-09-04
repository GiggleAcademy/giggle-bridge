export interface PlatformInfo {
    platform: string;
    version?: string;
    userId: string;
    kidId: string;
    kidName: string;
    appBaseUrl: string;
    token: string;
    storyQuiz: string;
    language: string;
    pointsDescDoneBtn: string;
    appVersion: string;
    greyScaleMode: string;
}
type CallNativeFn = (plugin: string, method: string, params?: any) => Promise<any>;
export interface PreferencePlugin {
    readValues(keys?: string[]): Promise<PlatformInfo>;
}
export declare class PreferencePluginImpl implements PreferencePlugin {
    private callNative;
    constructor(callNative: CallNativeFn);
    readValues(keys?: string[]): Promise<PlatformInfo>;
}
export {};
