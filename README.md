# PokéGen

Applicazione Vue 3 + Vite che esplora i Pokémon per generazione tramite PokeAPI, con fallback a dati mock per ambienti offline/CI. Implementa Clean Architecture con separazione netta tra layers, Dependency Injection e pattern repository. Include SEO dinamico, structured data, sitemap/robots e pagine legali.

NB: il progetto è volutamente over ingegnerizzato, poiché usato a scopo didattico per apprendere l'architettura clean.

## Caratteristiche
- Navigazione per generazione (`/generation/:id`) con elenco ordinato di Pokémon.
- Pagina dettaglio Pokémon (`/pokemon/:name`) completa con card dedicata, stats, flavor text, size/capture rate e catena evolutiva.
- Tabella mosse per generazione con dettagli (tipo, categoria, potenza, precisione, PP) e numero MT/TM, con fallback e sorting.
- Abilità (normali e nascoste) con slot e tabella dedicata nella pagina dettaglio.
- Varianti/forme con elenco navigabile e sprite dedicate.
- Ricerca Pokémon con input dedicato e debounce, basata su indice PokeAPI locale e fetch dei dettagli.
- Prefetch iniziale della lista tipi (`/type`) all'avvio, con caching in memoria.
- Caricamento dei version-group per derivare la generazione delle mosse e normalizzare i metodi di apprendimento.
- Stato centralizzato con Pinia e controller/use-case che orchestrano repository e store.
- Client HTTP Axios con retry configurabile, exponential backoff con jitter e cache IndexedDB.
- Mock data locali in `assets/mock_data` utilizzati in modalità development (incl. `pokeapi-list.json`).
- Mock dettagli per version-group, moves e machines in `assets/mock_data/` per test offline.
- Mock dettagliato dei tipi in `assets/mock_data/types-detail.json` e lista Pokémon ridotta in `assets/mock_data/pokemon-list.json` per la ricerca per tipo in dev.
- Dependency Injection tramite `AppContainer` e container feature-specific (PokéGen, Shared) per la gestione delle dipendenze.
- Sprite ufficiali scaricati come Blob tramite controller dedicato, con lazy loading via Intersection Observer, skeleton e fallback SVG per artwork mancanti.
- Arricchimento sprite per evoluzioni e varianti tramite servizi dedicati e facade composita.
- Composable `useIntersectionObserver` per ottimizzare il caricamento delle immagini (lazy load).
- SEO dinamico con meta tag OG/Twitter, JSON-LD e breadcrumb per rotta.
- SEO migliorata con canonical coerente, OG image assolute e JSON-LD più accurato.
- `robots.txt` e `sitemap.xml` generati da script prebuild in `public/`.
- OG image statiche in `public/og/` generate da script prebuild.
- Pagine legali (`/privacy`, `/terms`) e footer con disclaimer.
- Build metadata (versione e last updated) aggiornato da script prebuild.

## Stack tecnico
- **Frontend**: Vue 3, Vite, Vue Router, Pinia
- **HTTP Client**: Axios con interceptor personalizzati (retry, cache)
- **Storage**: IndexedDB per cache delle risposte HTTP (90 giorni TTL) + InMemoryCache in-app con TTL configurabile (via `InMemoryCache.set`)
- **Styling**: Tailwind 4
- **Testing**: Vitest + @vue/test-utils
- **Linting**: ESLint + boundaries
- **TypeScript**: Supporto completo con tsconfig

## Architettura (Clean Architecture)

### Core Layer (`src/core/`)
Contiene le regole di business indipendenti dal framework:
- `contracts/`: Interfacce per application, data, infrastructure e presentation
  - `IUseCaseBase`, `IRepository`, `IDataSource`, `IHttpClient`, `ILogger`, `IMapper`
- `domain/`: Entità di dominio (`Result<T, E>`)
- `enums/`: Enum condivisi (`ApplicationErrorCode`, `EnvironmentEnum`)
- `errors/`: Errori applicativi custom (`NotFoundError`, `MappingError`, `UnauthorizedError`)
- `types/`: Tipi comuni (`Base`, `NamedResource`, `Names`)
- `utils/`: Utility pure e helper:
  - `async/`: Funzioni asincrone (`delay`)
  - `factories/`: `FactoryHelper` per istanziare classi in base all'ambiente
  - `math/`: `MathHelper` per operazioni matematiche
  - `network/`: Utility di rete per connectivity detection e request optimization

### Infrastructure Layer (`src/infrastructure/`)
Implementazioni concrete delle interfacce core:
- `cache/`: `InMemoryCache` (TTL in-app e chiavi univoche)
- `indexedDb/`: Gestione cache persistente con:
  - `CacheDb` e `CacheKeyFactory` per IndexedDB (90 giorni TTL)
  - Tipi: `CacheItem`, `CacheMap`, `CachedResponse`, `CacheRequestConfig`
