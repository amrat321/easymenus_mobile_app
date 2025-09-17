export interface User {
  push_notification_token: any;
  id: number;
  email: string;
  name: string;
}

export interface Menu {
  id: number;
  name: string;
  logo: string | null;
}

export interface LoginSuccessMessage {
  type: "LOGIN_SUCCESS";
  user: User;
  token: string;
  menus: Menu[];
  currentMenu: string;
}

export interface ConsoleMessage {
  type: "Console";
  data: {
    type: "log" | "debug" | "info" | "warn" | "error";
    log: string;
  };
}

export type WebViewMessage = LoginSuccessMessage | ConsoleMessage;