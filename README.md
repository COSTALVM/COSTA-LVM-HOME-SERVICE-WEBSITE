# COSTA LVM Home Service Website

Static website for COSTA LVM Home Service.

## Structure

- `site/` contains the generated static site ready for hosting.
- `tools/site-generator/` contains the HTML generators used to rebuild generated pages.
- `site/assets/css/main.css` and `site/assets/js/main.js` are edited directly.

## Generate

```bash
node tools/site-generator/gen-index.js
node tools/site-generator/gen-services.js
```

## Preview

```bash
cd site
python -m http.server 8765 --bind 127.0.0.1
```