- `http/`: Client HTTP Axios con:
  - `client/axios/`: `AxiosHttpClient`, `AxiosClientFactory`, interceptor (retry, cache)
  - `config/`: Configurazioni di default per retry e jitter
  - `enums/`: Enum per errori HTTP e retry strategies
  - `mappers/`: `HttpErrorMapper` per normalizzare errori HTTP
  - `utils/`: `Jitter`, `Retry` per strategie di backoff
- `logger/`: `Logger` con livelli (info, warn, error, debug)

### Application Layer (`src/app/`)
Bootstrap e configurazione dell'applicazione:
- `di/`: **Dependency Injection** centralizzato con `AppContainer` (root) e `PokegenContainer` (feature). Usa `FactoryHelper` generico per istanziare classi in base all'ambiente (prod/dev).
- `routing/`: Configurazione Vue Router con `AppRouteName` enum (Home = '/') e hook `afterEach` per applicare SEO per rotta.
- `presentation/`: Layout globali (Hero, Navbar, Footer).
- `styles/`: CSS globali e variabili Tailwind.

### Config Layer (`src/config/`)
Configurazioni applicative indipendenti dai layer core:
- `appConfig.ts`: `BASE_API_URL`.
- `buildMeta.ts`: `APP_VERSION` e `LAST_UPDATED` (auto-aggiornati da `scripts/updateBuildMetadata.js`).

### Modules Layer (`src/modules/pokegen/`)
Feature PokéGen organizzata in sotto-layer:

#### Domain (`domain/`)
- `entities/`: `Generation`, `Pokemon`, `VersionGroupInfo`, `MoveDetail`, `MachineInfo`
- `repositories/`: Interfacce repository (`IGenerationRepository`, `IPokemonRepository`, `IVersionGroupRepository`, `IVersionGroupDetailRepository`, `IMoveRepository`, `IMachineRepository`)
- `usecases/`: Interfacce use case (`IGetGenerationUseCase`, `IGetPokemonUseCase`, `IGetPokemonDetailUseCase`, `IGetVersionGroupsDetailUseCase`, `IGetMoveDetailsUseCase`)

#### Application (`application/`)
- `mappers/`: 
  - `GenerationMapper`, `PokemonMapper` (DTO → Domain)
  - `utils/`: Utility per mapper (`Traverse` per traversal ricorsivo catena evolutiva)
- `providers/`:
  - `PokemonSpriteProvider` (recupero sprite via repository)
- `services/`:
  - `NavigationPokemonLoaderService`
  - `EvolutionSpriteEnricherService`, `VarietySpriteEnricherService`
  - `MoveDetailsEnricherService`
  - `contracts/`: `ISpriteEnricherService`, `INavigationPokemonLoaderService`, `IMoveDetailsEnricherService`
  - `facade/`: `CompositeSpriteEnricherServiceFacade`
- `usecases/`: Implementazioni use case (`GetGenerationUseCase`, `GetPokemonUseCase`, `GetPokemonDetailUseCase`)
  - `GetVersionGroupsDetailUseCase`, `GetMoveDetailsUseCase`

#### Data (`data/`)
- `datasources/`: 
  - `GenerationDataSource`, `PokemonDataSource`, `PokemonSpeciesDataSource`, `EvolutionChainDataSource` (HTTP)
  - `VersionGroupDataSource`, `MoveDataSource`, `MachineDataSource` (HTTP)
  - Versioni mock per `Generation`, `Pokemon`, `PokemonSpecies`, `VersionGroup`, `Move`, `Machine`
- `models/`: DTO e tipi aggregati (`GenerationDTO`, `PokemonDTO`, `PokemonSpeciesDTO`, `PokemonAggregateData`)
- `repositories/`: Implementazioni repository con facade per datasource e mapper
- `types/`: Tipi specifici del data layer
*Nota*: gli endpoint API sono centralizzati in `src/shared/data/enums/EndpointApi`.

#### Presentation (`presentation/`)
- `controllers/`: `UseGenerationController`, `UsePokemonController` (orchestrano use case e store)
- `controllers/`: `UseGenerationController`, `UsePokemonController`, `UseVersionGroupsController`, `UseMoveDetailsController`
- `store/`: Store Pinia (`UseGenerationStore`, `UsePokegenStore`, `UseVersionGroupsStore`, `UseMoveDetailsStore`)
- `mappers/`: 
  - `NavbarMapper`, `PokemonViewMapper` (Domain → ViewModel)
  - `utils/evolution/`: Utility builder (`BuildPokemonVM`, `BuildEvolutionVM`)
