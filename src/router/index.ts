import {
  createWebHistory,
  createRouter,
  type RouteRecordRaw,
  type NavigationGuardNext,
} from "vue-router";
import routes from "./routes";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import Swal from "sweetalert2";
import { type RouteLocationNormalized } from "vue-router";
import { check } from "@/service/authService";

const router = createRouter({
  history: createWebHistory("/"),
  routes: routes as RouteRecordRaw[],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0, left: 0 };
  },
});

function authCheck(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore();
  const { token, permissions } = storeToRefs(authStore);

  const authRequired = to.matched.some((route) => route.meta.authRequired as boolean);
  const permissionRequired = to.matched.some((route) => route.meta.permissionRequired as string);

  // Allow access to login page regardless of token state
  if (to.name === "auth.login") return next();

  if (token.value) {
    // Redirect index to dashboard for authenticated users
    if (to.name === "index") return next({ name: "dashboard", replace: true });

    // Check permissions for protected routes
    if (authRequired && permissionRequired) {
      const matching = permissions.value.filter((val: { module: unknown }) => val.module === to.meta.permissionRequired);
      if (matching.length < 1) {
        // permission denied
        Swal.fire(
          "Back off!!!",
          "Seems like you don't have permission to access this module!",
          "error"
        ).then(() => {
          if (from.name && from.name !== "index" && from.name !== "auth.login") {
            next(from as any);
          } else {
            next({ name: "dashboard", replace: true });
          }
        });
        return; // Stop execution here
      }
    }

    // All checks passed, proceed
    return next();
  }

  // User is not authenticated
  if (!authRequired) return next();
  return next({ name: "auth.login", replace: true });
}

// Add a flag to prevent repeated token validation
let tokenValidationInProgress = false;

function tokenValidityChecker(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<boolean> {
  return new Promise((resolve) => {
    // Only check token validity when coming from root path to login page
    // AND we haven't already validated the token in this session
    if (from.path === "/" && to.name === "auth.login" && !tokenValidationInProgress) {
      const authStore = useAuthStore();
      if (authStore.token) {
        tokenValidationInProgress = true; // Set flag to prevent repeated calls
        check(authStore.token)
          .then(() => {
            tokenValidationInProgress = false; // Reset flag
            next({ name: "dashboard", replace: true });
            resolve(true); // Navigation handled
          })
          .catch((e) => {
            tokenValidationInProgress = false; // Reset flag
            if (e.response?.data?.message === "Token expired!") {
              // Clear expired token and allow login
              authStore.loggingOut();
              resolve(false); // Continue to login page
            } else {
              // Other errors, allow normal flow to login
              resolve(false);
            }
          });
      } else {
        // No token, continue normal flow
        resolve(false);
      }
    } else {
      // Not the specific case we're handling, continue normal flow
      resolve(false);
    }
  });
}

router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  // Check token validity first
  const tokenHandled = await tokenValidityChecker(to, from, next);
  // Only proceed with auth check if token validation didn't handle the navigation
  if (!tokenHandled) authCheck(to, from, next);
});

export default router;
