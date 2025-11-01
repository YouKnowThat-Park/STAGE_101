"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/reviews/count-review/route";
exports.ids = ["app/api/reviews/count-review/route"];
exports.modules = {

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("net");

/***/ }),

/***/ "punycode":
/*!***************************!*\
  !*** external "punycode" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("punycode");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("tls");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/../node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Freviews%2Fcount-review%2Froute&page=%2Fapi%2Freviews%2Fcount-review%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Freviews%2Fcount-review%2Froute.ts&appDir=C%3A%5CUsers%5Cyoukn%5COneDrive%5CDesktop%5Cstage_101%5Cweb%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cyoukn%5COneDrive%5CDesktop%5Cstage_101%5Cweb&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ../node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Freviews%2Fcount-review%2Froute&page=%2Fapi%2Freviews%2Fcount-review%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Freviews%2Fcount-review%2Froute.ts&appDir=C%3A%5CUsers%5Cyoukn%5COneDrive%5CDesktop%5Cstage_101%5Cweb%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cyoukn%5COneDrive%5CDesktop%5Cstage_101%5Cweb&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/../node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/../node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/../node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_youkn_OneDrive_Desktop_stage_101_web_src_app_api_reviews_count_review_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/reviews/count-review/route.ts */ \"(rsc)/./src/app/api/reviews/count-review/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/reviews/count-review/route\",\n        pathname: \"/api/reviews/count-review\",\n        filename: \"route\",\n        bundlePath: \"app/api/reviews/count-review/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\youkn\\\\OneDrive\\\\Desktop\\\\stage_101\\\\web\\\\src\\\\app\\\\api\\\\reviews\\\\count-review\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_youkn_OneDrive_Desktop_stage_101_web_src_app_api_reviews_count_review_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/reviews/count-review/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi4vbm9kZV9tb2R1bGVzL25leHQvZGlzdC9idWlsZC93ZWJwYWNrL2xvYWRlcnMvbmV4dC1hcHAtbG9hZGVyLmpzP25hbWU9YXBwJTJGYXBpJTJGcmV2aWV3cyUyRmNvdW50LXJldmlldyUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGcmV2aWV3cyUyRmNvdW50LXJldmlldyUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRnJldmlld3MlMkZjb3VudC1yZXZpZXclMkZyb3V0ZS50cyZhcHBEaXI9QyUzQSU1Q1VzZXJzJTVDeW91a24lNUNPbmVEcml2ZSU1Q0Rlc2t0b3AlNUNzdGFnZV8xMDElNUN3ZWIlNUNzcmMlNUNhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPUMlM0ElNUNVc2VycyU1Q3lvdWtuJTVDT25lRHJpdmUlNUNEZXNrdG9wJTVDc3RhZ2VfMTAxJTVDd2ViJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBc0c7QUFDdkM7QUFDYztBQUNtRDtBQUNoSTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZ0hBQW1CO0FBQzNDO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLGlFQUFpRTtBQUN6RTtBQUNBO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ3VIOztBQUV2SCIsInNvdXJjZXMiOlsid2VicGFjazovL3N0YWdlXzEwMS8/MTNhZiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCJDOlxcXFxVc2Vyc1xcXFx5b3VrblxcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXHN0YWdlXzEwMVxcXFx3ZWJcXFxcc3JjXFxcXGFwcFxcXFxhcGlcXFxccmV2aWV3c1xcXFxjb3VudC1yZXZpZXdcXFxccm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL3Jldmlld3MvY291bnQtcmV2aWV3L3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvcmV2aWV3cy9jb3VudC1yZXZpZXdcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL3Jldmlld3MvY291bnQtcmV2aWV3L3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiQzpcXFxcVXNlcnNcXFxceW91a25cXFxcT25lRHJpdmVcXFxcRGVza3RvcFxcXFxzdGFnZV8xMDFcXFxcd2ViXFxcXHNyY1xcXFxhcHBcXFxcYXBpXFxcXHJldmlld3NcXFxcY291bnQtcmV2aWV3XFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuY29uc3Qgb3JpZ2luYWxQYXRobmFtZSA9IFwiL2FwaS9yZXZpZXdzL2NvdW50LXJldmlldy9yb3V0ZVwiO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICBzZXJ2ZXJIb29rcyxcbiAgICAgICAgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBvcmlnaW5hbFBhdGhuYW1lLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/../node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Freviews%2Fcount-review%2Froute&page=%2Fapi%2Freviews%2Fcount-review%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Freviews%2Fcount-review%2Froute.ts&appDir=C%3A%5CUsers%5Cyoukn%5COneDrive%5CDesktop%5Cstage_101%5Cweb%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cyoukn%5COneDrive%5CDesktop%5Cstage_101%5Cweb&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/reviews/count-review/route.ts":
