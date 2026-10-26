# WebExpress Glossary

This glossary explains the key terms of the WebExpress framework in plain language, so that a reader who is new to WebExpress can follow along. Each entry describes the idea in everyday words first and gives the precise class or attribute name afterwards. The entries are arranged alphabetically, and each one is tagged with the part of the framework it belongs to. A term is used only with the meaning described here, and when several parts of the framework legitimately use the same word, the entry says how they are told apart.

## A

**Action** *(WebApp)*: An action is the framework's name for something that should happen when a user does something, such as clicking a button. WebExpress keeps a central list of these named actions, and a page element opts into one by carrying the `data-wx-primary-action` marker. An action can run a visible command such as opening a dialog, and it can also send an intent that updates the page's data.

**Application** *(WebCore)*: A single WebExpress server can run several independent websites at the same time. An application is one such website, with its own web address prefix, its own map of pages and its own settings. Plugins add their pages and building blocks into the applications they belong to.

**Asset** *(WebCore)*: An asset is a supporting file that a plugin ships inside itself, such as a script, a stylesheet or an image. The asset manager delivers these files to the browser, and they are attached to a page through includes.

**Attribute registration** *(WebCore)*: WebExpress lets a class announce what it is and where it belongs by tagging it with attributes such as `[Section<T>]`, `[Scope<T>]`, `[Cache]` or `[Domain<T>]`. The framework then discovers it automatically. The idea is that behaviour is declared right on the class rather than being wired together by hand somewhere else.

## B

**Bind** *(WebApp)*: A bind is a small connection between an element on the page and a piece of the page's data, written into the markup rather than into code. A one way bind shows a data value on screen, while the two way variant `data-wx-model` also sends changes back when the user types into an input.

## C

**Change flash** *(WebApp)*: When data on a page updates because someone else changed it in the background, the affected control briefly plays a small highlight animation (the `wx-data-changed` style) so the user notices that the content changed on its own. The animation is skipped for users who prefer reduced motion.

**Cluster** *(WebCore)*: A cluster is a group of server instances serving the same deployment. The `Cluster` settings identify a shared state directory, peer instances and a shared secret so that sessions and other shared state can be coordinated across instances.

**Collaboration** *(WebApp)*: Collaboration lets several users edit the same document while receiving each other's changes. `ControlCollaborative` connects participating editors to the server's document manager, which validates changes, assigns versions and distributes accepted operations.

**Component** *(WebCore)*: A component is a core building block of the framework, one of the managers such as the sitemap manager or the fragment manager. They are all registered at the central component hub, which is the single place every part of the framework can reach to find them. Note that pieces running in the browser are never called components; the browser side base class is called Data instead.

**Condition** *(WebCore)*: A condition is a yes or no test attached to a page or a contribution that decides, for each request, whether it should appear. Conditions answer the question of whether something shows up, while scopes answer the question of where.

**Configuration** *(WebCore)*: Configuration supplies the server and plugins with settings at startup. The settings folder contains JSON files, including `webexpress.settings.json`, and variables prefixed with `WEBEXPRESS_` can override values from those files.

**Context** *(WebCore, WebUI)*: A context is a bundle of information about the current request that the framework passes along while building a page, for example which page is being rendered and who is asking. Because there are several kinds, the word is always paired with its type, such as `PageContext`, `IRenderControlContext` or `IFragmentContext`.

**ContextPath** *(WebCore)*: A context path is the URL path prefix under which the server hosts its applications. The `ContextPath` setting supports deployments below a path such as `/portal` rather than directly at the site root.

**Control** *(WebUI)*: A control is a reusable piece of user interface built on the server, such as a button or a table, that knows how to turn itself into HTML. WebUI controls are static on purpose: they draw themselves but contain no machinery for loading data.

**ControlData\* family** *(WebApp)*: This is the family of WebApp controls that show live data, including lists, tables, tiles, kanban boards, dashboards, tabs, comments, tags, watchers and more. Each one can stand alone and load its own data, or it can be attached to a shared ViewState and simply display a slice of it. They are set up in a readable, type safe way, for example with `.State(...)`, `.DataService<TEndpoint>()` and `.Resource<TResource>()`.

**Controller** *(WebUI, JavaScript)*: The controller is the piece of browser code that brings controls to life. It watches the page for new elements, creates the matching browser side control for each one exactly once, and cleans it up again when the element is removed from the page.

**Ctrl** *(WebUI, JavaScript)*: `Ctrl` is the base class that every browser side control is built on. The controller creates the right `Ctrl` for an element based on a marker class in the element's markup.

