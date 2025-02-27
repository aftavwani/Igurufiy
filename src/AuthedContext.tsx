import { createContext, Dispatch, useState } from "react";

/**
 * Context interface for AuthAuthentication/Authorization
 *
 * @property isAuthenticated
 * @property dispatch
 *
 * @interface
 */
interface AuthDefaultContext {
  isAuthenticated: boolean;
  dispatch: Dispatch<any>;
}

const isLogged = localStorage.getItem("isLogged");
let checklogin = false;
if (isLogged !== null && isLogged == "true") {
  checklogin = true;
} else {
  checklogin = false;
}

/**
 * Authentication/Authorization context for managing
 * authenticating/ed and authorizing/ed users
 */
export const AuthContext = createContext<AuthDefaultContext>({
  isAuthenticated: checklogin,
  dispatch: () => {},
});
