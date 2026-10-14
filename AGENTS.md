<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- The site is a static export (GitHub Pages): admin and live episode data use only the browser backend client with row-level security, never server functions — there is no server at runtime.
- Admin access is an email allowlist in `staff_members` (roles admin/editor, `active` flag) checked by `staff_role()`/`is_staff()` in policies; sign-up is open in auth settings but a trigger on `auth.users` rejects any e-mail not on the active allowlist — lets admins add users from the static site with no server.
- Public episode pages start from the built-in list in `src/lib/content.ts` and swap in published rows from the database in the browser — keeps pages prerendered and indexable.
- Episode covers live in a private bucket and are shown through signed links — the workspace blocks public buckets.
- Every admin path must be listed in the prerender pages in `vite.config.ts` — otherwise direct links 404 on GitHub Pages.
- Editable site texts, Quadros, profile and official links live as one JSON row per block in `site_content`, read in the browser through `src/lib/site-content.ts` with the current texts as built-in defaults — pages stay prerendered and fall back safely if nothing was saved.
- Quadros created in the admin live in the `quadros` table (the two original ones stay in `site_content`) and render through `/quadros/$slug` in the browser; a trigger blocks deleting a Quadro that still has episodes.
- Pages that did not exist at publish time (new Quadros/episodes) open on GitHub Pages via `public/404.html` → `/abrir?p=…`, which hands the address to the router — keeps direct links working without rebuilding.