- `viewmodels/`: `HomeViewModel`, `DetailViewModel`, `PokemonVM`
- `components/`: Componenti Vue (`Card`, `BadgeType`, `Skeleton`, `EvolutionChain`, `AbilitiesInfo`, `Forms`, `MovesInfo`)
- `views/`: Viste principali (`HomeView`, `DetailView`)
- `composables/`: `useMovesInfo` per logica tabella mosse
- `enums/`: `TypeRequestEnum` per discriminare tipo di richiesta
- `routes.ts`: Rotte della feature

### Shared Layer (`src/shared/`)
Componenti e logica riutilizzabili (usati trasversalmente da più feature):
- `application/`: Use case condivisi (`GetBlobUseCase`, `GetPokeApiUseCase`)
- `domain/`: Interfacce (`IBlobRepository`, `IGetBlobUseCase`, `IPokeApiRepository`, `IGetPokeApiUseCase`)
- `data/`: `BlobDataSource` (API), `BlobMockDataSource` (mock), `BlobRepository`, `PokeApiResponseDataSource`, `PokeApiRepository`
- `presentation/`:
  - `components/`: Componenti Vue riutilizzati (`404View`, `Loader`, `CustomSection`, `ScrollToTop`, `AppMetaInfo`, `PrivacyView`, `TermsView`)
  - `composables/`: Vue composables (`useIntersectionObserver`, `useSeo` per meta tag e JSON-LD)
  - `controllers/`: `UseBlobController`, `UsePokeApiController`
- `factories/`: `SharedContainer` per dependency injection (Blob + PokeAPI + cache)

## Rotte
- `/` – Home (redirect a `/generation/1`)
- `/generation/:id` – Lista Pokémon di una generazione specifica
- `/pokemon/:name` – Dettaglio Pokémon
- `/privacy` – Privacy Policy
- `/terms` – Terms of Service
- `/:pathMatch(.*)*` – Pagina 404 personalizzata

## Avvio rapido
**Prerequisiti**: Node 20.19+ o 22.12+

```bash
npm install
npm run dev        # sviluppo (usa mock data)
npm run build      # build produzione (usa PokeAPI) + aggiorna build metadata
npm run preview    # anteprima build locale
npm run deploy     # build e deploy su GitHub Pages
npm run lint       # linting con ESLint
```

## Test
```bash
npm test              # esegue test con vitest
npm run test:ui       # interfaccia interattiva vitest
npm run test:coverage # report coverage
```

## Lint
```bash
npm run lint
```

## Dependency Injection (AppContainer)
Il `AppContainer` + `PokegenContainer` + `SharedContainer` inizializzano tutte le dipendenze dell'applicazione:

1. **Infrastructure**: `AxiosClientFactory`, `HttpErrorMapper`, `Logger`
2. **Mappers**: `GenerationMapper`, `PokemonMapper`, `NavbarMapper`, `PokemonViewMapper`
3. **PokéGen DataSources**: Selezione API/mock via `FactoryHelper.createByEnvHelper`
4. **PokéGen Repositories**: `GenerationRepository`, `PokemonRepository` con facade per datasource e mapper
5. **PokéGen Services**: `NavigationPokemonLoaderService`, `EvolutionSpriteEnricherService`, `MoveDetailsEnricherService`
6. **PokéGen Use Cases**: `GetGenerationUseCase`, `GetPokemonUseCase`, `GetPokemonDetailUseCase`, `GetSearchPokemonUseCase`, `GetVersionGroupsDetailUseCase`, `GetMoveDetailsUseCase`
7. **PokéGen Controllers**: `UseGenerationController`, `UsePokemonController`, `UseVersionGroupsController`, `UseMoveDetailsController`
8. **Shared pipeline**: `BlobRepository` → `GetBlobUseCase` → `UseBlobController`
9. **PokéGen PokeAPI pipeline**: `PokeApiRepository` → `GetPokeApiUseCase` → `UsePokeApiController`

```typescript
// Esempio utilizzo in un componente Vue
const pkmController = appContainer.pokemonController();
await pkmController.loadData({ endpoint: 'pikachu', req: TypeRequestEnum.DETAIL });
```

## Cache e Retry Strategy
- **Cache IndexedDB**: TTL 90 giorni, chiavi generate da `CacheKeyFactory`
- **InMemory Cache**: TTL configurabile (default 1 ora)
  - `UseGenerationStore`: cache memory per generazioni
  - `UsePokegenStore`: cache memory per Pokémon (home e detail)
- **Retry**: Exponential backoff con jitter (full, equal, decorrelated)
  - 3 tentativi di default con delay iniziale 1000ms
  - Retry su errori transitori (429, 500, 503, 504) e errori di rete
