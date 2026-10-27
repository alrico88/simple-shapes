# Simple Shapes

Web app to draw geometries and get their GeoJSON or WKT representation.

Built with [Nuxt 4](https://nuxt.com), [Nuxt UI](https://ui.nuxt.com) and [Leaflet](https://leafletjs.com/).

## Requirements

- Node.js 24 (see `.nvmrc`)
- [Bun](https://bun.sh)

## Project setup

```bash
bun install
```

### Compiles and hot-reloads for development

```bash
bun run dev
```

### Compiles and minifies for production

```bash
bun run generate
```

## Open the map at given coordinates

Use query parameters to center the map when the app loads:

| Parameter | Description                                 | Required |
| --------- | ------------------------------------------- | -------- |
| `lat`     | Latitude, between -90 and 90                | yes      |
| `lon`     | Longitude, between -180 and 180             | yes      |
| `zoom`    | Zoom level of the map (defaults to 14)      | no       |

Example: `/?lat=40.4168&lon=-3.7038&zoom=11`

The coordinates are also filled in the "Go to coordinates" fields of the search panel. No shape is added to the map.

## Custom tile layers

In the map options you can add your own slippy map tiles URL. The URL must start with `http://` or `https://` and include `{x}`, `{y}` and `{z}`. `{s}` and `{r}` are also supported. Custom layers are stored in the browser.

Example: `https://tile.openstreetmap.org/{z}/{x}/{y}.png`
