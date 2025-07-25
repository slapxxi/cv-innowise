/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

import { Route as rootRouteImport } from './routes/__root.route'
import { Route as AboutRouteRouteImport } from './routes/about.route'
import { Route as IndexRouteRouteImport } from './routes/index.route'
import { Route as AuthForgotPasswordRouteRouteImport } from './routes/auth/forgot-password.route'
import { Route as AuthAuthLayoutRouteRouteImport } from './routes/auth/_authLayout.route'
import { Route as AuthAuthLayoutSignupRouteRouteImport } from './routes/auth/_authLayout.signup.route'
import { Route as AuthAuthLayoutLoginRouteRouteImport } from './routes/auth/_authLayout.login.route'

const AuthRouteImport = createFileRoute('/auth')()

const AuthRoute = AuthRouteImport.update({
  id: '/auth',
  path: '/auth',
  getParentRoute: () => rootRouteImport,
} as any)
const AboutRouteRoute = AboutRouteRouteImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRouteImport,
} as any)
const IndexRouteRoute = IndexRouteRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)
const AuthForgotPasswordRouteRoute = AuthForgotPasswordRouteRouteImport.update({
  id: '/forgot-password',
  path: '/forgot-password',
  getParentRoute: () => AuthRoute,
} as any)
const AuthAuthLayoutRouteRoute = AuthAuthLayoutRouteRouteImport.update({
  id: '/_authLayout',
  getParentRoute: () => AuthRoute,
} as any)
const AuthAuthLayoutSignupRouteRoute =
  AuthAuthLayoutSignupRouteRouteImport.update({
    id: '/signup',
    path: '/signup',
    getParentRoute: () => AuthAuthLayoutRouteRoute,
  } as any)
const AuthAuthLayoutLoginRouteRoute =
  AuthAuthLayoutLoginRouteRouteImport.update({
    id: '/login',
    path: '/login',
    getParentRoute: () => AuthAuthLayoutRouteRoute,
  } as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRouteRoute
  '/about': typeof AboutRouteRoute
  '/auth': typeof AuthAuthLayoutRouteRouteWithChildren
  '/auth/forgot-password': typeof AuthForgotPasswordRouteRoute
  '/auth/login': typeof AuthAuthLayoutLoginRouteRoute
  '/auth/signup': typeof AuthAuthLayoutSignupRouteRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRouteRoute
  '/about': typeof AboutRouteRoute
  '/auth': typeof AuthAuthLayoutRouteRouteWithChildren
  '/auth/forgot-password': typeof AuthForgotPasswordRouteRoute
  '/auth/login': typeof AuthAuthLayoutLoginRouteRoute
  '/auth/signup': typeof AuthAuthLayoutSignupRouteRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRouteRoute
  '/about': typeof AboutRouteRoute
  '/auth': typeof AuthRouteWithChildren
  '/auth/_authLayout': typeof AuthAuthLayoutRouteRouteWithChildren
  '/auth/forgot-password': typeof AuthForgotPasswordRouteRoute
  '/auth/_authLayout/login': typeof AuthAuthLayoutLoginRouteRoute
  '/auth/_authLayout/signup': typeof AuthAuthLayoutSignupRouteRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/about'
    | '/auth'
    | '/auth/forgot-password'
    | '/auth/login'
    | '/auth/signup'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/about'
    | '/auth'
    | '/auth/forgot-password'
    | '/auth/login'
    | '/auth/signup'
  id:
    | '__root__'
    | '/'
    | '/about'
    | '/auth'
    | '/auth/_authLayout'
    | '/auth/forgot-password'
    | '/auth/_authLayout/login'
    | '/auth/_authLayout/signup'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRouteRoute: typeof IndexRouteRoute
  AboutRouteRoute: typeof AboutRouteRoute
  AuthRoute: typeof AuthRouteWithChildren
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/auth': {
      id: '/auth'
      path: '/auth'
      fullPath: '/auth'
      preLoaderRoute: typeof AuthRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutRouteRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexRouteRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/auth/forgot-password': {
      id: '/auth/forgot-password'
      path: '/forgot-password'
      fullPath: '/auth/forgot-password'
      preLoaderRoute: typeof AuthForgotPasswordRouteRouteImport
      parentRoute: typeof AuthRoute
    }
    '/auth/_authLayout': {
      id: '/auth/_authLayout'
      path: '/auth'
      fullPath: '/auth'
      preLoaderRoute: typeof AuthAuthLayoutRouteRouteImport
      parentRoute: typeof AuthRoute
    }
    '/auth/_authLayout/signup': {
      id: '/auth/_authLayout/signup'
      path: '/signup'
      fullPath: '/auth/signup'
      preLoaderRoute: typeof AuthAuthLayoutSignupRouteRouteImport
      parentRoute: typeof AuthAuthLayoutRouteRoute
    }
    '/auth/_authLayout/login': {
      id: '/auth/_authLayout/login'
      path: '/login'
      fullPath: '/auth/login'
      preLoaderRoute: typeof AuthAuthLayoutLoginRouteRouteImport
      parentRoute: typeof AuthAuthLayoutRouteRoute
    }
  }
}

interface AuthAuthLayoutRouteRouteChildren {
  AuthAuthLayoutLoginRouteRoute: typeof AuthAuthLayoutLoginRouteRoute
  AuthAuthLayoutSignupRouteRoute: typeof AuthAuthLayoutSignupRouteRoute
}

const AuthAuthLayoutRouteRouteChildren: AuthAuthLayoutRouteRouteChildren = {
  AuthAuthLayoutLoginRouteRoute: AuthAuthLayoutLoginRouteRoute,
  AuthAuthLayoutSignupRouteRoute: AuthAuthLayoutSignupRouteRoute,
}

const AuthAuthLayoutRouteRouteWithChildren =
  AuthAuthLayoutRouteRoute._addFileChildren(AuthAuthLayoutRouteRouteChildren)

interface AuthRouteChildren {
  AuthAuthLayoutRouteRoute: typeof AuthAuthLayoutRouteRouteWithChildren
  AuthForgotPasswordRouteRoute: typeof AuthForgotPasswordRouteRoute
}

const AuthRouteChildren: AuthRouteChildren = {
  AuthAuthLayoutRouteRoute: AuthAuthLayoutRouteRouteWithChildren,
  AuthForgotPasswordRouteRoute: AuthForgotPasswordRouteRoute,
}

const AuthRouteWithChildren = AuthRoute._addFileChildren(AuthRouteChildren)

const rootRouteChildren: RootRouteChildren = {
  IndexRouteRoute: IndexRouteRoute,
  AboutRouteRoute: AboutRouteRoute,
  AuthRoute: AuthRouteWithChildren,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()