- **Interceptor**: Request (cache read da IndexedDB) e Response (cache write su IndexedDB, retry logic)

## SEO e Metadata
- Meta tag dinamici per route (OG/Twitter) con `applyRouteSeo`.
- JSON-LD con `createStructuredData` e `createPokemonStructuredData`.
- `public/robots.txt` e `public/sitemap.xml` per indicizzazione (generati via `scripts/updateSitemap.js`).
- OG images in `public/og/` generate via `scripts/updateOgImages.js`.
- Build metadata (`APP_VERSION`, `LAST_UPDATED`) in `src/config/buildMeta.ts` aggiornati da `scripts/updateBuildMetadata.js`.


## Struttura progetto completa
```
eslint.config.js                  # ESLint + boundaries
src/
  app/
    di/
      AppContainer.ts                # DI container principale
      pokegen/
        PokegenContainer.ts          # DI container pokegen
    presentation/
      layout/                        # Hero, Navbar, Footer
      seo/                            # seoManager
    routing/
      AppRouteName.ts                # Enum rotte (Home = '/')
      routes.ts                      # Configurazione router
      index.js                       # Router + SEO afterEach
    styles/
  config/
    appConfig.ts                     # BASE_API_URL
    buildMeta.ts                     # APP_VERSION, LAST_UPDATED
  core/
    contracts/                       # Interfacce astratte
    domain/                          # Result<T, E>
    enums/                           # ApplicationErrorCode, EnvironmentEnum
    errors/                          # Custom errors
    types/                           # Tipi comuni
    utils/                           # Utility pure
  infrastructure/
    cache/
      InMemoryCache.ts               # Cache in memoria
    indexedDb/
      CacheDb.ts                     # Gestione IndexedDB
      CacheKeyFactory.ts             # Generatore chiavi cache
      types/                         # CacheItem, CacheMap, CachedResponse
    http/
      client/axios/                  # AxiosHttpClient, interceptor
      config/                        # HttpConfig
      enums/                         # ErrorTypeEnum, RetryEnum
      mappers/                       # HttpErrorMapper
      utils/                         # Jitter, Retry
    logger/                          # Logger
  modules/
    pokegen/
      application/
        mappers/                     # DTO → Domain (+ utils/Traverse)
        providers/                   # PokemonSpriteProvider
        services/                    # NavigationPokemonLoaderService, Evolution/Variety sprite enrichers
          contracts/                 # ISpriteEnricherService, INavigationPokemonLoaderService
          facade/                    # CompositeSpriteEnricherServiceFacade
        usecases/                    # Business logic
      data/
        datasources/                 # API e mock
        models/                      # DTO e tipi
        repositories/                # Implementazioni repository
        types/                       # Tipi specifici data layer
      domain/
        entities/                    # Generation, Pokemon
        repositories/                # Interfacce repository
        usecases/                    # Interfacce use case
      presentation/
        components/                  # Card, BadgeType, Skeleton, EvolutionChain, AbilitiesInfo, Forms
        composables/                 # usePokegenSeo
        config/                      # PokegenAssets
        controllers/                 # Orchestrazione
        enums/                       # AbilitySlotMap
        mappers/                     # Domain → ViewModel (+ utils/evolution/)
        routing/                     # PokegenRouteName
        store/                       # Pinia stores
        viewmodels/                  # HomeViewModel, DetailViewModel
        views/                       # HomeView, DetailView
        routes.ts                    # Rotte della feature
  shared/
    application/
      usecases/                      # GetBlobUseCase, GetPokeApiUseCase
    data/
      datasources/                   # BlobDataSource, PokeApiResponseDataSource (+ mock)
      repositories/                  # BlobRepository, PokeApiRepository
    domain/
      repositories/                  # IBlobRepository, IPokeApiRepository
      usecases/                      # IGetBlobUseCase, IGetPokeApiUseCase
    presentation/
      components/                    # Loader, 404View, CustomSection, ScrollToTop, AppMetaInfo, PrivacyView, TermsView
      composables/                   # useIntersectionObserver, useSeo
      controllers/                   # UseBlobController, UsePokeApiController
      viewmodels/                    # ViewModel condivisi
    factories/                       # SharedContainer
assets/
  mock_data/                         # Dati JSON mock
public/
  default_image.svg                  # Immagine default Pokémon
  robots.txt                         # Robots
  sitemap.xml                        # Sitemap
```

## Mock Data vs API
- **Development** (`npm run dev`): Usa mock data da `assets/mock_data/`
- **Production** (`npm run build`): Usa PokeAPI in produzione
- **Testing**: Usa mock data per test deterministici

Nota: l'indice completo per la ricerca è in `assets/mock_data/pokeapi-list.json`.

