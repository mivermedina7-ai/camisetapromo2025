# Promoción 2025 - IEE José María Arguedas

Sitio web para organizar el reencuentro de la Promoción 2025 de la IEE José María Arguedas: registro de camisetas, guía de tallas, agenda, deportes, comunidad con recuerdos/comentarios y panel privado de administración.

**Demo en producción:** https://camisetapromo2025.web.app
**Proyecto Firebase:** `camiseta-d74e5`
**Repo:** https://github.com/promocion2025/camisetapromo2025

## Stack

- Angular 22 con componentes standalone.
- Firebase Hosting, Firestore y Firebase Auth.
- Cloudinary para subir fotos de recuerdos sin depender de Firebase Storage/Blaze.
- Vitest + jsdom para pruebas.

## Secciones

- `/` Home de la Promoción 2025.
- `/registro` Registro de camiseta: nombre, número, género y talla.
- `/tallas` Guía de medidas por género.
- `/agenda` Misa, ceremonia, almuerzo, deporte y baile.
- `/partidos` Inscripción pública a disciplinas deportivas y programación.
- `/comunidad` Recuerdos, fotos y comentarios moderados.
- `/admin` Gestión privada de pedidos, agenda, partidos, inscritos, recuerdos, comentarios y admins.

## Colecciones Firestore

| Colección | Lectura | Escritura |
| --- | --- | --- |
| `pedidos_camisetas` | pública | pública con validación |
| `recuerdos_promocion` | aprobados/destacados o admin | pública como pendiente |
| `comentarios_recuerdos` | aprobados o admin | pública como pendiente |
| `inscripciones_deportivas` | pública | pública con validación |
| `partidos_reencuentro` | pública | solo admin |
| `agenda_reencuentro` | pública | solo admin |
| `admins` | solo admin | admin/founder según reglas |

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
