# COSTA LVM Home Service Website

Static website for COSTA LVM Home Service.

## Structure

- Root files (`index.html`, `assets/`, `services/`, etc.) are the Hostinger-published copy.
- `site/` contains the generated static site source copy used for local rebuild/verification.
- `tools/site-generator/` contains the HTML generators used to rebuild generated pages.
- `site/assets/css/main.css` and `site/assets/js/main.js` are edited directly.

## Generate

```bash
node tools/site-generator/gen-index.js
node tools/site-generator/gen-services.js
```

After regenerating, mirror `site/` to the repository root before deploying to Hostinger.

## Preview

```bash
cd site
python -m http.server 8765 --bind 127.0.0.1
```