La selezione avviene automaticamente tramite le factory in base a `EnvironmentEnum`.

## Deploy su GitHub Pages
```bash
npm run deploy
```
Build Vite + deploy automatico su branch `gh-pages` con `404.html` per SPA routing.

## Stato attuale
✅ Sistema di generazioni completo con navigazione  
✅ Lista Pokémon per generazione con card dettagliate  
✅ Cache persistente e retry strategy  
✅ Clean Architecture con DI modulare  
✅ Immagini di fallback SVG per artwork mancanti e sprite caricati via BlobController  
✅ **Pagina dettaglio Pokémon** completa (stats, flavor text, size/capture rate, catena evolutiva)
✅ Abilità (normali/nascoste) e varianti/forme con sprite dedicate
✅ SEO per rotta (meta, JSON-LD) + sitemap/robots
✅ Pagine legali (privacy/terms) + build metadata nel footer

## Ultimi aggiornamenti
- **v0.0.15**: SEO + routing e config refactor
  - Aggiunto SEO per rotta (OG/Twitter, JSON-LD) e robots/sitemap
  - Aggiunte pagine legali e metadata nel footer
  - Introdotto `src/config` per API URL e build metadata
  - Spostati asset e route name PokéGen in config/routing del modulo

# English:

## PokéGen

Vue 3 + Vite application that explores Pokémon by generation via PokeAPI, with fallback to mock data for offline/CI environments. Implements Clean Architecture with a strict separation between layers, Dependency Injection, and the repository pattern. Includes dynamic SEO, structured data, sitemap/robots, and legal pages.

NB: the project is intentionally over-engineered, as it is used for educational purposes to learn clean architecture.

## Features

* Generation-based navigation (`/generation/:id`) with an ordered list of Pokémon.
* Pokémon detail page (`/pokemon/:name`) complete with a dedicated card, stats, flavor text, size/capture rate, and evolution chain.
* Abilities (normal and hidden) with slots and a dedicated table in the detail page.
* Variants/forms list with dedicated sprites.
* Pokémon search with dedicated input and debounce, based on a local PokeAPI index and fetching of details.
* Initial prefetch of the types list (`/type`) on app mount, cached in memory.
* Centralized state with Pinia and controller/use-case layers that orchestrate repositories and store.
* Axios HTTP client with configurable retry, exponential backoff with jitter, and IndexedDB cache.
* Local mock data in `assets/mock_data` used in development mode (incl. `pokeapi-list.json`).
* Detailed types mock in `assets/mock_data/types-detail.json` and reduced Pokémon list in `assets/mock_data/pokemon-list.json` for type search in dev.
* Dependency Injection via `AppContainer` and feature-specific containers (PokéGen, Shared) for dependency management.
* Official sprites downloaded as Blobs via a dedicated controller, with lazy loading via Intersection Observer, skeletons, and SVG fallback for missing artwork.
* Sprite enrichment for evolutions and variants via dedicated services and a composite facade.
* `useIntersectionObserver` composable to optimize image loading (lazy load).
* Dynamic SEO with OG/Twitter meta, JSON-LD, and breadcrumbs per route.
* Improved SEO with consistent canonical URLs, absolute OG images, and refined JSON-LD.
* `robots.txt` and `sitemap.xml` generated by prebuild scripts in `public/`.
* Static OG images in `public/og/` generated by prebuild scripts.
* Legal pages (`/privacy`, `/terms`) and footer disclaimer.
* Build metadata (version and last updated) updated by prebuild scripts.

## Tech stack

* **Frontend**: Vue 3, Vite, Vue Router, Pinia
* **HTTP Client**: Axios with custom interceptors (retry, cache)
* **Storage**: IndexedDB for HTTP response cache (90 days TTL) + in-app InMemoryCache with configurable TTL (via `InMemoryCache.set`)
* **Styling**: Tailwind 4
* **Testing**: Vitest + @vue/test-utils
* **Linting**: ESLint + boundaries
* **TypeScript**: Full support with tsconfig

## Architecture (Clean Architecture)

### Core Layer (`src/core/`)

Contains framework-agnostic business rules:

* `contracts/`: Interfaces for application, data, infrastructure, and presentation

  * `IUseCaseBase`, `IRepository`, `IDataSource`, `IHttpClient`, `ILogger`, `IMapper`
* `domain/`: Domain entities (`Result<T, E>`)
* `enums/`: Shared enums (`ApplicationErrorCode`, `EnvironmentEnum`)
* `errors/`: Custom application errors (`NotFoundError`, `MappingError`, `UnauthorizedError`)
* `types/`: Common types (`Base`, `NamedResource`, `Names`)
* `utils/`: Pure utilities and helpers:

  * `async/`: Asynchronous functions (`delay`)
  * `factories/`: `FactoryHelper` to instantiate classes based on environment
  * `math/`: `MathHelper` for mathematical operations
  * `network/`: Network utilities for connectivity detection and request optimization

