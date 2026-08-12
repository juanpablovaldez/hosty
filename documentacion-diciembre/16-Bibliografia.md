---
title: "16 — Bibliografía"
seccion: "16"
orden: 17
tipo: seccion
tags: [hosty, informe-final, bibliografia, referencias]
estado: completo
updated: 2026-08-03
---

# 16. Bibliografía

Las fuentes que sostienen las decisiones técnicas de este informe son, en su mayoría, la
documentación oficial de las herramientas empleadas. Se las cita porque cada una respalda una
decisión concreta —no como lectura de contexto— y se indica, cuando corresponde, la sección del
informe que se apoya en ella. Todas las direcciones se consultaron entre marzo y agosto de 2026.

## Metodología y proceso

Schwaber, K. y Sutherland, J. (2020). *The Scrum Guide: The Definitive Guide to Scrum — The Rules
of the Game*. Scrum.org. `https://scrumguides.org/scrum-guide.html`
— Marco de referencia para las ceremonias, los roles y la cadencia descritos en
[[09-Planificacion-Scrum]].

Beck, K. *et al.* (2001). *Manifesto for Agile Software Development*.
`https://agilemanifesto.org/iso/es/manifesto.html`
— Principios que orientan la priorización de alcance documentada en [[13-Ejecucion-por-Sprint]].

Conventional Commits (2023). *Conventional Commits 1.0.0*.
`https://www.conventionalcommits.org/es/v1.0.0/`
— Convención de mensajes de *commit* que el repositorio hace cumplir mediante `commitlint`, según
se detalla en [[12-Testing-y-Calidad]].

## Arquitectura y plataforma de datos

Supabase (2026). *Supabase Documentation*. `https://supabase.com/docs`
— Plataforma de base de datos, autenticación y almacenamiento sobre la que se apoya la arquitectura
de dos capas de [[11-Arquitectura]].

PostgREST (2026). *PostgREST Documentation*. `https://postgrest.org/en/stable/`
— Componente que autogenera la API REST a partir del esquema de PostgreSQL; fundamenta el
contenido de [[Anexo-IV-API-y-Repositorio]].

The PostgreSQL Global Development Group (2026). *PostgreSQL 17 Documentation — Row Security
Policies*. `https://www.postgresql.org/docs/17/ddl-rowsecurity.html`
— Mecanismo de autorización por propiedad de fila que sustituye a un esquema de roles, descrito en
[[11-Arquitectura]] y en [[Anexo-I-Modelo-de-Datos]].

Fielding, R. T. (2000). *Architectural Styles and the Design of Network-based Software
Architectures* (tesis doctoral). University of California, Irvine.
`https://ics.uci.edu/~fielding/pubs/dissertation/top.htm`
— Formulación original del estilo arquitectónico REST, del que PostgREST es una implementación.

## Desarrollo del cliente

Meta Open Source (2026). *React Documentation*. `https://react.dev`
— Biblioteca de interfaz de usuario; versión 19, con el compilador de React habilitado.

Vite (2026). *Vite Guide*. `https://vite.dev/guide/`
— Herramienta de construcción y servidor de desarrollo del *frontend*.

Microsoft (2026). *TypeScript Handbook*. `https://www.typescriptlang.org/docs/handbook/intro.html`
— Sistema de tipos empleado en modo estricto en todo el código de aplicación.

TanStack (2026). *TanStack Router Documentation*. `https://tanstack.com/router/latest`
— Enrutado tipado basado en archivos; sustenta el inventario de rutas de la Tabla 15.

TanStack (2026). *TanStack Query Documentation*. `https://tanstack.com/query/latest`
— Caché de estado de servidor; define el ciclo de lectura de datos de la Figura 18.

Tailwind Labs (2026). *Tailwind CSS Documentation*. `https://tailwindcss.com/docs`
— Sistema de utilidades de estilo y variables de marca descritos en [[08-Diseno-y-Desarrollo]].

WAI-ARIA Authoring Practices (2026). *ARIA Authoring Practices Guide*. W3C.
`https://www.w3.org/WAI/ARIA/apg/`
— Referencia de roles de accesibilidad; sustenta el hallazgo sobre el marcado semántico del control
de reserva registrado en [[Anexo-V-Evidencias-QA]].

## Calidad y automatización

Vitest (2026). *Vitest Guide*. `https://vitest.dev/guide/`
— Ejecutor de pruebas unitarias y de componente, y proveedor de la medición de cobertura de la
Tabla 32.

Testing Library (2026). *React Testing Library Documentation*.
`https://testing-library.com/docs/react-testing-library/intro/`
— Enfoque de prueba centrado en el comportamiento observable por la persona usuaria.

Microsoft (2026). *Playwright Documentation*. `https://playwright.dev/docs/intro`
— Automatización de pruebas de punta a punta sobre Chromium, Firefox y WebKit; incluye el modo
estricto de localizadores que explica dos de los fallos analizados en la Tabla 57c.

GitHub (2026). *GitHub Actions Documentation*. `https://docs.github.com/actions`
— Canalización de integración y despliegue continuos descrita en [[12-Testing-y-Calidad]].

## Infraestructura

Amazon Web Services (2026). *Amazon S3 y Amazon CloudFront — Developer Guides*.
`https://docs.aws.amazon.com/`
— Alojamiento estático y red de distribución de contenidos del *frontend* desplegado.

HashiCorp (2026). *Terraform Documentation*. `https://developer.hashicorp.com/terraform/docs`
— Infraestructura como código para los recursos de AWS, según [[11-Arquitectura]].

OpenStreetMap Foundation (2026). *Nominatim Documentation*.
`https://nominatim.org/release-docs/latest/`
— Servicio de geocodificación empleado para ubicar cada salón en el mapa del catálogo.

---
[[Indice|Índice]] · ← [[15-Conclusiones]] · [[Anexo-I-Modelo-de-Datos]] →