/*!***************************************************!*\
  !*** ./src/app/api/reviews/count-review/route.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../supabase/supabase-server */ \"(rsc)/./src/supabase/supabase-server.ts\");\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/server */ \"(rsc)/../node_modules/next/dist/api/server.js\");\n\n\nasync function GET(req) {\n    const supabase = await (0,_supabase_supabase_server__WEBPACK_IMPORTED_MODULE_0__.serverSupabase)();\n    const { searchParams } = new URL(req.url);\n    try {\n        const { data, error } = await supabase.from(\"reviews\").select(`\r\n        id,\r\n        theater_id,\r\n        user_id,\r\n        users:users(nickname, profile_img)\r\n      `).order(\"created_at\", {\n            ascending: false\n        });\n        if (error || !data) {\n            console.error(\"❌ 리뷰 조회 실패:\", error);\n            return next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.json({\n                error: error?.message || \"리뷰 조회 실패\"\n            }, {\n                status: 500\n            });\n        }\n        const reviews = data;\n        const userCounts = {};\n        reviews.forEach((review)=>{\n            const userId = review.user_id;\n            const user = review.users ?? {\n                nickname: \"익명\",\n                profile_img: \"/default.png\"\n            };\n            if (!userCounts[userId]) {\n                userCounts[userId] = {\n                    count: 0,\n                    nickname: user.nickname ?? \"익명\",\n                    profile_img: user.profile_img ?? \"/default.png\"\n                };\n            }\n            userCounts[userId].count++;\n        });\n        const ranking = Object.entries(userCounts).map(([user_id, data])=>({\n                user_id,\n                ...data\n            })).sort((a, b)=>b.count - a.count).slice(0, 3);\n        return next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.json({\n            ranking,\n            reviews\n        });\n    } catch (err) {\n        console.error(\"\\uD83D\\uDEA8 서버 오류 발생:\", err);\n        return next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.json({\n            error: \"서버 오류 발생\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9yZXZpZXdzL2NvdW50LXJldmlldy9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBc0U7QUFDZDtBQVlqRCxlQUFlRSxJQUFJQyxHQUFnQjtJQUN4QyxNQUFNQyxXQUFXLE1BQU1KLHlFQUFjQTtJQUNyQyxNQUFNLEVBQUVLLFlBQVksRUFBRSxHQUFHLElBQUlDLElBQUlILElBQUlJLEdBQUc7SUFFeEMsSUFBSTtRQUNGLE1BQU0sRUFBRUMsSUFBSSxFQUFFQyxLQUFLLEVBQUUsR0FBRyxNQUFNTCxTQUMzQk0sSUFBSSxDQUFDLFdBQ0xDLE1BQU0sQ0FDTCxDQUFDOzs7OztNQUtILENBQUMsRUFFQUMsS0FBSyxDQUFDLGNBQWM7WUFBRUMsV0FBVztRQUFNO1FBRTFDLElBQUlKLFNBQVMsQ0FBQ0QsTUFBTTtZQUNsQk0sUUFBUUwsS0FBSyxDQUFDLGVBQWVBO1lBQzdCLE9BQU9SLHFEQUFZQSxDQUFDYyxJQUFJLENBQUM7Z0JBQUVOLE9BQU9BLE9BQU9PLFdBQVc7WUFBVyxHQUFHO2dCQUFFQyxRQUFRO1lBQUk7UUFDbEY7UUFFQSxNQUFNQyxVQUFVVjtRQUVoQixNQUFNVyxhQUF1RixDQUFDO1FBRTlGRCxRQUFRRSxPQUFPLENBQUMsQ0FBQ0M7WUFDZixNQUFNQyxTQUFTRCxPQUFPRSxPQUFPO1lBQzdCLE1BQU1DLE9BQU9ILE9BQU9JLEtBQUssSUFBSTtnQkFDM0JDLFVBQVU7Z0JBQ1ZDLGFBQWE7WUFDZjtZQUVBLElBQUksQ0FBQ1IsVUFBVSxDQUFDRyxPQUFPLEVBQUU7Z0JBQ3ZCSCxVQUFVLENBQUNHLE9BQU8sR0FBRztvQkFDbkJNLE9BQU87b0JBQ1BGLFVBQVVGLEtBQUtFLFFBQVEsSUFBSTtvQkFDM0JDLGFBQWFILEtBQUtHLFdBQVcsSUFBSTtnQkFDbkM7WUFDRjtZQUVBUixVQUFVLENBQUNHLE9BQU8sQ0FBQ00sS0FBSztRQUMxQjtRQUVBLE1BQU1DLFVBQVVDLE9BQU9DLE9BQU8sQ0FBQ1osWUFDNUJhLEdBQUcsQ0FBQyxDQUFDLENBQUNULFNBQVNmLEtBQUssR0FBTTtnQkFBRWU7Z0JBQVMsR0FBR2YsSUFBSTtZQUFDLElBQzdDeUIsSUFBSSxDQUFDLENBQUNDLEdBQUdDLElBQU1BLEVBQUVQLEtBQUssR0FBR00sRUFBRU4sS0FBSyxFQUNoQ1EsS0FBSyxDQUFDLEdBQUc7UUFFWixPQUFPbkMscURBQVlBLENBQUNjLElBQUksQ0FBQztZQUN2QmM7WUFDQVg7UUFDRjtJQUNGLEVBQUUsT0FBT21CLEtBQUs7UUFDWnZCLFFBQVFMLEtBQUssQ0FBQywwQkFBZ0I0QjtRQUM5QixPQUFPcEMscURBQVlBLENBQUNjLElBQUksQ0FBQztZQUFFTixPQUFPO1FBQVcsR0FBRztZQUFFUSxRQUFRO1FBQUk7SUFDaEU7QUFDRiIsInNvdXJjZXMiOlsid2VicGFjazovL3N0YWdlXzEwMS8uL3NyYy9hcHAvYXBpL3Jldmlld3MvY291bnQtcmV2aWV3L3JvdXRlLnRzP2ExM2UiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgc2VydmVyU3VwYWJhc2UgfSBmcm9tICcuLi8uLi8uLi8uLi9zdXBhYmFzZS9zdXBhYmFzZS1zZXJ2ZXInO1xyXG5pbXBvcnQgeyBOZXh0UmVxdWVzdCwgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInO1xyXG5cclxudHlwZSBSZXZpZXdXaXRoVXNlciA9IHtcclxuICBpZDogc3RyaW5nO1xyXG4gIHRoZWF0ZXJfaWQ6IHN0cmluZztcclxuICB1c2VyX2lkOiBzdHJpbmc7XHJcbiAgdXNlcnM6IHtcclxuICAgIG5pY2tuYW1lOiBzdHJpbmcgfCBudWxsO1xyXG4gICAgcHJvZmlsZV9pbWc6IHN0cmluZyB8IG51bGw7XHJcbiAgfSB8IG51bGw7XHJcbn07XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKHJlcTogTmV4dFJlcXVlc3QpIHtcclxuICBjb25zdCBzdXBhYmFzZSA9IGF3YWl0IHNlcnZlclN1cGFiYXNlKCk7XHJcbiAgY29uc3QgeyBzZWFyY2hQYXJhbXMgfSA9IG5ldyBVUkwocmVxLnVybCk7XHJcblxyXG4gIHRyeSB7XHJcbiAgICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgICAuZnJvbSgncmV2aWV3cycpXHJcbiAgICAgIC5zZWxlY3QoXHJcbiAgICAgICAgYFxyXG4gICAgICAgIGlkLFxyXG4gICAgICAgIHRoZWF0ZXJfaWQsXHJcbiAgICAgICAgdXNlcl9pZCxcclxuICAgICAgICB1c2Vyczp1c2VycyhuaWNrbmFtZSwgcHJvZmlsZV9pbWcpXHJcbiAgICAgIGAsXHJcbiAgICAgIClcclxuICAgICAgLm9yZGVyKCdjcmVhdGVkX2F0JywgeyBhc2NlbmRpbmc6IGZhbHNlIH0pO1xyXG5cclxuICAgIGlmIChlcnJvciB8fCAhZGF0YSkge1xyXG4gICAgICBjb25zb2xlLmVycm9yKCfinYwg66as67ewIOyhsO2ajCDsi6TtjKg6JywgZXJyb3IpO1xyXG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogZXJyb3I/Lm1lc3NhZ2UgfHwgJ+umrOu3sCDsobDtmowg7Iuk7YyoJyB9LCB7IHN0YXR1czogNTAwIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJldmlld3MgPSBkYXRhIGFzIHVua25vd24gYXMgUmV2aWV3V2l0aFVzZXJbXTtcclxuXHJcbiAgICBjb25zdCB1c2VyQ291bnRzOiBSZWNvcmQ8c3RyaW5nLCB7IGNvdW50OiBudW1iZXI7IG5pY2tuYW1lOiBzdHJpbmc7IHByb2ZpbGVfaW1nOiBzdHJpbmcgfT4gPSB7fTtcclxuXHJcbiAgICByZXZpZXdzLmZvckVhY2goKHJldmlldykgPT4ge1xyXG4gICAgICBjb25zdCB1c2VySWQgPSByZXZpZXcudXNlcl9pZDtcclxuICAgICAgY29uc3QgdXNlciA9IHJldmlldy51c2VycyA/PyB7XHJcbiAgICAgICAgbmlja25hbWU6ICfsnbXrqoUnLFxyXG4gICAgICAgIHByb2ZpbGVfaW1nOiAnL2RlZmF1bHQucG5nJyxcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGlmICghdXNlckNvdW50c1t1c2VySWRdKSB7XHJcbiAgICAgICAgdXNlckNvdW50c1t1c2VySWRdID0ge1xyXG4gICAgICAgICAgY291bnQ6IDAsXHJcbiAgICAgICAgICBuaWNrbmFtZTogdXNlci5uaWNrbmFtZSA/PyAn7J2166qFJyxcclxuICAgICAgICAgIHByb2ZpbGVfaW1nOiB1c2VyLnByb2ZpbGVfaW1nID8/ICcvZGVmYXVsdC5wbmcnLFxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHVzZXJDb3VudHNbdXNlcklkXS5jb3VudCsrO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgcmFua2luZyA9IE9iamVjdC5lbnRyaWVzKHVzZXJDb3VudHMpXHJcbiAgICAgIC5tYXAoKFt1c2VyX2lkLCBkYXRhXSkgPT4gKHsgdXNlcl9pZCwgLi4uZGF0YSB9KSlcclxuICAgICAgLnNvcnQoKGEsIGIpID0+IGIuY291bnQgLSBhLmNvdW50KVxyXG4gICAgICAuc2xpY2UoMCwgMyk7XHJcblxyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHtcclxuICAgICAgcmFua2luZyxcclxuICAgICAgcmV2aWV3cyxcclxuICAgIH0pO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgY29uc29sZS5lcnJvcign8J+aqCDshJzrsoQg7Jik66WYIOuwnOyDnTonLCBlcnIpO1xyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6ICfshJzrsoQg7Jik66WYIOuwnOyDnScgfSwgeyBzdGF0dXM6IDUwMCB9KTtcclxuICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbInNlcnZlclN1cGFiYXNlIiwiTmV4dFJlc3BvbnNlIiwiR0VUIiwicmVxIiwic3VwYWJhc2UiLCJzZWFyY2hQYXJhbXMiLCJVUkwiLCJ1cmwiLCJkYXRhIiwiZXJyb3IiLCJmcm9tIiwic2VsZWN0Iiwib3JkZXIiLCJhc2NlbmRpbmciLCJjb25zb2xlIiwianNvbiIsIm1lc3NhZ2UiLCJzdGF0dXMiLCJyZXZpZXdzIiwidXNlckNvdW50cyIsImZvckVhY2giLCJyZXZpZXciLCJ1c2VySWQiLCJ1c2VyX2lkIiwidXNlciIsInVzZXJzIiwibmlja25hbWUiLCJwcm9maWxlX2ltZyIsImNvdW50IiwicmFua2luZyIsIk9iamVjdCIsImVudHJpZXMiLCJtYXAiLCJzb3J0IiwiYSIsImIiLCJzbGljZSIsImVyciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/reviews/count-review/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/supabase/supabase-server.ts":