### Infrastructure Layer (`src/infrastructure/`)

Concrete implementations of core interfaces:

* `cache/`: `InMemoryCache` (in-app TTL and unique keys)
* `indexedDb/`: Persistent cache management with:

  * `CacheDb` and `CacheKeyFactory` for IndexedDB (90 days TTL)
  * Types: `CacheItem`, `CacheMap`, `CachedResponse`, `CacheRequestConfig`
* `http/`: Axios HTTP client with:

  * `client/axios/`: `AxiosHttpClient`, `AxiosClientFactory`, interceptors (retry, cache)
  * `config/`: Default configurations for retry and jitter
  * `enums/`: Enums for HTTP errors and retry strategies
  * `mappers/`: `HttpErrorMapper` to normalize HTTP errors
  * `utils/`: `Jitter`, `Retry` for backoff strategies
* `logger/`: `Logger` with levels (info, warn, error, debug)

### Application Layer (`src/app/`)

Application bootstrap and configuration:

* `di/`: **Dependency Injection** centralized with `AppContainer` (root) and `PokegenContainer` (feature). Uses generic `FactoryHelper` to instantiate classes based on environment (prod/dev).
* `routing/`: Vue Router configuration with `AppRouteName` enum (Home = '/') and `afterEach` hook to apply route SEO.
* `presentation/`: Global layouts (Hero, Navbar, Footer)
* `styles/`: Global CSS and Tailwind variables

### Config Layer (`src/config/`)

Application configuration independent from core layers:

* `appConfig.ts`: `BASE_API_URL`
* `buildMeta.ts`: `APP_VERSION` and `LAST_UPDATED` (auto-updated by `scripts/updateBuildMetadata.js`)

### Modules Layer (`src/modules/pokegen/`)

PokéGen feature organized into sub-layers:

#### Domain (`domain/`)

* `entities/`: `Generation`, `Pokemon` (business entities with helper methods)
* `repositories/`: Repository interfaces (`IGenerationRepository`, `IPokemonRepository`)
* `usecases/`: Use case interfaces (`IGetGenerationUseCase`, `IGetPokemonUseCase`, `IGetPokemonDetailUseCase`)

#### Application (`application/`)

* `mappers/`:

  * `GenerationMapper`, `PokemonMapper` (DTO → Domain)
  * `utils/`: Mapper utilities (`Traverse` for recursive traversal of evolution chain)
* `providers/`:

  * `PokemonSpriteProvider` (sprite retrieval via repository)
* `services/`:

  * `NavigationPokemonLoaderService`
  * `EvolutionSpriteEnricherService`, `VarietySpriteEnricherService`
  * `contracts/`: `ISpriteEnricherService`, `INavigationPokemonLoaderService`
  * `facade/`: `CompositeSpriteEnricherServiceFacade`
* `usecases/`: Use case implementations (`GetGenerationUseCase`, `GetPokemonUseCase`, `GetPokemonDetailUseCase`)

#### Data (`data/`)

* `datasources/`:

  * `GenerationDataSource`, `PokemonDataSource`, `PokemonSpeciesDataSource`, `EvolutionChainDataSource` (HTTP)
  * Mock versions for `Generation`, `Pokemon`, and `PokemonSpecies`
* `models/`: DTOs and aggregated types (`GenerationDTO`, `PokemonDTO`, `PokemonSpeciesDTO`, `PokemonAggregateData`)
* `repositories/`: Repository implementations with datasource and mapper facades
* `types/`: Data-layer specific types
*Note*: endpoint constants are centralized in `src/shared/data/enums/EndpointApi`.

#### Presentation (`presentation/`)

* `controllers/`: `UseGenerationController`, `UsePokemonController` (orchestrate use cases and store)
* `store/`: Pinia stores (`UseGenerationStore`, `UsePokegenStore`)
* `mappers/`:

  * `NavbarMapper`, `PokemonViewMapper` (Domain → ViewModel)
  * `utils/evolution/`: Utility builders (`BuildPokemonVM`, `BuildEvolutionVM`)
* `viewmodels/`: `HomeViewModel`, `DetailViewModel`, `PokemonVM`
* `components/`: Vue components (`Card`, `BadgeType`, `Skeleton`, `EvolutionChain`, `AbilitiesInfo`, `Forms`)
* `views/`: Main views (`HomeView`, `DetailView`)
* `enums/`: `TypeRequestEnum` to discriminate request type
* `routes.ts`: Feature routes

### Shared Layer (`src/shared/`)

