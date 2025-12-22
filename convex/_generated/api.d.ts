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
import type * as config_dataSources from "../config/dataSources.js";
import type * as crons from "../crons.js";
import type * as functions_calendar from "../functions/calendar.js";
import type * as functions_notify from "../functions/notify.js";
import type * as functions_plan from "../functions/plan.js";
import type * as functions_preview from "../functions/preview.js";
import type * as functions_profile from "../functions/profile.js";
import type * as functions_shows from "../functions/shows.js";
import type * as functions_shows_batchUpdatePlaybillImages from "../functions/shows/batchUpdatePlaybillImages.js";
import type * as functions_shows_getPlaybillImage from "../functions/shows/getPlaybillImage.js";
import type * as functions_shows_testPlaybillSearch from "../functions/shows/testPlaybillSearch.js";
import type * as functions_shows_updateShowImage from "../functions/shows/updateShowImage.js";
import type * as functions_sync_dataSync from "../functions/sync/dataSync.js";
import type * as functions_sync_email from "../functions/sync/email.js";
import type * as functions_sync_inspectSyncReport from "../functions/sync/inspectSyncReport.js";
import type * as functions_trips from "../functions/trips.js";
import type * as lib_ai_extraction from "../lib/ai/extraction.js";
import type * as lib_ai_recommendations from "../lib/ai/recommendations.js";
import type * as lib_reddit from "../lib/reddit.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  "config/dataSources": typeof config_dataSources;
  crons: typeof crons;
  "functions/calendar": typeof functions_calendar;
  "functions/notify": typeof functions_notify;
  "functions/plan": typeof functions_plan;
  "functions/preview": typeof functions_preview;
  "functions/profile": typeof functions_profile;
  "functions/shows": typeof functions_shows;
  "functions/shows/batchUpdatePlaybillImages": typeof functions_shows_batchUpdatePlaybillImages;
  "functions/shows/getPlaybillImage": typeof functions_shows_getPlaybillImage;
  "functions/shows/testPlaybillSearch": typeof functions_shows_testPlaybillSearch;
  "functions/shows/updateShowImage": typeof functions_shows_updateShowImage;
  "functions/sync/dataSync": typeof functions_sync_dataSync;
  "functions/sync/email": typeof functions_sync_email;
  "functions/sync/inspectSyncReport": typeof functions_sync_inspectSyncReport;
  "functions/trips": typeof functions_trips;
  "lib/ai/extraction": typeof lib_ai_extraction;
  "lib/ai/recommendations": typeof lib_ai_recommendations;
  "lib/reddit": typeof lib_reddit;
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