**Culture** *(WebCore)*: A culture identifies a language and regional conventions, such as `en-US` or `de-DE`. The `Culture` setting supplies the server's default language and formatting conventions.

## D

**Data** *(WebApp, JavaScript)*: `Data` is the base class for browser side controls that hold their own state and load their own data. It gives a control a private store, wires up the services it needs, and runs the control through its lifecycle as it appears, updates and disappears.

**Data changed message** *(WebApp)*: This is the small notice the server pushes to the browser when the underlying data of an area changes. Every client that is interested reloads just the affected queries. The notice carries only the area, the kind of change and which item changed, never the data itself.

**Data island** *(WebApp)*: A data island is a hidden element (`wx-state`, `wx-service` or `wx-resource`) that the server places at the start of a control, carrying the control's starting data and its connection details. The browser reads it once and removes it. Islands exist so that the browser code never needs any web addresses or starting values baked into it.

**Data resource** *(WebApp)*: A data resource is a named query that a ViewState loads once and shares with the controls that need it. It records which service fetches it, where its result is stored, and how the query's inputs and outputs map to the shared data. Several controls can display the same resource and all refresh together when it is reloaded.

**Data subscription** *(WebApp)*: This is the message a ViewState sends to register its interest in one or more data areas, so the server will notify it of future changes. It is sent again automatically after every reconnect, because the server tracks these interests per connection.

**Disjunctive normal form (DNF)** *(WebUI, WebApp)*: Disjunctive normal form describes a filter as groups joined with OR, with the conditions inside each group joined with AND. `InputDnfCtrl` edits these expressions, `DnfCtrl` displays them and `DnfValue` handles their notation.

**Document model** *(WebUI)*: A document model is the structured content that an editor changes and renders into the browser. In the rich text editor, `EditorModel` defines document nodes, attributes and formatting; collaborative operations apply to this model rather than treating the rendered DOM as the stored document.

**Domain** *(WebCore, WebApp)*: A domain is a named area of data, such as all orders, identified by an `IDomain` type. It is the label the live update channel uses to route change notifications. A service that declares no domain simply stays disconnected from that channel. It is not a web domain name.

## E

**Endpoint** *(WebCore)*: An endpoint is anything that has its own web address: a page, a REST interface or a downloadable resource. Endpoints are what the sitemap turns into addresses, which keeps all the routing decisions in C# code rather than scattered as hard coded links.

**Event** *(WebCore)*: An event is a server side signal that one plugin can raise and others can listen for, so parts of the system can react to each other without being directly wired together. Signals that happen in the browser are called DOM events instead.

**Event constants** *(WebUI, JavaScript)*: These are the shared, agreed names for the signals that browser controls send to each other, collected in `webexpress.webui.Event` (with additions in `webexpress.webapp`). Using shared names keeps controls able to talk to one another.

**ExternalUri** *(WebCore)*: The external URI is the public server address used by clients, which can differ from the address on which the server listens. The `ExternalUri` setting exposes that address through `IHttpServerContext.ExternalUri`, for example when a reverse proxy forwards requests to an internal listener.

## F

**Fragment** *(WebCore)*: A fragment is a piece of user interface that a plugin contributes into a slot on someone else's page. Where it ends up is decided by which section it targets and which scopes it is tagged for, so it appears only on pages that match.

**Fragment control** *(WebUI)*: A fragment control is a normal control wrapped up as a fragment, so that a plugin can drop it into a page section just by tagging it.

**Full text search** *(WebIndex)*: Full text search finds indexed items by the words in their text fields. Documents and search text are analyzed into comparable terms before the index looks up matching items.

**Fuzzy search** *(WebIndex)*: Fuzzy search matches terms that are similar to the requested text rather than requiring an exact spelling. It is useful when a query contains a typing error or a small spelling variation.

## G

**Graceful shutdown** *(WebCore)*: Graceful shutdown allows admitted requests and background operations to finish before the server releases its resources. The `Shutdown` setting enables this behavior, and `ShutdownTimeoutSeconds` limits the time available for draining work.

## H

**Health check** *(WebCore)*: A health check reports whether the server and its critical dependencies are ready to serve requests. WebCore exposes `/health`, and applications contribute dependency checks through `IHealth` components discovered by the `HealthManager`.

**Html builders** *(WebCore)*: These are the safe, type checked classes used to build markup, such as the ones in `WebHtml`. Building HTML by gluing strings together is forbidden, because the builders take care of escaping content and so prevent broken or unsafe markup.

## I

**I18N** *(WebUI, JavaScript)*: `I18N` is the browser side helper that provides translated text. It detects the browser's language and looks up wording by a key that is prefixed with the plugin it belongs to.

