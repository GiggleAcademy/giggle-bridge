import './native-bridge';
interface PlatformInfo {
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
interface RouterPlugin {
    route(url: string): Promise<void>;
    dismiss(): Promise<void>;
    dismissLoading(): Promise<void>;
}
interface PreferencePlugin {
    readValues(keys?: string[]): Promise<PlatformInfo>;
}
declare global {
    interface Window {
        GiggleBridgeAPI?: Bridge;
    }
}
declare class Bridge {
    private router;
    private preference;
    platformInfo: PlatformInfo;
    isPlatformInited: boolean;
    constructor();
    callNative(plugin: string, method: string, params?: any): Promise<any>;
    inviteFriends(): Promise<void>;
    playGame(): Promise<void>;
    finishChallenge(): Promise<void>;
    flashcardLearning(): Promise<void>;
    dismissLoading(): Promise<void>;
    private _fetchPlatformInfo;
    requestPlatformInfoAsync(): Promise<PlatformInfo>;
    requestPlatformInfo(success: (info: PlatformInfo) => void, fail?: (error: any) => void): void;
    forceRefreshPlatformInfo(): Promise<PlatformInfo>;
    get pointsDescDoneBtn(): string;
    dismiss(): Promise<void>;
}
declare const bridge: Bridge;
export { PlatformInfo, Bridge, RouterPlugin, PreferencePlugin };
export default bridge;
