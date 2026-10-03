import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Private pages depend on the logged-in user, so render them in the browser only.
  { path: 'home', renderMode: RenderMode.Client },
  { path: 'cart', renderMode: RenderMode.Client },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
