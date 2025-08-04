import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect();
  }
}, { 
  publishableKey: "pk_test_c2luZ3VsYXItYmFzaWxpc2stNTcuY2xlcmsuYWNjb3VudHMuZGV2JA",
  secretKey: "sk_test_nSGoft6sZ8hKRRAfbrJ7DqUgGkam9YzLb1Q3cpkJ5O"
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
