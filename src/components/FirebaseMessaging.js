import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Linking, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';

const getUserToken = async () => {
    const token = await AsyncStorage.getItem("@user");
    return token;
};

// Request permission to send notifications
async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
        console.log('Authorization status:', authStatus);
    } else {
        console.log('not enabled');
    }
}

// Request Android-specific notification permission 
async function requestAndroidNotificationPermission() {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            {
                title: 'Notification Permission',
                message: 'This app needs access to send you notifications.',
            }
        );
    } catch (err) {
        throw new Error("[Notification] request android permission error: ", err);
    }
}

// Get the current notification token
async function getNotificationToken() {
    try {
        const token = await messaging().getToken();
        // console.log('Notification Token:', token);
        if (Platform.OS == 'ios') {
            if (token) {
                const userToken = await getUserToken();
                if (userToken) {
                    const dPlatform = Device.osName;
                    const dName = Device.deviceName;
                    const manufacturer = Device.brand;
                    const payload = {
                        deviceToken: token,
                        devicePlatform: dPlatform,
                        deviceName: dName,
                        deviceType: manufacturer
                    }
                    await sendNotificationToken(userToken, payload);
                }
            }
        }
    } catch (error) {
        console.error('Error getting notification token:', error);
    }
}

// Listen for token refresh events
const onTokenRefresh = messaging().onTokenRefresh(async token => {
    console.log('Token refreshed!', token);
});

async function updateNotificationCount() {
    try {
        const oldNotificationCountStr = await AsyncStorage.getItem('@notification');
        let oldNotificationCount = oldNotificationCountStr ? parseInt(oldNotificationCountStr) : 0;
        oldNotificationCount += 1;
        const countInString = oldNotificationCount.toString();
        await AsyncStorage.setItem('@notification', countInString);
    } catch (error) {
        throw new Error("[Notification] Error updating notification count in red dot:", error);
    }
}

async function decreaseNotificationCount() {
    try {
        const oldNotificationCountStr = await AsyncStorage.getItem('@notification');
        let oldNotificationCount = oldNotificationCountStr ? parseInt(oldNotificationCountStr) : 0;

        // Only decrease if the count is greater than 0
        if (oldNotificationCount > 0) {
            oldNotificationCount -= 1;
            const countInString = oldNotificationCount.toString();
            await AsyncStorage.setItem('@notification', countInString);
        }
    } catch (error) {
        throw new Error("[Notification] Error decreasing notification count in red dot:", error);
    }
}


// Initialize Firebase Messaging
export const initFirebaseMessaging = async (setBannerMessage) => {
    await getNotificationToken();
    await requestUserPermission();
    await requestAndroidNotificationPermission();
    messaging.NotificationAndroidPriority.PRIORITY_HIGH;
    messaging.NotificationAndroidVisibility.VISIBILITY_PRIVATE;

    // Foreground message handler
    const unsubscribe = messaging().onMessage(async remoteMessage => {
        console.log('foreground message received', remoteMessage);

        const messageContent = remoteMessage || {};
        setBannerMessage(messageContent);
        updateNotificationCount();
    });

    // Background and quit state messages
    messaging().setBackgroundMessageHandler(async remoteMessage => {
        // console.log('Message handled in the background!', remoteMessage);
        updateNotificationCount();
    });
    // Handle notification clicks
    messaging().onNotificationOpenedApp(async (remoteMessage) => {
        const deepLink = remoteMessage.data?.deepLink;
        await decreaseNotificationCount();
        if (deepLink) {
            Linking.openURL(deepLink);
        }
    });
    return () => {
        unsubscribe(); // Clean up the listener when no longer needed
        onTokenRefresh(); // Clean up token refresh listener
    };
};