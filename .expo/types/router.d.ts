/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(auth)` | `/(auth)/auth` | `/(auth)/onboarding` | `/(auth)/splash` | `/(tabs)` | `/(tabs)/` | `/(tabs)/communities` | `/(tabs)/events` | `/(tabs)/marketplace` | `/(tabs)/profile` | `/_sitemap` | `/admin` | `/auth` | `/communities` | `/create-event` | `/earnings` | `/events` | `/marketplace` | `/notifications` | `/onboarding` | `/post-service` | `/profile` | `/splash`;
      DynamicRoutes: `/communities/${Router.SingleRoutePart<T>}` | `/events/${Router.SingleRoutePart<T>}` | `/marketplace/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/communities/[id]` | `/events/[id]` | `/marketplace/[id]`;
    }
  }
}