**IconSet** *(WebUI, JavaScript)*: The icon set resolves a symbolic icon name to the CSS classes used to display a built-in SVG drawing. Browser controls use `webexpress.webui.IconSet.resolve(...)`, while C# icon classes expose the corresponding symbolic name. The drawing, CSS mask rule and C# class share that name.

**Identity** *(WebCore, WebApp)*: Identity is the framework's model of the signed in user. WebCore defines the basic model, and WebApp extends it with the identity provider and the login flow.

**Include** *(WebCore)*: An include is the instruction that attaches an asset, such as a script or stylesheet, to a page in a specific order. The order in which the WebApp browser engine loads is defined through includes.

**Index** *(WebIndex)*: An index is a search structure over a set of typed items that answers both free text searches and structured queries quickly. The index manager handles registering items, keeping them up to date and running searches.

**Index item** *(WebIndex)*: An index item is an object that has been registered for searching. Its properties become the searchable fields, and if the item type also counts as a data domain, changes to it feed the live update channel.

**Index-Explorer** *(WebIndex)*: Index-Explorer is the desktop interface for inspecting stored indexes, running WQL queries and examining documents, schema fields and reverse terms. The `WebExpress.WebIndex.WiUI` application also provides project links, result filtering and export.

**Intent** *(WebApp)*: An intent is a named request to change a ViewState's data. It has a pure part that works out the new data and an optional part that talks to a service first. The two built in intents that reload shared data are `viewstate/query` and `viewstate/reload`, and intent names follow a domain and verb pattern such as `list/search`.

**Internationalization (i18n)** *(WebCore)*: Internationalization is the system for offering the interface in different languages. Every piece of wording is looked up by a key that is prefixed with its plugin, and the same keys work on the server and in the browser.

## J

**Job** *(WebCore)*: A job is an operation that runs again and again on a schedule set by a cron expression, such as a nightly report. It differs from a task, which runs only once.

## L

**Layout view** *(WebUI)*: A layout view is one of the switchable arrangements offered by the `ViewCtrl` multi view control, for example a toolbar layout or a compact toggle bar. It is always called a layout view, never just a view, so that it is not confused with the drawing step of the data loop.

**Listener endpoint** *(WebCore)*: A listener endpoint is a configured address on which the HTTP server accepts connections. Entries in `Endpoints` configure these bindings; they are distinct from application endpoints such as pages and REST interfaces.

**Log** *(WebCore)*: The log is the framework's channel for status and diagnostic messages, written by the managers as the server starts up and runs.

## M

**Markdown** *(WebUI)*: This is WebUI's built in reader and model for Markdown text, used by the controls that display Markdown formatted content.

**Memory and storage index** *(WebIndex)*: These are the two ways an index can be kept: a fast one that lives only in memory, and a durable one that is saved to disk. Both answer searches in the same way.

**Message queue** *(WebApp)*: The message queue is WebApp's live channel from the server to the browser, running over a WebSocket. It carries data change notices, popup notifications, progress updates and collaboration messages, delivered either to a single session or to everyone interested in a data area.

**Metrics** *(WebCore)*: Metrics are numeric measurements of server activity and application behavior, such as request counts and execution times. WebCore can expose them at `/metrics` for Prometheus, while applications contribute measurements through instruments such as `MetricCounter`, `MetricGauge` and `MetricHistogram`, or through `IMetric` components.

**Modal** *(WebUI)*: A modal is a dialog that opens on top of the page. WebUI provides a family of them, including one that hosts a form, and a form shown in a modal keeps its hidden data islands attached so that it still works.

## N

**Normalization** *(WebIndex)*: Normalization converts text into a consistent representation so that equivalent forms can match during a search. It is part of term analysis and is applied when preparing text for indexing and querying.

**Notification** *(WebUI)*: This is WebUI's model for notifications, which WebApp's popup toasts are built on top of.

## O

**Operational transformation (OT)** *(WebUI, WebApp)*: Operational transformation adjusts concurrent document operations so that edits can be applied consistently after other edits have changed their positions or content. The browser uses `webexpress.webui.Ot` for transformation, while the collaboration server validates and sequences accepted operations.

## P

**Package** *(WebCore)*: A package is the deliverable bundle that carries a plugin so that it can be installed into a server. WebApp's settings pages include a surface for managing these packages.

**Page** *(WebCore)*: A page is an endpoint that produces a whole HTML document, drawn through a visual tree. Pages state which scopes they belong to.

**Parameter** *(WebCore)*: A parameter is a named value that comes in with a request. Its `ParameterScope` says where it travelled from: the web address, a query value or the session.