Reusable components and logic (used across multiple features):

* `application/`: Shared use cases (`GetBlobUseCase`, `GetPokeApiUseCase`)
* `domain/`: Interfaces (`IBlobRepository`, `IGetBlobUseCase`, `IPokeApiRepository`, `IGetPokeApiUseCase`)
* `data/`: `BlobDataSource` (API), `BlobMockDataSource` (mock), `BlobRepository`, `PokeApiResponseDataSource`, `PokeApiRepository`
* `presentation/`:

  * `components/`: Reusable Vue components (`404View`, `Loader`, `CustomSection`, `ScrollToTop`, `AppMetaInfo`, `PrivacyView`, `TermsView`)
  * `composables/`: Vue composables (`useIntersectionObserver`, `useSeo` for meta tags and JSON-LD)
  * `controllers/`: `UseBlobController`, `UsePokeApiController`
* `factories/`: `SharedContainer` for dependency injection (Blob + PokeAPI + cache)

## Routes

* `/` – Home (redirect to `/generation/1`)
* `/generation/:id` – Pokémon list of a specific generation
* `/pokemon/:name` – Pokémon detail
* `/privacy` – Privacy Policy
* `/terms` – Terms of Service
* `/:pathMatch(.*)*` – Custom 404 page

## Quick start

**Prerequisites**: Node 20.19+ or 22.12+

```bash
npm install
npm run dev        # development (uses mock data)
npm run build      # production build (uses PokeAPI) + updates build metadata
npm run preview    # local build preview
npm run deploy     # build and deploy to GitHub Pages
npm run lint       # ESLint linting
```

## Tests

```bash
npm test              # run tests with vitest
npm run test:ui       # vitest interactive UI
npm run test:coverage # coverage report
```

## Lint
```bash
npm run lint
```

## Dependency Injection (AppContainer)

The `AppContainer` + `PokegenContainer` + `SharedContainer` initialize all application dependencies:

1. **Infrastructure**: `AxiosClientFactory`, `HttpErrorMapper`, `Logger`
2. **Mappers**: `GenerationMapper`, `PokemonMapper`, `NavbarMapper`, `PokemonViewMapper`
3. **PokéGen DataSources**: API/mock selection via `FactoryHelper.createByEnvHelper`
4. **PokéGen Repositories**: `GenerationRepository`, `PokemonRepository` with datasource and mapper facades
5. **PokéGen Services**: `NavigationPokemonLoaderService`, `EvolutionSpriteEnricherService`
6. **PokéGen Use Cases**: `GetGenerationUseCase`, `GetPokemonUseCase`, `GetPokemonDetailUseCase`, `GetSearchPokemonUseCase`
7. **PokéGen Controllers**: `UseGenerationController`, `UsePokemonController`
8. **Shared pipeline**: `BlobRepository` → `GetBlobUseCase` → `UseBlobController`
9. **PokéGen PokeAPI pipeline**: `PokeApiRepository` → `GetPokeApiUseCase` → `UsePokeApiController`

```typescript
// Example usage in a Vue component
const pkmController = appContainer.pokemonController();
await pkmController.loadData({ endpoint: 'pikachu', req: TypeRequestEnum.DETAIL });
```

## Cache and Retry Strategy

* **IndexedDB Cache**: 90-day TTL, keys generated by `CacheKeyFactory`
* **InMemory Cache**: Configurable TTL (default 1 hour)

  * `UseGenerationStore`: memory cache for generations
  * `UsePokegenStore`: memory cache for Pokémon (home and detail)
* **Retry**: Exponential backoff with jitter (full, equal, decorrelated)

  * 3 attempts by default with initial delay of 1000ms
  * Retry on transient errors (429, 500, 503, 504) and network errors
* **Interceptor**: Request (cache read from IndexedDB) and Response (cache write to IndexedDB, retry logic)

## SEO and Metadata
* Dynamic meta tags per route (OG/Twitter) via `applyRouteSeo`.
* JSON-LD with `createStructuredData` and `createPokemonStructuredData`.
* `public/robots.txt` and `public/sitemap.xml` for indexing (generated via `scripts/updateSitemap.js`).
* OG images in `public/og/` generated via `scripts/updateOgImages.js`.
* Build metadata (`APP_VERSION`, `LAST_UPDATED`) in `src/config/buildMeta.ts` updated by `scripts/updateBuildMetadata.js`.


## Full project structure