/*!*****************************************!*\
  !*** ./src/supabase/supabase-server.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   serverSupabase: () => (/* binding */ serverSupabase)\n/* harmony export */ });\n/* harmony import */ var private_next_rsc_server_reference__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! private-next-rsc-server-reference */ \"(rsc)/../node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js\");\n/* harmony import */ var private_next_rsc_action_encryption__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! private-next-rsc-action-encryption */ \"(rsc)/../node_modules/next/dist/server/app-render/encryption.js\");\n/* harmony import */ var private_next_rsc_action_encryption__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(private_next_rsc_action_encryption__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _supabase_ssr__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @supabase/ssr */ \"(rsc)/../node_modules/@supabase/ssr/dist/module/index.js\");\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/headers */ \"(rsc)/../node_modules/next/dist/api/headers.js\");\n/* harmony import */ var private_next_rsc_action_validate__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! private-next-rsc-action-validate */ \"(rsc)/../node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js\");\n/* __next_internal_action_entry_do_not_use__ {\"d0a0fb420ce1b85009eeab5cf5989fb801ef0755\":\"serverSupabase\"} */ \n\n\n\nasync function serverSupabase() {\n    const cookieStore = (0,next_headers__WEBPACK_IMPORTED_MODULE_3__.cookies)();\n    const supabase = (0,_supabase_ssr__WEBPACK_IMPORTED_MODULE_2__.createServerClient)(\"https://zxryfhnxexxyxmrctocl.supabase.co\", \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4cnlmaG54ZXh4eXhtcmN0b2NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3MDUwNTMsImV4cCI6MjA1NTI4MTA1M30.43_YgPBND7eRxI3KzgZLJxU7f9cHJhUSVK-Ozy5wTL0\", {\n        cookies: {\n            get: async (name)=>{\n                const value = cookieStore.get(name)?.value ?? null;\n                return value;\n            },\n            set: async (name, value, options)=>{\n                cookieStore.set(name, value, {\n                    path: \"/\",\n                    ...options\n                });\n            },\n            remove: async (name)=>{\n                cookieStore.set(name, \"\", {\n                    path: \"/\",\n                    maxAge: -1\n                });\n            }\n        }\n    });\n    return supabase;\n}\n\n(0,private_next_rsc_action_validate__WEBPACK_IMPORTED_MODULE_4__.ensureServerEntryExports)([\n    serverSupabase\n]);\n(0,private_next_rsc_server_reference__WEBPACK_IMPORTED_MODULE_0__.registerServerReference)(\"d0a0fb420ce1b85009eeab5cf5989fb801ef0755\", serverSupabase);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvc3VwYWJhc2Uvc3VwYWJhc2Utc2VydmVyLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUVtRDtBQUNaO0FBRWhDLGVBQWVFO0lBQ3BCLE1BQU1DLGNBQWNGLHFEQUFPQTtJQUUzQixNQUFNRyxXQUFXSixpRUFBa0JBLENBQ2pDSywwQ0FBb0MsRUFDcENBLGtOQUF5QyxFQUN6QztRQUNFSixTQUFTO1lBQ1BRLEtBQUssT0FBT0M7Z0JBQ1YsTUFBTUMsUUFBUVIsWUFBWU0sR0FBRyxDQUFDQyxPQUFPQyxTQUFTO2dCQUM5QyxPQUFPQTtZQUNUO1lBQ0FDLEtBQUssT0FBT0YsTUFBTUMsT0FBT0U7Z0JBQ3ZCVixZQUFZUyxHQUFHLENBQUNGLE1BQU1DLE9BQU87b0JBQUVHLE1BQU07b0JBQUssR0FBR0QsT0FBTztnQkFBQztZQUN2RDtZQUNBRSxRQUFRLE9BQU9MO2dCQUNiUCxZQUFZUyxHQUFHLENBQUNGLE1BQU0sSUFBSTtvQkFBRUksTUFBTTtvQkFBS0UsUUFBUSxDQUFDO2dCQUFFO1lBQ3BEO1FBQ0Y7SUFDRjtJQUdGLE9BQU9aO0FBQ1QiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zdGFnZV8xMDEvLi9zcmMvc3VwYWJhc2Uvc3VwYWJhc2Utc2VydmVyLnRzP2E5NDUiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzZXJ2ZXInO1xyXG5cclxuaW1wb3J0IHsgY3JlYXRlU2VydmVyQ2xpZW50IH0gZnJvbSAnQHN1cGFiYXNlL3Nzcic7XHJcbmltcG9ydCB7IGNvb2tpZXMgfSBmcm9tICduZXh0L2hlYWRlcnMnO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNlcnZlclN1cGFiYXNlKCkge1xyXG4gIGNvbnN0IGNvb2tpZVN0b3JlID0gY29va2llcygpO1xyXG5cclxuICBjb25zdCBzdXBhYmFzZSA9IGNyZWF0ZVNlcnZlckNsaWVudChcclxuICAgIHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTCEsXHJcbiAgICBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TVVBBQkFTRV9BTk9OX0tFWSEsXHJcbiAgICB7XHJcbiAgICAgIGNvb2tpZXM6IHtcclxuICAgICAgICBnZXQ6IGFzeW5jIChuYW1lOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgIGNvbnN0IHZhbHVlID0gY29va2llU3RvcmUuZ2V0KG5hbWUpPy52YWx1ZSA/PyBudWxsO1xyXG4gICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0OiBhc3luYyAobmFtZSwgdmFsdWUsIG9wdGlvbnMpID0+IHtcclxuICAgICAgICAgIGNvb2tpZVN0b3JlLnNldChuYW1lLCB2YWx1ZSwgeyBwYXRoOiAnLycsIC4uLm9wdGlvbnMgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICByZW1vdmU6IGFzeW5jIChuYW1lOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgIGNvb2tpZVN0b3JlLnNldChuYW1lLCAnJywgeyBwYXRoOiAnLycsIG1heEFnZTogLTEgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgKTtcclxuXHJcbiAgcmV0dXJuIHN1cGFiYXNlO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJjcmVhdGVTZXJ2ZXJDbGllbnQiLCJjb29raWVzIiwic2VydmVyU3VwYWJhc2UiLCJjb29raWVTdG9yZSIsInN1cGFiYXNlIiwicHJvY2VzcyIsImVudiIsIk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTCIsIk5FWFRfUFVCTElDX1NVUEFCQVNFX0FOT05fS0VZIiwiZ2V0IiwibmFtZSIsInZhbHVlIiwic2V0Iiwib3B0aW9ucyIsInBhdGgiLCJyZW1vdmUiLCJtYXhBZ2UiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/supabase/supabase-server.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@supabase","vendor-chunks/tr46","vendor-chunks/whatwg-url","vendor-chunks/cookie","vendor-chunks/webidl-conversions"], () => (__webpack_exec__("(rsc)/../node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Freviews%2Fcount-review%2Froute&page=%2Fapi%2Freviews%2Fcount-review%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Freviews%2Fcount-review%2Froute.ts&appDir=C%3A%5CUsers%5Cyoukn%5COneDrive%5CDesktop%5Cstage_101%5Cweb%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cyoukn%5COneDrive%5CDesktop%5Cstage_101%5Cweb&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();