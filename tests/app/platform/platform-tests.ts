import * as TKUnit from "../tk-unit";
import * as app from "@nativescript/core/application";
import * as platformModule from "@nativescript/core/platform";
import { ios } from "@nativescript/core/utils/utils";

export function test_platform() {
    let expectedPlatform;
    if (app.android) {
        expectedPlatform = "Android";
    } else {
        expectedPlatform = "iOS";
    }
    TKUnit.assertEqual(platformModule.Device.os, expectedPlatform);
}

export function test_device_screen() {
    TKUnit.assert(platformModule.Device.model, "Device model not initialized.");
    TKUnit.assert(platformModule.Device.manufacturer, "Device manufacturer not initialized.");
    TKUnit.assert(platformModule.Device.deviceType, "Device type not initialized.");
    TKUnit.assert(platformModule.Device.uuid, "Device UUID not initialized.");

    TKUnit.assert(platformModule.Device.language, "Preferred language not initialized.");
    
    // NSLocale.currentLocale.objectForKey(NSLocaleCountryCode) not initialized by default on iOS13 simulator;
    // can be set through Settings -> General -> Language & Region -> Region
    if (platformModule.isAndroid || ios.MajorVersion < 13) {
        TKUnit.assert(platformModule.Device.region, "Preferred region not initialized.");
    }

    TKUnit.assert(platformModule.Device.os, "OS not initialized.");
    TKUnit.assert(platformModule.Device.osVersion, "OS version not initialized.");
    TKUnit.assert(platformModule.Device.sdkVersion, "SDK version not initialized.");

    TKUnit.assert(platformModule.screen.mainScreen.widthPixels, "Screen width (px) not initialized.");
    TKUnit.assert(platformModule.screen.mainScreen.heightPixels, "Screen height (px) not initialized.");
    TKUnit.assert(platformModule.screen.mainScreen.widthDIPs, "Screen width (DIPs) not initialized.");
    TKUnit.assert(platformModule.screen.mainScreen.heightDIPs, "Screen height (DIPs) not initialized.");
    TKUnit.assert(platformModule.screen.mainScreen.scale, "Screen scale not initialized.");
}

export function test_IsAndroid_IsIOS() {
    if (platformModule.isIOS) {
        TKUnit.assertTrue(!!NSObject, "isIOS is true-ish but common iOS APIs are not available.");
    } else if (platformModule.isAndroid) {
        TKUnit.assertTrue(!!android, "isAndroid is true-ish but common 'android' package is not available.");
    }
}
