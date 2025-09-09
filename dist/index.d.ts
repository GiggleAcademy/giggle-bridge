import './native-bridge';
import { PlatformInfo } from './preference-plugin';
export declare const isInContainerization: boolean;
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
    dismiss(): Promise<void>;
    private _fetchPlatformInfo;
    requestPlatformInfoAsync(): Promise<PlatformInfo>;
    requestPlatformInfo(success: (info: PlatformInfo) => void, fail?: (error: any) => void): void;
    forceRefreshPlatformInfo(): Promise<PlatformInfo>;
    get pointsDescDoneBtn(): string;
}
declare const bridge: Bridge;
export { RouterPlugin } from './router-plugin';
export { PreferencePlugin, PlatformInfo } from './preference-plugin';
export { Bridge };
export default bridge;