**Phrase search** *(WebIndex)*: Phrase search matches terms in a specified order as a phrase. It uses term positions to distinguish a matching word sequence from documents that merely contain the same words elsewhere.

**Plugin** *(WebCore)*: A plugin is the unit that extends WebExpress. It is an assembly the framework loads, and it can contribute applications, pages, fragments, assets and translations.

**Policy** *(WebCore)*: A policy is an access rule attached to an endpoint that decides who is allowed to reach it, for example open to everyone, signed in users only, or system use only.

**Popup notification** *(WebApp)*: This is the channel for brief pop up messages (toasts) that the server pushes to a session over the message queue.

**Posting** *(WebIndex)*: A posting connects an indexed term to a document in which it occurs. Posting information lets the reverse index find matching documents and retain occurrence details needed for positional searches.

**Progress task** *(WebApp)*: This is the channel for showing the live progress of a long running operation, pushed to the browser over the message queue.

**Proximity search** *(WebIndex)*: Proximity search finds terms that occur near one another in indexed text. It uses their positions to constrain the distance between matches instead of requiring only that all terms occur somewhere in the document.

## R

**Request and response** *(WebCore)*: These are the framework's models for an incoming HTTP request, with its parameters, and the typed replies it can return, such as a not found response or a status message.

**Resource** *(WebCore)*: A resource is something the server delivers over a web address, such as a file, an image or a binary download. It should not be confused with a data resource, which is the shared query inside a ViewState in WebApp.

**REST API** *(WebCore, WebApp)*: A REST API is an endpoint that returns JSON data instead of a web page. WebApp adds ready made create, read, update and delete base classes on top.

**RestForm** *(WebApp)*: RestForm is the control family shaped like a form. It loads a record, lets the user edit it and submits it through its services, showing any validation errors right next to the fields.

**Reverse index** *(WebIndex)*: A reverse index, also called an inverted index, maps each searchable term to the documents containing it. This structure supports fast lookup without scanning every document for each query.

## S

**Schema** *(WebIndex, WebUI)*: A schema describes the permitted structure of data. An index schema describes indexed fields, while an editor schema defines the allowed document nodes, children and attributes; the owning subsystem determines which meaning applies.

**Scope** *(WebCore)*: A scope is a named area of the application, written as a marker interface based on `IScope`. Pages say which scopes they are, and fragments, settings pages and includes are tagged with `[Scope<TScope>]` so that they appear only on pages in a matching area. The word scope always means this placement idea; the area of a page that holds shared data is a ViewState, not a scope. The ready made WebApp scopes are `IScopeGeneral`, `IScopeAdmin`, `IScopeLogin`, `IScopeSetting` and `IScopeStatusPage`.

**Section** *(WebCore)*: A section is a named slot on a page that fragments can be placed into with `[Section<T>]`. WebUI and WebApp define the concrete slots of their own page layouts, such as the primary app navigation.

**Sequencer** *(WebApp)*: A sequencer establishes the authoritative order of collaborative changes. The `CollaborativeDocumentManager` assigns versions to accepted operations so that participating clients can follow the same document history.

**Service** *(WebApp)*: A service is the piece that talks to the network on a control's behalf. It is described declaratively (its address, its operations, how inputs and outputs map, and its retry and error handling) and set up from a `wx-service` island by the service registry. A control uses a service directly to save changes or look something up, while shared data it displays comes through a data resource instead. When the service address is keyed by a route parameter, such as the class a table of fields belongs to, the server fills that part in from the current request before it writes the island, so the browser always receives a complete address; an author can also supply that part by hand when the request does not carry it.

**Session** *(WebCore)*: A session is the per visitor memory that a connection is tied to. Session parameters and the visitor's live message subscriptions are kept here.

**Setting page** *(WebApp)*: A setting page is a page in the settings area, tagged for scopes such as the settings or admin area and grouped by section.

**Sitemap** *(WebCore)*: The sitemap is the routing table that turns a page or endpoint into a web address and back. Code never writes addresses by hand; it asks the sitemap for them.

**Spreadsheet** *(WebUI)*: A spreadsheet is an editable workbook containing sheets and cells, with support for formulas, formatting and undo history. `SpreadsheetCtrl` provides the browser control and can exchange workbook data through forms and JSON endpoints.

**State** *(WebApp)*: State is the observable data that a ViewState (or a standalone control) holds. Updates are applied as shallow merges, several updates in one go are batched into a single notification, and a subscriber can watch just the slice it cares about. There is no separate store type; the ViewState itself is the store.

**Status page** *(WebCore)*: A status page is the page shown for an HTTP status code such as 404 or 500, registered per application.

