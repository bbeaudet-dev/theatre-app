/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as functions_calendar from "../functions/calendar.js";
import type * as functions_dataSync from "../functions/dataSync.js";
import type * as functions_notify from "../functions/notify.js";
import type * as functions_plan from "../functions/plan.js";
import type * as functions_preview from "../functions/preview.js";
import type * as functions_profile from "../functions/profile.js";
import type * as functions_shows from "../functions/shows.js";
import type * as functions_trips from "../functions/trips.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  "functions/calendar": typeof functions_calendar;
  "functions/dataSync": typeof functions_dataSync;
  "functions/notify": typeof functions_notify;
  "functions/plan": typeof functions_plan;
  "functions/preview": typeof functions_preview;
  "functions/profile": typeof functions_profile;
  "functions/shows": typeof functions_shows;
  "functions/trips": typeof functions_trips;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
