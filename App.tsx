// App.js

import React, { useState } from "react";
import {
  StyleSheet,
  StatusBar,
  View,
  ActivityIndicator,
  Dimensions,
  Alert,
} from "react-native";
import { WebView } from "react-native-webview";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePushNotifications } from "./utils/usePushNotifications";
import { WebViewMessage, LoginSuccessMessage } from "./src/types";
import axios from "axios";

const { width, height } = Dimensions.get("window");

export default function App() {
  const [loading, setLoading] = useState(true);
  const token = usePushNotifications();

  const debugging = `
    const consoleLog = (type, log) => window.ReactNativeWebView.postMessage(JSON.stringify({'type': 'Console', 'data': {'type': type, 'log': log}}));
    console = {
      log: (log) => consoleLog('log', log),
      debug: (log) => consoleLog('debug', log),
      info: (log) => consoleLog('info', log),
      warn: (log) => consoleLog('warn', log),
      error: (log) => consoleLog('error', log),
    };
  `;

  const API_KEY =
    "kHxUaiaRJzlvQMf1aqeSRisOdOfsTxJGZ6WmPvfrns85ax7LU3cJTrBvEaD2MYTo";

  const onMessage = (event: any) => {
    try {
      const data: WebViewMessage = JSON.parse(event.nativeEvent.data);
      console.log(data);
      if (data.type === "LOGIN_SUCCESS") {
        const loginData = data as LoginSuccessMessage;
        if (loginData.user.push_notification_token) {
          if (token !== loginData.user.push_notification_token) {
            axios
              .put(
                `https://api.easymenus.eu/api/push-notification/token/${loginData.user.id}`,
                { token },
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${API_KEY}`,
                    EASYMENUS_PUSH_TOKEN: token,
                  },
                }
              )
              .then(() => console.log("Token updated"))
              .catch((error) => console.log("Token update error:", error));
          }
        } else {
          axios
            .post(
              "https://api.easymenus.eu/api/push-notification/token",
              {
                token,
                userId: loginData.user.id,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${API_KEY}`,
                  EASYMENUS_PUSH_TOKEN: token,
                },
              }
            )
            .then(() => console.log("Token saved"))
            .catch((error) => console.log("Token save error:", error));
        }

      }
    } catch (e) {
      console.error("Failed to parse message from WebView", e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: "https://app.easymenus.eu/" }}
        onMessage={onMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        injectedJavaScript={debugging}
        onLoadEnd={() => setLoading(false)}
      />

      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 35,
  },
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)", // Slight overlay
    zIndex: 10,
  },
});
