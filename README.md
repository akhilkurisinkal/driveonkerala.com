# Drive On — static GitHub Pages site

This folder is a standalone copy of the website: five HTML pages and the CSS, JavaScript and images they use. No npm install, build, WordPress, or server application is required. The `.nojekyll` file tells GitHub Pages to serve these files directly.

## Publish from this repository

1. Push this repository, including the `docs` folder, to GitHub.
2. Open the repository's **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Choose the branch containing these files (usually `main`), choose **/docs**, and save.
5. GitHub will show the published website address on the Pages settings screen.

If you create a separate repository containing only this folder's contents, choose **/(root)** instead. Include the hidden `.nojekyll` file.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Preview and edit

Open `index.html` in a browser, or run `python3 -m http.server 8766 --bind 127.0.0.1 --directory docs` from the parent project folder and visit http://127.0.0.1:8766.

All site links and assets use relative paths, so the site works under a GitHub Pages repository URL as well as a custom domain. Edit the files in this folder to update the published copy; changes to the original files outside this folder are not copied automatically.

## Existing configuration

- The phone and WhatsApp numbers are configured in `assets/js/main.js`. The quote form opens a WhatsApp chat with the trip details filled in for the traveller to review and send.
- The existing search-engine restrictions (`noindex, nofollow` and `robots.txt`) are preserved. Visitors can view the deployed site, but it is configured to discourage search indexing. Change these when ready for indexing.
- No domain, canonical URL, or sitemap URL has been invented. Set those once the final public URL is known.
- This copy preserves the existing images and content. Image provenance is recorded in the original project's `assets/images/fleet/CATALOG-SOURCES.md`.