**Stop word** *(WebIndex)*: A stop word is a frequent word excluded during text analysis because it contributes little to distinguishing search results. Stop word lists depend on the language used to analyze the index.

## T

**Task** *(WebCore)*: A task is a one off background operation whose state you can observe, such as a file import. It differs from a job, which repeats on a schedule.

**Template** *(WebApp)*: A template is a reusable way of drawing a view, registered so that it can be authored in C# or in the browser and reused across several controls. It is referenced through `data-wx-template`.

**Term** *(WebIndex)*: A term is a single searchable unit of the index. Text is broken up into terms, and searches match against those terms.

**Theme** *(WebCore)*: A theme is a visual appearance registered for an application. WebUI icons use CSS masks that inherit the surrounding text color, allowing them to follow the appearance of the active theme.

**Tokenization** *(WebIndex)*: Tokenization splits input text into units that can be analyzed for indexing or querying. Tokens are intermediate units; the analysis pipeline turns them into the terms used by the search index.

## U

**Uri** *(WebCore)*: This is the framework's model for a web address, produced by the sitemap and used by links, services and redirects.

## V

**View** *(WebApp)*: The view is the drawing step of the data loop. It turns the current data into what you see and never fetches anything or changes the data itself. The switchable layouts of the `ViewCtrl` control are called layout views to keep them apart from this meaning.

**ViewState** *(WebApp)*: A ViewState is the area of a page that acts as the single source of truth for the controls inside it. It owns the shared data, the services and the queries that keep that data fresh, so that the controls do not each fetch their own copy. It is set up in C# with `ControlViewState`, runs in the browser as `webexpress.webapp.ViewState`, and is found again through the `ViewStateRegistry`. The whole page counts as the outermost ViewState, and ViewStates can be nested. It has nothing to do with the ASP.NET Web Forms feature of the same name.

**ViewState binding** *(WebApp)*: This is the link that says a control should display a slice of a ViewState rather than loading its own data. It is declared in C# with `IViewStateBound` (and `IViewStateBoundUsers` when a people lookup service is also needed). In the browser an explicit ViewState id takes precedence; otherwise the control uses the nearest enclosing ViewState that declares the resource it is bound to, and as a fallback the ViewState the registry's resource index names for that resource. A control with no binding simply stands alone and loads itself.

**ViewState host** *(WebApp)*: The ViewState host is the element that `ControlViewState` renders. It carries the `wx-webapp-viewstate` class and the ViewState id, holds the starting data and connection islands, and defines how long the ViewState lives. When the host element goes away, the ViewState unsubscribes, cancels any pending requests and removes itself.

**ViewState id** *(WebApp)*: The ViewState id is the name of a ViewState, carried in the `data-wx-viewstate` attribute. On the host element it declares the ViewState, and on a bound control it names the ViewState the control wants to attach to. The two uses stay apart because only the host also carries the host class.

**VisualTree** *(WebCore)*: A visual tree is the skeleton of a page on the server, the typed structure that fragments and controls draw themselves into. WebUI and WebApp provide their own specialized trees.

**VisualTreeWebApp** *(WebApp)*: This is WebApp's page skeleton, with its named slots for things like navigation, content and preferences. It draws the ViewState fragments first, finding them by their type.

## W

**WebSocket** *(WebCore)*: A WebSocket is the always open connection the server keeps for pushing updates to the browser. WebApp's message queue runs over it.

**Wildcard search** *(WebIndex)*: Wildcard search matches terms against a pattern containing placeholders for unspecified characters. It allows a query to describe a family of spellings instead of listing each complete term separately.

**Wizard** *(WebApp)*: A wizard is the step by step variant of the form family. It keeps a model for each step, guards moving between steps, and saves progress step by step.

**WQL (WebExpress Query Language)** *(WebIndex)*: WQL is the query language for searching indexed items. A parser turns a WQL text into a plan that filters, sorts and groups the results. WQL text shows up in the browser, for example in search boxes, and is understood and run on the server.

**Writing surface** *(WebApp)*: A writing surface is a control that changes what a ViewState shows rather than only displaying it: a quickfilter, a search or WQL prompt, a form or a comment composer. Bound with `Resource<TResource>()` and `Model(...)`, it writes a value into the shared state and re-queries the resource, so every control that renders that resource re-renders. It is the write counterpart to a ViewState binding, and it is why the `BindSearch` and `BindFilter` control-to-control wires are needed only for a standalone surface. A writing surface keeps its own service islands, because it still loads its own data (filter definitions, suggestions) or submits through its own service.

---

**Last updated**: 2026-10-26
