# Promocion 2025 - IEE Jose Maria Arguedas

Sitio web para organizar el reencuentro de la Promocion 2025 de la IEE Jose Maria Arguedas: registro de camisetas, guia de tallas, agenda, deportes, comunidad con recuerdos/comentarios y panel privado de administracion.

**Demo en produccion:** https://camisetapromo2025.web.app
**Proyecto Firebase:** `camiseta-d74e5`
**Repo:** https://github.com/promocion2025/camisetapromo2025

## Stack

- Angular 22 con componentes standalone.
- Firebase Hosting, Firestore y Firebase Auth.
- Cloudinary para subir fotos de recuerdos sin depender de Firebase Storage/Blaze.
- Vitest + jsdom para pruebas.

## Secciones

- `/` Home de la Promocion 2025.
- `/registro` Registro de camiseta: nombre, numero, genero y talla.
- `/tallas` Guia de medidas por genero.
- `/agenda` Misa, ceremonia, almuerzo, deporte y baile.
- `/partidos` Inscripcion publica a disciplinas deportivas y programacion.
- `/comunidad` Recuerdos, fotos y comentarios moderados.
- `/admin` Gestion privada de pedidos, agenda, partidos, inscritos, recuerdos, comentarios y admins.

## Colecciones Firestore

| Coleccion | Lectura | Escritura |
| --- | --- | --- |
| `pedidos_camisetas` | publica | publica con validacion |
| `recuerdos_promocion` | aprobados/destacados o admin | publica como pendiente |
| `comentarios_recuerdos` | aprobados o admin | publica como pendiente |
| `inscripciones_deportivas` | publica | publica con validacion |
| `partidos_reencuentro` | publica | solo admin |
| `agenda_reencuentro` | publica | solo admin |
| `admins` | solo admin | admin/founder segun reglas |

## Datos principales

`pedidos_camisetas`:

```ts
{
  nombre: string
  numero: number
  genero: 'hombre' | 'mujer'
  talla: string
  fecha: string
}
```

`inscripciones_deportivas`:

```ts
{
  nombre: string
  disciplinas: Array<'voley-mixto' | 'voley-femenino' | 'basket-mujer' | 'basket-varones' | 'futbol'>
  promocion: '2025'
  fecha: string
}
```

`recuerdos_promocion` y `comentarios_recuerdos` se crean como `pendiente`; el admin los aprueba desde `/admin`.

## Desarrollo

```bash
npm install
npm start
```

## Build y pruebas

```bash
npm run build
npm test -- --watch=false
```

## Deploy

La cuenta Firebase CLI debe tener acceso al proyecto `camiseta-d74e5`.

```bash
firebase login
firebase use camiseta-d74e5
firebase deploy --only hosting,firestore:rules,storage
```
