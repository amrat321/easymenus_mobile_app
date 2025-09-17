// // utils/usePushNotifications.ts

// import { useEffect } from "react";
// import * as Notifications from "expo-notifications";
// import * as Device from "expo-device";
// import { Platform } from "react-native";

// export function usePushNotifications() {

//   useEffect(() => {
//     const register = async () => {
//       console.log("📲 Starting push notification setup");

//       if (!Device.isDevice) {
//         console.warn("❌ Must use physical device for Push Notifications");
//         return;
//       }

//       const { status: existingStatus } = await Notifications.getPermissionsAsync();
//       let finalStatus = existingStatus;

//       if (existingStatus !== "granted") {
//         const { status } = await Notifications.requestPermissionsAsync();
//         finalStatus = status;
//       }

//       console.log("🔐 Permission Status:", finalStatus);

//       if (finalStatus !== "granted") {
//         console.warn("🚫 Push Notification permission not granted");
//         return;
//       }

//       if (Platform.OS === "android") {
//         await Notifications.setNotificationChannelAsync("default", {
//           name: "default",
//           importance: Notifications.AndroidImportance.MAX,
//         });
//       }

//       const tokenData = await Notifications.getExpoPushTokenAsync();
//       console.log("✅ Expo Push Token:", tokenData.data);
//     };

//     register();
//   }, []);
// }

// utils/usePushNotifications.ts

import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  useEffect(() => {
    const register = async () => {
      console.log("📲 Starting push notification setup");

      if (!Device.isDevice) {
        console.warn("❌ Must use physical device for Push Notifications");
        return;
      }

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      console.log("🔐 Permission Status:", finalStatus);

      if (finalStatus !== "granted") {
        console.warn("🚫 Push Notification permission not granted");
        return;
      }

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
        });
      }

      const tokenData = await Notifications.getExpoPushTokenAsync();
      console.log("✅ Expo Push Token:", tokenData.data);
      setExpoPushToken(tokenData.data);
    };

    register();
  }, []);

  return expoPushToken;
}
