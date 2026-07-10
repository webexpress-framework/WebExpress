![WebExpress](https://raw.githubusercontent.com/webexpress-framework/.github/main/docs/assets/img/banner.png)

# View, State and Service Architecture for WebExpress.WebApp

This document defines the conceptual architecture of the JavaScript component model of WebExpress.WebApp. It establishes a clear separation between presentation (View), data ownership (State) and network access (Service). The concept draws its mental model from React and from unidirectional data flow while remaining fully compatible with the existing WebExpress ecosystem. The declarative binding surface (data-wx-bind) and the imperative action surface (data-wx-primary-action and data-wx-secondary-action) are integrated into the concept rather than replaced.

A central guiding constraint is that WebExpress applications continue to be authored entirely in C#. State initialization, service definitions and data provisioning originate in the C# layer, and JavaScript serves exclusively as the dynamic user interface engine.

The architecture is written to be precise, modular and extensible. Every section opens with a short introduction that frames the intent of that section, followed by the concrete architectural rules, artifacts and responsibilities.

## 1. Scope and Goals

The scope and goals defined here describe what the conceptual architecture achieves and where its boundaries lie, so that later implementation decisions can be measured against a fixed intent. The scope covers the client-side component layer of WebExpress.WebApp together with the C# control layer that emits it, as well as the shared primitives that already exist in WebExpress.WebUI and are inherited by WebExpress.WebApp.

The primary goal is a predictable component model in which three responsibilities are always separated. The View renders markup from a single source of truth and never performs input or output. The State owns the data and the user interface flags of a component and is the single source of truth. The Service performs all network access and returns normalized results.

A secondary goal is to preserve the authoring experience in C#, ensuring that application developers declare state, services, bindings and actions through typed C# controls and never edit JavaScript.

A third goal is architectural compatibility with the existing WebExpress control model, so that the concept can be applied uniformly across simple controls, stateful controls and controls with remote data access without changing the public authoring surface.

Out of scope are a third-party reactive framework, a change to the routing model and a change to the REST endpoint contracts on the server. A JavaScript bundler or minifier is optional infrastructure and not part of the architecture itself.

## 2. Target Architecture (View, State and Service)

The target architecture is a small unidirectional loop layered on top of the existing WebExpress primitives.

The State layer is an observable store that holds the data and the user interface flags of a component. It exposes four operations: reading the current state, applying a shallow patch, subscribing to changes and selecting a derived slice. A patch notifies subscribers in a single batched step, so that multiple updates in one turn trigger exactly one render. Stores are local to a component by default and can be promoted to named shared stores for cross-component coordination.

The View layer is a pure function of state. A component implements a render method that receives the current state and produces a lightweight virtual node tree. A small keyed reconciler patches that tree into the real DOM, preserves focus and preserves nested control instances through stable keys and a keep flag. The View never calls a service and never mutates state directly.

The architecture supports three compatible rendering forms.
The first form keeps imperative rendering but drives it exclusively from the store.
The second form uses the keyed reconciler.
The third form expresses the view as a registered template that can be authored from C#.
Each form implements the same state and service contract and therefore belongs to the same concept.

The Service layer encapsulates all network access behind named services. Each service is configured by a declarative descriptor that defines the base address, the operations, the mapping of parameters into the query, the mapping of the response into state and the policies for headers, retry and cancellation. A service exposes asynchronous operations such as load, query, create, update and emove, and every operation returns a normalized result that reports success, data, error and status. Service descriptors are authored in C#.

The single direction of data is the binding contract between the layers.
The C# layer seeds the initial state and the service descriptors.
The store holds that state.
The view renders from the store.
A user interaction enters through an action or a bind, which produces an intent.
The intent calls a service when it needs data and reduces the result into the store.
The store notifies, and the view renders again.

Side effects exist only in services and in the effect part of intents, never in the view and never in a reducer.

## 2.1 Scope ViewState and Central Resources

The scope ViewState is the concrete, page-near realization of the loop above. Instead of every data control owning a private store and loading itself, a region of the page is wrapped in a single ViewState that owns the state, the services and the resources of that region. The page is simply the outermost scope; scopes nest, and a control resolves the nearest enclosing scope, or an explicit one by id. The motivation is direct: resources are loaded once and centrally, every control in the scope re-renders when the shared state changes, and any control can trigger a re-query without knowing how the data is fetched.

The ViewState is the observable state container of WebExpress.WebApp. It is not a wrapper around a separate store; it is the store. It applies a shallow patch, batches notifications on a microtask and lets a subscriber watch a derived slice with shallow equality, and it adds the scope wiring on top: it seeds its state from the wx-state island, resolves its services from the wx-service islands and parses its resources from the wx-resource islands, all emitted by the C# `ControlViewState` host. A control therefore never owns a store of its own; it subscribes to the scope it belongs to.

A resource is a named, centrally loaded query. It names the scope service that loads it, the state key its result is reduced into, and the parameters that flow between the state and the query. On mount the ViewState loads every automatic resource, and it reduces the outcome into `state[target] = { items, total, loading, error }`. A control subscribes to that slice and renders it; a stale response that a newer query supersedes arrives as an abort and is ignored. A control re-queries a resource by dispatching the scope intent `view/query`, whose reducer merges a patch (for example a new search term and a reset page) and whose effect re-queries the named resource, so one control changes the shared state and every subscribing control re-renders from the result.

Parameter binding is bidirectional. Each resource parameter binds a scope state key to a query parameter. Outbound, the state value feeds the request; inbound, the value the response echoes flows back into the state, which is how a server that clamps a page index keeps the scope state authoritative. The direction is declared as `out`, `in` or `inout`, defaulting to `inout`. Combined with the two-way `data-wx-model` input bind, this closes the loop from the input to the state to the query to the response and back to the input. A response that echoes an unchanged value never loops back into a fresh query, because a patch that changes nothing notifies no one and a load runs only when a resource is loaded on mount or re-queried explicitly.

Scope resolution and lifetime are deterministic. The `ControlViewState` renders a `wx-webapp-viewstate` host that carries a `data-wx-scope` id. A control resolves its scope by the resource it binds to: the registry indexes each scope by the resources it declares, so a control with a `data-wx-resource` binding finds the scope that owns that resource without the host needing to wrap it. An explicit `data-wx-scope` id and DOM ancestry remain as fallbacks. Because the controller instantiates children before their host, a control that resolves its scope before the host exists is queued and resolved when the scope registers, independent of event timing. A scope's lifetime is its host element's lifetime, which the controller already tears down on removal, so the ViewState unsubscribes its listeners, aborts its in-flight services and unregisters itself with no reference counting of its own.

Authoring is type-safe. The scope is `ControlViewState<TState>`, where the state model `TState` configures the initial state through typed properties rather than string keys. A service is declared with `Service<TService>()` and a resource with `Resource<TResource>()`, both identified by their type; a control is created separately and bound to a resource with `Resource<TResource>()`. The wire names the islands carry are derived from the types, so no resource or service name is ever written as a string at the call site, and the scope holds only services, resources and state — never the controls themselves. A control's data and mutations use the service its bound resource declares (`serviceForResource`), and a control that also needs the scope's users service binds it with `UsersService<TEndpoint>()`.

The asymmetry between `Resource<TResource>()` and `UsersService<TEndpoint>()` is deliberate, because a resource and a service are two different kinds of scope member. A resource is a central, reactive query that the scope loads once and reduces into a slice of the scope state; a control binds the resource it renders and re-renders when the scope re-queries it. A service is an endpoint a control calls directly, for a mutation or an on-demand lookup such as the assignee picker, and its result is not reduced into a reactive slice. The primary data service is therefore implicit, declared by the resource and reached through `serviceForResource`, while only an additional, role-specific service such as the users lookup is bound explicitly. The rule is: a control binds a resource for the shared data it renders, and a service for an endpoint it calls directly. A small, preloaded set of candidate users could be modelled as a resource instead, but an on-demand, parameterized lookup is a service.

## 2.2 Live Data Updates over the Message Queue

A resource that was loaded once is stale the moment another user changes the data behind it. The live update channel closes this gap: when server side data of a logical domain changes, the server pushes a small change notification over the existing message queue WebSocket, and every scope ViewState whose services serve that domain re-queries the affected resources, so all subscribing controls re-render from the fresh result. The unidirectional loop stays intact, because the notification does not carry data; it merely triggers the same central re-query that a user interaction would, so the REST endpoint remains the single source of the data, its authorization and its projection.

The producing side is the domain concept the framework already carries. A domain (`IDomain` in WebCore) names a logical data area, and its wire name is the lower case full type name, derived once by `DataChangedNotifier.DomainName` and shared by the addressing, the messages and the service islands. When an index item implements `IDomain`, the CRUD REST endpoints announce every create, update and delete through `DataChangedNotifier`, which sends a `webexpress.webapp.data.changed` message carrying the domain, the operation (`created`, `updated`, `deleted`) and the item id to every session that subscribed the domain (`AddressDomain`). Application code calls the same notifier for changes that happen outside a request, for example in a background job or an import, so every change reaches the clients through one channel regardless of its origin.

The declaring side is the service island. A `wx-service` island may carry a `domains` attribute with the wire names of the domains its endpoint serves. The author usually never writes them: `Endpoint<TEndpoint>()` derives the domains from the endpoint type, because the CRUD REST bases carry their item type as a generic argument, and every generic argument along the inheritance chain that implements `IDomain` names a change source of the endpoint. An endpoint whose item type cannot be derived declares its domain explicitly with `Domain<TDomain>()` on the service builder. A service without domains keeps its scope entirely detached from the message queue, so the channel is strictly opt-in by data model.

The subscribing side is the scope ViewState. On mount it indexes its resources by the domains their services declare; when at least one domain exists, it registers a listener on the message queue and subscribes the domains through an inbound `webexpress.webapp.data.subscribe` message. The server merges the subscribed domains into the connection's session, so the scope is addressed like a page that declared the domain up front, and the client re-announces the subscription after every reconnect. The static page-level declaration through the `[Domain<TDomain>]` page attribute keeps working and seeds the connect url, but a scope no longer depends on it, because the scope learns its domains from its own services.

The reacting side is a coalesced re-query. An incoming change message whose domain matches marks the resources of that domain and re-queries them once after a short coalescing window, so a burst of changes (for example a bulk operation by another user) triggers one re-query per resource instead of one per message. The re-query is the ordinary central load: the outbound parameters are read from the current scope state, the result is reduced into the target slice and every subscribing control re-renders. The originator of a change receives the notification too and re-queries like everyone else, which keeps its slices on the canonical server state; the coalescing window and the service's abort of superseded queries absorb the overlap with its own post-mutation reload. On teardown the scope unregisters its listener; the domain subscription stays with the connection, because an unmatched change message is simply ignored.

An externally triggered refresh is made visible. Once the fresh data has been reduced, every control bound to the re-queried resource (found by its `data-wx-resource` binding) briefly plays the change flash: the engine puts the `wx-data-changed` class on the control host for the duration of its css animation, so the user sees that the content changed because of an outside action rather than an own one. A standalone data control (a list, table, tile panel, tab, kanban board, dashboard, backlog or gantt that owns its islands) reloads through its own service and flashes its host the same way, wired through the shared `DataChangeSubscription.attachReload`. The flash respects `prefers-reduced-motion`, and no control has to opt in individually, because in scope mode the binding attribute that resolves the scope is also what locates the flash targets.

## 3. New Artifacts and Responsibilities

The following artifact overview enumerates every architectural artifact, on both the JavaScript side and the C# side, and assigns each a single clear responsibility. The artifacts follow the egister, get and unregister shape that the Actions and Binds registries already use, so that the surface stays uniform and open to plugins.

### 3.1 JavaScript artifacts

The introduction to this part is that all core artifacts live in the webexpress.webapp namespace, because the dynamic concept belongs to WebExpress.WebApp; WebExpress.WebUI stays a static control library and is intentionally untouched by it. The core engine is intentionally small and free of framework dependencies.

The Store class is an observable state container. Its responsibility is to hold one component state object, to apply shallow patches, to batch notifications on a microtask and to expose selection with shallow equality so that subscribers only react to relevant changes. The StoreRegistry singleton holds named shared stores and reference counts them, so that a shared store is created when the first consumer asks for it and disposed when the last consumer unmounts.

The Service base class defines the operation interface and the normalized result shape. The RestService default implementation reproduces the current behavior of the list and table controls, including the query parameters for search, structured query, filter, page, length and order, the use of an abort controller and the parsing of a JSON body. The ServiceRegistry singleton holds named services and resolves a descriptor into a configured service. Its island parser reads the hidden wx-service child elements of a host into configured services so that the JavaScript carries no hard-coded endpoint knowledge; the islands are consumed on the first read.

The Renderer module provides a node factory and a keyed patch function. Its responsibility is to diff a virtual node tree against a container and to apply the minimal set of DOM mutations, while preserving focus and preserving nested controls that are marked to be kept. The Intents registry maps intent names to a reducer and an effect. The reducer is a pure state transition, and the effect is an asynchronous routine that calls a service and dispatches a follow-up intent with the result. The Intents registry is the bridge that connects actions and binds to services and state.

The Data class extends Ctrl and ties these pieces together. Its responsibility is to own a store, to resolve the services it needs, to expose a dispatch method for intents, to provide setState and a state accessor, and to run lifecycle hooks named onMount, onUpdate and onUnmount. Controls with view logic, local state or remote data access extend Data, while Ctrl remains available for trivial controls that hold no state and perform no network access.

### 3.2 C# artifacts

The introduction to this part is that the C# artifacts exist so that an author declares the entire client behavior in typed C# and never writes JavaScript. They render their declarations into hidden island elements at the start of the host element that the JavaScript engine consumes.

The DataState C# type provides a fluent way (Create and Set) to declare the initial state object of a control. It collects keys and values, where the values come from the existing C# lambdas, and renders them into a wx-state island element whose wx-prop children carry the values with type markers. The DataServiceDescriptor C# type declares the REST contract as a typed object, including the endpoints resolved through the sitemap, the methods, the query parameter names and the response mapping, and renders one wx-service island element per service, with the scalar parts as attributes and the mappings as child elements. A control exposes both through the IDataIsland interface, namely its State and DataService properties. Because the endpoints are resolved through the sitemap manager, routing stays authoritative in C#.

The IDataIsland C# interface, together with the DataIslandExtensions.EmitDataIslands extension, lets a control emit the state island and the service islands beside its existing marker class, optional template identifier, actions and binds. A control opts in by implementing IDataIsland, namely its State and DataService properties, and calling EmitDataIslands during render, so it gains the new capabilities without losing its current surface or changing its base class, which keeps WebExpress.WebUI untouched. The IControlView abstraction and an optional server-rendered template element let a view be authored in C# with the existing HtmlElement builders and reused on the client through the Templates registry. Stable identifiers derived from the control id let actions and binds target a specific store or service, so the markup contract is generated by C# rather than written by hand.

## 4. Lifecycle Concept

The lifecycle definition below explains when components, stores and services are created and destroyed, because a reactive model is only safe when teardown is deterministic. The lifecycle extends the existing controller behavior rather than replacing it.

The controller continues to own instantiation through the MutationObserver. When an element that matches a registered selector enters the document, the controller constructs the component, which creates or resolves its store, resolves its services and performs the first render. After the first render the component runs onMount, which is the place to subscribe to shared stores, to start timers and to trigger an initial service load when the server did not seed the data. After every later render the component runs onUpdate, which is the place to reconcile imperative concerns that the renderer does not own.

Teardown is made deterministic by a small addition to the controller. The MutationObserver already reports removed nodes, and the controller calls destroy on the component of a removed element and then drops it from the instance map. The component destroy runs onUnmount, unsubscribes from stores, aborts in-flight service requests and releases shared stores through the reference-counted registries. Shared stores and shared services outlive any single component and are disposed only when their last consumer unmounts. This model prevents the leaks that ad hoc event listeners can cause today and gives every subscription a clear owner.

## 5. Data Flow

The following data-flow description presents the single direction in which data moves and renders it as a diagram, so that the loop is unambiguous. The diagram reads from the C# render at the top to the re-render at the bottom, and the loop closes when a user interaction produces a new intent.

```
┌─────────────────────────────────────────────────────────────┐
│ C# render                                                   │
│ Control emits host element, wx-state and wx-service islands │
└───────────────┬─────────────────────────────────────────────┘
                │ controller instantiates Data
                │
        ┌───────▼────────┐  seeds  ┌────────────────────┐
        │      Store     ◀─────────│ initial state (C#) │
        └───────┬────────┘         └────────────────────┘
                │ subscribe and notify
                │ 
        ┌───────▼────────┐
        │      View      │  renders DOM from state, no I/O
        └───────┬────────┘
                │ user interaction (click, input)
                │
        ┌───────▼────────┐
        │ Action or Bind │  produces an Intent
        └───────┬────────┘
                │
        ┌───────▼────────┐   calls   ┌────────────────┐
        │     Intent     │───────────▶    Service     │  network I/O
        └───────┬────────┘           └───────┬────────┘
                │ reduce result              │ normalized result
                │                            │
        ┌───────▼────────┐                   │
        │     Store      ◀───────────────────┘
        └───────┬────────┘   setState(patch)
                │ notify
                ▼
         View re-render
```

The introduction to the reading of this diagram is that the only writers of the store are intents, and the only reader that produces DOM is the view. Actions and binds never touch the DOM of a component directly and never call a service directly. They translate a user gesture into an intent. This keeps the flow testable, because a test can dispatch an intent and assert the resulting state, and it can render a state and assert the resulting DOM, without involving the network.

## 6. Dynamic State Updates and Re-Rendering

The rules below define how state changes and how the view reacts, because predictable updates are the core promise of the architecture. The rules favor batching, purity and the preservation of nested controls.

A patch is a shallow merge into the current state. Deep changes flow through explicit reducers so that the shape of a transition stays visible and testable. Notifications are batched on a microtask, so that several patches in one synchronous turn produce a single render. The render method is a pure function of state with no side effects and no network access, and it returns a virtual node tree. The keyed reconciler applies the minimal DOM mutations. Nodes that host nested controls carry a stable key and a keep flag, so that an input control such as the tag editor keeps its instance, its focus and its caret across a parent re-render.

Selection and memoization keep renders cheap. A subscriber selects the slice of state it depends on, and the store compares the selected slice with shallow equality before it notifies, so an unrelated change does not trigger a render. Derived values are computed in pure selector functions rather than stored, which avoids stale duplicates. Concurrency is handled in the service through an abort controller, where a new query aborts the request that is in flight, and in the store through a request token and a loading flag that let the component ignore a stale response. For components that use imperative DOM updates, a patch calls the update method, which reads the state and patches the DOM imperatively while still following the same state contract.

## 7. Bindings and Actions in the State Concept

The following explanation shows how the existing declarative bindings and imperative actions are folded into the unidirectional loop, because preserving this surface is what keeps applications authored in C#. The markup contract stays the same, and only the implementation behind it changes.

Bindings become state-oriented. The current binds, which are search, paging, filter, show, hide, disable and darkmode, keep their markup. Their default implementations are reframed so that a source event dispatches an intent that updates a store, rather than calling a method on the bound control directly. Two additional binds complete the picture. A state bind subscribes an element or a control to a store path and reflects it as text, as a value, as visibility or as a class, which is the read direction of a controlled component. A model bind provides two-way binding for inputs, where an input event updates a store path and a store change updates the input, which is the controlled input pattern expressed declaratively.

Actions become intent dispatchers. The Actions registry stays, and the imperative actions such as modal, rame, split and ullscreen remain available because they are genuine commands. A new dispatch action sends a named intent with a payload to the store of a target control. An action may both run an imperative command and dispatch an intent, which lets command-oriented behavior coexist with the unidirectional state flow. Intents are registered with an optional reducer and an optional effect, so that a gesture either changes state directly or triggers a service and then changes state with the result. The net effect is that data-wx-bind and data-wx-primary-action remain the public surface authored in C#, while underneath both feed the same loop.

## 8. C# Side Control of State and Services

The C# control model described here shows how an author controls the entire client behavior from C#, because the central constraint of the concept is that applications stay in C#. The author declares state, services, bindings and actions on typed controls, and the framework generates the markup contract.

State initialization is declared with a builder on the control. The author sets keys and values, and the values come from the same lambdas that controls already use, so an initial page index, a page size and an initial set of items are expressed in C# and rendered into the wx-state island element. Server-side initial data can be embedded in this island so that the first paint needs no round trip, which generalizes the existing seed that the tag control already uses through its data-value attribute. When the author omits the data, the component performs a client load on mount.

Service definition is declared with a descriptor on the control. The author names a service, resolves its endpoint through the sitemap manager so that routing stays in C#, sets the method, maps the logical parameters to the wire parameter names and maps the response shape into state. The descriptor is rendered into a wx-service island element, and the JavaScript RestService consumes it without any hard-coded knowledge of endpoints or parameter names. Targeting is also declared in C#. Actions and binds reference services and stores by stable identifiers that the control derives from its id, and the control exposes typed methods that generate the corresponding data attributes, so the markup is never hand-written. The result is that an author reads and writes only C#, while the client gains a fully configured store and service set.

## 9. Service Concept in Control Families

The following service view describes how the concept manifests in the established control families of WebExpress.WebApp. It exists to make the architecture concrete across lists, tables, forms, wizard flows, tabs and other controls that already rely on remote data.

Controls that load or persist data do not access etch directly from the view or from event handlers. Instead, each control family works with one or more named services that represent its domain responsibilities. A list or table typically uses a data service with query semantics. A form uses a load service and a submit service. A wizard uses step-oriented services for validation, persistence and server-driven progression. A tab control uses services for load, create, reorder and remove. The names and operations follow the role of the control rather than the structure of an endpoint URL.

The default RestService realizes the common REST interaction model of WebExpress.WebApp. It supports query parameters such as search, structured query, filter, page, length and order, uses an abort controller for concurrency control and normalizes the JSON response into a stable result object. This gives all controls a shared behavioral contract for loading, cancellation, success and failure.

Service descriptors remain the source of truth for endpoint knowledge. The descriptor carries the route resolved through the sitemap, the HTTP method, the parameter mapping, the response mapping and the policies for headers, retry and cancellation. The JavaScript layer consumes that descriptor and performs the call, but it does not define routes or parameter conventions on its own. This keeps transport concerns declarative and keeps routing authoritative in C#.

## 10. Error Handling

The error model defined here is single and predictable, because consistent failures are part of a good user interface and part of a testable system. Errors are normalized in the service, surfaced through state and presented by the view.

Every service operation normalizes a failure into a result that reports the kind of error, the status, a message and whether the error is retriable. The kinds are 
etwork, http, parse, bort and alidation, and an abort is never surfaced to the user because it is an expected consequence of a newer request replacing an older one. The store carries a loading flag and an error value, and the view renders an error affordance from that state, which reuses the existing alert and the validation summary that the modal form already presents. Intents decide retry and user messaging, so the policy lives in one place rather than being scattered across handlers.

A global error channel reports uncaught service errors through an event and an optional toast that reuses the existing popup notification component, so that an unexpected failure is visible without crashing a component. The C# service descriptor can declare a mapping from status codes to message keys, so that the messages stay server-authored and localizable through the existing internationalization layer. The outcome is that a failure has exactly one path, from the service to the store to the view, and that path is the same for every component.

## 11. Reusability and Naming Conventions

The naming and module conventions below fix the vocabulary and shapes, because a uniform terminology is what makes the architecture extensible and approachable. The conventions extend the patterns that already exist rather than inventing new ones.

A component module stays cohesive, and the three internal roles of state, view and service are explicit objects inside that module rather than three separate files, while genuinely shared services and shared stores live in their own modules. Class names that end in Ctrl remain for compatibility, and a new component uses the Data base internally while it registers the same selector, so the markup is unchanged. Stores are named by the control id, services are named by their role such as data, orm or 	ab, and intents use a domain and verb name such as list search or 	ab add. The island element names keep the wx prefix, so the structured surface is the wx-state and wx-service elements, and the attribute surface is data-wx-template, data-wx-model, data-wx-bind and the existing action attributes.

The registries for stores, services, intents, templates, actions and binds all follow the same egister, get and unregister shape that the Actions and Binds registries already expose, so a plugin author learns one pattern and applies it everywhere. Reuse is encouraged through shared services for endpoints that several components consume, through shared stores for state that several components observe, and through registered templates for views that repeat across controls. The naming table in the appendix records the full vocabulary so that reviews can check a change against a single reference.

## 12. Build Pipeline

The build pipeline described here explains how the modules reach the page, because the load order is significant in a world without a mandatory bundler. The pipeline reuses the embedded resource and Asset attribute mechanism that the framework already relies on.

The JavaScript modules are embedded resources, and they are registered through Asset attributes on the include classes, with a strict order. The core engine, which is the store, the service, the renderer, the intents registry and the Data base, is included immediately after webexpress.webapp.js. The default registries follow, which are the existing action, bind and template defaults together with the new intent and service defaults. The controls follow last, so that every control can rely on the engine and the registries being present. The WebApp include mirrors this order for the application-specific modules.

The architecture does not require a bundler. Each module may stay a separate include. Where deployment scenarios benefit from concatenation or minification, that optimization can be added without changing the architectural contract, because the source of truth for ordering remains the Asset declarations. A formatting and linting gate for the JavaScript core and a small unit harness are recommended so that the engine is protected by automated checks.

## 13. Example Modules

The following examples ground the concept in four concrete modules, because a pattern is only convincing when it is shown on real controls. The four modules are a list, a form, a wizard and the REST tab control, and each is presented through its state shape, its services and its intents, with a short C# authoring sketch and the resulting client behavior. The code is illustrative and favors clarity over completeness.

### 13.1 List

The introduction to this example is that the list exercises search, filter, paging and selection in one place. The state shape holds the search term, the structured query, the filter, the page, the page size, the items, the total, a loading flag and an error value. A data service of the RestService kind performs the query. The search, paging and filter binds dispatch the intents named list search, list page and list filter, each of which sets the relevant state and triggers a load.

```csharp
// C# authoring sketch
new ControlDataList("orders")
    .State(s => s
        .Set("page", 0)
        .Set("pageSize", 50))
    .Service("data", svc => svc
        .Endpoint<OrderRestApi>(pageContext)
        .Method(HttpMethod.Get)
        .Query(q => q
            .Map("search", "q")
            .Map("page", "p")
            .Map("pageSize", "l"))
        .Response(r => r
            .Items("items")
            .Total("total")));
```

The client behavior is that the component seeds its store from the state island, renders placeholders, and loads through the data service on mount. A keystroke in a bound search box dispatches list search, which resets the page to zero and triggers a load through the same service. The data arrived event is still dispatched, so any existing listener continues to work.

### 13.2 Form

The introduction to this example is that a form needs a model, validation errors and a submitting flag, which maps cleanly onto state. A form service loads the initial model and submits it. Inputs use the model bind for two-way binding, and a submit action dispatches a orm submit intent whose effect calls the service and reduces validation errors into state.

The state shape holds the model object, a map of field errors, a submitting flag and a general error value. The submit intent sets submitting to 	rue, calls the service, and on a validation failure reduces the field errors into state so that the view renders them next to the inputs, which reuses the presentation that the modal form already provides. On success the intent clears the errors and dispatches a follow-up intent that closes the host modal when the form lives inside one. The author declares the endpoints and the field mapping in C#, so the client form carries no endpoint knowledge.

### 13.3 Wizard Steps

The introduction to this example is that a wizard is a small state machine, which the store expresses naturally and which becomes resumable once the state is explicit. The state shape holds the current step index, a per-step model, a map of completed flags and a loading flag. Navigation actions named 
ext, previous and go to are intents with guard reducers that refuse to advance past an invalid step. A wizard service persists the data of a step and loads the next step when the steps are server-driven.

The view renders only the active step from state, which keeps the DOM small and the transitions predictable. Because the progress lives in state, a wizard can be serialized and restored, which enables a resume feature without any change to the view. The author declares the steps, the validation and the persistence endpoints in C#, and the client engine runs the machine.

### 13.4 REST Tab Control

The introduction to this example is that the tab control demonstrates optimistic updates and rollback, which are where a reactive store pays off most clearly. The state shape holds the tabs, the active tab id, the available templates and a loading flag. A tab service loads the tabs, creates a tab with a create operation, reorders tabs with an update operation and closes a tab with a remove operation. Add and close are intents, and a drag reorder updates the state optimistically, then calls the service, and rolls back to the previous order when the service reports an error.

The client behavior is that a reorder feels immediate because the view renders the new order from the optimistic state before the network confirms it, and a failure restores the previous order from the state snapshot that the intent kept. The 	ab added and 	ab closed events are still dispatched, so existing integrations continue to work. The author declares the tab endpoints and the templates in C#, and the optimistic policy lives in the intent rather than in the view.

## 14. Architectural Qualities, Constraints and Verification

The following quality and verification view records the architectural qualities that the concept must satisfy, the design constraints that shape it and the ways in which conformity can be verified. It exists so that the concept can be judged as an architecture rather than as a sequence of implementation steps.

The main architectural qualities are predictability, composability, compatibility and performance. Predictability comes from the single unidirectional loop and from the rule that only intents write to state. Composability comes from explicit stores, explicit services and uniform registries. Compatibility comes from retaining the existing C# authoring surface, the current selector registration model and the existing action and bind attributes. Performance comes from batched notifications, selection with shallow equality, keyed reconciliation and request cancellation.

The main design constraints are the preservation of nested controls and focus across a re-render, the behavior of large lists, deterministic initialization through the MutationObserver, stable ordering between binds, actions and store notifications, and an additive data attribute contract. These constraints are not project risks but structural requirements of the architecture. The design addresses them through keep flags for nested controls, keyed reconciliation, instance-map based idempotent instantiation, a single state loop and generated markup contracts from C#.

Verification follows four layers. C# unit tests assert that the rendered control emits the correct state and service islands, in the same style as the existing control render tests. JavaScript unit tests cover the store, the service, the renderer and the intents through a small headless harness. Integration tests assert that network calls and DOM outcomes follow the declared state and service contracts. Manual and visual verification runs on the tutorial pages, which already demonstrate the controls. The architecture is conformant when controls with state and services author those concerns in C#, route side effects through services, route state changes through intents and preserve the documented data attribute and registry contracts.

## 15. Architectural Summary

The following summary condenses the concept into a short operational reference for implementation and review.

A WebExpress component is a state-driven client artifact generated from C#. Its state is seeded through the wx-state island element, its services are declared through wx-service island elements, its interactions enter through binds and actions, its mutations happen through intents, and its DOM is produced by the view from the current state. The service is the only place for network access, the reducer is the only place for pure state transitions and the view is the only place that produces component DOM. Shared registries provide discovery and reuse, lifecycle hooks provide deterministic setup and teardown, and the public authoring surface remains the typed C# control model.

## 16. Appendix

The appendix below collects the reference tables that support reviews, because a single place for the vocabulary and the contract reduces ambiguity. The tables are intended to be extended as the architecture evolves.

### 16.1 Island and data attribute contract

The introduction to this table is that it lists the island elements and the data attributes that the C# layer emits and the JavaScript engine consumes. The island elements are hidden first children of the host and are consumed on the first read.

|Surface                |Producer         |Consumer         |Purpose
|-----------------------|-----------------|-----------------|-----------------------------------------------------------
|wx-state element       |IDataIsland      |ViewState        |Seeds the initial scope state through typed wx-prop children.
|wx-service element     |IDataIsland      |ServiceRegistry  |Declares a named service descriptor, with the mappings as wx-query, wx-response, wx-header and wx-error children and the served domains as the domains attribute.
|wx-resource element    |IViewState       |ViewState        |Declares a named central resource, with the bidirectional parameter bindings as wx-param children (name, state, dir).
|data-wx-scope          |ControlViewState |ViewState        |Identifies a scope host, so a control resolves its scope by id or by ancestry.
|data-wx-template       |IDataIsland      |Templates        |References a registered or server rendered view template.
|data-wx-model          |Control authors  |model bind       |Two way binding between an input and a store path.
|data-wx-bind           |Control authors  |Binds            |Existing declarative bindings, now state oriented.
|data-wx-primary-action |Control authors  |Actions, Intents |Existing primary action, may dispatch an intent.

### 16.2 Registry shapes

The introduction to this table is that every registry shares the same shape, so that one mental model covers all of them. The shape is a egister method, a get method and an unregister method, with a stable key.

|Registry  |Key          |Value
|----------|-------------|-----------------------------------------------------------
|Actions   |action name  |An object with an execute and an optional init.
|Binds     |bind name    |An object with a ind hook.
|Intents   |intent name  |An object with an optional reducer and an optional effect.
|Services  |service name |A configured service instance from a descriptor.
|ViewState |scope id     |The observable state container of a scope, resolved by id or by ancestry.
|Templates |template id  |A render function that returns a DOM node or a node tree.

### 16.3 Naming vocabulary

The introduction to this table is that it fixes the names used across the codebase, so that reviews can check a change against a single reference. The vocabulary extends the existing conventions.

|Concept        |Convention                  |Example
|---------------|----------------------------|------------------------------
|Control class  |name ends in Ctrl           |webexpress.webapp.ListCtrl
|Data base      |the base class Data         |webexpress.webapp.Data
|Scope host     |the ViewState container     |webexpress.webapp.ViewState
|Scope id       |the data-wx-scope id        |orders, scope
|Service role   |a short noun                |data, form, tab
|Resource name  |a short noun                |orders, summary
|Resource target|the reduced state slice     |state.orders = { items, total, loading, error }
|Param direction|the binding direction       |out, in, inout
|Scope intent   |the central re-query        |view/query, view/reload
|Intent name    |domain and verb             |list search, tab add
|Data island    |wx element prefix           |wx-state, wx-service, wx-resource
|Domain name    |lower case full type name   |myapp.model.order
|Change message |the outbound data change    |webexpress.webapp.data.changed
|Subscribe message|the inbound subscription  |webexpress.webapp.data.subscribe
|Change flash   |the wx-data-changed class   |played on re-queried controls