```
eslint.config.js                  # ESLint + boundaries
src/
  app/
    di/
      AppContainer.ts                # Main DI container
      pokegen/
        PokegenContainer.ts          # Pokegen DI container
    presentation/
      layout/                        # Hero, Navbar, Footer
      seo/                            # seoManager
    routing/
      AppRouteName.ts                # Route enum (Home = '/')
      routes.ts                      # Router configuration
      index.js                       # Router + SEO afterEach
    styles/
  config/
    appConfig.ts                     # BASE_API_URL
    buildMeta.ts                     # APP_VERSION, LAST_UPDATED
  core/
    contracts/                       # Abstract interfaces
    domain/                          # Result<T, E>
    enums/                           # ApplicationErrorCode, EnvironmentEnum
    errors/                          # Custom errors
    types/                           # Common types
    utils/                           # Pure utilities
  infrastructure/
    cache/
      InMemoryCache.ts               # In-memory cache
    indexedDb/
      CacheDb.ts                     # IndexedDB management
      CacheKeyFactory.ts             # Cache key generator
      types/                         # CacheItem, CacheMap, CachedResponse
    http/
      client/axios/                  # AxiosHttpClient, interceptors
      config/                        # HttpConfig
      enums/                         # ErrorTypeEnum, RetryEnum
      mappers/                       # HttpErrorMapper
      utils/                         # Jitter, Retry
    logger/                          # Logger
  modules/
    pokegen/
      application/
        mappers/                     # DTO → Domain (+ utils/Traverse)
        providers/                   # PokemonSpriteProvider
        services/                    # NavigationPokemonLoaderService, Evolution/Variety sprite enrichers
          contracts/                 # ISpriteEnricherService, INavigationPokemonLoaderService
          facade/                    # CompositeSpriteEnricherServiceFacade
        usecases/                    # Business logic
      data/
        datasources/                 # API and mock
        models/                      # DTOs and types
        repositories/                # Repository implementations
        types/                       # Data-layer specific types
      domain/
        entities/                    # Generation, Pokemon
        repositories/                # Repository interfaces
        usecases/                    # Use case interfaces
      presentation/
        components/                  # Card, BadgeType, Skeleton, EvolutionChain, AbilitiesInfo, Forms
        composables/                 # usePokegenSeo
        config/                      # PokegenAssets
        controllers/                 # Orchestration
        enums/                       # AbilitySlotMap
        mappers/                     # Domain → ViewModel (+ utils/evolution/)
        routing/                     # PokegenRouteName
        store/                       # Pinia stores
        viewmodels/                  # HomeViewModel, DetailViewModel
        views/                       # HomeView, DetailView
        routes.ts                    # Feature routes
  shared/
    application/
      usecases/                      # GetBlobUseCase, GetPokeApiUseCase
    data/
      datasources/                   # BlobDataSource, PokeApiResponseDataSource (+ mock)
      repositories/                  # BlobRepository, PokeApiRepository
    domain/
      repositories/                  # IBlobRepository, IPokeApiRepository
      usecases/                      # IGetBlobUseCase, IGetPokeApiUseCase
    presentation/
      components/                    # Loader, 404View, CustomSection, ScrollToTop, AppMetaInfo, PrivacyView, TermsView
      composables/                   # useIntersectionObserver, useSeo
      controllers/                   # UseBlobController, UsePokeApiController
      viewmodels/                    # Shared ViewModels
    factories/                       # SharedContainer
assets/
  mock_data/                         # Mock JSON data
public/
  default_image.svg                  # Default Pokémon image
  robots.txt                         # Robots
  sitemap.xml                        # Sitemap
```

## Mock Data vs API

* **Development** (`npm run dev`): Uses mock data from `assets/mock_data/`
* **Production** (`npm run build`): Uses PokeAPI in production
* **Testing**: Uses mock data for deterministic tests

Note: the complete index for search is in `assets/mock_data/pokeapi-list.json`.

Selection happens automatically via factories based on `EnvironmentEnum`.

## Deploy to GitHub Pages

```bash
npm run deploy
```

Vite build + automatic deploy to `gh-pages` branch with `404.html` for SPA routing.

## Current status

✅ Complete generation system with navigation
✅ Pokémon list per generation with detailed cards
✅ Persistent cache and retry strategy
✅ Clean Architecture with modular DI
✅ SVG fallback images for missing artwork and sprites loaded via BlobController
✅ **Pokémon detail page** complete (stats, flavor text, size/capture rate, evolution chain)
✅ Abilities (normal/hidden) and variants/forms with dedicated sprites
✅ SEO per route (meta, JSON-LD) + sitemap/robots
✅ Legal pages (privacy/terms) + build metadata in footer

## Latest updates
* **v0.0.15**: SEO + routing and config refactor
  * Added route-based SEO (OG/Twitter, JSON-LD) and robots/sitemap
  * Added legal pages and footer metadata
  * Introduced `src/config` for API URL and build metadata
  * Moved PokéGen presentation assets and route names into module config/routing
