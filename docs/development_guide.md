![WebExpress-Framework](https://raw.githubusercontent.com/webexpress-framework/.github/main/docs/assets/img/banner.png)

# WebExpress

**WebExpress** is a lightweight web server that has been optimized for use in low-performance environments. Even on small systems, such as the Raspberry PI, web applications can be operated efficiently. This is achieved through a small footprint with a low resource burden. Furthermore, **WebExpress** has a powerful and optimized plugin system, with a comprehensive API and application templates. This allows web applications to be easily and quickly integrated into a .Net language (e.g. C#).

# License

The software is freely available as open source (MIT). The software sources can be obtained from https://github.com/webexpress-framework/WebExpress. **WebExpress** is based on components that are available as open source:

- https://github.com/dotnet/core (MIT)
- https://getbootstrap.com/ (MIT)
- https://www.chartjs.org (MIT)
- https://fontawesome.com/ (CC BY 4.0 and MIT)
- https://popper.js.org/ (MIT)

```
The MIT License (MIT)

Copyright (c) 2025 René Schwarzer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is 
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

# Vision of a new web framework

The development of a web application without the need to use HTML, CSS, or JavaScript, but exclusively using C#, could revolutionize web development. A web framework programmed entirely in C# offers numerous advantages. Modularity allows for the independent development and testing of components, facilitating reusability and maintenance. Plugins can be added to extend functionality without altering the core of the framework. Using such a framework can significantly reduce development time. Prepared components allow developers to focus on business logic, leading to faster time-to-market and reduced costs. Development, debugging, and deployment processes can be fully carried out with C# tools like Visual Studio. This provides a unified development environment that enhances efficiency and simplifies troubleshooting. The need to deal with various technologies is eliminated, reducing complexity and improving maintainability. Frameworks like Angular, React, or Vue.js require knowledge of HTML, CSS, and JavaScript. These technologies are powerful but also complex and require a steep learning curve. A C#-based framework eliminates these hurdles, enabling quicker onboarding and higher productivity. A C#-based web framework offers numerous advantages. It simplifies web development, increases efficiency and productivity, and reduces complexity. With pre-built components and a unified development environment, high-quality web applications can be created faster and more cost-effectively. Such a framework could fundamentally change the way web applications are developed.

# Architecture

**WebExpress** is deliberately kept very simple. It consists only of basic functionalities for processing HTTP and HTTPS requests, an API and a plugin system for extending the functionalities. This means that **WebExpress** itself is not able to generate content. The plugin system is required for this. Plugins are .Net assemblies, which create content based on the **WebExpress** API. The plugins are loaded and executed by **WebExpress**. **WebExpress** controls the plugins and distributes the http(s) requests to the responsible plugin. The plugins answer the requests, create the content and transfer it to **WebExpress**. Finally, the content is delivered as an HTTP response via **WebExpress**. **WebExpress** uses `Kestrel` to process http(s) requests.

```
╔WebExpress════════════════════════════════════════════════════════════════════════════╗
║┌Plugin a---------------------------------------┐ ┌Plugin b--------------------------┐║
║¦                                               ¦ ¦                                  ¦║
║¦┌──────────────────┐┌──────────────────────────────────────────┐┌──────────────────┐¦║
║¦│ Application X    ││ Application y                            ││ Application z    │¦║
║¦│                  ││                                          ││                  │¦║
║¦│ ┌───────────┐    ││ ┌──────────┐  ┌─────────┐ ┌────────┐     ││ ┌───────────┐    │¦║
║¦│ │ Resources │    ││ │  Pages   │  │ RestAPI │ │ Assets │     ││ │ Resources │    │¦║
║¦│ └───────────┘    ││ └──────────┘  └─────────┘ └────────┘     ││ └───────────┘    │¦║
║¦│                  ││                                          ││                  │¦║
║¦│ ┌─────────┐      ││ ┌───────────┐ ┌───────────┐ ┌────────┐   ││ ┌───────────┐    │¦║
║¦│ │  Pages  │      ││ │ Fragments │ │ Resources │ │Identity│   ││ │ Fragments │    │¦║
║¦│ └─────────┘      ││ └───────────┘ └───────────┘ └────────┘   ││ └───────────┘    │¦║
║¦│                  ││                                          ││                  │¦║
║¦│ ┌────────┐       ││ ┌─────────────┐ ┌─────────┐ ┌────────┐   ││ ┌─────────────┐  │¦║
║¦│ │  Jobs  │       ││ │ StatusPages │ │ Events  │ │  Jobs  │   ││ │ StatusPages │  │¦║
║¦│ └────────┘       ││ └─────────────┘ └─────────┘ └────────┘   ││ └─────────────┘  │¦║
║¦│                  ││                                          ││                  │¦║
║¦└──────────────────┘└──────────────────────────────────────────┘└──────────────────┘¦║
║¦                                               ¦ ¦                                  ¦║
║¦┌──────────┐ ┌───────────────────┐             ¦ ¦ ┌────────┐                       ¦║
║¦│   I18N   │ │ ComponentManagers │             ¦ ¦ │  I18N  │                       ¦║
║¦└──────────┘ └───────────────────┘             ¦ ¦ └────────┘                       ¦║
║└-----------------------------------------------┘ └----------------------------------┘║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

**WebExpress** consists of several program libraries, which serve as the basis for **WebExpress** projects. The `WebExpress.WebCore.dll` program library provides basic functions for creating content and additional functions such as logging. The `WebExpress.UI.dll` and `WebExpress.WebApp.dll` packages provide controls and templates that facilitate the development of (business) applications. `WebExpress.WebIndex.dll` provides full-text indexing. The `WebExpress.exe` program library represents the application that takes control of the individual functions and components. The `WebExpress.exe` program library is generic and can be replaced by its own program library.

```
╔WebExpress.exe════════════════════════════════════════════════════════════════════════╗
║                                                                                      ║
║                                                 ┌──────────────┐                     ║
║                                                 │ WebIndex.dll │                     ║
║                                                 └───────▲──────┘                     ║
║                                                         │                            ║
║               ┌──────────────────────────────────────┐  │                            ║
║               │                                      │  └───┐                        ║
║         ┌─────▼───────┐       ┌───────────┐       ┌──┴──────┴──┐                     ║
║         │ WebCore.dll ◄───────┤ WebUI.dll ◄───────┤ WebApp.dll │                     ║
║         └─────────────┘       └───────────┘       └────────────┘                     ║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

In the context of **WebExpress**, (web) applications are deployed. An application is the logical combination of Components. Components, in turn, are amalgamations of (web) elements. Elements reflect content (e.g. web pages). The relationships between **WebExpress**, packages, applications, and elements are illustrated in the following figure: 

```
╔WebExpress════════════════════════════════════════════════════════════════════════════╗
║                                                                                      ║
║                      ┌WebPackage----------------------------------------------------┐║
║                      ¦                                                              ¦║
║ ┌────────────────┐ 1 ¦                       * ┌──────────┐  ┌────────────────────┐ ¦║
║ │ WebExpress.exe ├─────────────────────────────►  Plugin  │  │ external libraries │ ¦║
║ └────────────────┘   ¦                         └──▲────▲──┘  └────────────────────┘ ¦║
║                      ¦                          1 │  * │                            ¦║
║                      ¦           1 ┌──────────────┘    └──────┐ 1                   ¦║
║                      ¦        ┌────┴─────┐            * ┌─────┴─────┐*  1┌────────┐ ¦║
║                      ¦        │   I18N   │     ┌────────►Application◄────┤Identity│ ¦║
║                      ¦        └──────────┘     │        └─▲───▲───▲─┘    └────────┘ ¦║
║                      ¦                         │        * │ * │ * │                 ¦║
║                      ¦       ┌─────────────────┘          │   │   │                 ¦║
║                      ¦     1 │                 1 ┌────────┘ 1 │   └────────┐ 1      ¦║
║                      ¦  ┌────┴─────┐        ┌────┴─────┐ ┌────┴─────┐ ┌────┴─────┐  ¦║
║                      ¦  │ Fragment │        │   Job    │ │ Endpoint │ │   Event  │  ¦║
║                      ¦  └────▲─────┘        └──────────┘ └Δ──Δ──Δ──Δ┘ └──────────┘  ¦║
║                      ¦     * │                            ¦  ¦  ¦  ¦                ¦║
║                      ¦       │         ┌------------------┘  ¦  ¦  ¦                ¦║
║                      ¦       │         │           ┌---------┘  ¦  └--------┐       ¦║
║                      ¦       │    ┌────┴────┐ ┌────┴─────┐ ┌────┴─────┐ ┌───┴───┐   ¦║
║                      ¦       │    │ RestAPI │ │   Page   │ │ Resource │ │ Asset │   ¦║
║                      ¦       │    └─────────┘ └────┬─────┘ └──────────┘ └───────┘   ¦║
║                      ¦       │                   * │                                ¦║
║                      ¦       └─────────────────────┘                                ¦║
║                      └--------------------------------------------------------------┘║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

## Component model

The components of **WebExpress** and its applications are centrally managed in the `ComponentHub`. The following component managers are available in **WebExpress**:

|Component                   |Description
|----------------------------|---------------------
|ApplicationManager          |An application is the logical combination of functionalities into an application system. 
|AssetManager                |Assets like static java script files are delivered by **WebExpress**.
|EventManager                |Manages and triggers events triggered by specific actions in the system.
|FragmentManager             |Are program parts that are integrated into defined areas of pages. The components extend the functionality or appearance of the page.
|IdentityManager             |Users or technical objects that are used for identity and access management.
|IncludeManager              |Manages the dynamic integration of JavaScript and CSS files into the HTML header. In release mode, the files are delivered bundled and minified.
|InternationalizationManager |Provides language packs for the internationalization of applications.
|JobManager                  |Jobs can be used for cyclic processing of tasks.
|LogManager                  |Allows to create, view, and delete logs used for troubleshooting and monitoring system performance.
|MessageQueueManager         |Handles the registration of message receivers and manages the distribution of messages via a bidirectional WebSocket connection. Enables real-time features such as notifications, status updates, and cross-system commands.
|PackageManager              |Management of packages that extend the functionality of **WebExpress**.
|PluginManager               |Management of extension addons that extend the functionality of **WebExpress**.
|ResourceManager             |Resources are contents that are delivered by **WebExpress**. These include, for example, websites that consist of HTML source code, arbitrary files (e.g. css, JavaScript, images) and REST interfaces, which are mainly used for communication via HTTP(S) with (other) systems.
|SessionManager              |Responsible for storing session data generated during the user session.
|SettingPageManager          |Manages the settings of the application.
|SitemapManager              |Manages the structure of the website, including navigation between different pages.
|SocketManager               |Manages persistent connections for real-time communication between server and client, via WebSocket protocol.
|StatusPageManager           |Represent HTML pages that are returned with a StatusCode other than 200.
|TaskManager                 |Management of ad-hoc tasks.
|ThemeManager                |Provides color and layout schemes for customizing applications.

In addition, you can create your own components and register them in the `ComponentHub`. The following UML diagram illustrates the relationships and internal structure of the `ComponentManager` and the components it manages:

```
╔WebExpress.Core═══════════════════════════════════════════════════════════════════════╗
║                                                                                      ║
║     ┌────────────────────────────────────────────────────────────┐                   ║
║     │ <<Interface>>                                              │                   ║
║     │ IComponentHub                                              │                   ║
║     ├────────────────────────────────────────────────────────────┤                   ║
║     │ AddManager:Event                                           │                   ║
║     │ RemoveManager:Event                                        │                   ║
║     ├────────────────────────────────────────────────────────────┤                   ║
║     │ HttpServerContext:IHttpServerContext                       │ 1                 ║
║     │ Managers:IEnumerable<IComponentManager>                    ├─────┐             ║
║     │ LogManager:ILogManager                                     │     │             ║
║     │ PackageManager:IPackageManager                             │     │             ║
║     │ PluginManager:IPluginManager                               │     │             ║
║     │ ApplicationManager:IApplicationManager                     │     │             ║
║     │ EventManager:IEventManager                                 │     │             ║
║     │ JobManager:IJobManager                                     │     │             ║
║     │ ResponseManager:IResponseManager                           │     │             ║
║     │ ResourceManager:IResourceManager                           │     │             ║
║     │ ThemeManager:IThemeManager                                 │     │             ║
║     │ FragmentManager:IFragmentManager                           │     │             ║
║     │ SitemapManager:ISitemapManager                             │     │             ║
║     │ InternationalizationManager:IInternationalizationManager   │     │             ║
║     │ SessionManager:ISessionManager                             │     │             ║
║     │ TaskManager:ITaskManager                                   │     │             ║
║     ├────────────────────────────────────────────────────────────┤     │             ║
║     │ GetComponentManager(id):IComponentManager                  │     │             ║
║     │ GetComponentManager<TComponentManager>():TComponentManager │     │             ║
║     │ Remove(pluginContext)                                      │     │             ║
║     └────────────────────────────────────────────────────────────┘     │             ║
║                                                                        │             ║
║                                  ┌─────────────────────────────────────┘             ║
║                                * │                                                   ║
║                 ┌────────────────▼──────────────────┐                                ║
║                 │ <<Interface>>                     │                                ║
║                 │ IComponentManager                 │                                ║
║                 ├───────────────────────────────────┤                                ║
║                 └────────────────Δ──────────────────┘                                ║
║                                  ¦                                                   ║
║                                  ¦                                                   ║
║                     ┌────────────┴────────────┐         ┌───────────────┐            ║
║                     │ <<Interface>>           │         │ <<Interface>> │            ║
║                     │ IComponentManagerPlugin │         │ IComponent    │            ║
║                     ├─────────────────────────┤         ├───────────────┤            ║
║                     │ Register(pluginContext) │         └───────▲───────┘            ║
║                     │ Remove(pluginContext)   │               * │                    ║
║                     └────────────Δ────────────┘                 │                    ║
║                                  ¦                              │                    ║
║                                  ¦                              │                    ║
║                     ┌────────────┴────────────┐ 1               │                    ║
║                     │ MyComponentManager      ├─────────────────┘                    ║
║                     ├─────────────────────────┤                                      ║
║                     │ Register(pluginContext) │                                      ║
║                     │ Remove(pluginContext)   │                                      ║
║                     └─────────────────────────┘                                      ║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

**WebExpress** supports the creation of `IComponent` instances using dependency injection. This allows dependencies to be automatically injected when an instance of a component is created. The following constructor parameters can be indexed by injection:

| Constructor Parameter | Description 
|-----------------------|-------------
| `IComponentHub`       | The central hub for managing all components. 
| `I<*>Manager`         | A specific manager from `IComponentHub` (e.g. `IResourceManager`).
| `IComponentId`        | The unique identifier of the component. 
| `IHttpServerContext`  | The context of the HTTP server.

By using dependency injection, it is ensured that all required dependencies are automatically provided when the instance of the component is created.

## Package model

**WebExpress** is designed by its open and modular plugin system, which supports many usage scenarios. The distribution of the plugins and other software components (e.g. Entity Framework) takes place as **WebExpress** packages. **WebExpress** is able to read these packets and execute the code in them. Packages can contain both managed code and native libraries (e.g. for Linux) and be dependent on other packages. The recursive resolution of the dependencies is done by **WebExpress**. The **WebExpress** packages are ZIP-compressed files that can provide libraries for multiple platforms. They have the `wxp` file extension. A **WebExpress** package has the following structure:

```
   📦 <packagename>.<version>.wxp
   ├─📁 lib
   │ └─📁 runtime
   │   └─📁 <rid>
   ├─📁 licences
   ├─📄 readme.md
   └─📄 <packagename>.spec
```

|Directory/ File  |Description
|-----------------|-------------------
|assets           |Media files, which are needed for the description of the package.
|lib              |This directory contains the libraries.
|runtimes         |Contains the platform-dependent libraries.
|rid              |A runtime identifier (RID) of the supported runtime (see .NET Runtime Identifier (RID) catalog). Each supported runtime is created in its own directory.
|licences         |Storage location of all third-party licenses and your own license.
|readme.md        |The description of the package contents for the user.
|packagename.spec |The specification of the package.

The packages are versioned and can assume the following states:

```
┌───────────┐              ┌───────────┐
│ Available │              │  Disable  │
└────┬──────┘              └─────▲─────┘
     │                           │
     │ activate                  │
     │       ┌───────────┐       │ disable/enable
     └───────►  Active   ◄───────┘
             └───────────┘
```

- **Available** - The package is available, but not yet loaded by the **WebExpress**. 
- **Active** - The package has been loaded and is ready for use. 
- **Disable** - The package has been disabled. The use of the package is not possible.

The `PackageManager` is responsible for provisioning the packages. This has the task of loading all packages and deactivating or removing them if desired. The following directories are used to store the packages and libraries: 

```
   📁 packages
   ├─📁 <package>
   ├─📄 catalog.xml
   ├─📦 <package 1>.wxp
   ├─📦 <package …>.wxp
   └─📦 <package n>.wxp
```

|Directory/ File |Description
|----------------|-----------------------
|packages        |The home directory that contains the catalog and packages.
|package         |Each active package is unpacked in a separate directory. This directory contains the libraries of the **WebExpress** packages for the installed framework and platform.
|catalog.xml     |The catalog.xml file collects all metadata (including the package state) of the installed packages.
|package.wxp     |Each installed package is saved unpacked for future actions.

New packages can be installed on the fly by copying them into the packages directory by the user. The provisioning service cyclically scans the directory for new packets and loads them. If a package is to be deactivated without removing it, the `PackageManager` notes it in the catalog (state `Disable`). In addition package, the directory of the deactivated package is deleted and all contents (components) are removed from the running **WebExpress**. When **WebExpress** boots up and initializes, the catalog is read and the disabled packages are excluded. A disabled package is activated by changing the state in the catalog and unpacking and loading the package into the package directory. When a package is deleted, it is removed from the package directory and from the catalog. The `PackageManager` manages the catalog. This can be accessed at runtime via the following classes:

```
╔WebExpress.Core═══════════════════════════════════════════════════════════════════════╗
║                                                                                      ║
║         ┌───────────────────┐                                                        ║
║         │ <<Interface>>     │                                                        ║
║         │ IComponentManager │                                                        ║
║         ├───────────────────┤                                                        ║
║         └────────Δ──────────┘                                                        ║
║                  ¦                        ┌────────────────────────────────┐         ║
║                  ¦                        │ <<Interface>>                  │         ║
║      ┌───────────┴────────────┐           │ IComponentHub                  │         ║
║      │ <<Interface>>          │ 1       1 ├────────────────────────────────┤         ║
║      │ IPackageManager        ◄───────────┤ PackageManager:IPackageManager │         ║
║      ├────────────────────────┤           │ …                              │         ║
║      │ AddPackage:Event       │           └────────────────────────────────┘         ║
║      │ RemovePackage:Event    │                                                      ║
║      ├────────────────────────┤                                                      ║
║      │ Catalog:PackageCatalog │                                                      ║
║      ├────────────────────────┤                                                      ║
║      └────────────────────────┘                                                      ║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

## Plugin model

The plugin system can be used to extend both **WebExpress** and application functionalities. Each plugin must have exactly one plugin class that implements `IPlugin`. The following example demonstrates the implementation of a plugin:

```csharp
[Name("myplugin")]
[Description("description")]
[Icon("/assets/img/Logo.png")]
[Dependency("webexpress.webapp")]
[Application<MyApplication>()]
public sealed class MyPlugin : IPlugin
{
    public Initialization(IPluginContext) {}
    public Run() {}
    public Dispose() {}
}
```

To provide clarity about the metadata specified in the code above, the following table presents the available attributes and their corresponding details for defining plugins:

|Attribute   |Type           |Multiplicity |Optional |Description
|------------|---------------|-------------|---------|--------------
|Name        |String         |1            |Yes      |The name of the plugin. This can be a key to internationalization.
|Description |String         |1            |Yes      |The description of the plugin. This can be a key to internationalization.
|Icon        |String         |1            |Yes      |The icon that represents the plugin graphically.
|Dependency  |String         |n            |Yes      |Defines a dependency on another plugin and is specified via the PluginId.
|Applcation  |`IApplication` |n            |No       |A concrete class that implements IApplication or an interface that marks the application class that is to be extended.

The implemented methods from the interface cover the life cycle of the plugin. Meta information about the plugin is stored in the `PluginContext` and is available globally via the `PluginManager`. Below is a UML diagram that highlights the structure and connections between the `PluginManager` and plugins.

```
╔WebExpress.Core═══════════════════════════════════════════════════════════════════════╗
║                                                                                      ║
║                                                   ┌──────────────────────────────┐   ║
║                                                   │ <<Interface>>                │   ║
║                                                   │ IComponentHub                │   ║
║                                                 1 ├──────────────────────────────┤   ║
║          ┌───────────────────┐                ┌───┤ PluginManager:IPluginManager │   ║
║          │ <<Interface>>     │                │   │ …                            │   ║
║          │ IComponentManager │                │   └──────────────────────────────┘   ║
║          ├───────────────────┤                │                                      ║
║          └─────────Δ─────────┘                │                                      ║
║                    ¦                          │           ┌───────────────┐          ║
║                    ¦                          │           │ <<Interface>> │          ║
║                    ¦                          │           │ IContext      │          ║
║ ┌──────────────────┴───────────────────┐      │           ├───────────────┤          ║
║ │ <<Interface>>                        │ 1    │           └───────Δ───────┘          ║
║ │ IPluginManager                       ◄──────┘                   ¦                  ║
║ ├──────────────────────────────────────┤                          ¦                  ║
║ │ AddPlugin:Event                      │                          ¦                  ║
║ │ RemovePlugin:Event                   │              ┌───────────┴─────────────┐    ║
║ ├──────────────────────────────────────┤ 1          * │ <<Interface>>           │    ║
║ │ Plugins:IEnumerable<IPluginContext>  ├──────────────► IPluginContext          │    ║
║ ├──────────────────────────────────────┤              ├─────────────────────────┤    ║
║ │ GetPlugin(PluginId):IPluginContext   ├----------┐   │ Assembly:Assembly       │    ║
║ │ GetPlugin(Type):IPluginContext       │          ¦   │ PluginId:String         │    ║
║ └──────────────────────────────────────┘          ¦   │ PluginName:String       │    ║
║                                                   ¦   │ Manufacturer:String     │    ║
║                                                   ¦   │ Description:String      │    ║
║                                                   ¦   │ Version:String          │    ║
║                                                   ¦   │ Copyright:String        │    ║
║          ┌───────────────┐                        ¦   │ License:String          │    ║
║          │ <<Interface>> │                        ¦   │ Icon:IRoute             │    ║
║          │ IComponent    │                        ¦   └─────────────────────────┘    ║
║          ├───────────────┤                        ¦                                  ║
║          └──────Δ────────┘                        ¦                                  ║
║                 ¦                                 ¦                                  ║
║                 ¦                                 ¦                                  ║
║         ┌───────┴───────┐                         ¦                                  ║
║         │ <<Interface>> │                         ¦                                  ║
║         │ IPlugin       │                         ¦                                  ║
║         ├───────────────┤                         ¦                                  ║
║         │ Run()         │                         ¦                                  ║
║         └──────Δ────────┘                         ¦                                  ║
║                ¦                                  ¦                                  ║
╚════════════════¦══════════════════════════════════¦══════════════════════════════════╝
                 ¦                                  ¦               
╔MyPlugin════════¦══════════════════════════════════¦══════════════════════════════════╗
║                ¦                                  ¦                                  ║
║                ¦                                  ¦                                  ║
║          ┌─────┴─────┐                     create ¦                                  ║
║          │ MyPlugin  ◄----------------------------┘                                  ║
║          ├───────────┤                                                               ║
║          │ Run()     │                                                               ║
║          └───────────┘                                                               ║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

## Internationalization model

The provision of multilingual applications for different cultures is supported by **WebExpress**. In addition, the following text formatting is also adapted to the corresponding culture:

|Text formatting |Description
|---------------|-----------------
|Date formats   |Use of the calendar format of the selected culture.
|Time formats   |Support between 24 and 12 hour counting.
|Time zones     |Support for time zones when displaying times.
|Number formats |Support the different representation of decimal and thousands separators, as well as different currencies, weights and measurements.

The `InternationalizationManager` is a central component responsible for managing the translation of texts within the application. It reads the language files and provides the `I18N` function to access the translations. This following UML diagram offers an overview of the architecture of the `InternationalizationManager`:

```
╔WebExpress.Core═══════════════════════════════════════════════════════════════════════╗
║                                                                                      ║
║        ┌───────────────────┐                                                         ║
║        │ <<Interface>>     │                                                         ║
║        │ IComponentManager │                                                         ║
║        ├───────────────────┤                                                         ║
║        └─────────Δ─────────┘                                                         ║
║                  ¦                                                                   ║
║            ┌-----┘                                                                   ║
║            ¦                                                                         ║
║            ¦    ┌──────────────────────────────────────────────────────────┐         ║
║            ¦    │ <<Interface>>                                            │         ║
║            ¦    │ IComponentHub                                            │         ║
║            ¦    ├──────────────────────────────────────────────────────────┤ 1       ║
║            ¦    │ InternationalizationManager:IInternationalizationManager ├───┐     ║
║            ¦    │ …                                                        │   │     ║
║            ¦    └──────────────────────────────────────────────────────────┘   │     ║
║            ¦                                                                   │     ║
║            ¦                              ┌────────────────────────────────────┘     ║
║            ¦                              │                                          ║
║            ¦                              │                                          ║
║            ¦                              │                                          ║
║            ¦                            1 │                                          ║
║     ┌──────┴──────────────────────────────▼───────┐                                  ║
║     │ <<Interface>>                               │                                  ║
║     │ IInternationalizationManager                ├------------------------┐         ║
║     ├─────────────────────────────────────────────┤                        ¦         ║
║     │ I18N(Key,Args):String                       │                        ¦         ║
║     │ I18N(II18N,Key,Args):String                 │                        ¦         ║
║     │ I18N(IRequest,Key,Args):String              │                        ¦         ║
║     │ I18N(CultureInfo,Key,Args):String           │                        ¦         ║
║     │ I18N(CultureInfo,PluginId,Key,Args):String  │                        ¦         ║
║     └─────────────────────▲───────────────────────┘                        ¦         ║
║                           ¦                                                ¦         ║
║                           ¦                                                ¦         ║
║                           ¦ uses                                           ¦         ║
║             ┌─────────────┴────────────────┐                               ¦         ║
║             │ I18N                         │                               ¦         ║
║             ├──────────────────────────────┤                               ¦         ║
║             │ Translate(Key):String        │                               ¦         ║
║             │ Translate(Key, Args):String  │                               ¦         ║
║             └──────────────────────────────┘                               ¦         ║
║                                                                            ¦         ║
╚════════════════════════════════════════════════════════════════════════════¦═════════╝
                                                                             ¦
╔MyPlugin════════════════════════════════════════════════════════════════════¦═════════╗
║                                                                            ¦         ║
║                                    ############                       uses ¦         ║
║                                    # MyI18N   #◄---------------------------┘         ║
║                                    ############                                      ║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

For the translation of texts, language translation files are used, which are stored in the packages under `Internationalization`:

```
   📁 Internationalization
   ├─📄 de
   └─📄 en
```

To add a new language, a new language file must be created in the Internationalization folder and registered in the project file:

```xml
<ItemGroup>
    <EmbeddedResource Include="Internationalization/de" />
    <EmbeddedResource Include="Internationalization/en" />
</ItemGroup>
```

The name of the language translation file must match the country code from ISO 3166 ALPHA-2. Each language translation file is structured as follows:

```csharp
# Comment
key=text fragment

e.g.
# de
welcome.message=Willkommen '{0}' zu unserer Anwendung!
logout.button=Abmelden

# en
welcome.message=Welcome '{0}' to our application!
logout.button=Logout
```

When creating language files, it is important to pay attention to cultural differences in the translation of content, e.g. in forms of address.

The translation of a text is done with the help of the `InternationalizationManager`, which provides the `I18N` function. The term i18n is a numeronym for "internationalization", where the number 18 stands for the 18 letters between the first "i" and the last "n" in the word. The following examples demonstrate how to use the `I18N` function for translating text:

```csharp
// Language, PluginId, Key
var text = I18N.Translate("de", "<PlginId>", "logout.button"); 

// Culture, PluginId:key
var text = I18N.Translate(culture, "<PlginId>:logout.button"); 

// Language, PluginId, Key, Placeholders for dynamic content in texts
var user = "Max";
var text = I18N.Translate("de", "<PlginId>:welcome.message", user); 
```

The `I18N` function works as follows:
- Language: Specifies the language code (e.g. "de" for German) or a CulturInfo object of the language.
- PluginId: Identifies the plugin for which the translation is registered.
- Key: The key that corresponds to the text fragment to be translated.

If a key is not found, the I18N function returns the key itself by default. This can be replaced with a custom error message:

```csharp
var text = I18N.Translate("en", "<PluginId>", "non.existent.key") ??
    "Translation not found";
```

## Application model

Each plugin can provide one or more applications. To define an application, a class must be defined that implements the `IApplication` interface. The application's metadata is appended as attributes of the class. The following example illustrates the definition of an application:

```csharp
[Name("Application")]
[Description("example")]
[Icon("/app.svg")]
[ContextPath("/app")]
[AssetPath("/app")]
public sealed class MyApplication : Application
{
}
```

To provide clarity about the metadata specified in the code above, the following table presents the available attributes and their corresponding details for defining applications:

|Attribute   |Type       |Multiplicity |Optional |Description
|------------|-----------|-------------|---------|------------
|Name        |String     |1            |Yes      |The name of the application. This can be a key to internationalization.
|Description |String     |1            |Yes      |The description of the application. This can be a key to internationalization.
|Icon        |String     |1            |Yes      |The icon that represents the application graphically.
|AssetPath   |String     |1            |Yes      |The path where the assets are stored. This file path is mounted in the asset path of the web server.
|DataPath    |String     |1            |Yes      |The path where the data is stored. This file path is mounted in the data path of the web server.
|ContextPath |String     |1            |Yes      |The context path where the resources are stored. This path is mounted in the context path of the web server.

The methods implemented from the interface cover the life cycle of the application. When the plugin is loaded, all the applications it contains are instantiated. These remain in place until the plugin is unloaded. Meta information about the application is stored in the `ApplicationContext` and managed by the `ApplicationManager`. To better understand the organization and lifecycle of applications in relation to the `ApplicationManager`, refer to the UML diagram below:

```
╔WebExpress.Core═══════════════════════════════════════════════════════════════════════╗
║                                                                                      ║
║                   ┌────────────────────────────────────────┐                         ║
║                   │ <<Interface>>                          │                         ║
║                   │ IComponentHub                          │                         ║
║                   ├────────────────────────────────────────┤ 1                       ║
║                   │ ApplicationManager:IApplicationManager ├───┐                     ║
║                   │ …                                      │   │                     ║
║                   └────────────────────────────────────────┘   │                     ║
║                                                                │                     ║
║                     ┌────────────────────┐                     │                     ║
║                     │ <<Interface>>      │                     │                     ║
║                     │ IComponentManager  │                     │                     ║
║                     ├────────────────────┤                     │                     ║
║                     └──────────Δ─────────┘                     │                     ║
║                                ¦                        ┌──────┘                     ║
║                      ┌---------┘                        │                            ║
║                      ¦                                1 │                            ║
║              ┌───────┴──────────────────────────────────▼────────┐                   ║
║              │ <<Interface>>                                     │                   ║
║           ┌--┤ IApplicationManager                               │                   ║
║           ¦  ├───────────────────────────────────────────────────┤                   ║
║           ¦  │ AddApplication:Event                              │                   ║
║           ¦  │ RemoveApplication:Event                           │                   ║
║           ¦  ├───────────────────────────────────────────────────┤ 1                 ║
║           ¦  │ Applications:IEnumerable<IApplicationContext>     ├───┐               ║
║           ¦  ├───────────────────────────────────────────────────┤   │               ║
║           ¦  │ GetApplication(ApplicationId):IApplicationContext │   │               ║
║           ¦  │ GetApplication(Type):IApplicationContext          │   │               ║
║           ¦  └───────────────────────────────────────────────────┘   │               ║
║           ¦                                                          │               ║
║           ¦          ┌────────────────┐                              │               ║
║           ¦          │ <<Interface>>  │                              │               ║
║           ¦          │ IContext       │                              │               ║
║           ¦          ├────────────────┤                              │               ║
║           ¦          └───────Δ────────┘                              │               ║
║           ¦                  ¦                ┌──────────────────────┘               ║
║           ¦                  ¦              * │                                      ║
║           ¦           ┌──────┴────────────────▼──────┐                               ║
║           ¦           │ <<Interface>>                │                               ║
║           ¦           │ IApplicationContext          │                               ║
║           ¦           ├──────────────────────────────┤                               ║
║           ¦           │ PluginContext:IPluginContext │                               ║
║           ¦           │ ApplicationId:String         │                               ║
║           ¦           │ ApplicationName:String       │                               ║
║           ¦           │ Description:String           │                               ║
║           ¦           │ AssetPath:String             │                               ║
║           ¦           │ DataPath:String              │                               ║
║           ¦           │ ContextPath:IRoute           │                               ║
║           ¦           │ Icon:IRoute                  │                               ║
║           ¦           └──────────────────────────────┘                               ║
║           ¦                                                                          ║
║           ¦                   ┌────────────────┐                                     ║
║           ¦                   │ <<Interface>>  │                                     ║
║           ¦                   │ IComponent     │                                     ║
║           ¦                   ├────────────────┤                                     ║
║           ¦                   └───────Δ────────┘                                     ║
║           ¦                           ¦                                              ║
║           ¦                           ¦                                              ║
║           ¦                   ┌───────┴───────┐                                      ║
║           ¦                   │ <<Interface>> │                                      ║
║           ¦                   │ IApplication  │                                      ║
║           ¦                   ├───────────────┤                                      ║
║           ¦                   │ Run()         │                                      ║
║           ¦                   └───────Δ───────┘                                      ║
║           ¦                           ¦                                              ║
╚═══════════¦═══════════════════════════¦══════════════════════════════════════════════╝
            ¦                           ¦                               
╔MyPlugin═══¦═══════════════════════════¦══════════════════════════════════════════════╗
║           ¦                           ¦                                              ║
║           ¦ create            ┌───────┴───────┐                                      ║
║           └-------------------► MyApplication │                                      ║
║                               ├───────────────┤                                      ║
║                               │ Run()         │                                      ║
║                               └───────────────┘                                      ║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

## Endpoint model

Endpoints are (web) elements that can be accessed with a URI (Uniform Resource Identifier). When a plugin is loaded, all classes marked as resources are automatically determined from the assembly and included in a sitemap. For this purpose, the affected classes are provided with attributes. Endpoints are virtual and are implemented through specific derivations such as pages, resources, or REST APIs. Additionally, custom endpoints can also be defined. The following UML diagram illustrates the relationships and internal structure of the `EndpointManager` and the `Endpoint` it manages:

```
╔WebExpress.Core═══════════════════════════════════════════════════════════════════════╗
║                                                                                      ║
║      ┌───────────────────┐                                                           ║
║      │ <<Interface>>     │                                                           ║
║      │ IComponentManager │                                                           ║
║      ├───────────────────┤                                                           ║
║      └──Δ─────Δ──────Δ───┘                                                           ║
║         ¦     ¦      ¦                                                               ║
║  ┌----- ¦-----┘      └----------------------┐                                        ║
║  ¦      ¦                                   ¦                                        ║
║  ¦      ¦            ┌──────────────────────┴────────────────────────┐               ║
║  ¦      ¦          * │ <<Interface>>                                 │               ║
║  ¦      ¦      ┌─────► ISitemapManager                               │               ║
║  ¦      ¦      │     ├───────────────────────────────────────────────┤ 1             ║
║  ¦      ¦      │     │ SiteMap:IEnumerable<IEndpointContext>         ├───────────┐   ║
║  ¦      ¦      │     ├───────────────────────────────────────────────┤           │   ║
║  ¦      ¦      │     │ Refresh()                                     ◄------┐    │   ║
║  ¦      ¦      │     │ SearchResource(Uri,SearchContex):SearchResult │      ¦    │   ║
║  ¦      ¦      │     └───────────────────────────────────────────────┘      ¦    │   ║
║  ¦      ¦      │                                                            ¦    │   ║
║  ¦      ¦      │                                                            ¦    │   ║
║  ¦      ¦      │   ┌───────────────────────────────────┐                    ¦    │   ║
║  ¦      ¦      │   │ <<Interface>>                     │                    ¦    │   ║
║  ¦      ¦      │   │ IComponentHub                     │                    ¦    │   ║
║  ¦      ¦      │ 1 ├───────────────────────────────────┤                    ¦    │   ║
║  ¦      ¦      └───┤ SitemapManager:ISitemapManager    │ 1                  ¦    │   ║
║  ¦      ¦          │ ResourceManager:IResourceManager  ├───┐                ¦    │   ║
║  ¦      ¦          │ GetComponentManager(Id)           │   │                ¦    │   ║
║  ¦      ¦          │   :IComponentManager              │   │                ¦    │   ║
║  ¦      ¦          │ GetComponent<IComponentManager>() │   │                ¦    │   ║
║  ¦      ¦          │   :IComponentManager              │   │                ¦    │   ║
║  ¦      ¦          │ …                                 │   │                ¦    │   ║
║  ¦      ¦          └───────────────────────────────────┘   │                ¦    │   ║
║  ¦      ¦                                            ┌─────┘                ¦    │   ║
║  ¦      └-----------┐                                │                      ¦    │   ║
║  ¦                  ¦                              1 │                      ¦    │   ║
║  ¦         ┌────────┴────────────────────────────────▼────────┐             ¦    │   ║
║  ¦         │ <<Interface>>                                    │  Refresh    ¦    │   ║
║  ¦         │ IEndpointManager                                 ├-------------┘    │   ║
║  ¦         ├──────────────────────────────────────────────────┤                  │   ║
║  ¦         │ AddEndpoint:Event                                │                  │   ║
║  ¦         │ RemoveEndpoint:Event                             │                  │   ║
║  ¦       1 ├──────────────────────────────────────────────────┤                  │   ║
║  ¦    ┌────┤ Endpoints:IEnumerable<IEndpointContext>          │                  │   ║
║  ¦    │    ├──────────────────────────────────────────────────┤                  │   ║
║  ¦    │    │ Register<IEndpointContext>(EndpointRegistration) │◄----┐            │   ║
║  ¦    │    │ Remove<IEndpointContext>()                       │     ¦            │   ║
║  ¦    │    │ HandleRequest(IRequest,IEndpointContext):        │     ¦            │   ║
║  ¦    │    │   IResponse                                      │     ¦            │   ║
║  ¦    │    │ GetEndpoints(EndpointType,IApplicationContext):  │     ¦            │   ║
║  ¦    │    │   IEnumerable<IEndpointContext>                  │     ¦            │   ║
║  ¦    │    └──────────────────────────────────────────────────┘     ¦            │   ║
║  ¦    │                                                             ¦            │   ║
║  ¦    │                    ┌────────────────┐                       ¦            │   ║
║  ¦    │                    │ <<Interface>>  │                       ¦            │   ║
║  ¦    │                    │ IContext       │                       ¦            │   ║
║  ¦    │                    ├────────────────┤                       ¦            │   ║
║  ¦    │                    └────────────────┘                       ¦            │   ║
║  ¦    │                            Δ                                ¦            │   ║
║  ¦    │                            ¦                                ¦            │   ║
║  ¦    │                            ¦                                ¦            │   ║
║  ¦    │        ┌───────────────────┴────────────────────┐           ¦            │   ║
║  ¦    │      * │ <<Interface>>                          │ *         ¦            │   ║
║  ¦    └────────► IEndpointContext                       ◄────────────────────────┘   ║
║  ¦             ├────────────────────────────────────────┤           ¦                ║
║  ¦             │ EndpointId:String                      │           ¦                ║
║  ¦             │ PluginContext:IPluginContext           │           ¦                ║
║  ¦             │ ApplicationContext:IApplicationContext │           ¦                ║
║  ¦             │ Conditions:IEnumerable<ICondition>     │           ¦                ║
║  ¦             │ Policies:IEnumerable<IIdentityPolicy>  │           ¦                ║
║  ¦             │ Cache:Bool                             │           ¦                ║
║  ¦             │ Route:IRoute                           │           ¦                ║
║  ¦             └────────────────────────────────────────┘           ¦                ║
║  ¦                                                                  ¦                ║
╚══¦══════════════════════════════════════════════════════════════════¦════════════════╝
   └-------------------------------┐                                  ¦
╔MyPlugin══════════════════════════¦══════════════════════════════════¦════════════════╗
║                                  ¦                                  ¦                ║
║                     ┌────────────┴──────────────┐ Register          ¦                ║
║                     │ MyEndpointManager         ├-------------------┘                ║
║                     ├───────────────────────────┤                                    ║
║                     └───────────────────────────┘                                    ║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

Endpoint, such as pages or assets, can be uniquely addressed with the help of URIs. The following endpoint types are supported:

|Endpoint type |Description
|--------------|-------------------------
|Asset         |Files from the assembly.
|File          |Files from the file system.
|Page          |A HTML document.
|SettingPage   |An HTML document for setting purposes.
|RestAPI       |A RestAPI-Endpoint.

Parameters can be transferred to the endpoint to be executed in a URI or through form inputs. Furthermore, it is possible to store parameters in the session environment in order to make values available across endpoints. The parameters in the session are valid until the web server is restarted or the session is destroyed. The following parameters are supported:

|Origin       |Scope     |Description
|-------------|----------|-------------------------
|GET, DELETE  |Parameter |Parameter from the URI. Example: http://www.example.com?id=d9869404-6628-464b-8286-9685d4c4ff8b
|POST, PATCH  |Parameter |Parameter from the content part of the request. 
|Path segment |URI       |Parameters that are part of the URI path. Example: http://www.example.com/d9869404-6628-464b-8286-9685d4c4ff8b/edit
|Session      |Session   |Parameters, which are stored in the session. 

### Asset model

**WebExpress** provides automatically generated endpoints, which are made available to the client application. Assets in this context are static resources such as JavaScript files, CSS files, icons, and other files necessary for the presentation and functionality of the application.

To include additional resources such as CSS files in the project, they can be embedded directly within the project configuration. An example of how to include asset files as an embedded resource is shown below:

```xml
<ItemGroup>
	<EmbeddedResource Include="Assets/**/*.*">
		<LogicalName>$(MSBuildProjectName).Assets.%(RecursiveDir)%(Filename)%(Extension)</LogicalName>
	</EmbeddedResource>
</ItemGroup>
```

Assets embedded in each plugin are converted into endpoints by the `AssetManager` and integrated into the application's sitemap. As a central component for managing static resources, the `AssetManager` collects and organizes embedded resources from plugins (such as `WebExpress.UI` and `WebExpress.WebApp`). When converting assets, if an asset comes from an external plugin, the `AssetManager` will attach the name of the plugin to the route (e.g. `/server/app/asset/<plugin>/x/y/z)` to ensure unique identification. However, if the asset comes from the plugin that hosts the application, the plugin's subdirectory will be omitted, resulting in a simplified route (e.g. `/server/app/asset/x/y/z`). This approach prevents naming conflicts and ensures consistent resource provisioning across the system.

The following asset types are supported by the **WebExpress** system: 

| Type  | Description
|-------|-----------------------
| .bmp  | BMP image
| .css  | CSS stylesheet
| .csv  | CSV file
| .doc  | Microsoft Word
| .docx | Microsoft Word
| .gif  | GIF image
| .htm  | HTML file
| .html | HTML file
| .ico  | Icon file
| .jpeg | JPEG image
| .jpg  | JPEG image
| .js   | Java script file
| .json | JSON file
| .mp3  | MP3 audio
| .mp4  | MP4 video
| .pdf  | PDF document
| .png  | PNG image
| .ppt  | Microsoft PowerPoint
| .svg  | SVG image
| .txt  | Text file
| .wav  | WAV audio
| .xls  | Microsoft Excel
| .xlx  | Microsoft Excel
| .xml  | XML file
| .zip  | ZIP archive

All assets are placed under the "assets" path, which is located within the main directory of the application. This facilitates the organization and access to the necessary resources. It is important to note that the size of embedded resources increases the size of the plugin, which can lead to longer load times and higher memory consumption. Therefore, large files should not be delivered as embedded resources. Below is a UML diagram that highlights the architecture of the `AssetManager` and its management of `Assets`:

```
╔WebExpress.Core═══════════════════════════════════════════════════════════════════════╗
║                                                                                      ║
║     ┌───────────────────┐                                                            ║
║     │ <<Interface>>     │                                                            ║
║     │ IComponentManager │                                                            ║
║     ├───────────────────┤                                                            ║
║     └──Δ────────────Δ───┘                                                            ║
║        ¦            ¦                                                                ║
║        ¦            └-----------------------------┐                                  ║
║        ¦                                          ¦                                  ║
║        ¦                   ┌──────────────────────┴────────────────────────┐         ║
║        ¦                 * │ <<Interface>>                                 │         ║
║        ¦             ┌─────► ISitemapManager                               │         ║
║        ¦             │     ├───────────────────────────────────────────────┤ 1       ║
║        ¦             │     │ SiteMap:IEnumerable<IEndpointContext>         ├───┐     ║
║        ¦             │     ├───────────────────────────────────────────────┤   │     ║
║        ¦             │     │ Refresh()                                     │   │     ║
║        ¦             │     │ SearchResource(Uri,SearchContex):SearchResult │   │     ║
║        ¦             │     └───────────────────────────────────────────────┘   │     ║
║        ¦             │                                                         │     ║
║        ¦             │                                                         │     ║
║        ¦             │   ┌────────────────────────────────┐                    │     ║
║        ¦             │   │ <<Interface>>                  │                    │     ║
║        ¦             │   │ IComponentHub                  │                    │     ║
║        ¦             │ 1 ├────────────────────────────────┤                    │     ║
║        └------┐      └───┤ SitemapManager:ISitemapManager │ 1                  │     ║
║               ¦          │ AssetManager:IAssetManager     ├───┐                │     ║
║               ¦          │ …                              │   │                │     ║
║               ¦          └────────────────────────────────┘   │                │     ║
║               ¦                                          ┌────┘                │     ║
║               ¦                                          │                     │     ║
║               ¦                                        1 │                     │     ║
║     ┌─────────┴──────────────────────────────────────────▼───────┐             │     ║
║     │ <<Interface>>                                              │             │     ║
║     │ IAssetManager                                              ├---------┐   │     ║
║     ├────────────────────────────────────────────────────────────┤         ¦   │     ║
║     │ AddResource:Event                                          │         ¦   │     ║
║     │ RemoveResource:Event                                       │         ¦   │     ║
║   1 ├────────────────────────────────────────────────────────────┤         ¦   │     ║
║  ┌──┤ Assets:IEnumerable<IResourceContext>                       │         ¦   │     ║
║  │  ├────────────────────────────────────────────────────────────┤         ¦   │     ║
║  │  │ GetAssets(IApplicationContext,ResourceId):IResourceContext │         ¦   │     ║
║  │  └────────────────────────────────────────────────────────────┘         ¦   │     ║
║  │                                                                         ¦   │     ║
║  │                        ┌────────────────┐                               ¦   │     ║
║  │                        │ <<Interface>>  │                               ¦   │     ║
║  │                        │ IContext       │                               ¦   │     ║
║  │                        ├────────────────┤                               ¦   │     ║
║  │                        └───────Δ────────┘                               ¦   │     ║
║  │                                ¦                                        ¦   │     ║
║  │                                ¦                                        ¦   │     ║
║  │            ┌───────────────────┴────────────────────┐                   ¦   │     ║
║  │            │ <<Interface>>                          │                   ¦   │     ║
║  │            │ IEndpointContext                       │                   ¦   │     ║
║  │            ├────────────────────────────────────────┤                   ¦   │     ║
║  │            │ EndpointId:String                      │                   ¦   │     ║
║  │            │ PluginContext:IPluginContext           │                   ¦   │     ║
║  │            │ ApplicationContext:IApplicationContext │                   ¦   │     ║
║  │            │ Conditions:IEnumerable<ICondition>     │                   ¦   │     ║
║  │            │ Policies:IEnumerable<IIdentityPolicy>  │                   ¦   │     ║
║  │            │ Cache:Bool                             │                   ¦   │     ║
║  │            │ Route:IRoute                           │                   ¦   │     ║
║  │            └──────────────────Δ─────────────────────┘                   ¦   │     ║
║  │                               ¦                                         ¦   │     ║
║  │                               ¦                                         ¦   │     ║
║  │                       ┌───────┴───────┐                                 ¦   │     ║
║  │                     * │ <<Interface>> │ *                               ¦   │     ║
║  └───────────────────────► IAssetContext ◄─────────────────────────────────────┘     ║
║                          ├───────────────┤                                 ¦         ║
║                          └───────────────┘                                 ¦         ║
║                                                                            ¦         ║
╚════════════════════════════════════════════════════════════════════════════¦═════════╝
                                                                             ¦
╔MyPlugin════════════════════════════════════════════════════════════════════¦═════════╗
║                                                                            ¦         ║
║                                    ############                       uses ¦         ║
║                                    # MyAsset  #◄---------------------------┘         ║
║                                    ############                                      ║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

### Resource model

Resources are typically assets that can come in various forms, such as images, videos, documents, or other files. They serve to provide and support content and functionalities within an application. Unlike assets, especially those provided by the "AssetManager" that reference static content, resources are used to provide dynamic assets. This distinction allows resources to enable greater flexibility and adaptability for applications. The example below demonstrates how to implement a resource:

```csharp
[Segment("E")]
[Policy<AuthenticatedAccessPolicy>]
public sealed class MyResource : IResource
{
}
```

To provide clarity about the metadata specified in the code above, the following table presents the available attributes and their corresponding details for defining resources:

|Attribute       |Type              |Multiplicity |Optional |Description
|----------------|------------------|-------------|---------|----------------
|Segment         |String, String    |1            |Yes      |The path segment of the resource. The first argument is the path segment. The second argument is the display string.
|SegmentInt      |Parameter, String |1            |Yes      |A variable path segment of type `Int`.
|SegmentGuid     |Parameter, String |1            |Yes      |A variable path segment of type `Guid`.
|IncludeSubPaths |Bool              |1            |Yes      |Determines whether all resources below the specified path (including segment) are processed.
|Policy          |`IIdentityPolicy` |n            |Yes      |Grants authority to a policy.
|Condition       |`ICondition`      |n            |Yes      |Condition that must be met for the resource to be available.
|Cache           |-                 |1            |Yes      |Determines whether the resource is created once and reused each time it is called.
|Optional        |-                 |1            |Yes      |Marks a resource as optional. It only becomes active if the option has been activated in the application.

A cached resource is created on the first call and persists until the associated plugin is unloaded. The `Initialize` method is called once at instantiation, while the `Process` method is called each time the resource is requested. For non-cached resources, a new instance is created each time they are called.

```
┌────────┐ ┌────────┐ ┌─────────┐ ┌─────────┐
│ Web    │ │ HTTP   │ │ Package │ │ Plugin  │
│ Client │ │ Server │ │ Manager │ │ Manager │              ┌──────────┐
└────┬───┘ └────┬───┘ └────┬────┘ └────┬────┘              │ MyPlugin │
     ¦          ¦          ¦           ¦                   │          │
    ┌┴┐        ┌┴┐        ┌┴┐ Register┌┴┐                  └────┬─────┘
    │ │        │ │        │ ├────────>│ │      Create Instacnce ¦
    │ │        │ │        │ │         │ ├─────────────────────>┌┴┐
    │ │        │ │        │ │         │ │<---------------------┤ │
    │ │        │ │        │ │         │ │        Initialization│ │
    │ │        │ │        │ │         │ ├─────────────────────>│ │
    │ │        │ │        │ │         │ │<---------------------┤ │
    │ │        │ │        │ │         │ │                      └─┘
    │ │        │ │        │ │         │ │     ┌─────────┐
    │ │        │ │        │ │         │ │     │ App.    │
    │ │        │ │        │ │         │ │     │ Manager │               ┌───────┐
    │ │        │ │        │ │         │ │     └────┬────┘               │ MyApp │
    │ │        │ │        │ │         │ │          ¦                    │       │
    │ │        │ │        │ │         │ │AddPlugin┌┴┐                   └───┬───┘
    │ │        │ │        │ │         │ ├────────>│ │      Create Instacnce ¦
    │ │        │ │        │ │         │ │         │ ├─────────────────────>┌┴┐
    │ │        │ │        │ │         │ │         │ │<---------------------┤ │
    │ │        │ │        │ │         │ │         │ │        Initialization│ │
    │ │        │ │        │ │         │ │         │ ├─────────────────────>│ │
    │ │        │ │        │ │         │ │         │ │<---------------------┤ │
    │ │        │ │        │ │         │ │<--------┤ │                      └─┘
    │ │        │ │        │ │         │ │         └─┘
    │ │        │ │        │ │         │ │
    │ │        │ │        │ │         │ │     ┌──────────┐        ┌──────────┐
    │ │        │ │        │ │         │ │     │ Endpoint │        │ Resource │
    │ │        │ │        │ │         │ │     │ Manager  │        │ Manager  │
    │ │        │ │        │ │         │ │     └────┬─────┘        └────┬─────┘
    │ │        │ │        │ │         │ │          ¦                   ¦
    │ │        │ │        │ │         │ │         ┌┴┐Register         ┌┴┐
    │ │        │ │        │ │         │ │         │ │<────────────────┤ │
    │ │        │ │        │ │         │ │         │ ├---------------->│ │
    │ │        │ │        │ │         │ │         │ │                 │ │
    │ │        │ │        │ │         │ │         │ │                 │ │
    │ │        │ │        │ │         │ │         │ │                 │ │
    │ │        │ │        │ │         │ │         │ │    ┌─────────┐  │ │
    │ │        │ │        │ │         │ │         │ │    │ Sitemap │  │ │
    │ │        │ │        │ │         │ │         │ │    │ Manager │  │ │
    │ │        │ │        │ │         │ │         │ │    └────┬────┘  │ │
    │ │        │ │        │ │         │ │         │ │         ¦       │ │
    │ │        │ │        │ │         │ │         │ │        ┌┴┐      │ │
    │ │        │ │        │ │         │ │AddPlugin│ │        │ │      │ │
    │ │        │ │        │ │         │ ├────────>│ │        │ │      │ │
    │ │        │ │        │ │         │ │         │ │ Refresh│ │      │ │
    │ │        │ │        │ │         │ │         │ ├───────>│ │      │ │
    │ │        │ │        │ │         │ │         │ │<-------┤ │      │ │
    │ │        │ │        │ │         │ │<--------┤ │        │ │      │ │
    │ │        │ │        │ │<--------┤ │         │ │        │ │      │ │
    │ │ Request│ │        │ │         │ │         │ │        │ │      │ │
    │ ├───────>│ │        │ │         │ │     Search Resource│ │      │ │
    │ │        │ ├──────────────────────────────────────────>│ │      │ │ ┌────────────┐
    │ │        │ │<------------------------------------------┤ │      │ │ │ MyResource │
    │ │        │ │        │ │         │ │  Process│ │        │ │      │ │ │            │
    │ │        │ ├───────────────────────────────>│ │          Process│ │ └─────┬──────┘
    │ │        │ │        │ │         │ │         │ ├────────────────>│Create Instacnce
    │ │        │ │        │ │         │ │         │ │        │ │      │ ├─────>┌┴┐
    │ │        │ │        │ │         │ │         │ │        │ │      │ │<-----┤ │
    │ │        │ │        │ │         │ │         │ │        │ │      │ │      │ │
    │ │        │ │        │ │         │ │         │ │        │ │      │ Process│ │
    │ │        │ │        │ │         │ │         │ │        │ │      │ ├─────>│ │
    │ │        │ │        │ │         │ │         │ │        │ │      │ │<-----┤ │
    │ │        │ │        │ │         │ │         │ │<----------------┤ │      │ │
    │ │Response│ │<-------------------------------┤ │        │ │      │ │      │ │
    │ │<-------┤ │        │ │         │ │         │ │        │ │      │ │      │ │
    └─┘        └─┘        └─┘         └─┘         └─┘        └─┘      └─┘      └─┘
```

The `ResourceManager` manages all resources. However, these are only accessible through the `SitemapManager`. The interaction of the classes involved is illustrated in the following figure:

```
╔WebExpress.Core═══════════════════════════════════════════════════════════════════════╗
║                                                                                      ║
║     ┌───────────────────┐                                                            ║
║     │ <<Interface>>     │                                                            ║
║     │ IComponentManager │                                                            ║
║     ├───────────────────┤                                                            ║
║     └──Δ────────────Δ───┘                                                            ║
║        ¦            ¦                                                                ║
║        ¦            └-----------------------------┐                                  ║
║        ¦                                          ¦                                  ║
║        ¦                   ┌──────────────────────┴────────────────────────┐         ║
║        ¦                 * │ <<Interface>>                                 │         ║
║        ¦             ┌─────► ISitemapManager                               │         ║
║        ¦             │     ├───────────────────────────────────────────────┤ 1       ║
║        ¦             │     │ SiteMap:IEnumerable<IEndpointContext>         ├───┐     ║
║        ¦             │     ├───────────────────────────────────────────────┤   │     ║
║        ¦             │     │ Refresh()                                     │   │     ║
║        ¦             │     │ SearchResource(Uri,SearchContex):SearchResult │   │     ║
║        ¦             │     └───────────────────────────────────────────────┘   │     ║
║        ¦             │                                                         │     ║
║        ¦             │                                                         │     ║
║        ¦             │   ┌──────────────────────────────────┐                  │     ║
║        ¦             │   │ <<Interface>>                    │                  │     ║
║        ¦             │   │ IComponentHub                    │                  │     ║
║        ¦             │ 1 ├──────────────────────────────────┤                  │     ║
║        └------┐      └───┤ SitemapManager:ISitemapManager   │ 1                │     ║
║               ¦          │ ResourceManager:IResourceManager ├───┐              │     ║
║               ¦          │ …                                │   │              │     ║
║               ¦          └──────────────────────────────────┘   │              │     ║
║               ¦                                          ┌──────┘              │     ║
║               ¦                                          │                     │     ║
║               ¦                                        1 │                     │     ║
║     ┌─────────┴──────────────────────────────────────────▼─────────┐           │     ║
║     │ <<Interface>>                                                │           │     ║
║     │ IResourceManager                                             ├-------┐   │     ║
║     ├──────────────────────────────────────────────────────────────┤       ¦   │     ║
║     │ AddResource:Event                                            │       ¦   │     ║
║     │ RemoveResource:Event                                         │       ¦   │     ║
║   1 ├──────────────────────────────────────────────────────────────┤       ¦   │     ║
║  ┌──┤ Resources:IEnumerable<IResourceContext>                      │       ¦   │     ║
║  │  ├──────────────────────────────────────────────────────────────┤       ¦   │     ║
║  │  │ GetResorces(IApplicationContext,ResourceId):IResourceContext │       ¦   │     ║
║  │  └──────────────────────────────────────────────────────────────┘       ¦   │     ║
║  │                                                                         ¦   │     ║
║  │                        ┌────────────────┐                               ¦   │     ║
║  │                        │ <<Interface>>  │                               ¦   │     ║
║  │                        │ IContext       │                               ¦   │     ║
║  │                        ├────────────────┤                               ¦   │     ║
║  │                        └───────Δ────────┘                               ¦   │     ║
║  │                                ¦                                        ¦   │     ║
║  │                                ¦                                        ¦   │     ║
║  │            ┌───────────────────┴────────────────────┐                   ¦   │     ║
║  │            │ <<Interface>>                          │                   ¦   │     ║
║  │            │ IEndpointContext                       │                   ¦   │     ║
║  │            ├────────────────────────────────────────┤                   ¦   │     ║
║  │            │ EndpointId:String                      │                   ¦   │     ║
║  │            │ PluginContext:IPluginContext           │                   ¦   │     ║
║  │            │ ApplicationContext:IApplicationContext │                   ¦   │     ║
║  │            │ Conditions:IEnumerable<ICondition>     │                   ¦   │     ║
║  │            │ Policies:IEnumerable<IIdentityPolicy>  │                   ¦   │     ║
║  │            │ Cache:Bool                             │                   ¦   │     ║
║  │            │ Route:IRoute                           │                   ¦   │     ║
║  │            └──────────────────Δ─────────────────────┘                   ¦   │     ║
║  │                               ¦                                         ¦   │     ║
║  │                               ¦                                         ¦   │     ║
║  │                  ┌────────────┴───────────────┐                         ¦   │     ║
║  │                * │ <<Interface>>              │ *                       ¦   │     ║
║  └──────────────────► IResourceContext           ◄─────────────────────────────┘     ║
║                     ├────────────────────────────┤                         ¦         ║
║                     │ Scopes:IEnumerable<IScope> │                         ¦         ║
║                     └────────────────────────────┘                         ¦         ║
║                                                                            ¦         ║
║                          ┌────────────────┐                                ¦         ║
║                          │ <<Interface>>  │                                ¦         ║
║                          │ IComponent     │                                ¦         ║
║                          ├────────────────┤                                ¦         ║
║                          └───────Δ────────┘                                ¦         ║
║                                  ¦                                         ¦         ║
║                                  ¦                                         ¦         ║
║                          ┌───────┴────────┐                                ¦         ║
║                          │ <<Interface>>  │                                ¦         ║
║                          │ IEndpoint      │                                ¦         ║
║                          ├────────────────┤                                ¦         ║
║                          └───────Δ────────┘                                ¦         ║
║                                  ¦                                         ¦         ║
║                                  ¦                                         ¦         ║
║                  ┌───────────────┴─────────────┐                           ¦         ║
║                  │ <<Interface>>               │                           ¦         ║
║                  │ IResource                   │                           ¦         ║
║                  ├─────────────────────────────┤                           ¦         ║
║                  │ Process(IRequest):IResponse │                           ¦         ║
║                  └───────────────Δ─────────────┘                           ¦         ║
║                                  ¦                                         ¦         ║
╚══════════════════════════════════¦═════════════════════════════════════════¦═════════╝
                                   ¦                                         ¦
╔MyPlugin══════════════════════════¦═════════════════════════════════════════¦═════════╗
║                                  ¦                                         ¦         ║
║                   ┌──────────────┴──────────────┐                   create ¦         ║
║                   │ MyResource                  ◄--------------------------┘         ║
║                   ├─────────────────────────────┤                                    ║
║                   │ Process(IRequest):IResponse │                                    ║
║                   └─────────────────────────────┘                                    ║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

### Include-Modell

The include model describes the dynamic integration of client-side resources, such as JavaScript and CSS, into the HTML header. In contrast to the `AssetManager`, which provides static content directly, the `IncludeManager` manages references to scripts and stylesheets. It ensures the correct loading order, considers operating modes (debug and release), and handles the consistent registration and deregistration of resources when plugins are loaded or unloaded. In debug mode, JavaScript and CSS files are still delivered individually via the `AssetManager` to provide transparency and traceability during development. In release mode, however, the `IncludeManager` combines the resources for each plugin and provides two additional endpoints through which the minimized and bundled JavaScript and CSS files are delivered. This means it is responsible for efficient delivery, while the technical file serving relies on the existing infrastructure. The following example shows how to implement a JavaScript and a style sheet  include:

```csharp
[Scope<ScopeGeneral>]
[Asset("myscript.js")]
[Asset("mycss.css")]
public sealed class MyInclude : IInclude
{
}
```

To better understand the metadata used in the code above, the following table presents the available attributes and their meanings:

|Attribute |Type              |Multiplicity |Optional |Description
|----------|------------------|-------------|---------|----------------
|Cache     |Bool              |1            |Yes      |Specifies whether the resource is created once and reused with each call.
|Scope     |`IScope`          |n            |Yes      |The scope of the page.
|Asset     |String            |n            |No       |The file name or path of the JavaScript or StyleSheet resource.

The following sequence diagram illustrates the lifecycle of include resources in interaction with the `IncludeManager`. It shows how JavaScript or CSS files are registered and processed.

```
┌────────┐ ┌────────┐ ┌─────────┐ ┌─────────┐
│ Web    │ │ HTTP   │ │ Package │ │ Plugin  │
│ Client │ │ Server │ │ Manager │ │ Manager │              ┌──────────┐
└────┬───┘ └────┬───┘ └────┬────┘ └────┬────┘              │ MyPlugin │
     ¦          ¦          ¦           ¦                   │          │
    ┌─┐        ┌─┐        ┌─┐ Register┌─┐                  └────┬─────┘
    │ │        │ │        │ ├────────>│ │      Create Instacnce ¦
    │ │        │ │        │ │         │ ├─────────────────────>┌─┐
    │ │        │ │        │ │         │ │<---------------------┤ │
    │ │        │ │        │ │         │ │        Initialization│ │
    │ │        │ │        │ │         │ ├─────────────────────>│ │
    │ │        │ │        │ │         │ │<---------------------┤ │
    │ │        │ │        │ │         │ │                      └─┘
    │ │        │ │        │ │         │ │     ┌─────────┐
    │ │        │ │        │ │         │ │     │ App.    │
    │ │        │ │        │ │         │ │     │ Manager │               ┌───────┐
    │ │        │ │        │ │         │ │     └────┬────┘               │ MyApp │
    │ │        │ │        │ │         │ │          ¦                    │       │
    │ │        │ │        │ │         │ │AddPlugin┌─┐                   └───┬───┘
    │ │        │ │        │ │         │ ├────────>│ │      Create Instacnce ¦
    │ │        │ │        │ │         │ │         │ ├─────────────────────>┌─┐
    │ │        │ │        │ │         │ │         │ │<---------------------┤ │
    │ │        │ │        │ │         │ │         │ │        Initialization│ │
    │ │        │ │        │ │         │ │         │ ├─────────────────────>│ │
    │ │        │ │        │ │         │ │         │ │<---------------------┤ │
    │ │        │ │        │ │         │ │<--------┤ │                      └─┘
    │ │        │ │        │ │         │ │         └─┘
    │ │        │ │        │ │         │ │
    │ │        │ │        │ │         │ │     ┌──────────┐        ┌─────────┐
    │ │        │ │        │ │         │ │     │ Endpoint │        │ Include │
    │ │        │ │        │ │         │ │     │ Manager  │        │ Manager │
    │ │        │ │        │ │         │ │     └────┬─────┘        └────┬────┘
    │ │        │ │        │ │         │ │          ¦                   ¦     ┌─────────┐
    │ │        │ │        │ │         │ │         ┌─┐                 ┌─┐    │ My      │
    │ │        │ │        │ │         │ │         │ │                 │ │    │ Include │
    │ │        │ │        │ │         │ │         │ │                 │ │    └────┬────┘
    │ │        │ │        │ │         │ │         │ │            Create Instacnce ¦
    │ │        │ │        │ │         │ │         │ │                 │ ├───────>┌─┐
    │ │        │ │        │ │         │ │         │ │Register         │ │<-------└─┘
    │ │        │ │        │ │         │ │         │ │<────────────────┤ │
    │ │        │ │        │ │         │ │         │ ├---------------->│ │
    │ │        │ │        │ │         │ │         │ │    ┌─────────┐  │ │
    │ │        │ │        │ │         │ │         │ │    │ Sitemap │  │ │
    │ │        │ │        │ │         │ │         │ │    │ Manager │  │ │
    │ │        │ │        │ │         │ │         │ │    └────┬────┘  │ │
    │ │        │ │        │ │         │ │         │ │         ¦       │ │
    │ │        │ │        │ │         │ │         │ │        ┌─┐      │ │
    │ │        │ │        │ │         │ │AddPlugin│ │        │ │      │ │
    │ │        │ │        │ │         │ ├────────>│ │        │ │      │ │
    │ │        │ │        │ │         │ │         │ │ Refresh│ │      │ │
    │ │        │ │        │ │         │ │         │ ├───────>│ │      │ │
    │ │        │ │        │ │         │ │         │ │<-------┤ │      │ │
    │ │        │ │        │ │         │ │<--------┤ │        │ │      │ │
    │ │        │ │        │ │<--------┤ │         │ │        │ │      │ │
    │ │ Request│ │        │ │         │ │         │ │        │ │      │ │
    │ ├───────>│ │        │ │         │ │     Search Resource│ │      │ │
    │ │        │ ├──────────────────────────────────────────>│ │      │ │ ┌────────────┐
    │ │        │ │<------------------------------------------┤ │      │ │ │ Include    │
    │ │        │ │        │ │         │ │  Process│ │        │ │      │ │ │ Endpoint   │
    │ │        │ ├───────────────────────────────>│ │          Process│ │ └─────┬──────┘
    │ │        │ │        │ │         │ │         │ ├────────────────>│Create Instacnce
    │ │        │ │        │ │         │ │         │ │        │ │      │ ├─────>┌─┐
    │ │        │ │        │ │         │ │         │ │        │ │      │ │<-----┤ │
    │ │        │ │        │ │         │ │         │ │        │ │      │ │      │ │
    │ │        │ │        │ │         │ │         │ │        │ │      │ Process│ │
    │ │        │ │        │ │         │ │         │ │        │ │      │ ├─────>│ │
    │ │        │ │        │ │         │ │         │ │        │ │      │ │<-----┤ │
    │ │        │ │        │ │         │ │         │ │<----------------┤ │      │ │
    │ │Response│ │<-------------------------------┤ │        │ │      │ │      │ │
    │ │<-------┤ │        │ │         │ │         │ │        │ │      │ │      │ │
    └─┘        └─┘        └─┘         └─┘         └─┘        └─┘      └─┘      └─┘
```

The following class diagram illustrates the architecture of the `IncludeManager` for managing JavaScript and CSS includes. The `IncludeManager` is integrated as a central component in the `IComponentHub` and coordinates the dynamic integration of client-side resources. In debug mode, the actual delivery of individual files is still handled by existing endpoints, such as asset endpoints or resource nodes. Under normal circumstances (release mode), the `IncludeManager` provides its own endpoints that deliver the bundled and minified JavaScript and CSS files.

```
╔WebExpress.Core═══════════════════════════════════════════════════════════════════════╗
║                                                                                      ║
║     ┌───────────────────┐                                                            ║
║     │ <<Interface>>     │                                                            ║
║     │ IComponentManager │                                                            ║
║     ├───────────────────┤                                                            ║
║     └──Δ────────────Δ───┘                                                            ║
║        ¦            ¦                                                                ║
║        ¦            └-----------------------------┐                                  ║
║        ¦                                          ¦                                  ║
║        ¦                   ┌──────────────────────┴────────────────────────┐         ║
║        ¦                 * │ <<Interface>>                                 │         ║
║        ¦             ┌─────► ISitemapManager                               │         ║
║        ¦             │     ├───────────────────────────────────────────────┤ 1       ║
║        ¦             │     │ SiteMap:IEnumerable<IEndpointContext>         ├───┐     ║
║        ¦             │     │ Refresh()                                     │   │     ║
║        ¦             │     │ SearchResource(Uri,SearchContex):SearchResult │   │     ║
║        ¦             │     └───────────────────────────────────────────────┘   │     ║
║        ¦             │                                                         │     ║
║        ¦             │   ┌──────────────────────────────────┐                  │     ║
║        ¦             │   │ <<Interface>>                    │                  │     ║
║        ¦             │   │ IComponentHub                    │                  │     ║
║        ¦             │ 1 ├──────────────────────────────────┤                  │     ║
║        ¦             └───┤ SitemapManager:ISitemapManager   │ 1                │     ║
║        ¦                 │ IncludeManager:IIncludeManager   ├───┐              │     ║
║        ¦                 │ …                                │   │              │     ║
║        ¦                 └──────────────────────────────────┘   │              │     ║
║        ¦                                       ┌────────────────┘              │     ║
║        └-----------------┐                     │                               │     ║
║                          ¦                   1 │                               │     ║
║                ┌─────────┴─────────────────────▼────────┐                      │     ║
║                │ <<Interface>>                          │                      │     ║
║                │ IIncludeManager                        ├------------------┐   │     ║
║                ├────────────────────────────────────────┤                  ¦   │     ║
║                │ AddInclude:Event                       │                  ¦   │     ║
║                │ RemoveInclude:Event                    │                  ¦   │     ║
║              1 ├────────────────────────────────────────┤                  ¦   │     ║
║  ┌─────────────┤ Includes:IEnumerable<IIncludeContext>  │                  ¦   │     ║
║  │             ├────────────────────────────────────────┤                  ¦   │     ║
║  │             │ GetIncludes(IApplicationContext,Type): │                  ¦   │     ║
║  │             │   IEnumerable<IIncludeContext>         │                  ¦   │     ║
║  │             └────────────────────────────────────────┘                  ¦   │     ║
║  │                                                                         ¦   │     ║
║  │                        ┌────────────────┐                               ¦   │     ║
║  │                        │ <<Interface>>  │                               ¦   │     ║
║  │                        │ IContext       │                               ¦   │     ║
║  │                        ├────────────────┤                               ¦   │     ║
║  │                        └───────Δ────────┘                               ¦   │     ║
║  │                                ¦                                        ¦   │     ║
║  │                                ¦                                        ¦   │     ║
║  │            ┌───────────────────┴────────────────────┐                   ¦   │     ║
║  │            │ <<Interface>>                          │                   ¦   │     ║
║  │            │ IEndpointContext                       │                   ¦   │     ║
║  │            ├────────────────────────────────────────┤                   ¦   │     ║
║  │            │ EndpointId:String                      │                   ¦   │     ║
║  │            │ PluginContext:IPluginContext           │                   ¦   │     ║
║  │            │ ApplicationContext:IApplicationContext │                   ¦   │     ║
║  │            │ Conditions:IEnumerable<ICondition>     │                   ¦   │     ║
║  │            │ Policies:IEnumerable<IIdentityPolicy>  │                   ¦   │     ║
║  │            │ Cache:Bool                             │                   ¦   │     ║
║  │            │ Route:IRoute                           │                   ¦   │     ║
║  │            └───────────────────Δ────────────────────┘                   ¦   │     ║
║  │                                ¦                                        ¦   │     ║
║  │                                ¦                                        ¦   │     ║
║  │                  ┌─────────────┴──────────────┐                         ¦   │     ║
║  │                  │ <<Interface>>              │                         ¦   │     ║
║  │                  │ IIncludeContext            │                         ¦   │     ║
║  │                  ├────────────────────────────┤                         ¦   │     ║
║  │                  │ IncludeType:Type           │                         ¦   │     ║
║  │                  │ Scopes:IEnumerable<IScope> │                         ¦   │     ║
║  │                  └────────────Δ───────────────┘                         ¦   │     ║
║  │                               ¦                                         ¦   │     ║
║  │                               ¦                                         ¦   │     ║
║  │                      ┌────────┴────────┐                                ¦   │     ║
║  │                    * │ <<Interface>>   │ *                              ¦   │     ║
║  └──────────────────────► IIncludeContext ◄────────────────────────────────────┘     ║
║                         ├─────────────────┤                                ¦         ║
║                         └─────────────────┘                                ¦         ║
║                                                                            ¦         ║
║                         ┌────────────────┐                                 ¦         ║
║                         │ <<Interface>>  │                                 ¦         ║
║                         │ IComponent     │                                 ¦         ║
║                         ├────────────────┤                                 ¦         ║
║                         └───────Δ────────┘                                 ¦         ║
║                                 ¦                                          ¦         ║
║                                 ¦                                          ¦         ║
║                         ┌───────┴────────┐                                 ¦         ║
║                         │ <<Interface>>  │                                 ¦         ║
║                         │ IEndpoint      │                                 ¦         ║
║                         ├────────────────┤                                 ¦         ║
║                         └───────Δ────────┘                                 ¦         ║
║                                 ¦                                          ¦         ║
║               ┌-----------------┴------------------┐                       ¦         ║
║               ¦                                    ¦                       ¦         ║
║               ¦                      ┌─────────────┴─────────────┐  create ¦         ║
║               ¦                      │ JavaScriptIncludeEndpoint ◄---------┤         ║
║               ¦                      ├───────────────────────────┤         ¦         ║
║               ¦                      │                           │         ¦         ║
║               ¦                      └───────────────────────────┘         ¦         ║
║               ¦                                                            ¦         ║
║     ┌─────────┴──────────┐                                          create ¦         ║
║     │ CssIncludeEndpoint ◄-------------------------------------------------┘         ║
║     ├────────────────────┤                                                           ║
║     │                    │                                                           ║
║     └────────────────────┘                                                           ║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

### Page model

Pages are a fundamental component of web applications, serving as the primary interface through which users interact with the content and functionalities provided by the application. Pages can contain a variety of elements, including text, images, videos, forms, and interactive components, all designed to enhance the user experience. When a plugin is loaded, pages marked as page are automatically identified and included in the sitemap. This process ensures that all relevant pages are easily accessible and properly indexed. Pages are virtual constructs, implemented through specific derivations such as HTML documents, dynamic web pages, or single-page applications (SPAs). The following example demonstrates the implementation of a page:

```csharp
[Title("my page")]
[Scope<ScopeGeneral>]
[Policy<AuthenticatedAccessPolicy>]
public sealed class MyPage : IPage
{
    public void Process(IRenderContext renderContext, VisualTree visualTree)
    {
    }
}
```

To clearly illustrate the metadata described in the code above, the table below outlines the available attributes and their respective details for defining pages:

|Attribute       |Type              |Multiplicity |Optional |Description
|----------------|------------------|-------------|---------|----------------
|Title           |String            |1            |Yes      |The name of the page. This can be an internationalization key.
|Description     |String            |1            |Yes      |The description of the page. This can be a key to internationalization.
|WebIcon         |IIcon             |1            |Yes      |The icon that represents the page graphically.
|Segment         |String, String    |1            |Yes      |The path segment of the resource. The first argument is the path segment. The second argument is the display string.
|SegmentInt      |Parameter, String |1            |Yes      |A variable path segment of type `Int`.
|SegmentGuid     |Parameter, String |1            |Yes      |A variable path segment of type `Guid`.
|IncludeSubPaths |Bool              |1            |Yes      |Determines whether all resources below the specified path (including segment) are processed.
|Scope           |`IScope`          |n            |Yes      |The scope of the page.
|Policy          |`IIdentityPolicy` |n            |Yes      |Grants authority to a policy.
|Condition       |`ICondition`      |n            |Yes      |Condition that must be met for the resource to be available.
|Cache           |-                 |1            |Yes      |Determines whether the resource is created once and reused each time it is called.
|Domain          |`IDomain`         |n            |Yes      |Associates the page with one or more logical domains. Domains represent functional areas, modules or workspaces and can be used for routing, filtering or contextual grouping.

Web pages are resources that are rendered in an HTML tree before delivery. The `ViualTree` class, which is available in the `RenderContext`, is responsible for the display of the page. The following UML diagram illustrates the relationships and internal structure between `Page` and the `PageManager`.

```
╔WebExpress.Core═══════════════════════════════════════════════════════════════════════╗
║                                                                                      ║
║      ┌───────────────────┐                                                           ║
║      │ <<Interface>>     │                                                           ║
║      │ IComponentManager │                                                           ║
║      ├───────────────────┤                                                           ║
║      └──Δ─────────────Δ──┘                                                           ║
║         ¦             ¦                                                              ║
║         ¦             └------------------------┐                                     ║
║         ¦                                      ¦                                     ║
║         ¦               ┌──────────────────────┴────────────────────────┐            ║
║         ¦             * │ <<Interface>>                                 │            ║
║         ¦         ┌─────► ISitemapManager                               │            ║
║         ¦         │     ├───────────────────────────────────────────────┤ 1          ║
║         ¦         │     │ SiteMap:IEnumerable<IEndpointContext>         ├───────┐    ║
║         ¦         │     ├───────────────────────────────────────────────┤       │    ║
║         ¦         │     │ Refresh()                                     │       │    ║
║         ¦         │     │ SearchResource(Uri,SearchContex):SearchResult │       │    ║
║         ¦         │     └───────────────────────────────────────────────┘       │    ║
║         ¦         │                                                             │    ║
║         ¦         └───────────────┐                                             │    ║
║         ¦                         │                                             │    ║
║         ¦                         │   ┌────────────────────────────────┐        │    ║
║         ¦                         │   │ <<Interface>>                  │        │    ║
║         ¦                         │   │ IComponentHub                  │        │    ║
║         ¦                         │ 1 ├────────────────────────────────┤        │    ║
║         ¦                         └───┤ SitemapManager:ISitemapManager │        │    ║
║         └------┐                  ┌───┤ PageManager:IPageManager       │        │    ║
║                ¦                  │ 1 │ …                              │        │    ║
║                ¦                  │   └────────────────────────────────┘        │    ║
║                ¦                  └──────────────────┐                          │    ║
║                ¦                                     │                          │    ║
║                ¦                                   1 │                          │    ║
║      ┌─────────┴─────────────────────────────────────▼──────┐                   │    ║
║      │ <<Interface>>                                        ├---------┐         │    ║
║      │ IPageManager                                         │         ¦         │    ║
║      ├──────────────────────────────────────────────────────┤         ¦         │    ║
║      │ AddPage:Event                                        │         ¦         │    ║
║      │ RemovePage:Event                                     │         ¦         │    ║
║    1 ├──────────────────────────────────────────────────────┤         ¦         │    ║
║   ┌──┤ Resources:IEnumerable<IPageContext>                  │         ¦         │    ║
║   │  ├──────────────────────────────────────────────────────┤         ¦         │    ║
║   │  │ GetResorces(IApplicationContext,PageId):IPageContext │         ¦         │    ║
║   │  └──────────────────────────────────────────────────────┘         ¦         │    ║
║   │                                                                   ¦         │    ║
║   │                        ┌────────────────┐                         ¦         │    ║
║   │                        │ <<Interface>>  │                         ¦         │    ║
║   │                        │ IContext       │                         ¦         │    ║
║   │                        ├────────────────┤                         ¦         │    ║
║   │                        └───────Δ────────┘                         ¦         │    ║
║   │                                ¦                                  ¦         │    ║
║   │                                ¦                                  ¦         │    ║
║   │            ┌───────────────────┴────────────────────┐             ¦         │    ║
║   │            │ <<Interface>>                          │             ¦         │    ║
║   │            │ IEndpointContext                       │             ¦         │    ║
║   │            ├────────────────────────────────────────┤             ¦         │    ║
║   │            │ EndpointId:String                      │             ¦         │    ║
║   │            │ PluginContext:IPluginContext           │             ¦         │    ║
║   │            │ ApplicationContext:IApplicationContext │             ¦         │    ║
║   │            │ Conditions:IEnumerable<ICondition>     │             ¦         │    ║
║   │            │ Policies:IEnumerable<IIdentityPolicy>  │             ¦         │    ║
║   │            │ Cache:Bool                             │             ¦         │    ║
║   │            │ Route:IRoute                           │             ¦         │    ║
║   │            └────────────────────Δ───────────────────┘             ¦         │    ║
║   │                                 ¦                                 ¦         │    ║
║   │                                 ¦                                 ¦         │    ║
║   │                  ┌──────────────┴─────────────┐                   ¦         │    ║
║   │                * │ <<Interface>>              │ *                 ¦         │    ║
║   └──────────────────► IPageContext               ◄─────────────────────────────┘    ║
║                      ├────────────────────────────┤                   ¦              ║
║                      │ PageIcon:IIcon             │                   ¦              ║
║                      │ PageTitle:String           │                   ¦              ║
║                      │ Scopes:IEnumerable<String> │                   ¦              ║
║                      └────────────────────────────┘                   ¦              ║
║                                                                       ¦              ║
║                            ┌────────────────┐                         ¦              ║
║                            │ <<Interface>>  │                         ¦              ║
║                            │ IComponent     │                         ¦              ║
║                            ├────────────────┤                         ¦              ║
║                            └───────Δ────────┘                         ¦              ║
║                                    ¦                                  ¦              ║
║                                    ¦                                  ¦              ║
║                            ┌───────┴────────┐                         ¦              ║
║                            │ <<Interface>>  │                         ¦              ║
║                            │ IEndpoint      │                         ¦              ║
║                            ├────────────────┤                         ¦              ║
║                            └───────Δ────────┘                         ¦              ║
║                                    ¦                                  ¦              ║
║                                    ¦   ┌─────────────┐                ¦              ║
║                  ┌─────────────────┴───│ TVisualTree │─┐              ¦              ║
║                  │ <<Interface>>       └─────────────┘ │              ¦              ║
║                  │ IPage                               │              ¦              ║
║                  ├─────────────────────────────────────┤              ¦              ║
║                  │ Process(IRenderContext,TVisualTree) │              ¦              ║
║                  └────────────────Δ────────────────────┘              ¦              ║
║                                   ¦                                   ¦              ║
╚═══════════════════════════════════¦═══════════════════════════════════¦══════════════╝
                                    ¦                                   ¦     
╔MyPlugin═══════════════════════════¦═══════════════════════════════════¦══════════════╗
║                                   ¦                                   ¦              ║
║               ┌───────────────────┴─────────────────┐          create ¦              ║
║               │ MyPage                              ◄-----------------┘              ║
║               ├─────────────────────────────────────┤                                ║
║               │ Process(IRenderContext,TVisualTree) │                                ║
║               └─────────────────────────────────────┘                                ║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

Rendering a page in **WebExpress** involves converting it into an HTML tree, which is then sent to the requesting client for viewing. 

 - `IRenderContext`: Provides all necessary information and methods for the rendering process, including details about the current request. Manages the `IVisualTree`, ensuring it is properly constructed and utilized during rendering.
 - `IVisualTree`: Represents the HTML tree constructed during the rendering process. It can implement various derivatives of the VisualTree class to offer different templates. A template defines the structure and appearance of a page.

This ensures each page is correctly rendered and sent to the client. To better understand the composition and functionality of the `RenderContext`, refer to the UML diagram below for a comprehensive visualization:

```
╔WebExpress.Core═══════════════════════════════════════════════════════════════════════╗
║                                                                                      ║
║             ┌──────────────────────────┐                                             ║
║             │ <<Interface>>            │                                             ║
║             │ IRenderContext           │                                             ║
║             ├──────────────────────────┤                                             ║
║             │ Endpoint:IEndpoint       │                                             ║
║             │ PageContext:IPageContext │                                             ║
║             │ Request:IRequest         │          ┌──────────────────────────────┐   ║
║             └─────────────Δ────────────┘          │ <<Interface>>                │   ║
║                           ¦                       │ IVisualTreeContext           │   ║
║                           ¦                       ├──────────────────────────────┤   ║
║                           ¦                       │ Request:IRequest             │   ║
║ ┌─────────────────────────┴────────────────────┐  │ Uri:IUri                     │   ║
║ │ RenderContext                                │  │ RenderContext:IRenderContext │   ║
║ ├──────────────────────────────────────────────┤  ├──────────────────────────────┤   ║
║ │ Endpoint:IEndpoint                           │  └──────────────────────────────┘   ║
║ │ PageContext:IPageContext                     │                                     ║
║ │ Request:IRequest                             │                                     ║
║ ├──────────────────────────────────────────────┤                                     ║
║ │ RenderContext(Endpoint,PageContext,IRequest) │                                     ║
║ └─────────────────────────Δ────────────────────┘                                     ║
║                           │                                                          ║
║                           │             ┌──────────────────────────────────────┐     ║
║                           │             │ <<Interface>>                        │     ║
║                           │             │ IVisualTree                          │     ║
║                           │             ├──────────────────────────────────────┤     ║
║                           │             ├──────────────────────────────────────┤     ║
║                           │             │ Render(IVisualTreeContext):IHtmlNode │     ║
║                           │             └───────────────────Δ──────────────────┘     ║
║                           │                                 ¦                        ║
╚═══════════════════════════│═════════════════════════════════¦════════════════════════╝
                            │                                 ¦
╔WebExpress.WebUI═══════════│═════════════════════════════════¦════════════════════════╗
║                           │                                 ¦                        ║
║                           │             ┌───────────────────┴──────────────────┐     ║
║                           │             │ <<Interface>>                        │     ║
║                           │             │ IVisualTreeControl                   │     ║
║                           │             ├──────────────────────────────────────┤     ║
║                           │             │ Title:string                         │     ║
║                           │             │ Favicons:List<Favicon>               │     ║
║                           │             │ Styles:List<string>                  │     ║
║                           │             │ HeaderScriptLinks:List<string>       │     ║
║                           │             │ …                                    │     ║
║                           │             ├──────────────────────────────────────┤     ║
║                           │             │ Render(IVisualTreeContext):IHtmlNode │     ║
║                           │             └───────────────────Δ──────────────────┘     ║
║                           │                                 ¦                        ║
╚═══════════════════════════│═════════════════════════════════¦════════════════════════╝
                            │                                 ¦
╔WebExpress.WebApp══════════│═════════════════════════════════¦════════════════════════╗
║                           │                                 ¦                        ║
║                           │             ┌───────────────────┴──────────────────┐     ║
║                           │             │ <<Interface>>                        │     ║
║                           │             │ IVisualTreeWebApp                    │     ║
║                           │             ├──────────────────────────────────────┤     ║
║                           │             │ Theme:IThemeWebApp                   │     ║
║                           │             │ …                                    │     ║
║                           │             ├──────────────────────────────────────┤     ║
║                           │             │ Render(IVisualTreeContext):IHtmlNode │     ║
║                           │             └───────────────────Δ──────────────────┘     ║
║                           │                                 ¦                        ║
╚═══════════════════════════│═════════════════════════════════¦════════════════════════╝ 
                            │                                 ¦
╔MyPlugin═══════════════════│═════════════════════════════════¦════════════════════════╗
║                           │                                 ¦                        ║
║  ┌────────────────────────┴───────────────────────┐         ¦                        ║
║  │ MyRenderContext                                │         ¦                        ║
║  ├────────────────────────────────────────────────┤         ¦                        ║
║  ├────────────────────────────────────────────────┤         ¦                        ║
║  │ MyRenderContext(Endpoint,PageContext,IRequest) │         ¦                        ║
║  └───────────────────────┬────────────────────────┘         ¦                        ║
║                          ¦                                  ¦                        ║
║                          ¦                                  ¦                        ║
║                          ¦     create   ┌───────────────────┴──────────────────┐     ║
║                          └--------------► MyVisualTree                         │     ║
║                                         ├──────────────────────────────────────┤     ║
║                                         │ Theme:IThemeWebApp                   │     ║
║                                         │ Title:string                         │     ║
║                                         │ Favicons:List<Favicon>               │     ║
║                                         │ Styles:List<string>                  │     ║
║                                         │ HeaderScriptLinks:List<string>       │     ║
║                                         │ …                                    │     ║
║                                         ├──────────────────────────────────────┤     ║
║                                         │ Render(IVisualTreeContext):IHtmlNode │     ║
║                                         └──────────────────────────────────────┘     ║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

**WebExpress** supports the creation of `IVisualTree` instances through dependency injection. This approach allows dependencies to be automatically provided when an instance of a component is created. The following constructor parameters can be injected:

| Constructor Parameter | Description 
|-----------------------|-------------
| `IComponentHub`       | The central hub for managing all components. 
| `I<*>Manager`         | A specific manager from `IComponentHub` (e.g., `IResourceManager`).
| `IComponentId`        | The unique identifier of the component. 
| `IHttpServerContext`  | The context of the HTTP server.

By leveraging dependency injection, all required dependencies are automatically supplied when the component instance is created.

### Setting page model

Setting page templates are utilized to manage and configure web applications. Each settings page is required to implement the `IPageSetting` interface. The following UML diagram illustrates the relationships and structures:

```
╔WebExpress.Core═══════════════════════════════════════════════════════════════════════╗
║                                                                                      ║
║   ┌────────────────────────────────────────┐                                         ║
║   │ <<Interface>>                          │                                         ║
║   │ IComponentHub                          │                                         ║
║   ├────────────────────────────────────────┤ 1                                       ║
║   │ SettingPageManager:ISettingPageManager ├────────┐                                ║
║   │ …                                      │        │                                ║
║   └────────────────────────────────────────┘        │                                ║
║                                                     │                                ║
║   ┌────────────────────────────────────┐            │                                ║
║   │ <<Interface>>                      │            │                                ║
║   │ IComponentManager                  │            │                                ║
║   ├────────────────────────────────────┤            │                                ║
║   └──────────────────Δ─────────────────┘            │                                ║
║                      ¦                              │                                ║
║                 ┌----┘                              │                                ║
║                 ¦                                 1 │                                ║
║        ┌────────┴───────────────────────────────────▼────────────┐                   ║
║        │ <<Interface>>                                           │                   ║
║        │ ISettingPageManager                                     ├--------------┐    ║
║        ├─────────────────────────────────────────────────────────┤              ¦    ║
║        │ AddSettingPage:Event                                    │              ¦    ║
║        │ RemoveSettingPage:Event                                 │              ¦    ║
║        │ AddSettingCategory:Event                                │              ¦    ║
║        │ RemoveSettingCategory:Event                             │              ¦    ║
║        │ AddSettingGroup:Event                                   │              ¦    ║
║        │ RemoveSettingGroup:Event                                │              ¦    ║
║        ├─────────────────────────────────────────────────────────┤ 1            ¦    ║
║      1 │ SettingCategories:IEnumerable<ISettingCategoryContext>  ├───────┐      ¦    ║
║   ┌────┤ SettingGroups:IEnumerable<ISettingGroupContext>         │ 1     │      ¦    ║
║   │    │ SettingPages:IEnumerable<ISettingPageContext>           ├──┐    │      ¦    ║
║   │    ├─────────────────────────────────────────────────────────┤  │    │      ¦    ║
║   │    │ GetSettingPages(Type):                                  │  │    │      ¦    ║
║   │    │  IEnumerable<ISettingPageContext>                       │  │    │      ¦    ║
║   │    │ GetSettingPages(Type, IApplicationContext):             │  │    │      ¦    ║
║   │    │  IEnumerable<ISettingPageContext>                       │  │    │      ¦    ║
║   │    │ GetSettingPages(IApplicationContext,category):          │  │    │      ¦    ║
║   │    │  IEnumerable<ISettingPageContext>                       │  │    │      ¦    ║
║   │    │ GetSettingPages(IApplicationContext,                    │  │    │      ¦    ║
║   │    │  ISettingCategoryContext,                               │  │    │      ¦    ║
║   │    │  ISettingGroupContext):IEnumerable<ISettingPageContext> │  │    │      ¦    ║
║   │    │ GetFirstSettingPage(IApplicationContext,                │  │    │      ¦    ║
║   │    │  ISettingCategoryContext):ISettingPageContext           │  │    │      ¦    ║
║   │    │ GetCategories(IApplicationContext):                     │  │    │      ¦    ║
║   │    │  IEnumerable<ISettingCategoryContext>                   │  │    │      ¦    ║
║   │    │ GetGroups(IApplicationContext,ISettingCategoryContext): │  │    │      ¦    ║
║   │    │  IEnumerable<ISettingGroupContext>                      │  │    │      ¦    ║
║   │    └─────────────────────────────────────────────────────────┘  │    │      ¦    ║
║   │                                                                 │    │      ¦    ║
║   │                   ┌────────────────┐                            │    │      ¦    ║
║   │                   │ <<Interface>>  │                            │    │      ¦    ║
║   │                   │ IContext       │                            │    │      ¦    ║
║   │                   ├────────────────┤                            │    │      ¦    ║
║   │                   └───────Δ────────┘                            │    │      ¦    ║
║   │                           ¦                                     │    │      ¦    ║
║   │                           ¦                                     │    │      ¦    ║
║   │       ┌───────────────────┴────────────────────┐                │    │      ¦    ║
║   │       │ <<Interface>>                          │                │    │      ¦    ║
║   │       │ IEndpointContext                       │                │    │      ¦    ║
║   │       ├────────────────────────────────────────┤                │    │      ¦    ║
║   │       │ EndpointId:String                      │                │    │      ¦    ║
║   │       │ PluginContext:IPluginContext           │                │    │      ¦    ║
║   │       │ ApplicationContext:IApplicationContext │                │    │      ¦    ║
║   │       │ Conditions:IEnumerable<ICondition>     │                │    │      ¦    ║
║   │       │ Policies:IEnumerable<IIdentityPolicy>  │                │    │      ¦    ║
║   │       │ Cache:Bool                             │                │    │      ¦    ║
║   │       │ Route:IRoute                           │                │    │      ¦    ║
║   │       └───────────────────Δ────────────────────┘                │    │      ¦    ║
║   │                           ¦     ┌───────────────────────────────┘  * │      ¦    ║
║   │                           ¦     │               ┌────────────────────▼────┐ ¦    ║
║   │                       ┌---┘     │             1 │ <<Interface>>           │ ¦    ║
║   │                       ¦         │          ┌────► ISettingCategoryContext │ ¦    ║
║   │                       ¦       * │          │    ├─────────────────────────┤ ¦    ║
║   │      ┌────────────────┴─────────▼───────┐  │    │ Icon:PropertyIcon       │ ¦    ║
║   │      │ <<Interface>>                    │  │    │ Name:String             │ ¦    ║
║   │      │ ISettingPageContext              │  │    │ Description:String      │ ¦    ║
║   │      ├──────────────────────────────────┤  │    │ Section:SettingSection  │ ¦    ║
║   │      │ Hide:Bool                        │  │    └─────────────────────────┘ ¦    ║
║   │      │ PageIcon:IIcon                   │  │                                ¦    ║
║   │      │ PageTitle:String                 │ 1│                                ¦    ║
║   │      │ Category:ISettingCategoryContext ├──┘       ┌─────────────────┐      ¦    ║
║   │   ┌──┤ Group:ISettingGroupContext       │ 1      1 │ <<Enumeration>> │      ¦    ║
║   │   │  │ Section:SettingSection           ├──────────► SettingSection  │      ¦    ║
║   │   │  └──────────────────────────────────┘          ├─────────────────┤      ¦    ║
║   │   │                                                │ Preferences     │      ¦    ║
║ * │ 1 │                                                │ Primary         │      ¦    ║
║ ┌─▼───▼─────────────────────┐    ┌───────────────┐     │ Secondary       │      ¦    ║
║ │ <<Interface>>             │    │ <<Interface>> │     └─────────────────┘      ¦    ║
║ │ ISettingGroupContext      │    │ IComponent    │                              ¦    ║
║ ├───────────────────────────┤    ├───────────────┤                              ¦    ║
║ │ Icon:PropertyIcon         │    └───────Δ───────┘                              ¦    ║
║ │ Name:String               │            ¦                                      ¦    ║
║ │ Description:String        │            ¦                                      ¦    ║
║ │ Category:                 │    ┌───────┴───────┐                              ¦    ║
║ │   ISettingCategoryContext │    │ <<Interface>> │                              ¦    ║
║ │ Section:SettingSection    │    │ IEndpoint     │                              ¦    ║
║ └───────────────────────────┘    ├───────────────┤                              ¦    ║
║                                  └───────Δ───────┘                              ¦    ║
║                                          ¦                                      ¦    ║
║                                          ¦   ┌─────────────┐                    ¦    ║
║                        ┌─────────────────┴───│ TVisualTree │─┐                  ¦    ║
║                        │ <<Interface>>       └─────────────┘ │                  ¦    ║
║                        │ ISettingPage                        │                  ¦    ║
║                        ├─────────────────────────────────────┤                  ¦    ║
║                        │ Process(IRenderContext,TVisualTree) │                  ¦    ║
║                        └─────────────────Δ───────────────────┘                  ¦    ║
║                                          ¦                                      ¦    ║
╚══════════════════════════════════════════¦══════════════════════════════════════¦════╝
                                           ¦                                      ¦     
╔MyPlugin══════════════════════════════════¦══════════════════════════════════════¦════╗
║                                          ¦                                      ¦    ║
║                        ┌─────────────────┴───────────────────┐           create ¦    ║
║                        │ MySettingPage                       ◄------------------┘    ║
║                        ├─────────────────────────────────────┤                       ║
║                        │ Process(IRenderContext,TVisualTree) │                       ║
║                        └─────────────────────────────────────┘                       ║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

Setting categories serve the purpose of organizing settings at the highest level and help users navigate large settings interfaces efficiently. The example below demonstrates how a category can be defined in code:

```csharp
[WebIcon<IconInfoCircle>]
[Name("SettingCategory A")]
[Description("Description of category a.")]
[SettingSection(SettingSection.Primary)]
public sealed class MySettingCategory : ISettingCategory
{
}
```

The following attributes are available for a settings category, which organizes settings at the highest level:

|Attribute       |Type             |Multiplicity |Optional |Description
|----------------|-----------------|-------------|---------|--------------
|WebIcon         |IIcon            |1            |Yes      |An icon displayed alongside the category link.
|Name            |String           |1            |Yes      |Human-readable name or internationalization key for the category.
|Description     |String           |1            |Yes      |Human-readable description or internationalization key for the category.
|SettingSection  |SettingSection   |1            |Yes      |Specifies the section for displaying the entry.

Setting groups provide a way to structure settings within categories, offering a more granular organization. Below is an example of how a group can be defined in code:

```csharp
[WebIcon<IconInfoCircle>]
[Name("SettingGroup A")]
[Description("Description of group a.")]
[SettingCategory<MySettingCategory>]
[SettingSection(SettingSection.Primary)]
public sealed class MySettingGroup : ISettingGroup
{
}
```

The following attributes are available for a settings group, which structures settings within a category:

|Attribute       |Type             |Multiplicity |Optional |Description
|----------------|-----------------|-------------|---------|--------------
|WebIcon         |IIcon            |1            |Yes      |An icon displayed alongside the group link.
|Name            |String           |1            |Yes      |Human-readable name or internationalization key for the group.
|Description     |String           |1            |Yes      |Human-readable description or internationalization key for the group.
|SettingCategory |ISettingCategory |1            |Yes      |Each setting page can have a setting category. If no `SettingCategory` is specified, the settings page will not be associated with a category.
|SettingSection  |SettingSection   |1            |Yes      |Specifies the section for displaying the entry.

Setting pages define the individual interfaces where the settings are presented. These pages make use of categories and groups to provide an organized experience. Below is an example of how a settings page can be defined in code:

```csharp
[WebIcon<IconInfoCircle>]
[SettingGroup<MySettingGroup>]
[SettingSection(SettingSection.Primary)]
public sealed class MySettingPage : ISettingPage<VisualTree>
{
    public void Process(IRenderContext renderContext, VisualTree visualTree)
    {
    }
}
```

To provide clarity about the metadata specified in the code above, the following table presents the available attributes and their corresponding details for defining a settings page:

|Attribute      |Type             |Multiplicity |Optional |Description
|---------------|-----------------|-------------|---------|--------------
|Title          |String           |1            |Yes      |The title of the setting page. This can be a key to internationalization.
|Description    |String           |1            |Yes      |The description of the setting page. This can be a key to internationalization.
|WebIcon        |IIcon            |1            |Yes      |An icon to be displayed along with the link to the settings page.
|SettingGroup   |ISettingGroup    |1            |Yes      |Each setting page can have a setting group. If no `SettingGroup` is specified, the settings page will not be associated with a group.
|SettingSection |SettingSection   |1            |Yes      |Determines the section by displaying the entry in the setting sidebar.
|SettingHide    |-                |1            |Yes      |Not displaying the page in the settings
|Scope          |`IScope`         |n            |Yes      |The scope of the page.
|Domain         |`IDomain`        |n            |Yes      |Associates the page with one or more logical domains. Domains represent functional areas, modules or workspaces and can be used for routing, filtering or contextual grouping.
                                          
### RestAPI model

A REST API (Representational State Transfer Application Programming Interface) is an interface that allows resources to be accessed and manipulated via the HTTP protocol. REST APIs are designed to be simple and scalable by following the principles of REST, such as stateless communication, use of HTTP methods, and resource orientation. By using REST APIs, applications can exchange and integrate data between different systems, facilitating the development of distributed and modular applications.

The integration of REST APIs into **WebExpress** offers several advantages that make the application more dynamic and reactive:

- **Flexibility and scalability**: REST APIs make it possible to develop and scale different frontend and backend components independently of each other. This means that changes can be made to one component without affecting the others, making it easier to maintain and evolve the application.
- **Real-time data refresh**: By using REST APIs, data can be exchanged in real time between the client and the server. This allows **WebExpress** to respond instantly to user actions and dynamically update the interface without having to reload the entire page.
- **Interoperability**: REST APIs are platform-independent and can be used by various programming languages and frameworks. This makes it easier to integrate **WebExpress** with other systems and services, which expands the functionality and reach of the application.
- **Reusability**: The modular and standardized interfaces of REST APIs make it possible to reuse functions once developed in different parts of the application or even in other projects. This saves development time and resources.
- **Improved user experience**: By leveraging REST APIs, **WebExpress** can provide a more responsive and interactive user interface. Users can seamlessly navigate through the application and receive instant feedback on their actions, increasing user satisfaction and engagement.

REST APIs supply data to various components, whether the user interface, automation scripts or external web applications. They form the central communication layer between frontend, backend logic and other systems, ensuring a consistent and flexible data flow in modern web applications.

Within **WebExpress**, REST endpoints are abstracted through the `IRestApi` interface. Each REST resource inherits from `IEndpoint`, integrating it into the framework’s routing and security model. A REST API can represent any form of HTTP-based, stateless data exchange between client and server—ranging from search queries and specialized service resources to custom operations and complex integration scenarios.

One of the main uses of REST APIs is to implement CRUD (Create, Retrieve, Update, Delete) operations. These basic operations allow data to be created, retrieved, updated, and deleted, and form the backbone of many web applications. In **WebExpress**, CRUD operations are supported by a framework that provides HTML and REST API templates to enable a generic view and processing.

```
    ┌─────────┐         ┌─────────┐         ┌─────────┐         ┌─────────┐
    │ Web     │         │ HTTP    │         │ Resource│         │ REST-   │
    │ Client  │         │ Server  │         │ Rest    │         │ API     │
    └────┬────┘         └────┬────┘         └────┬────┘         └────┬────┘
         ¦                   ¦                   ¦                   ¦
        ┌┴┐     POST Request┌┴┐                 ┌┴┐                 ┌┴┐
  create│ ├────────────────>│ │          Process│ │                 │ │
        │ │                 │ ├────────────────>│ │           Create│ │
        │ │                 │ │                 │ ├────────────────>│ │
        │ │                 │ │                 │ │                 │ │
        │ │                 │ │                 │ │                 │ │
        │ │                 │ │                 │ │<----------------│ │
        │ │Response (201)   │ │<----------------│ │                 │ │
        │ │<----------------│ │                 │ │                 │ │
        └┬┘                 └┬┘                 └┬┘                 └┬┘
         ¦                   ¦                   ¦                   ¦ 
        ┌┴┐      GET Request┌┴┐                 ┌┴┐                 ┌┴┐
retrieve│ ├────────────────>│ │          Process│ │                 │ │
        │ │                 │ ├────────────────>│ │         Retrieve│ │
        │ │                 │ │                 │ ├────────────────>│ │
        │ │                 │ │                 │ │                 │ │
        │ │                 │ │                 │ │                 │ │
        │ │                 │ │                 │ │<----------------│ │
        │ │Response (200)   │ │<----------------│ │                 │ │
        │ │<----------------│ │                 │ │                 │ │
        └┬┘                 └┬┘                 └┬┘                 └┬┘
         ¦                   ¦                   ¦                   ¦ 
        ┌┴┐    PATCH Request┌┴┐                 ┌┴┐                 ┌┴┐
  update│ ├────────────────>│ │          Process│ │                 │ │
        │ │                 │ ├────────────────>│ │           Update│ │
        │ │                 │ │                 │ ├────────────────>│ │
        │ │                 │ │                 │ │                 │ │
        │ │                 │ │                 │ │                 │ │
        │ │                 │ │                 │ │<----------------│ │
        │ │Response (200)   │ │<----------------│ │                 │ │
        │ │<----------------│ │                 │ │                 │ │
        └┬┘                 └┬┘                 └┬┘                 └┬┘
         ¦                   ¦                   ¦                   ¦ 
        ┌┴┐   DELETE Request┌┴┐                 ┌┴┐                 ┌┴┐
  delete│ ├────────────────>│ │          Process│ │                 │ │
        │ │                 │ ├────────────────>│ │           Delete│ │
        │ │                 │ │                 │ ├────────────────>│ │
        │ │                 │ │                 │ │                 │ │
        │ │                 │ │                 │ │                 │ │
        │ │                 │ │                 │ │<----------------│ │
        │ │Response (200)   │ │<----------------│ │                 │ │
        │ │<----------------│ │                 │ │                 │ │
        └─┘                 └─┘                 └─┘                 └─┘           
```

CRUD operations are mapped by the REST API by the following operations (RFC 7231 and RFC 5789):

|CRUD operation   |REST API  |Description
|-----------------|----------|-----------------
|Create           |POST      |create record
|Retrieve (Read)  |GET       |read record(s)
|Update           |PUT/PATCH |update record
|Delete (Destroy) |DELETE    |delete record

The following code selection contains an example class called `MyRestApi` that implements a REST API in **WebExpress**:

```csharp
[Version(1)]
[Policy<SystemAccessPolicy>]
public sealed class MyRestApi : IRestApiCrud
{
    [Method(RequestMethod.POST)]
    public IResponse Create(IRequest request) {…}
    
    [Method(RequestMethod.GET)]
    public IResponse Retrieve(IRequest request) {…}
    
    [Method(RequestMethod.PUT)]
    [Method(RequestMethod.PATCH)]
    public IResponse Update(IRequest request) {…}
    
    [Method(RequestMethod.DELETE)]
    public IResponse Delete(IRequest request) {…}
}
```

This class uses various attributes to define the CRUD operations. Below are the descriptions of the attributes used in the rest api classes:

|Attribute       |Type              |Multiplicity |Optional |Description
|----------------|------------------|-------------|---------|----------------
|SegmentInt      |Parameter, String |1            |Yes      |A variable path segment of type `Int`.
|SegmentGuid     |Parameter, String |1            |Yes      |A variable path segment of type `Guid`.
|IncludeSubPaths |Bool              |1            |Yes      |Determines whether all resources below the specified path (including segment) are processed.
|Policy          |`IIdentityPolicy` |n            |Yes      |Grants authority to a policy.
|Condition       |`ICondition`      |n            |Yes      |Condition that must be met for the resource to be available.
|Cache           |-                 |1            |Yes      |Determines whether the resource is created once and reused each time it is called.

The following diagram outlines how the class structure and interactions for the REST API are defined:

```
╔WebExpress.Core═══════════════════════════════════════════════════════════════════════╗
║                                                                                      ║
║   ┌────────────────────────────────────┐                                             ║
║   │ <<Interface>>                      │                                             ║
║   │ IComponentManager                  │                                             ║
║   ├────────────────────────────────────┤                                             ║
║   └─────Δ───────────────────────Δ──────┘                                             ║
║         ¦                       ¦                                                    ║
║         ¦                       └-----------------┐                                  ║
║         ¦                                         ¦                                  ║
║         ¦                * ┌──────────────────────┴────────────────────────┐         ║
║         ¦                  │ <<Interface>>                                 │         ║
║         ¦            ┌─────► ISitemapManager                               │         ║
║         ¦            │     ├───────────────────────────────────────────────┤ 1       ║
║         ¦            │     │ SiteMap:IEnumerable<IEndpointContext>         ├───┐     ║
║         ¦            │     ├───────────────────────────────────────────────┤   │     ║
║         ¦            │     │ Refresh()                                     │   │     ║
║         ¦            │     │ SearchResource(Uri,SearchContex):SearchResult │   │     ║
║         ¦            │     └───────────────────────────────────────────────┘   │     ║
║         ¦            │                                                         │     ║
║         ¦            └───────────────┐                                         │     ║
║         ¦                            │                                         │     ║
║         ¦                            │   ┌────────────────────────────────┐    │     ║
║         ¦                            │   │ <<Interface>>                  │    │     ║
║         ¦                            │   │ IComponentHub                  │    │     ║
║         ¦                            │ 1 ├────────────────────────────────┤    │     ║
║         ¦                            └───┤ SitemapManager:ISitemapManager │    │     ║
║         └--------------┐             ┌───┤ RestApiManager:IRestApiManager │    │     ║
║                        ¦             │ 1 │ …                              │    │     ║
║                        ¦             │   └────────────────────────────────┘    │     ║
║                        ¦             └────┐                                    │     ║
║                        ¦                  │                                    │     ║
║                        ¦                1 │                                    │     ║
║              ┌─────────┴──────────────────▼────────────────┐                   │     ║
║              │ <<Interface>>                               │                   │     ║
║              │ IRestApiManager                             ├--------------┐    │     ║
║              ├─────────────────────────────────────────────┤              ¦    │     ║
║              │ AddRestApi:Event                            │              ¦    │     ║
║              │ RemoveRestApi:Event                         │              ¦    │     ║
║            1 ├─────────────────────────────────────────────┤              ¦    │     ║
║   ┌──────────┤ RestApis:IEnumerable<IRestApiContext>       │              ¦    │     ║
║   │          ├─────────────────────────────────────────────┤              ¦    │     ║
║   │          │ GetResorces(IApplicationContext,RestApiId): │              ¦    │     ║
║   │          │   :IResourceContext                         │              ¦    │     ║
║   │          └─────────────────────────────────────────────┘              ¦    │     ║
║   │                                                                       ¦    │     ║
║   │                        ┌────────────────┐                             ¦    │     ║
║   │                        │ <<Interface>>  │                             ¦    │     ║
║   │                        │ IContext       │                             ¦    │     ║
║   │                        ├────────────────┤                             ¦    │     ║
║   │                        └───────Δ────────┘                             ¦    │     ║
║   │                                ¦                                      ¦    │     ║
║   │                                ¦                                      ¦    │     ║
║   │            ┌───────────────────┴────────────────────┐                 ¦    │     ║
║   │            │ <<Interface>>                          │                 ¦    │     ║
║   │            │ IEndpointContext                       │                 ¦    │     ║
║   │            ├────────────────────────────────────────┤                 ¦    │     ║
║   │            │ EndpointId:String                      │                 ¦    │     ║
║   │            │ PluginContext:IPluginContext           │                 ¦    │     ║
║   │            │ ApplicationContext:IApplicationContext │                 ¦    │     ║
║   │            │ Conditions:IEnumerable<ICondition>     │                 ¦    │     ║
║   │            │ Policies:IEnumerable<IIdentityPolicy>  │                 ¦    │     ║
║   │            │ Cache:Bool                             │                 ¦    │     ║
║   │            │ Route:IRoute                           │                 ¦    │     ║
║   │            └───────────────────Δ────────────────────┘                 ¦    │     ║
║   │                                ¦                                      ¦    │     ║
║   │                                ¦                                      ¦    │     ║
║   │             * ┌────────────────┴───────────────────┐                  ¦    │     ║
║   └───────────────► <<Interface>>                      │ *                ¦    │     ║
║                   │ IRestApiContext                    ◄───────────────────────┘     ║
║                   ├────────────────────────────────────┤                  ¦          ║
║                   │ Version:String                     │ 1                ¦          ║
║                   │ Methode:CrudMethode                ├─────┐            ¦          ║
║                   │ Version:UInt                       │     │            ¦          ║
║                   └────────────────────────────────────┘     │            ¦          ║
║                                                              │            ¦          ║
║                            ┌───────────────┐                 │            ¦          ║
║                            │ <<Interface>> │               1 │            ¦          ║
║                            │ IComponent    │        ┌────────▼─────────┐  ¦          ║
║                            ├───────────────┤        │ <<Enumeration>>  │  ¦          ║
║                            └───────Δ───────┘        │ CrudMethod       │  ¦          ║
║                                    ¦                ├──────────────────┤  ¦          ║
║                                    ¦                │ POST             │  ¦          ║
║                            ┌───────┴───────┐        │ GET              │  ¦          ║
║                            │ <<Interface>> │        │ PATCH            │  ¦          ║
║                            │ IEndpoint     │        │ PUT              │  ¦          ║
║                            ├───────────────┤        │ DELETE           │  ¦          ║
║                            └───────Δ───────┘        └──────────────────┘  ¦          ║
║                                    ¦                                      ¦          ║
║                                    ¦                                      ¦          ║
║                            ┌───────┴───────┐                              ¦          ║
║                            │ <<Interface>> │                              ¦          ║
║                            │ IRestApi      │                              ¦          ║
║                            ├───────────────┤                              ¦          ║
║                            └───────Δ───────┘                              ¦          ║
║                                    ¦                                      ¦          ║
║                                    ¦                                      ¦          ║
║                                    ¦┌────────────┐                        ¦          ║
║                    ┌───────────────┴┤ TIndexItem ├┐                       ¦          ║
║                    │ <<Interface>>  └────────────┘│                       ¦          ║
║                    │ IRestApiCrud                 │                       ¦          ║
║                    ├──────────────────────────────┤                       ¦          ║
║                    │ Create(IRequest):IResponse   │                       ¦          ║
║                    │ Retrieve(IRequest):IResponse │                       ¦          ║
║                    │ Update(IRequest):IResponse   │                       ¦          ║
║                    │ Delete(IRequest):IResponse   │                       ¦          ║
║                    └───────────────Δ──────────────┘                       ¦          ║
║                                    ¦                                      ¦          ║
╚════════════════════════════════════¦══════════════════════════════════════¦══════════╝
                                     ¦                                      ¦
╔MyPlugin════════════════════════════¦══════════════════════════════════════¦══════════╗
║                                    ¦                                      ¦          ║
║                    ┌───────────────┴──────────────┐                create ¦          ║
║                    │ MyRestApi                    ◄-----------------------┘          ║
║                    ├──────────────────────────────┤                                  ║
║                    │ Create(IRequest):IResponse   │                                  ║
║                    │ Retrieve(IRequest):IResponse │                                  ║
║                    │ Update(IRequest):IResponse   │                                  ║
║                    │ Delete(IRequest):IResponse   │                                  ║
║                    └──────────────────────────────┘                                  ║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

In **WebExpress**, the CRUD REST APIs work closely with the `RestForm` control from `WebExpress.WebApp` to provide a fully data‑driven user interface. UI display controls (such as the table control) serve as examples of how records can be presented in a structured format, retrieved through the Table REST API’s `Retrieve` method. They send GET requests to the assigned REST resource and support features such as pagination, sorting, and filtering. Whenever the underlying data changes through POST, PATCH, or DELETE operations, the table can automatically refresh to reflect the current state. 

The `RestForm` component provides a generic form that is directly connected to the CRUD REST API. It automatically detects whether the form is in creation or editing mode and sends POST, PUT, or PATCH requests accordingly. Optionally, a delete function can be integrated, which triggers a DELETE request. The fields of the `RestForm` are dynamically bound to the properties of the REST model, eliminating the need for manual mapping.

By combining UI display controls and `RestForm`, a complete CRUD workflow emerges. These display controls present all existing records, while the `RestForm` enables their creation, modification, and deletion. The REST API serves as the central interface between the user interface and the data model. Changes to the dataset become visible immediately without requiring a page reload. This tight integration between the REST API and the UI components makes **WebExpress** particularly reactive, modular, and easy to maintain. Developers can create complex, interactive applications with minimal effort, based on standardized HTTP operations while still offering a high level of usability.


```
┌─────────┐                ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│ Web     │                │ HTTP    │     │ Page    │     │ Form    │     │ Table   │
│ Client  │                │ Server  │     │         │     │ Page    │     │ API     │
└────┬────┘                └────┬────┘     └────┬────┘     └────┬────┘     └────┬────┘
     ¦                          ¦               ¦               ¦               ¦
    ┌┴┐                        ┌┴┐             ┌┴┐             ┌┴┐             ┌┴┐
    │ │             GET Request│ │             │ │             │ │             │ │
    │ ├───────────────────────>│ │      Process│ │             │ │             │ │
    │ │                        │ ├────────────>│ │             │ │             │ │
    │ │                        │ │HTML         │ │             │ │             │ │
    │ │Response (200)          │ │<------------│ │             │ │             │ │
    │ │<-----------------------│ │             │ │             │ │             │ │
    │ │                        │ │             │ │             │ │             │ │
    │ │  ┌─────────┐           │ │             │ │             │ │             │ │
    │ │  │ Table   │           │ │             │ │             │ │             │ │
    │ │  │ Control │           │ │             │ │             │ │             │ │
    │ │  └────┬────┘           │ │             │ │             │ │             │ │
    │ │Create ¦                │ │             │ │             │ │             │ │
    │ ├─────>┌┴┐       Retrieve│ │             │ │             │ │             │ │
    │ │      │ ├──────────────>│ │             │ │             │ │     Retrieve│ │
    │ │      │ │               │ ├────────────────────────────────────────────>│ │
    │ │      │ │               │ │JSON         │ │             │ │             │ │
    │ │      │ │Response (200) │ │<--------------------------------------------│ │
    │ │  Edit│ │<--------------│ │             │ │             │ │             │ │
    │ │   ┌──┤ │               │ │             │ │             │ │             └─┘
    │ │   └─>│ │    GET Request│ │             │ │             │ │
    │ ├───────────────────────>│ │             │ │      Process│ │
    │ │      │ │               │ ├────────────────────────────>│ │
    │ │      │ │               │ │HTML         │ │             │ │
    │ │Response (200)          │ │<----------------------------│ │
    │ │<-----------------------│ │             │ │             │ │ 
    │ │      │ │               │ │             │ │             │ │ 
    │ │      │ │  ┌─────────┐  │ │             │ │             │ │         ┌─────────┐
    │ │      │ │  │ RestForm│  │ │             │ │             │ │         │ CRUD    │
    │ │Show  │ │  │ Control │  │ │             │ │             │ │         │ API     │
    │ │Modal │ │  └────┬────┘  │ │             │ │             │ │         └────┬────┘
    │ ├──┐   │ │       ¦       │ │             │ │             │ │              ¦
    │ │<─┘   │ │Create┌┴┐      │ │             │ │             │ │             ┌┴┐
    │ ├──────────────>│Retrieve│ │             │ │             │ │             │ │
    │ │      │ │      │ ├─────>│ │             │ │             │ │     Retrieve│ │
    │ │      │ │      │ │      │ ├────────────────────────────────────────────>│ │
    │ │      │ │      │ │      │ │JSON         │ │             │ │             │ │
    │ │      │ │      │ │      │ │<--------------------------------------------│ │
    │ │      │ │      │ │<-----│ │             │ │             │ │             │ │
    │ │      │ │      │ │Response (200)        │ │             │ │             │ │
    │ │      │ │      │ │      │ │             │ │             │ │             │ │
    │ │      │ │      │ │Update│ │             │ │             │ │             │ │
    │ │      │ │      │ ├─────>│ │             │ │             │ │       Update│ │
    │ │      │ │      │ │      │ ├────────────────────────────────────────────>│ │
    │ │      │ │      │ │      │ │             │ │             │ │             │ │
    │ │      │ │      │ │      │ │<--------------------------------------------│ │
    │ │      │ Destroy│ │<-----│ │             │ │             │ │             │ │
    │ ├──────────────>│ │Response (204)        │ │             │ │             │ │
    │ │      │ │      └X┘      │ │             │ │             │ │             │ │
    │ │      │ │               │ │             │ │             │ │             │ │
    └─┘      └─┘               └─┘             └─┘             └─┘             └─┘
```

## WebSocket model

WebExpress supports WebSocket connections as an additional communication channel alongside traditional HTTP request/response endpoints. WebSocket endpoints are registered as specialized endpoint contexts (`ISocketContext`) within the sitemap/endpoint management system and are delegated by the HttpServer to the appropriate handler when a request arrives. WebSocket endpoints are implemented as components (`ISocket`), analogous to page or REST API endpoints, and are managed through a socket manager (`ISocketManager`). The sitemap contains a route for each socket endpoint, allowing incoming URIs to be mapped to the appropriate socket context using the familiar sitemap lookup mechanism.

The following illustration depicts the basic architecture of the WebSocket model. Multiple clients can simultaneously establish persistent connections to the server. These connections are recognized by the `HttpServer` and routed through the sitemap to the appropriate socket endpoints.

```
╔══════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                      ║
║      ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐        ║
║      │ Client 1 │   │ Client 2 │   │ Client 3 │   │ Client … │   │ Client n │        ║
║      └────▲─────┘   └────▲─────┘   └────▲─────┘   └────▲─────┘   └────▲─────┘        ║
║           │              │              │              │              │              ║
║           │              │              │              │              │              ║
║           └──────────────┴──────────────┼──────────────┴──────────────┘              ║
║                                         │                                            ║
║                                         │                                            ║
║                                   ┌─────▼──────┐                                     ║
║                                   │ WebExpress │                                     ║
║                                   └────────────┘                                     ║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

Every WebSocket connection follows the typical flow of WebSocket communication. A client first sends a connection request to a server, which forwards it to a responsible management component. There, a new socket instance is created. Afterwards, the WebSocket handshake takes place, during which the server confirms the protocol switch with “101 Switching Protocols”. Once the handshake is complete, the socket instance receives incoming messages through the management layer and can likewise send its own messages back to the client via the same path.

```
   ┌─────────┐         ┌─────────┐         ┌─────────┐         ┌─────────┐
   │ Web     │         │ HTTP    │         │ Socket  │         │ My-     │
   │ Client  │         │ Server  │         │ Manager │         │ Socket  │
   └────┬────┘         └────┬────┘         └────┬────┘         └────┬────┘
        ¦                   ¦                   ¦                   ¦
       ┌┴┐       Ws Request┌┴┐                 ┌┴┐                 ┌┴┐
 create│ ├────────────────>│ │ HandleConnection│ │                 │ │
       │ │                 │ ├────────────────>│ │           Create│ │
       │ │                 │ │                 │ ├────────────────>│ │
       │ │                 │ │                 │ │                 │ │
       │ │Handshake (101)  │ │                 │ │<----------------│ │
       │ │<------------------------------------│ │                 │ │
       │ │                 │ │                 │ │      OnConnected│ │
       │ │                 │ │                 │ ├────────────────>│ │
       │ │                 │ │                 │ │                 │ │
       │ │                 │ │                 │ │<----------------│ │
       │ │                 │ │<----------------│ │                 │ │
       └┬┘                 └┬┘                 └┬┘                 └┬┘
        ¦                   ¦                   ¦                   ¦ 
       ┌┴┐                 ┌┴┐                 ┌┴┐          receive┌┴┐
receive│ ├────────────────────────────────────────────────────────>│ │
       │ │                 │ │                 │ │                 │ │
       │ │                 │ │                 │ │                 │ │
       │ │<--------------------------------------------------------│ │
       └┬┘                 └┬┘                 └┬┘                 └┬┘
        ¦                   ¦                   ¦                   ¦ 
       ┌┴┐send             ┌┴┐                 ┌┴┐                 ┌┴┐
   send│ │<────────────────────────────────────────────────────────┤ │
       │ │                 │ │                 │ │                 │ │
       │ │                 │ │                 │ │                 │ │
       │ │-------------------------------------------------------->│ │
       └─┘                 └─┘                 └─┘                 └─┘
```

An established WebSocket connection is represented at runtime by a dedicated socket endpoint, which acts as the concrete communication interface through which all WebSocket messages are received and transmitted. For clarity regarding how such an endpoint is configured, the following table summarizes the available metadata attributes and their respective roles in defining these resources:

|Attribute      |Type                   |Multiplicity |Optional |Description
|---------------|-----------------------|-------------|---------|------------- 
|Policy         |`IIdentityPolicy`      |n            |Yes      |Grants authority to a policy.
|Condition      |`ICondition`           |n            |Yes      |Condition that must be met for the resource to be available. 
|MessageType    |`MessageTypeAttribute` |1            |Yes      |Defines the message type and optionally the maximum allowed message size. 
|SubProtocol    |String                 |1            |Yes      |Specifies the sub‑protocol that the socket must use. 
|MaxMessageSize |ULong                  |1            |Yes      |Sets the maximum allowed message size for incoming messages.

The example implements the `ISocket` interface in the `MySocket` class, demonstrating how to accept a WebSocket connection, receive and send messages, and handle connection closure and errors:

```
[MessageType(MaxMessageSize.Text)]
[SubProtocol("chat")]
[MaxMessageSize(1024)]
[Policy<PublicAccessPolicy>]
public sealed class MySocket : ISocket
{
    /// <summary>
    /// Invoked after the websocket handshake has been accepted.
    /// </summary>
    public async Task OnConnectedAsync(ISocketConnection webSocket)
    {
        ...
    }
}
```

The UML diagram illustrates the class structure and interactions for web socket endpoints in **WebExpress**, including the `ComponentHub`, `SitemapManager`, `SocketManager`, and `ISocketContext`, as well as the delegation of the upgrade process, connection lifecycle, and message handling to concrete ISocket handlers.

```
╔WebExpress.Core═══════════════════════════════════════════════════════════════════════╗
║                                                                                      ║
║   ┌────────────────────────────────────┐                                             ║
║   │ <<Interface>>                      │                                             ║
║   │ IComponentManager                  │                                             ║
║   ├────────────────────────────────────┤                                             ║
║   └─────Δ───────────────────────Δ──────┘                                             ║
║         ¦                       ¦                                                    ║
║         ¦                       └-----------------┐                                  ║
║         ¦                                         ¦                                  ║
║         ¦                * ┌──────────────────────┴────────────────────────┐         ║
║         ¦                  │ <<Interface>>                                 │         ║
║         ¦            ┌─────► ISitemapManager                               │         ║
║         ¦            │     ├───────────────────────────────────────────────┤ 1       ║
║         ¦            │     │ SiteMap:IEnumerable<IEndpointContext>         ├───┐     ║
║         ¦            │     ├───────────────────────────────────────────────┤   │     ║
║         ¦            │     │ Refresh()                                     │   │     ║
║         ¦            │     │ SearchResource(Uri,SearchContex):SearchResult │   │     ║
║         ¦            │     └───────────────────────────────────────────────┘   │     ║
║         ¦            │                                                         │     ║
║         ¦            └───────────────┐                                         │     ║
║         ¦                            │                                         │     ║
║         ¦                            │   ┌────────────────────────────────┐    │     ║
║         ¦                            │   │ <<Interface>>                  │    │     ║
║         ¦                            │   │ IComponentHub                  │    │     ║
║         ¦                            │ 1 ├────────────────────────────────┤    │     ║
║         ¦                            └───┤ SitemapManager:ISitemapManager │    │     ║
║         └--------------┐             ┌───┤ SocketManager:ISocketManager   │    │     ║
║                        ¦             │ 1 │ …                              │    │     ║
║                        ¦             │   └────────────────────────────────┘    │     ║
║                        ¦             └────┐                                    │     ║
║                        ¦                1 │                                    │     ║
║              ┌─────────┴──────────────────▼────────────────┐                   │     ║
║              │ <<Interface>>                               │                   │     ║
║              │ ISocketManager                              ├--------------┐    │     ║
║              ├─────────────────────────────────────────────┤              ¦    │     ║
║              │ AddSocket:Event                             │              ¦    │     ║
║              │ RemoveSocket:Event                          │              ¦    │     ║
║            1 ├─────────────────────────────────────────────┤              ¦    │     ║
║   ┌──────────┤ Sockets:IEnumerable<ISocketContext>         │              ¦    │     ║
║   │          ├─────────────────────────────────────────────┤              ¦    │     ║
║   │          │ GetSockets(IPluginContext):                 │              ¦    │     ║
║   │          │   IEnumerable<ISocketContext>               │              ¦    │     ║
║   │          │ GetSocket(IApplicationContext,socketId):    │              ¦    │     ║
║   │          │   ISocketContext                            │              ¦    │     ║
║   │          └─────────────────────────────────────────────┘              ¦    │     ║
║   │                                                                       ¦    │     ║
║   │                         ┌───────────────┐                             ¦    │     ║
║   │                         │ <<Interface>> │                             ¦    │     ║
║   │                         │ IContext      │                             ¦    │     ║
║   │                         ├───────────────┤                             ¦    │     ║
║   │                         └───────Δ───────┘                             ¦    │     ║
║   │                                 ¦                                     ¦    │     ║
║   │                                 ¦                                     ¦    │     ║
║   │             ┌───────────────────┴────────────────────┐                ¦    │     ║
║   │             │ <<Interface>>                          │                ¦    │     ║
║   │             │ IEndpointContext                       │                ¦    │     ║
║   │             ├────────────────────────────────────────┤                ¦    │     ║
║   │             │ EndpointId:String                      │                ¦    │     ║
║   │             │ PluginContext:IPluginContext           │                ¦    │     ║
║   │             │ ApplicationContext:IApplicationContext │                ¦    │     ║
║   │             │ Conditions:IEnumerable<ICondition>     │                ¦    │     ║
║   │             │ Policies:IEnumerable<IIdentityPolicy>  │                ¦    │     ║
║   │             │ Cache:Bool                             │                ¦    │     ║
║   │             │ Route:IRoute                           │                ¦    │     ║
║   │             └───────────────────Δ────────────────────┘                ¦    │     ║
║   │                                 ¦                                     ¦    │     ║
║   │                                 ¦                                     ¦    │     ║
║   │                   ┌─────────────┴───────────────┐                     ¦    │     ║
║   │                 * │ <<Interface>>               │ *                   ¦    │     ║
║   └───────────────────► ISocketContext              ◄──────────────────────────┘     ║
║                       ├─────────────────────────────┤                     ¦          ║
║                       │ SupportedSubProtocol:string │                     ¦          ║
║                       │ MaxMessageSize:long         │                     ¦          ║
║                       │ RequiresAuthentication:bool │                     └----┐     ║
║                       └─────────────────────────────┘                          ¦     ║
║                                                                                ¦     ║
║                                                ┌───────────────────────────┐   ¦     ║
║                                                │ <<Interface>>             │   ¦     ║
║                            ┌───────────────┐   │ ISocketConnection         │   ¦     ║
║                            │ <<Interface>> │   ├───────────────────────────┤   ¦     ║
║                            │ IComponent    │   │ TextMessageReceived:      │   ¦     ║
║                            ├───────────────┤   │   Event                   │   ¦     ║
║                            └───────Δ───────┘   │ BinaryMessageReceived:    │   ¦     ║
║                                    ¦           │   Event                   │   ¦     ║
║                                    ¦           ├───────────────────────────┤   ¦     ║
║                            ┌───────┴───────┐   │ SendTextAsync(String,     │   ¦     ║
║                            │ <<Interface>> │   │   CancellationToken):Task │   ¦     ║
║                            │ IEndpoint     │   │ SendBinaryAsync(Byte[],   │   ¦     ║
║                            ├───────────────┤   │   CancellationToken):Task │   ¦     ║
║                            └───────Δ───────┘   │ CloseAsync(String,        │   ¦     ║
║                                    ¦           │   CancellationToken):Task │   ¦     ║
║                                    ¦           └───────────────────────────┘   ¦     ║
║                  ┌─────────────────┴───────────────┐                           ¦     ║
║                  │ <<Interface>>                   │                           ¦     ║
║                  │ ISocket                         │                           ¦     ║
║                  ├─────────────────────────────────┤                           ¦     ║
║                  │ OnConnected(ISocketConnection): │                           ¦     ║
║                  │   Task                          │                           ¦     ║
║                  └─────────────────Δ───────────────┘                           ¦     ║
║                                    ¦                                           ¦     ║
╚════════════════════════════════════¦═══════════════════════════════════════════¦═════╝
                                     ¦                                           ¦
╔MyPlugin════════════════════════════¦═══════════════════════════════════════════¦═════╗
║                                    ¦                                           ¦     ║
║                  ┌─────────────────┴───────────────┐                    create ¦     ║
║                  │ MySocket                        ◄---------------------------┘     ║
║                  ├─────────────────────────────────┤                                 ║
║                  │ OnConnected(ISocketConnection): │                                 ║
║                  │   Task                          │                                 ║
║                  └─────────────────────────────────┘                                 ║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

Because WebSocket connections are long-lived and stateful, the number of concurrently connected clients has a direct impact on resource consumption. In typical deployment scenarios, a single **WebExpress** instance can maintain several thousand simultaneous WebSocket connections. Each active WebSocket endpoint instance consumes memory for connection metadata, protocol buffers, and message queues. Under realistic workloads, this results in an estimated baseline footprint of approximately 20–60 KB per connection, depending on message frequency, enabled subprotocols, and application level state. CPU load scales primarily with message throughput rather than connection count, as idle connections impose minimal overhead due to the event driven processing model. To support high-traffic scenarios, **WebExpress** relies on asynchronous message handling within the ISocket implementation and efficient dispatching through the `ISocketManager`. This design avoids thread-per-connection models and enables the system to scale horizontally by running multiple application instances behind a load balancer. Backpressure handling is essential for preventing overload when clients produce messages faster than the server can process them. **WebExpress** enforces configurable message size limits and can reject or close connections that exceed throughput or buffer constraints. For applications with high message rates, batching, throttling, or protocol level compression may be applied to reduce CPU and network overhead.

## Sitemap model

In a sitemap, all endpoints are listed with their route path. When a web client calls a resource, the associated endpoint is determined from the sitemap and returned to the caller.

The basic concept of the sitemap is based on mapping the physical file structure of the assembly directly as a routing hierarchy. Each folder corresponds to a segment of the route path, with the entire directory structure being converted into a namespace hierarchy during compilation. For example, a path such as `WWWW/Blog/Post` becomes the namespace `WWWW.Blog.Post`, which serves as the foundation for deriving the route path. Within these namespaces, the contained classes (such as `Index.cs`, `Add.cs`, or `Edit.cs`) define the specific endpoints of the corresponding segment. In this process, `Index.cs` functions as the default endpoint, meaning that this filename is not explicitly included in the URI. Thus, a class like `WWWW.Blog.Post.Index.cs` results in the route `/blog/post`.

It is important to note that the algorithm removes certain prefixes from the route to ensure a simplified path structure. To help you understand the prefixes that are eliminated by the algorithm, the following table shows the prefixes and their conversion:

|Prefix   |Full Class Name                 |Resulting Route
|---------|--------------------------------|------------------
|WWW      |`WWW.Blog.Post.Index`           |`/blog/post`
|Web      |`Web.Products.List`             |`/products/list`
|WebPage  |`WebPage.About`                 |`/about`
|WebPages |`WebPages.Contact`              |`/contact`
|Root     |`Root.Homepage.Index`           |`/homepage`
|WebRoot  |`WebRoot.Products.Index`        |`/products`
|WWWRoot  |`WWWRoot.Blog.Post.PostId.Edit` |`/blog/post/{postId}/edit`
|Default  |`Default.Blog.Post`             |`/blog/post`

In addition, the algorithm eliminates certain class name suffixes from the route to generate standardized route paths. If a class name contains one of these suffixes, only the essential part is used to form the path. The following is a summary table that lists the suffix identifiers and the corresponding transformation:

|Suffix     |Full Class Name                 |Resulting Route
|-----------|--------------------------------|------------------
|Controller |`WWW.Blog.Post.IndexController` |`/blog/post`
|Page       |`WWW.Products.ListPage`         |`/products/list`

When converting endpoints into routes, the system checks whether an endpoint originates from the plugin that hosts the current application. If so, the plugin’s subdirectory is omitted, resulting in a simplified route (e.g., `/server/app/x/y/z`). In contrast, endpoints from external plugins retain the plugin’s name in the route (e.g., `/server/app/<plugin>/x/y/z`) to clearly indicate their source.

Variable segments are a key feature in designing dynamic and user-friendly URLs. Unlike `?query` parameters, they enable a clearer structure by treating specific parts of a URL as placeholders, which are replaced with actual values at runtime. This approach greatly enhances the readability and aesthetics of URLs. For instance, a URL like `/blog/post/42` appears far more professional and intuitive than `/blog?post=42`. This structured format improves user experience while also benefiting search engines, as "clean URLs" contribute to better search engine optimization (SEO).

**WebExpress** takes this functionality even further by supporting specific data types such as int (integers) and GUIDs (Globally Unique Identifiers) for dynamic segments. This ensures seamless handling of both numeric identifiers (e.g., `/products/details/314`) and globally unique values (e.g., `/blog/post/{guid}`), making it ideal for applications that depend on precise resource identification. The integration of attributes like `SegmentInt` and `SegmentGuid` in **WebExpress** helps define these dynamic URL segments explicitly, enabling clear routing and robust processing.

In addition to improving aesthetics and functionality, variable segments also offer hierarchical structures that facilitate user-friendly navigation. Users can easily shorten URLs logically to access higher-level sections, such as navigating from `/blog/post/42` to `/blog/post` or `/blog`. This hierarchical design promotes a clean REST-API architecture, emphasizing resource-oriented routes like `/user/123/orders` over traditional queries such as `/orders?user=123`.

The `Index` classes in **WebExpress** can be equipped with type-defining attributes such as `SegmentInt` or `SegmentGuid` to define dynamic segments. These type attributes specify what kind of dynamic values the URL segments can contain, such as integers (int) or globally unique identifiers (GUID). This ensures that the corresponding values are properly processed and validated during routing. To illustrate the concept of `Index` classes and how they can be equipped with type-defining attributes to manage dynamic URL segments, consider the following example. It demonstrates how a specific parameter, such as a blog post ID, can be handled through a custom `BlogPostParameter` class, while the `Index` class represents the dynamic segment in the routing hierarchy:

```csharp
public class BlogPostParameter : Parameter
{
    public BlogPostParameter(int value)
        :base("postid", value, ParameterScope.Url)
    {
    }
}

[SegmentInt<BlogPostParameter>]
public sealed class Index : IPage
{
    public void Process(IRenderContext renderContext, VisualTree visualTree)
    {
    }
}
```

The following table describes the attributes used in the `Index`:

|Attribute       |Type       |Multiplicity |Optional |Description
|----------------|-----------|-------------|---------|----------------
|SegmentInt      |Parameter  |1            |Yes      |A variable path segment of type `Int`.
|SegmentGuid     |Parameter  |1            |Yes      |A variable path segment of type `Guid`.
|Title           |String     |1            |Yes      |The title of the path segment. This can be a key to internationalization.
|Description     |String     |1            |Yes      |The description of the path segment. This can be a key to internationalization.
|Icon            |IIcon      |1            |Yes      |The icon that represents the path segment graphically.

This class is further decorated with a custom attribute (`SegmentAttribute`) that defines the name of the placeholder (`postId`). During routing, a reflection-based mechanism examines the namespace hierarchy and the set attributes to determine where a dynamic value is expected. The mechanism then extracts the corresponding value from the URL and passes it on to the appropriate endpoint.

When the application starts, the sitemap uses reflection to traverse all relevant classes that represent endpoints (all those that implement the `IEndpoint` interface) and automatically builds a routing tree from them. Below is an example of a typical website structure implemented with **WebExpress**:

```
   <> MyPlugin.csproj
   ├─...
   └─📁 WWWW                 (web root)
     ├─📁 Blog               (blog section)
     │ ├─📄 Index.cs         (blog overview)
     │ └─📁 Post             (blog post section)
     │   ├─📁 PostId         (blog post id section)
     │   │ ├─📄 Edit.cs      (editing an blog post, e.g. /blog/post/42/edit)
     │   │ └─📄 Index.cs     (post with definition of the postId, e.g., /blog/post/42)
     │   ├─📄 Add.cs         (adding a new blog post, e.g. /blog/post/add)
     │   └─📄 Index.cs       (redirecting to the blog overview, e.g. /blog/post)
     ├─📁 Products           (products section)
     │ ├─📁 Details          (product details section)
     │ │ └─📄 Index.cs       (product details, e.g., /products/details/314)
     │ ├─📄 Index.cs         (products overview)
     │ └─📄 List.cs          (product listing)
     ├─📄 About.cs           (about us)
     ├─📄 Contact.cs         (contact page)
     └─📄 Index.cs           (homepage)
```

The insertion into the sitemap is done by sorting the number of route segments in ascending order. Only one endpoint can be assigned per sitemap node. In a competing situation (e.g. variable segments), the first endpoint is used. All other endpoints are not processed. This is indicated in the log by a warning message. 

Finding a resource starts at the root of the sitemap tree and follows the path of the URI. If no resource can be found, a `404` error page is returned.

## Response model

Web queries can be answered with different status responses (see RFC 2616). If successful, a status code of `200` is returned with the invoked resource. In the `StatusPageManager`, generally valid status pages for the various status codes can be stored. When returning a response that differs from `200`, the stored status page is used. 

Status pages are primarily used from the plugin in which the associated application is implemented. Status pages implement the `IStatusPage` interface. The example below demonstrates how to create a custom status page:

```csharp
[WebExStatusCode(500)]
public sealed class MyStatusPage : IStatusPage<RenderContext>
{
}
```

To provide clarity about the metadata specified in the code above, the following table presents the available attributes and their corresponding details for defining status codes:

|Attribute  |Type   |Multiplicity |Optional |Description
|-----------|-------|-------------|---------|-------------
|Title      |String |1            |Yes      |The name of the page. This can be an internationalization key.
|StatusCode |int    |1            |No       |The status code (see RFC 2616 para. 6). 
|Icon       |String |1            |Yes      |The icon that represents the statuscode graphically.

When creating a response that differs from status `200`, the corresponding status page is determined from the StatusPageManager and an instance is created. To do this, the following order is used to determine the status page:

- Search in the plugin of the called resource.
- Search in the plugin of the application of the called resource.
- Use the status pages from the plugin `webexpress.webapp`.
- Use the system status pages.

To better understand the architecture of the `StatusPageManager` and the `StatusPage` it oversees, refer to the UML diagram below:

```
╔WebExpress.Core═══════════════════════════════════════════════════════════════════════╗
║                                                                                      ║
║            ┌──────────────────────────────────────┐                                  ║
║            │ <<Interface>>                        │                                  ║
║            │ IComponentHub                        │                                  ║
║            ├──────────────────────────────────────┤ 1                                ║
║            │ StatusPageManager:IStatusPageManager ├──┐                               ║
║            │ …                                    │  │                               ║
║            └──────────────────────────────────────┘  │                               ║
║                                                      │                               ║
║             ┌───────────────────┐                    │                               ║
║             │ <<Interface>>     │                    │                               ║
║             │ IComponentManager │                    │                               ║
║             ├───────────────────┤                    │                               ║
║             └─────────Δ─────────┘                    │                               ║
║                       ¦                              │                               ║
║                       ¦                            1 │                               ║
║                ┌──────┴──────────────────────────────▼───────┐                       ║
║                │ <<Interface>>                               │                       ║
║                │ IStatusPageManager                          ├---------┐             ║
║                ├─────────────────────────────────────────────┤         ¦             ║
║                │ AddStatusPage:Event                         │         ¦             ║
║                │ RemoveStatusPage:Event                      │         ¦             ║
║              1 ├─────────────────────────────────────────────┤         ¦             ║
║            ┌───┤ StatusPages:IEnumerable<IStatusPageContext> │         ¦             ║
║            │   ├─────────────────────────────────────────────┤         ¦             ║
║            │   │ CreateStatusResponse(Message,Status,        │         ¦             ║
║            │   │   ApplicationContext,IRequest):IResponse    │         ¦             ║
║            │   └─────────────────────────────────────────────┘         ¦             ║
║            │                                                           ¦             ║
║            └────────────┐                                              ¦             ║
║                         │                 ┌────────────────┐           ¦             ║
║                         │                 │ <<Interface>>  │           ¦             ║
║                         │                 │ IContext       │           ¦             ║
║                         │                 ├────────────────┤           ¦             ║
║                         │                 └───────Δ────────┘           ¦             ║
║                         │                         ¦                    ¦             ║
║                       * │                         ¦                    ¦             ║
║                  ┌──────▼─────────────────────────┴───────┐            ¦             ║
║                  │ <<Interface>>                          │            ¦             ║
║                  │ IStatusPageContext                     │            ¦             ║
║                  ├────────────────────────────────────────┤            ¦             ║
║                  │ PluginContext:IPluginContext           │            ¦             ║
║                  │ ApplicationContext:IApplicationContext │            ¦             ║
║                  │ StatusId:String                        │            ¦             ║
║                  │ StatusCode:Int                         │            ¦             ║
║                  │ StatusTitle:String                     │            ¦             ║
║                  │ StatusIcon:IRoute                      │            ¦             ║
║                  └────────────────────────────────────────┘            ¦             ║
║                                                                        ¦             ║
║                               ┌────────────────┐                       ¦             ║
║                               │ <<Interface>>  │                       ¦             ║
║                               │ IComponent     │                       ¦             ║
║                               ├────────────────┤                       ¦             ║
║                               └───────Δ────────┘                       ¦             ║
║                                       ¦                                ¦             ║
║                                       ¦  ┌─────────────┐               ¦             ║
║                    ┌──────────────────┴──│ TVisualTree │─┐             ¦             ║
║                    │ <<Interface>>       └─────────────┘ │             ¦             ║
║                    │ IStatusPage                         │             ¦             ║
║                    ├─────────────────────────────────────┤             ¦             ║
║                    │ Process(IRenderContext,TVisualTree) │             ¦             ║
║                    └──────────────────Δ──────────────────┘             ¦             ║
║                                       ¦                                ¦             ║
╚═══════════════════════════════════════¦════════════════════════════════¦═════════════╝
                                        ¦                                ¦
╔MyPlugin═══════════════════════════════¦════════════════════════════════¦═════════════╗
║                                       ¦                                ¦             ║
║                    ┌──────────────────┴──────────────────┐     create  ¦             ║
║                    │ MyStatusPage                        ◄-------------┘             ║
║                    ├─────────────────────────────────────┤                           ║
║                    │ Process(IRenderContext,TVisualTree) │                           ║
║                    └─────────────────────────────────────┘                           ║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

If no status page is found in the current application, a default page is created and delivered by **WebExpress**.

## Fragment model

Fragments are components that can be integrated into pages to extend functionalities. Fragments can come from different sources (plugins). When a resource is loaded, the fragments stored in the sections are determined, instantiated and integrated into the resource. A section is a named area within a page (e.g. `Property.Primary`). The following UML diagram illustrates the relationships and internal structure of the `FragmentManager` and its associated fragments:

```
╔WebExpress.Core═══════════════════════════════════════════════════════════════════════╗
║                                                                                      ║
║         ┌──────────────────────────────────┐                                         ║
║         │ <<Interface>>                    │                                         ║
║         │ IComponentHub                    │                                         ║
║         ├──────────────────────────────────┤ 1                                       ║
║         │ FragmentManager:IFragmentManager ├─────┐                                   ║
║         │ …                                │     │                                   ║
║         └──────────────────────────────────┘     │                                   ║
║                                                  │                                   ║
║              ┌───────────────────┐               │                                   ║
║              │ <<Interface>>     │               │                                   ║
║              │ IComponentManager │               │                                   ║
║              ├───────────────────┤               │                                   ║
║              └────────Δ──────────┘               │                                   ║
║                       ¦                          │                                   ║
║                       ¦                        1 │                                   ║
║             ┌─────────┴──────────────────────────▼────────┐                          ║
║             │ <<Interface>>                               │                          ║
║             │ IFragmentManager                            ├----------------┐         ║
║             ├─────────────────────────────────────────────┤                ¦         ║
║             │ AddFragment:Event                           │                ¦         ║
║             │ RemoveFragment:Event                        │                ¦         ║
║             ├─────────────────────────────────────────────┤ 1              ¦         ║
║             │ Fragments:IEnumerable<IFragmentContext>     ├─────────┐      ¦         ║
║             ├─────────────────────────────────────────────┤         │      ¦         ║
║             │ GetFragment<TFragment>(IApplicationContext) │         │      ¦         ║
║             │   :IEnumerable<IFragmentContext>            │         │      ¦         ║
║             │ GetFragments<TFragment,TSection>            │         │      ¦         ║
║             │   (IApplicationContext,Scopes)              │         │      ¦         ║
║             │   :IEnumerable<IFragmentContext>            │         │      ¦         ║
║             └─────────────────────────────────────────────┘         │      ¦         ║
║                                                                     │      ¦         ║
║                            ┌────────────────┐                       │      ¦         ║
║                            │ <<Interface>>  │                       │      ¦         ║
║                            │ IContext       │                       │      ¦         ║
║                            ├────────────────┤                       │      ¦         ║
║                            └───────Δ────────┘                       │      ¦         ║
║                                    ¦                                │      ¦         ║
║                                    ¦                                │      ¦         ║
║               ┌────────────────────┴───────────────────┐            │      ¦         ║
║               │ <<Interface>>                          │ *          │      ¦         ║
║               │ IFragmentContext                       ◄────────────┘      ¦         ║
║               ├────────────────────────────────────────┤                   ¦         ║
║               │ PluginContext:IPluginContext           │                   ¦         ║
║               │ ApplicationContext:IApplicationContext │                   ¦         ║
║               │ Conditions:IEnumerable<ICondition>     │                   ¦         ║
║               │ Policies:IEnumerable<IIdentityPolicy>  │                   ¦         ║
║               │ Cache:Bool                             │                   ¦         ║
║               └────────────────────────────────────────┘                   ¦         ║
║                                                                            ¦         ║
║                              ┌────────────────┐                            ¦         ║
║                              │ TRenderContext,│                            ¦         ║
║  ┌───────────────────────────┤ TVisualTree    ├─┐                          ¦         ║
║  │ <<Interface>>             └────────────────┘ │                          ¦         ║
║  │ IWebUIElement                                │                          ¦         ║
║  ├──────────────────────────────────────────────┤     ┌────────────────┐   ¦         ║
║  │ Id:String                                    │     │ <<Interface>>  │   ¦         ║
║  ├──────────────────────────────────────────────┤     │ IComponent     │   ¦         ║
║  │ Render(TRenderContext,TVisualTree):IHtmlNode │     ├────────────────┤   ¦         ║
║  └──────────────────────Δ───────────────────────┘     └───────Δ────────┘   ¦         ║
║                         ¦                                     ¦            ¦         ║
║                         └----------┬--------------------------┘            ¦         ║
║                                    ¦    ┌────────────────┐                 ¦         ║
║                                    ¦    │ TRenderContext,│                 ¦         ║
║             ┌──────────────────────┴────┤ TVisualTree    ├─┐               ¦         ║
║             │ <<Interface>>             └────────────────┘ │               ¦         ║
║             │ IFragment                                    │               ¦         ║
║             ├──────────────────────────────────────────────┤               ¦         ║
║             └──────────────────────Δ───────────────────────┘               ¦         ║
║                                    ¦                                       ¦         ║
╚════════════════════════════════════¦═══════════════════════════════════════¦═════════╝
                                     ¦                                       ¦
╔MyPlugin════════════════════════════¦═══════════════════════════════════════¦═════════╗
║                                    ¦                                       ¦         ║
║             ┌──────────────────────┴────────────────────────┐       create ¦         ║
║             │ MyFragment                                    ◄--------------┘         ║
║             ├───────────────────────────────────────────────┤                        ║
║             │ Process(TRenderContext,TVisualTree):IHtmlNode │                        ║
║             └───────────────────────────────────────────────┘                        ║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

Fragments are modular components that derive from the `IFragment` interface and are identified and configured through attributes. These attributes help define their behavior, scope, and access permissions. The example below demonstrates how to define a fragment with specific attributes:

```csharp
[Order(0)]
[Section("mysection")]
[Scope<ScopeGeneral>]
[Permission<MyIdentityPermission>()]
public sealed class MyFragment : IFragment<IRenderContext>
{
}
```

To provide clarity about the metadata specified in the code above, the following table presents the available attributes and their corresponding details for defining fragments:

|Attribute     |Type         |Multiplicity |Optional |Description
|--------------|-------------|-------------|---------|-----------------
|Section       |`Section`    |n            |No       |The section of the Web page where the fragment is rendered.
|Scope         |`IScope`     |n            |Yes      |The scope in which the fragment is valid. If no value is specified, the scope `IScope` is set as the default.
|Order         |Int          |1            |Yes      |The order within the section. If no value is specified, the order "0" is set as the default.
|Permission    |`Permission` |n            |Yes      |Grants access to the fragment.       
|Condition     |`ICondition` |1            |Yes      |Condition that must be met for the fragment to be available.
|Cache         |Bool         |1            |Yes      |Determines whether the fragment is created once and reused each time it is called. This attribute is active only if the associated page also has the cache attribute. 

## Web icons

Unlike components, web icons are not managed through a centralized manager like the `AssetManager`. Instead, each web icon is derived from the `IIcon` interface and used directly within the application. This approach provides a lightweight and flexible system for incorporating icons into the user interface without the need for additional management layers. To define a specific web icon, a class is created that inherits from a base Icon class or implements the `IIcon` interface. Below is an example of a class representing an information circle icon:

```csharp
public class IconInfoCircle : IIcon
{
    public IHtmlNode Render(IRenderContext renderContext, 
        IVisualTree visualTree, 
        string id = null, 
        string description = null, 
        string css = null, 
        string style = null, 
        string role = null)
    {
        return new HtmlElementTextSemanticsSpan()
        {
            Class = "fas fa-info-circle"
        };
    }
}
```

This implementation showcases the core functionality of the `IconInfoCircle` class. The render method generates an HTML span element (`HtmlElementTextSemanticsSpan`) with a CSS class (`fas fa-info-circle`) that defines the icon's appearance. In contrast to standard icons, which typically reference a file path to an external asset, web icons directly produce HTML code that can be embedded into the HTML document. Additional optional parameters, such as id, description, and css, provide flexibility in customizing the icon's rendering for various use cases.

## Controls

Controls are units of the web page that are translated into HTML source code by rendering. A Web page consists of nested controls. This UML diagram provides a representation of the relationships and structure of controls:

```
╔WebExpress.Core═══════════════════════════════════════════════════════════════════════╗
║                                                                                      ║
║                                               ┌────────────────┐                     ║
║                                               │ TRenderContext,│                     ║
║                   ┌───────────────────────────┤ TVisualTree    ├─┐                   ║
║                   │ <<Interface>>             └────────────────┘ │                   ║
║                   │ IWebUIElement                                │                   ║
║                   ├──────────────────────────────────────────────┤                   ║
║                   │ Id:String                                    │                   ║
║                   ├──────────────────────────────────────────────┤                   ║
║                   │ Render(TRenderContext,TVisualTree):IHtmlNode │                   ║
║                   └──────────────────────Δ───────────────────────┘                   ║
║                                          ¦                                           ║
╚══════════════════════════════════════════¦═══════════════════════════════════════════╝
                                           ¦
╔WebExpress.UI═════════════════════════════¦═══════════════════════════════════════════╗
║                                          ¦                                           ║
║            ┌─────────────────────────────┴──────────────────────────────┐            ║
║            │ <<Interface>>                                              │            ║
║            │ IControl                                                   │            ║
║            ├────────────────────────────────────────────────────────────┤            ║
║            ├────────────────────────────────────────────────────────────┤            ║
║            │ Render(IRenderControlContext,IVisualTreeControl):IHtmlNode │            ║
║            └─────────────────────────────Δ──────────────────────────────┘            ║
║                                          ¦                                           ║
║                                          ¦                                           ║
║            ┌─────────────────────────────┴──────────────────────────────┐            ║
║            │ Control                                                    │            ║
║            ├────────────────────────────────────────────────────────────┤            ║
║            │ Id:String                                                  │            ║
║            │ Classes:List<String>                                       │            ║
║            │ Styles:List<String>                                        │            ║
║            │ HorizontalAlignment:TypeHorizontalAlignment                │            ║
║            │ TextColor:PropertyColorText                                │            ║
║            │ BackgroundColor:PropertyColorBackground                    │            ║
║            │ BorderColor:PropertyColorBorder                            │            ║
║            │ Padding:PropertySpacingPadding                             │            ║
║            │ Margin:PropertySpacingMargin                               │            ║
║            │ Border:PropertyBorder                                      │            ║
║            │ GridColumn:PropertyGrid                                    │            ║
║            │ Width:TypeWidth                                            │            ║
║            │ Height:TypeHeight                                          │            ║
║            │ Role:String                                                │            ║
║            │ OnClick:PropertyOnClick                                    │            ║
║            │ Enable:Bool                                                │            ║
║            ├────────────────────────────────────────────────────────────┤            ║
║            │ Render(IRenderControlContext,IVisualTreeControl):IHtmlNode │            ║
║            └─────────────────────────────Δ──────────────────────────────┘            ║
║                                          │                                           ║
╚══════════════════════════════════════════│═══════════════════════════════════════════╝
                                           │
╔MyPlugin══════════════════════════════════│═══════════════════════════════════════════╗
║                                          │                                           ║
║            ┌─────────────────────────────┴──────────────────────────────┐            ║
║            │ MyControl                                                  │            ║
║            ├────────────────────────────────────────────────────────────┤            ║
║            │ Render(IRenderControlContext,IVisualTreeControl):IHtmlNode │            ║
║            └────────────────────────────────────────────────────────────┘            ║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

A control provides the following properties:

|Property            |Type                    |Description
|--------------------|------------------------|-----------------
|Classes             |List<String>            |CSS classes applied to the element.
|Styles              |List<String>            |Inline styles applied to the element.
|HorizontalAlignment |TypeHorizontalAlignment |Horizontal alignment of the element.
|TextColor           |PropertyColorText       |Text color of the element.
|BackgroundColor     |PropertyColorBackground |Background color of the element.
|BorderColor         |PropertyColorBorder     |Border color of the element.
|Padding             |PropertySpacingPadding  |Padding around the element.
|Margin              |PropertySpacingMargin   |Margin around the element.
|Border              |PropertyBorder          |Border properties of the element.
|GridColumn          |PropertyGrid            |Grid column properties of the element.
|Width               |TypeWidth               |Width of the element.
|Height              |TypeHeight              |Height of the element.
|Role                |String                  |Role attribute for accessibility.
|OnClick             |PropertyOnClick         |Event handler for click events.
|Enable              |Bool                    |Indicates if the element is enabled.

### Form

A form in HTML is an interactive element that allows users to enter data and send it to the **WebExpress** server. Forms consist of various input elements such as text boxes, checkboxes, radio buttons, drop-down menus, and buttons. These form elements are organized into tabs and groups for better structure and usability. By grouping related elements together and using tabs to separate different sections, users can navigate and complete the form more efficiently. The following UML diagram illustrates the relationships and internal structure, serving as a schema for form designs:

```
╔WebExpress.UI═════════════════════════════════════════════════════════════════════════╗
║                                                                                      ║
║                                      ┌──────────┐                                    ║
║                                      │ IControl │                                    ║
║                                      ├──────────┤                                    ║
║                                      │ …        │                                    ║
║                                      └────Δ─────┘                                    ║
║                                           ¦                                          ║
║                                           ¦                                          ║
║                                      ┌────┴────┐                                     ║
║                                      │ Control │                                     ║
║                                      ├─────────┤                                     ║
║                                      │ …       │                                     ║
║                                      └────Δ────┘                                     ║
║                                           │                                          ║
║                                           │                                          ║
║               ┌───────────────────────────┴─────────────────────────────┐            ║
║               │ ControlForm                                             │            ║
║               ├─────────────────────────────────────────────────────────┤            ║
║               │ Name:String                                             │            ║
║               ├─────────────────────────────────────────────────────────┤            ║
║               │ OnValidation():Bool                                     │            ║
║               │ Render(IRenderFormContext,IVisualTreeControl):IHtmlNode │            ║
║               └───────────────────────────▲─────────────────────────────┘            ║
║                                         1 │                                          ║
║                                           │                                          ║
║                                         * │                                          ║
║           ┌───────────────────────────────┴────────────────────────────────┐         ║
║           │ ControlFormTab                                                 │         ║
║           ├────────────────────────────────────────────────────────────────┤         ║
║           │ Name:String                                                    │         ║
║           ├────────────────────────────────────────────────────────────────┤         ║
║           │ Render(IRenderControlFormContext,IVisualTreeControl):IHtmlNode │         ║
║           └───────────────────────────────▲────────────────────────────────┘         ║
║                                         1 │                                          ║
║                                           │                                          ║
║                                         * │                                          ║
║           ┌───────────────────────────────┴────────────────────────────────┐         ║
║           │ ControlFormGroup                                               │         ║
║           ├────────────────────────────────────────────────────────────────┤         ║
║           │ Name:String                                                    │         ║
║           ├────────────────────────────────────────────────────────────────┤         ║
║           │ Render(IRenderControlFormContext,IVisualTreeControl):IHtmlNode │         ║
║           └───────────────────────────────▲────────────────────────────────┘         ║
║                                         1 │                                          ║
║                                           │                                          ║
║                                         * │                                          ║
║           ┌───────────────────────────────┴────────────────────────────────┐         ║
║           │ ControlFormItem                                                │         ║
║           ├────────────────────────────────────────────────────────────────┤         ║
║           │ Label:String                                                   │         ║
║           │ Name:String                                                    │         ║
║           │ Description:String                                             │         ║
║           ├────────────────────────────────────────────────────────────────┤         ║
║           │ Render(IRenderControlFormContext,IVisualTreeControl):IHtmlNode │         ║
║           └───────────────────────────────Δ────────────────────────────────┘         ║
║                                           │                                          ║
║                                           │                                          ║
║     ┌─────────────────────────────────────┴────────────────────────────────────┐     ║
║     │ ControlFormItemInput                                                     │     ║
║     ├──────────────────────────────────────────────────────────────────────────┤     ║
║     │ Label:String                                                             │     ║
║     │ Name:String                                                              │     ║
║     │ Description:String                                                       │     ║
║     │ Icon:IIcon                                                               │     ║
║     │ Help:String                                                              │     ║
║     │ Disabled: Bool                                                           │     ║
║     │ Tag: Object                                                              │     ║
║     ├──────────────────────────────────────────────────────────────────────────┤     ║
║     │ Initialize(Action<ControlFormEventItemInitialize>):IControlFormItemInput │     ║
║     │ Validate(Action<ControlFormEventItemValidate>):IControlFormItemInput     │     ║
║     │ Process(Action<ControlFormEventItemProzess>):IControlFormItemInput       │     ║
║     │ Render(IRenderControlFormContext,IVisualTreeControl):IHtmlNode           │     ║
║     └──────────────────────────────────────────────────────────────────────────┘     ║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

A form takes user input and forwards it to the web server for processing:

```
  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
  │ Web     │ │ HTTP    │ │ MyPage  │ │ Form    │ │ FormTab │ │FormGroup│ │ FormItem│
  │ Client  │ │ Server  │ │         │ │         │ │         │ │         │ │         │
  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘
       ¦           ¦           ¦           ¦           ¦           ¦           ¦
      ┌┴┐  Request┌┴┐         ┌┴┐         ┌┴┐         ┌┴┐         ┌┴┐         ┌┴┐
  init│ ├────────>│ │  Process│ │         │ │         │ │         │ │         │ │
      │ │         │ ├────────>│ │         │ │         │ │         │ │         │ │
      │ │         │ │       ┌─┤ │         │ │         │ │         │ │         │ │
      │ │         │ │ Render│ │ │         │ │         │ │         │ │         │ │
      │ │         │ │       └>│ │   Render│ │         │ │         │ │         │ │
      │ │         │ │         │ ├────────>│ │         │ │         │ │         │ │
      │ │         │ │         │ │         │ Initialize│ Initialize│ Initialize│ │
      │ │         │ │         │ │         │ ├────────>│ ├────────>│ ├────────>│ │
      │ │         │ │         │ │         │ │<--------│ │<--------│ │<--------│ │
      │ │         │ │         │ │       ┌─┤ │         │ │         │ │         │ │
      │ │         │ │         Initialize│ │ │         │ │         │ │         │ │
      │ │         │ │         │ │       └>│ │         │ │         │ │         │ │
      │ │         │ │         │ │         │ │   Render│ │   Render│ │   Render│ │
      │ │         │ │         │ │         │ ├────────>│ ├────────>│ ├────────>│ │
      │ │         │ │         │ │         │ │<--------│ │<--------│ │<--------│ │
      │ │         │ │         │ │<--------│ │         │ │         │ │         │ │
      │ │Response │ │<--------│ │         │ │         │ │         │ │         │ │
      │ │<--------│ │         │ │         │ │         │ │         │ │         │ │
      └┬┘         └┬┘         └┬┘         └┬┘         └┬┘         └┬┘         └┬┘
       ¦           ¦           ¦           ¦           ¦           ¦           ¦
      ┌┴┐  Request┌┴┐         ┌┴┐         ┌┴┐         ┌┴┐         ┌┴┐         ┌┴┐
submit│ ├────────>│ │  Process│ │         │ │         │ │         │ │         │ │
      │ │         │ ├────────>│ │         │ │         │ │         │ │         │ │
      │ │         │ │       ┌─┤ │         │ │         │ │         │ │         │ │
      │ │         │ │ Render│ │ │         │ │         │ │         │ │         │ │
      │ │         │ │       └>│ │   Render│ │         │ │         │ │         │ │
      │ │         │ │         │ ├────────>│ │         │ │         │ │         │ │
      │ │         │ │         │ │         │ │ Validate│ │ Validate│ │ Validate│ │
      │ │         │ │         │ │         │ ├────────>│ ├────────>│ ├────────>│ │
      │ │         │ │         │ │         │ │<--------│ │<--------│ │<--------│ │
      │ │         │ │         │ │       ┌─┤ │         │ │         │ │         │ │
      │ │         │ │         │ Validate│ │ │         │ │         │ │         │ │
      │ │         │ │         │ │       └>│ │         │ │         │ │         │ │
      │ │         │ │         │ │         │ │  Process│ │  Process│ │  Process│ │
      │ │         │ │         │ │         │ ├────────>│ ├────────>│ ├────────>│ │
      │ │         │ │         │ │         │ │<--------│ │<--------│ │<--------│ │
      │ │         │ │         │ │       ┌─┤ │         │ │         │ │         │ │
      │ │         │ │         │ │Process│ │ │         │ │         │ │         │ │
      │ │         │ │         │ │       └>│ │         │ │         │ │         │ │
      │ │         │ │         │ │         │ │   Render│ │   Render│ │   Render│ │
      │ │         │ │         │ │         │ ├────────>│ ├────────>│ ├────────>│ │
      │ │         │ │         │ │         │ │<--------│ │<--------│ │<--------│ │
      │ │         │ │         │ │<--------│ │         │ │         │ │         │ │
      │ │Response │ │<--------│ │         │ │         │ │         │ │         │ │
      │ │<--------│ │         │ │         │ │         │ │         │ │         │ │
      └─┘         └─┘         └─┘         └─┘         └─┘         └─┘         └─┘
```

Form classes and associated form controls are available for entering data, ensuring a consistent and user-friendly experience. The user interface of the form is structured as follows to ensure a variable display of the controls:

```
╔Form═════════════════════════════════════════════════════════════════════╗
║ ┌Header───────────────────────────────────────────────────────────────┐ ║
║ │┌Preference Header──────────────────────────────────────────────────┐│ ║
║ ││ An optional header that displays custom content.                  ││ ║
║ │└───────────────────────────────────────────────────────────────────┘│ ║
║ │┌Primary Header─────────────────────────────────────────────────────┐│ ║
║ ││ A clear and concise title that describes the purpose of the form. ││ ║
║ │└───────────────────────────────────────────────────────────────────┘│ ║
║ │┌Secondary Header───────────────────────────────────────────────────┐│ ║
║ ││ An additional header for further information or subtitles.        ││ ║
║ │└───────────────────────────────────────────────────────────────────┘│ ║
║ └─────────────────────────────────────────────────────────────────────┘ ║
║─────────────────────────────────────────────────────────────────────────║
║ ┌Notifications────────────────────────────────────────────────────────┐ ║
║ │ A section for notifications or alerts.                              │ ║
║ └─────────────────────────────────────────────────────────────────────┘ ║
║ ┌PreContent───────────────────────────────────────────────────────────┐ ║
║ │┌Preference PreItem─────────────────────────────────────────────────┐│ ║
║ ││ An optional item for user-defined preferences.                    ││ ║
║ │└───────────────────────────────────────────────────────────────────┘│ ║
║ │┌Primary PreItem────────────────────────────────────────────────────┐│ ║
║ ││ A main item displayed before the primary inputs.                  ││ ║
║ │└───────────────────────────────────────────────────────────────────┘│ ║
║ │┌Secondary PreItem──────────────────────────────────────────────────┐│ ║
║ ││ An additional item for further information.                       ││ ║
║ │└───────────────────────────────────────────────────────────────────┘│ ║
║ └─────────────────────────────────────────────────────────────────────┘ ║
║ ┌Tabs─────────────────────────────────────────────────────────────────┐ ║
║ │┌Preference Tab──┐┌Primary Tab──┐┌─Secondary Tab──┐                  │ ║
║ ││  Tab Name      ││ Tab Name    ││ Tab Name       │                  │ ║
║ ││                └┴─────────────┴┴────────────────┴─────────────────┐│ ║
║ ││ Tabs for different categories or sections.                        ││ ║
║ ││ ┌Preference Group───────────────────────────────────────────────┐ ││ ║
║ ││ │ A preferred section for grouped input elements.               │ ││ ║
║ ││ │Label 1:                                                       │ ││ ║
║ ││ │┌─────────────────────────────────────────────────────────────┐│ ││ ║
║ ││ ││ Item 1                                                      ││ ││ ║
║ ││ │└─────────────────────────────────────────────────────────────┘│ ││ ║
║ ││ │ Help 1                                                        │ ││ ║
║ ││ └───────────────────────────────────────────────────────────────┘ ││ ║
║ ││ ┌Primary Group──────────────────────────────────────────────────┐ ││ ║
║ ││ │ A main section for grouped input elements.                    │ ││ ║
║ ││ │Label 1:                                                       │ ││ ║
║ ││ │┌─────────────────────────────────────────────────────────────┐│ ││ ║
║ ││ ││ Item 1                                                      ││ ││ ║
║ ││ │└─────────────────────────────────────────────────────────────┘│ ││ ║
║ ││ │ Help 1                                                        │ ││ ║
║ ││ └───────────────────────────────────────────────────────────────┘ ││ ║
║ ││ ┌Secondary Group────────────────────────────────────────────────┐ ││ ║
║ ││ │ A additional section for grouped input elements.              │ ││ ║
║ ││ │Label 1:                                                       │ ││ ║
║ ││ │┌─────────────────────────────────────────────────────────────┐│ ││ ║
║ ││ ││ Item 1                                                      ││ ││ ║
║ ││ │└─────────────────────────────────────────────────────────────┘│ ││ ║
║ ││ │ Help 1                                                        │ ││ ║
║ ││ └───────────────────────────────────────────────────────────────┘ ││ ║
║ │└───────────────────────────────────────────────────────────────────┘│ ║
║ └─────────────────────────────────────────────────────────────────────┘ ║
║ ┌PostItems────────────────────────────────────────────────────────────┐ ║
║ │┌Preference PostItem────────────────────────────────────────────────┐│ ║
║ ││ An optional item for user-defined preferences.                    ││ ║
║ │└───────────────────────────────────────────────────────────────────┘│ ║
║ │┌Primary PostItem───────────────────────────────────────────────────┐│ ║
║ ││ A main item displayed after the primary inputs.                   ││ ║
║ │└───────────────────────────────────────────────────────────────────┘│ ║
║ │┌Secondary PostItem─────────────────────────────────────────────────┐│ ║
║ ││ An additional item for further information.                       ││ ║
║ │└───────────────────────────────────────────────────────────────────┘│ ║
║ └─────────────────────────────────────────────────────────────────────┘ ║
║─────────────────────────────────────────────────────────────────────────║
║ ┌Buttons──────────────────────────────────────────────────────────────┐ ║
║ │ A section for buttons with a prominently visible button             │ ║
║ │ to submit or cancel the form.                                       │ ║
║ │┌Preference Button┐┌Primary Button───────────────┐┌Secondary Button─┐│ ║
║ ││                 ││                  ┌─────────┐││      ┌─────────┐││ ║
║ ││                 ││                  │ Submit  │││      │ Cancel  │││ ║
║ ││                 ││                  └─────────┘││      └─────────┘││ ║
║ │└─────────────────┘└─────────────────────────────┘└─────────────────┘│ ║
║ └─────────────────────────────────────────────────────────────────────┘ ║
║ ┌Footer───────────────────────────────────────────────────────────────┐ ║
║ │┌Preference Footer──────────────────────────────────────────────────┐│ ║
║ ││ An optional footer for user-defined preferences.                  ││ ║
║ │└───────────────────────────────────────────────────────────────────┘│ ║
║ │┌Primary Footer─────────────────────────────────────────────────────┐│ ║
║ ││ A main footer for important information.                          ││ ║
║ │└───────────────────────────────────────────────────────────────────┘│ ║
║ │┌Secondary Footer───────────────────────────────────────────────────┐│ ║
║ ││ An additional footer for further information.                     ││ ║
║ │└───────────────────────────────────────────────────────────────────┘│ ║
║ └─────────────────────────────────────────────────────────────────────┘ ║
╚═════════════════════════════════════════════════════════════════════════╝
```

The alignment of the form elements can be controlled with the help of the different form layouts:

- `Default`: A form in which the elements are arranged in several rows.
```
╔Form══════════════════════════════════╗
║ ┌Notifications─────────────────────┐ ║
║ └──────────────────────────────────┘ ║
║ ┌Items─────────────────────────────┐ ║
║ │                                  │ ║
║ │                                  │ ║
║ └──────────────────────────────────┘ ║
║──────────────────────────────────────║
║ ┌────────┐                ┌────────┐ ║
║ │ Submit │                │ Cancel │ ║
║ └────────┘                └────────┘ ║
╚══════════════════════════════════════╝
```
- `Inline`: A form whose elements are arranged in one row.
```
╔Inline form═══════════════════════════╗
║ ┌Items──────────────────┐ ┌────────┐ ║
║ │                       │ │ Submit │ ║
║ └───────────────────────┘ └────────┘ ║
╚══════════════════════════════════════╝
```

### Form controls

Each form can hold multiple form controls. There are two different types of form controls:

- Controls with an informational or decorative character
- Controls for selecting or entering data

The arrangement of the form contents can be controlled by the `ControlFormItemGroup` classes:

- `ControlFormItemGroupVertical`:
```
╔Items════════════════════════════════════════════════════════════╗
║ Label 1:                                                        ║
║  ┌────────────────────────────────────────────────────────────┐ ║
║  │ Item 1                                                     │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║   Help 1                                                        ║
║                                                                 ║
║ Label 2:                                                        ║
║  ┌────────────────────────────────────────────────────────────┐ ║
║  │ Item 2                                                     │ ║
║  └────────────────────────────────────────────────────────────┘ ║
║   Help 2                                                        ║
╚═════════════════════════════════════════════════════════════════╝
```
- `ControlFormItemGroupHorizontal`:
```
╔Items════════════════════════════════════════════════════════════╗
║          ┌─────────────────────────────────────────────┐        ║
║ Label 1: │ Item 1                                      │ Help 1 ║
║          └─────────────────────────────────────────────┘        ║
║          ┌─────────────────────────────────────────────┐        ║
║ Label 2: │ Item 2                                      │ Help 2 ║
║          └─────────────────────────────────────────────┘        ║
╚═════════════════════════════════════════════════════════════════╝
```
- `ControlFormItemGroupMix`:
```
╔Items════════════════════════════════════════════════════════════╗
║          ┌────────────────────────────────────────────────────┐ ║
║ Label 1: │ Item 1                                             │ ║
║          └────────────────────────────────────────────────────┘ ║
║           Help 1                                                ║
║                                                                 ║
║          ┌────────────────────────────────────────────────────┐ ║
║ Label 2: │ Item 2                                             │ ║
║          └────────────────────────────────────────────────────┘ ║
║           Help 2                                                ║
╚═════════════════════════════════════════════════════════════════╝
```
- `ControlFormItemGroupColumnVertical`:
```
╔Items════════════════════════════════════════════════════════════╗
║ Label 1:                        Label 2:                        ║
║  ┌────────────────────────────┐  ┌────────────────────────────┐ ║
║  │ Item 2                     │  │ Item 2                     │ ║
║  └────────────────────────────┘  └────────────────────────────┘ ║
║   Help 1                          Help 2                        ║
╚═════════════════════════════════════════════════════════════════╝
```
- `ControlFormItemGroupColumnHorizontal`:
```
╔Items════════════════════════════════════════════════════════════╗
║          ┌────────────┐                   ┌────────────┐        ║
║ Label 1: │ Item 1     │ Help 1   Label 2: │ Item 2     │ Help 2 ║
║          └────────────┘                   └────────────┘        ║
╚═════════════════════════════════════════════════════════════════╝
```
- `ControlFormItemGroupColumnMix`:
```
╔Items════════════════════════════════════════════════════════════╗
║          ┌────────────────────┐          ┌────────────────────┐ ║
║ Label 1: │ Item 1             │ Label 2: │ Item 2             │ ║
║          └────────────────────┘          └────────────────────┘ ║
║           Help 1                          Help 2                ║
╚═════════════════════════════════════════════════════════════════╝
```

## Session model

A session establishes a state-based connection between the client and WebExpress using the otherwise stateless HTTP(S) protocol. The session is assigned to a cookie and is personalized. The cookie consists of a guid. Further data is not stored in the cookie, but on the server side in the `session` object. The following UML diagram illustrates the relationships and structure involved:

```
╔WebExpress.Core═══════════════════════════════════════════════════════════════════════╗
║                                                                                      ║
║                ┌────────────────────────────────┐                                    ║
║                │ <<Interface>>                  │                                    ║
║                │ IComponentHub                  │                                    ║
║                ├────────────────────────────────┤ 1                                  ║
║                │ SessionManager:ISessionManager ├──────┐                             ║
║                │ …                              │      │                             ║
║                └────────────────────────────────┘      │                             ║             
║                                                        │                             ║
║           ┌────────────────────────────────────┐       │                             ║
║           │ <<Interface>>                      │       │                             ║
║           │ IComponentManager                  │       │                             ║
║           ├────────────────────────────────────┤       │                             ║
║           └────────────────Δ───────────────────┘       │                             ║
║                            ¦                           │                             ║
║                            ¦                         1 │                             ║
║                      ┌─────┴───────────────────────────▼────┐                        ║
║                      │ SessionManager                       │                        ║
║                      ├──────────────────────────────────────┤ 1                      ║
║                      │ Sessions:IEnumerable<Session>        ├────┐                   ║
║                      ├──────────────────────────────────────┤    │                   ║
║                      │ GetSession(IRequest):Session         │    │                   ║
║                      │ Remove(Session)                      │    │                   ║
║                      └──────────────────────────────────────┘    │                   ║
║                                                                  │                   ║
║                                         ┌────────────────────────┘                   ║
║                                       * │                                            ║
║                  ┌──────────────────────▼─────────────────────────┐                  ║
║                  │ Session                                        │                  ║
║                  ├────────────────────────────────────────────────┤                  ║
║                  │ Id:Guid                                        │                  ║
║                  │ Created:DateTime                               │                  ║
║                  │ Updated:DateTime                               │ 1                ║
║                  │ Properties:IEnumerable<ISessionProperty>       ├────┐             ║
║                  ├────────────────────────────────────────────────┤    │             ║
║                  │ GetProperty():ISessionProperty                 │    │             ║
║                  │ GetOrCreateProperty():ISessionProperty         │    │             ║
║                  │ SetProperty(ISessionProperty):IResourceContext │    │             ║
║                  │ RemoveProperty(ISessionProperty)               │    │             ║
║                  └────────────────────────────────────────────────┘    │             ║
║                                                                        │             ║
║                                       ┌────────────────────────────────┘             ║
║                                     * │                                              ║
║                              ┌────────▼─────────┐                                    ║
║                              │ <<Interface>>    │                                    ║
║                              │ ISessionProperty │                                    ║
║                              ├──────────────────┤                                    ║
║                              └────────Δ─────────┘                                    ║
║                                       ¦                                              ║
╚═══════════════════════════════════════¦══════════════════════════════════════════════╝
                                        ¦
╔MyPlugin═══════════════════════════════¦══════════════════════════════════════════════╗
║                                       ¦                                              ║
║                             ┌─────────┴─────────┐                                    ║
║                             │ MySessionProperty │                                    ║
║                             ├───────────────────┤                                    ║
║                             └───────────────────┘                                    ║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

The session manager delivers the currently used session based on the cookie stored in the request. The session, in turn, stores instances of the `ISessionProperty` interface in which the information (e.g. parameters) is stored. 

## Event model

Events are notifications from the **WebExpress** API or web applications that can be subscribed to and evaluated. To explore the organization, refer to the UML diagram illustrating the structural relationships:

```
╔WebExpress.Core═══════════════════════════════════════════════════════════════════════╗
║                                                                                      ║
║                                         ┌────────────────────────────┐               ║
║                                         │ <<Interface>>              │               ║
║                                         │ IComponentHub              │               ║
║                                       1 ├────────────────────────────┤               ║
║                                   ┌─────┤ EventManager:IEventManager │               ║
║                                   │     │ …                          │               ║
║                                   │     └────────────────────────────┘               ║
║                                   │                                                  ║
║                                   │                 ┌────────────────┐               ║
║                                   │                 │ <<Interface>>  │               ║
║                                   │                 │ IContext       │               ║
║                                   │                 ├────────────────┤               ║
║                                   │                 └───────Δ────────┘               ║
║                                   │                         ¦                        ║
║                                   │                         ¦                        ║
║                                   │     ┌───────────────────┴────────────────────┐   ║
║                                   │     │ <<Interface>>                          │   ║
║       ┌───────────────────┐       │     │ IEventHandlerContext                   │   ║
║       │ <<Interface>>     │       │     ├────────────────────────────────────────┤   ║
║       │ IComponentManager │       │     │ PluginContext:IPluginContext           │   ║
║       ├───────────────────┤       │     │ ApplicationContext:IApplicationContext │   ║
║       └────────Δ──────────┘       │     │ EventID:String                         │   ║
║                ¦                  │     │ EventHandlerId:String                  │   ║
║                ¦                  │     └───────────────────▲────────────────────┘   ║
║                ¦                * │                       * │                        ║
║   ┌────────────┴──────────────────▼─────────────────┐       │                        ║
║   │ <<Interface>>                                   │       │                        ║
║   │ IEventManager                                   ├---┐   │                        ║
║   ├─────────────────────────────────────────────────┤   ¦   │                        ║
║   │ AddEvent:Event                                  │   ¦   │                        ║
║   │ RemoveEvent:Event                               │   ¦   │                        ║
║   ├─────────────────────────────────────────────────┤ 1 ¦   │                        ║
║   │ EventHandlers:IEnumerable<IEventHandlerContext> ├───────┘                        ║
║   ├─────────────────────────────────────────────────┤   ¦                            ║
║   │ GetEventHandlers<IEvent>(IApplicationContext):  │   ¦                            ║
║   │   IEnumerable<IEventHandlerContext>             │   ¦                            ║
║   │ RaiseEvent<IEvent>(IApplicationContext)         │   ¦                            ║
║   └─────────────────────────────────────────────────┘   ¦                            ║
║                                                         ¦                            ║
║                 ┌────────────────┐                      ¦                            ║
║                 │ <<Interface>>  │                      ¦                            ║
║                 │ IComponent     │                      ¦                            ║
║                 ├────────────────┤                      ¦                            ║
║                 └───────Δ────────┘                      ¦                            ║
║                         ¦                               ¦                            ║
║                         ¦  ┌────────────────┐           ¦                            ║
║       ┌─────────────────┴──│ TEventArgument │─┐         ¦                            ║
║       │ <<Interface>>      └────────────────┘ │         ¦                            ║
║       │ IEventHandler                         │         ¦                            ║
║       ├───────────────────────────────────────┤         ¦                            ║
║       │ Process(Sender,TEventArgument)        │         ¦                            ║
║       └─────────────────Δ─────────────────────┘         ¦                            ║
║                         ¦                               ¦                            ║
╚═════════════════════════¦═══════════════════════════════¦════════════════════════════╝
                          ¦                               ¦               
╔MyPlugin═════════════════¦═══════════════════════════════¦════════════════════════════╗
║                         ¦                               ¦                            ║
║        ┌────────────────┴───────────────┐        create ¦                            ║
║        │ MyEventHandler                 ◄---------------┘                            ║
║        ├────────────────────────────────┤                                            ║
║        │ Process(Sender,TEventArgument) │                                            ║
║        └────────────────────────────────┘                                            ║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

An event handler is created by defining a class that implements the `IEventHandler` interface. This allows the system to respond to specific events and execute custom logic when those events are triggered. The example below demonstrates how to create a simple event handler:

```csharp
[Event<Event>] 
public sealed class MyEventHandler : IEventHandler
{
    public void Process(object sender)
    {
    }
}
```

To provide clarity about the metadata specified in the code above, the following table presents the available attributes and their corresponding details for defining events:

|Attribute   |Type           |Multiplicity |Optional |Description
|------------|---------------|-------------|---------|------------
|Event       |`IEvent`       |1            |No       |The event at which you want to listen.

## Job model

Jobs are tasks that are executed in a time-controlled and repetitive manner. When a plugin is loaded, all jobs containing it are determined by the ScheduleManager and instantiated and started at the specified execution time. The UML diagram below serves to illustrate the relationships and underlying structure:

```
╔WebExpress.Core═══════════════════════════════════════════════════════════════════════╗
║                                                                                      ║
║                                         ┌────────────────────────┐                   ║
║                                         │ <<Interface>>          │                   ║
║                                         │ IComponentHub          │                   ║
║                                       1 ├────────────────────────┤                   ║
║      ┌──────────────────────────┐    ┌──┤ JobManager:IJobManager │                   ║
║      │ <<Interface>>            │    │  │ …                      │                   ║
║      │ IComponentManager        │    │  └────────────────────────┘                   ║
║      ├──────────────────────────┤    │                                               ║
║      └────────────Δ─────────────┘    │                                               ║
║                   ¦                  │                                               ║
║                   ¦                1 │                                               ║
║            ┌──────┴──────────────────▼─────┐                                         ║
║            │ <<Interface>>                 │ create                                  ║
║            │ IJobManager                   ├-------------------------------------┐   ║
║            ├───────────────────────────────┤                                     ¦   ║
║            │ AddJob:Event                  │                                     ¦   ║
║            │ RemoveJob:Event               │                                     ¦   ║
║            ├───────────────────────────────┤ 1                                   ¦   ║
║          1 │ Jobs:IEnumerable<JobContext>  ├───────┐                             ¦   ║
║         ┌──┤ Clock:Clock                   │       │                             ¦   ║
║         │  ├───────────────────────────────┤       │                             ¦   ║
║         │  │ GetJob(IApplicationContext,   │       │                             ¦   ║
║         │  │   JobType):IJobContext        │       │                             ¦   ║
║         │  └───────────────────────────────┘       │                             ¦   ║
║         │                                          │                             ¦   ║
║         │                   ┌───────────────┐      │                             ¦   ║
║         │                   │ <<Interface>> │      │                             ¦   ║
║         │                   │ IContext      │      │                             ¦   ║
║         │                   ├───────────────┤      │                             ¦   ║
║         │                   └───────Δ───────┘      │                             ¦   ║
║         │                           ¦              │                             ¦   ║
║         │                           ¦            * │                             ¦   ║
║         │       ┌───────────────────┴──────────────▼─────┐                       ¦   ║
║         │       │ <<Interface>>                          │                       ¦   ║
║         │       │ IJobContext                            │                       ¦   ║
║         │       ├────────────────────────────────────────┤                       ¦   ║
║         │       │ PluginContext:IPluginContext           │                       ¦   ║
║         │       │ ApplicationContext:IApplicationContext │                       ¦   ║
║         │     1 │ JobId:String                           │                       ¦   ║
║         │    ┌──┤ Cron:Cron                              │                       ¦   ║
║         │    │  └────────────────────────────────────────┘                       ¦   ║
║         │    │                                                                   ¦   ║
║         │    │ 1 ┌──────────────────────────────────────┐                        ¦   ║
║         │    └───► Cron                                 │                        ¦   ║
║         │        ├──────────────────────────────────────┤                        ¦   ║
║         │        │ HttpServerContext:IHttpServerContext │                        ¦   ║
║         │        │ Minute:IEnumerable<Int>              │                        ¦   ║
║         │        │ Hour:IEnumerable<Int>                │                        ¦   ║
║         │        │ Day:IEnumerable<Int>                 │                        ¦   ║
║         │        │ Month:IEnumerable<Int>               │                        ¦   ║
║         │        │ Weekday:IEnumerable<Int>             │                        ¦   ║
║         │        ├──────────────────────────────────────┤                        ¦   ║
║         │        │ Matching(Clock):Bool                 │                        ¦   ║
║         │        └──────────────────────────────────────┘    ┌───────────────┐   ¦   ║
║         │                                                    │ <<Interface>> │   ¦   ║
║         │ 1 ┌──────────────────────────────────┐             │ IComponent    │   ¦   ║
║         └───► Clock                            │             ├───────────────┤   ¦   ║
║             ├──────────────────────────────────┤             └───────Δ───────┘   ¦   ║
║             │ Minute:Int                       │                     ¦           ¦   ║
║             │ Hour:Int                         │                     ¦           ¦   ║
║             │ Day:Int                          │             ┌───────┴───────┐   ¦   ║
║             │ Month:Int                        │             │ <<Interface>> │   ¦   ║
║             │ Weekday:Int                      │             │ IJob          │   ¦   ║
║             ├──────────────────────────────────┤             ├───────────────┤   ¦   ║
║             │ Synchronize():IEnumerable<Clock> │             │ Process()     │   ¦   ║
║             │ Equals(Object):Bool              │             │ Dispose()     │   ¦   ║
║             └──────────────────────────────────┘             └──────Δ────────┘   ¦   ║
║                                                                     ¦            ¦   ║
╚═════════════════════════════════════════════════════════════════════¦════════════¦═══╝
                                  ┌-----------------------------------┘            ¦
╔MyPlugin═════════════════════════¦════════════════════════════════════════════════¦═══╗
║                                 ¦                                                ¦   ║
║                ┌────────────────┴──────────────┐                                 ¦   ║
║                │ MyJob                         ◄---------------------------------┘   ║
║                ├───────────────────────────────┤                                     ║
║                │ Process()                     │                                     ║
║                └───────────────────────────────┘                                     ║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

A job is created by a class that inherits from `Job`. The example below demonstrates how to define a job that starts at 0:30 a.m. on the first day of each month:

```csharp
[Job("30", "0", "1", "*", "*")] 
public sealed class MyJob : Job
{
    public override void Initialization(JobContext context)
    {
        base. Initialization(context);
    }

    public override void Process()
    {
        base Process();
    }
}
```

To provide clarity about the metadata specified in the code above, the following table presents the available attributes and their corresponding details for defining jobs:

|Attribute |Type      |Multiplicity |Optional |Description
|----------|----------|-------------|---------|------------
|Job       |String    |1            |No       |Time information about when the job should be executed. The parameters have the following meanings: Minute (0 - 59), Hour (0 - 23), Day of the month (1 - 31), Month (1 - 12), Weekday (0 - 6) for (Sunday - Saturday). The parameters can consist of single values, comma-separated lists (1, 3, 6, 9, ...), range (from-to) or * for all.

## Task model

Tasks are another form of concurrent code execution. In contrast to jobs, tasks are executed ad-hoc (e.g. an export task that was triggered by the user). The result may not be available until a later date. However, the web application can still be fully used. If the result is available, information is usually provided (e.g. by means of a notification). The following UML diagram illustrates the relationships and structure involved:

```
╔WebExpress.Core═══════════════════════════════════════════════════════════════════════╗
║                                                                                      ║
║                            ┌──────────────────────────┐                              ║
║                            │ <<Interface>>            │                              ║
║                            │ IComponentHub            │                              ║
║                            ├──────────────────────────┤ 1                            ║
║                            │ TaskManager:ITaskManager ├───┐                          ║
║                            │ …                        │   │                          ║
║                            └──────────────────────────┘   │                          ║
║                                                           │                          ║
║              ┌───────────────────┐                        │                          ║
║              │ <<Interface>>     │                        │                          ║
║              │ IComponentManager │                        │                          ║
║              ├───────────────────┤                        │                          ║
║              └────────Δ──────────┘                        │                          ║
║                       ¦                                   │                          ║
║                       ¦                                 1 │                          ║
║              ┌────────┴───────────────────────────────────▼───────┐                  ║
║              │ <<Interface>>                                      │                  ║
║              │ TaskManager                                        │                  ║
║              ├────────────────────────────────────────────────────┤                  ║
║              │ AddTask:Event                                      │                  ║
║              │ RemoveTask:Event                                   │                  ║
║            1 ├────────────────────────────────────────────────────┤                  ║
║       ┌──────┤ ActiveTasks:IEnumerable<ITask>                     │                  ║
║       │      ├────────────────────────────────────────────────────┤                  ║
║       │      │ CreateTask(Id):ITask                               │                  ║
║       │      │ CreateTask(Id,Arguments):ITask                     │                  ║
║       │      │ CreateTask(Id,EventHandler,Arguments):ITask        │                  ║
║       │      │ CreateTask<ITask>(Id,EventHandler,Arguments):ITask ├-------┐          ║
║       │      │ RemoveTask(ITask)                                  │       ¦          ║
║       │      │ GetTask(Id):ITask                                  │       ¦          ║
║       │      │ ContainsTask(Id):Bool                              │       ¦          ║
║       │      └────────────────────────────────────────────────────┘       ¦          ║
║       │                                                                   ¦          ║
║       │               ┌───────────────────────────────┐                   ¦          ║
║       │             * │ <<Interface>>                 │                   ¦          ║
║       └───────────────► ITask                         │                   ¦          ║
║                       ├───────────────────────────────┤                   ¦          ║
║                       │ Start:Event                   │                   ¦          ║
║                       │ Finish:Event                  │                   ¦          ║
║                       ├───────────────────────────────┤                   ¦          ║
║                       │ Id:String                     │                   ¦          ║
║              ┌────────┤ State:TaskState               │                   ¦          ║
║              │        │ Progress:Int                  │                   ¦          ║
║              │        │ Message:String                │                   ¦          ║
║              │        │ Arguments:IEnumerable<Object> │                   ¦          ║
║              │        ├───────────────────────────────┤                   ¦          ║
║              │        │ Process()                     │                   ¦          ║
║              │        │ Cancel()                      │                   ¦          ║
║              │        └──────────────Δ────────────────┘                   ¦          ║
║            1 │                       ¦                                    ¦          ║
║     ┌────────▼────────┐              ¦                                    ¦          ║
║     │ <<Enumeration>> │              ¦                                    ¦          ║
║     │ TaskState       │              ¦                                    ¦          ║
║     ├─────────────────┤              ¦                                    ¦          ║
║     │ Created         │              ¦                                    ¦          ║
║     │ Run             │              ¦                                    ¦          ║
║     │ Canceled        │              ¦                                    ¦          ║
║     │ Finish          │              ¦                                    ¦          ║
║     └─────────────────┘              ¦                                    ¦          ║
║                                      ¦                                    ¦          ║
╚══════════════════════════════════════¦════════════════════════════════════¦══════════╝
                                       ¦                                    ¦
╔MyPlugin══════════════════════════════¦════════════════════════════════════¦══════════╗
║                                      ¦                                    ¦          ║
║                       ┌──────────────┴────────────────┐            create ¦          ║
║                       │ MyTask                        ◄-------------------┘          ║
║                       ├───────────────────────────────┤                              ║
║                       │ Start:Event                   │                              ║
║                       │ Finish:Event                  │                              ║
║                       ├───────────────────────────────┤                              ║
║                       │ Id:String                     │                              ║
║                       │ State:TaskState               │                              ║
║                       │ Progress:Int                  │                              ║
║                       │ Message:String                │                              ║
║                       │ Arguments:IEnumerable<Object> │                              ║
║                       ├───────────────────────────────┤                              ║
║                       │ Process()                     │                              ║
║                       │ Cancel()                      │                              ║
║                       └───────────────────────────────┘                              ║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

Tasks are created dynamically by instantiating a class derived from `Task` and starting it from the `TaskManager`. The tasks can take the following states:

```
╔══════════╗           ╔═══════════╗
║ Created  ║           ║ Cancelled ║
╚══════════╝           ╚═════▲═════╝
     │                       │
     │                       │
     │       ┌───────┐       │ 
     └───────►  Run  ├───────┘
             └───┬───┘
                 │
                 │
                 │
           ╔═════▼════╗ 
           ║  Finish  ║
           ╚══════════╝
```


## Notification model

Notifications are messages that are displayed to users as pop-up windows. The notifications are globally (visible to all), linked to a session (visible to current users) or to specific roles (visible to selected users). The notifications are displayed in the upper right corner and are retained when a page is changed. Notifications are closed by the user or at the end of the display period. Notifications that are visible to multiple users are removed by closing a user. To better understand the relationships and structure, refer to the UML diagram below:

```
╔WebExpress.UI═════════════════════════════════════════════════════════════════════════╗
║                                                                                      ║
║  ┌──────────────────────────────────────────┐                                        ║
║  │ <<Interface>>                            │                                        ║
║  │ IComponentHub                            │                                        ║
║  ├──────────────────────────────────────────┤ 1                                      ║
║  │ NotificationManager:INotificationManager ├────────────────────────┐               ║
║  │ …                                        │                        │               ║
║  └──────────────────────────────────────────┘                        │               ║
║                                                                      │               ║
║  ┌────────────────────────────────────┐                              │               ║
║  │ <<Interface>>                      │                              │               ║
║  │ IComponentManager                  │                              │               ║
║  ├────────────────────────────────────┤                              │               ║
║  │ Initialization(IHttpServerContext) │                              │               ║
║  └─────────────Δ──────────────────────┘                              │               ║
║                ¦                                                     │               ║
║                ¦                                                   1 │               ║
║  ┌─────────────┴─────────────────────────────────────────────────────▼────────┐      ║
║  │ <<Interface>>                                                              │      ║
║  │ INotificationManager                                                       │      ║
║  ├────────────────────────────────────────────────────────────────────────────┤      ║
║  │ CreateNotification:Event                                                   │      ║
║  │ DestroyNotification:Event                                                  │      ║
║  ├────────────────────────────────────────────────────────────────────────────┤ 1    ║
║  │ GlobalNotifications:IEnumerable<INotification>                             ├────┐ ║
║  ├────────────────────────────────────────────────────────────────────────────┤    │ ║
║  │ AddNotification(Message,Durability,Heading,Icon,TypeNotification)          │    │ ║
║  │   :INotification                                                           │    │ ║
║  │ AddNotification(IRequest,Message,Durability,Heading,Icon,TypeNotification) │    │ ║
║  │   :INotification                                                           │    │ ║
║  │ GetNotifications(IRequest):IEnumerable<INotification>                      │    │ ║
║  │ RemoveNotification(Id)                                                     │    │ ║
║  │ RemoveNotification(IRequest)                                               │    │ ║
║  └────────────────────────────────────────────────────────────────────────────┘    │ ║
║                                                                                    │ ║
║                                                                           ┌────────┘ ║
║                                                                         * │          ║
║                                               ┌───────────────────────────▼───────┐  ║
║                                               │ <<Interface>>                     │  ║
║                                               │ INotification                     │  ║
║                                               ├───────────────────────────────────┤  ║
║                                               │ Id:Guid                           │  ║
║                                               │ Heading:String                    │  ║
║                                               │ Message:String                    │  ║
║                                               │ Durability:Int                    │  ║
║                                               │ Icon:String                       │  ║
║            ┌──────────────────┐               │ Created:DateTime                  │  ║
║            │ <<Enumeration>>  │ 1           1 │ Progress:Int                      │  ║
║            │ TypeNotification ◄───────────────┤ TypeNotification:TypeNotification │  ║
║            ├──────────────────┤               └───────────────────────────────────┘  ║
║            │ Default          │                                                      ║
║            │ Primary          │                                                      ║
║            │ Secondary        │                                                      ║
║            │ Success          │                                                      ║
║            │ Info             │                                                      ║
║            │ Warning          │                                                      ║
║            │ Danger           │                                                      ║
║            │ Dark             │                                                      ║
║            │ Light            │                                                      ║
║            │ White            │                                                      ║
║            │ Transparent      │                                                      ║
║            └──────────────────┘                                                      ║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

The `NotificationManager` is the central class for notifications. The `AddNotification` method is used to create notifications. The following properties can be assigned to notifications:

|Property   |Optional |Description
|-----------|---------|-----------------
|Id         |No       |Is assigned internally. A change is not possible.
|Heading    |Yes      |The heading, or null if you don't want it to be displayed.
|Message    |No       |The body of the message.
|Durability |Yes      |The display time in milliseconds. If the number is less than 0, the notification remains active until it is closed by the user.
|Progress   |Yes      |Instead of the display duration, a progress value from 0 to 100 can be specified. A value less than zero means that no progress is calculated.
|Icon       |Yes      |A URI that contains an icon.
|Type       |Yes      |Is the notification type. The following values are supported: Primary, Secondary, Success, Info, Warning, Danger, Dark, Light, White

Here is an example to illustrate how the `NotificationManager` functions. Notifications can be added with specific properties such as heading, message, icon, and duration. The following snippet demonstrates how to create a simple welcome notification:

```csharp
// Welcome notification
NotificationManager.AddNotification
(
    heading: I18N("inventoryexpress:app.notification.welcome.label"),
    message: I18N("inventoryexpress:app.notification.welcome.description"),
    icon: Context.Icon,
    durability: 30000
);
```

The functions of the `NotificationManager` can also be accessed via the REST API interface `{base path}/wxapp/api/v1/popupnotifications` can be accessed. The following methods are available:

|Method |Parameter             |Description
|-------|----------------------|----------------
|Get    |None                  |Detects all notifications for the current user.
|Post   |A notification object |Stores a notification.
|Delete |The id                |Deletes an existing notification.


## MessageQueue model

The `MessageQueueManager` is the central component responsible for receiving and forwarding messages within the `WebExpress.WebApp` application layer. Data exchange takes place over a bidirectional `WebSocket` connection provided by a dedicated socket endpoint. This approach enables direct, event-driven communication between client and server without the overhead of traditional HTTP requests.

Any object within **WebExpress** can register with the message queue to receive messages or send its own. Registration is performed through a standardized interface, allowing both client-side and server-side components to participate in message exchange. The message queue manages all connected listeners, distributes incoming messages to the registered recipients, and forwards outgoing messages through the existing WebSocket connection. This makes it possible to reliably implement features such as real-time notifications, chat messages, status updates, or cross-system commands.

To support selective and context‑aware communication, the `MessageQueueManager` maintains an internal registry of all active WebSocket sessions. Each session contains the active WebSocket instance, a unique session identifier and a metadata dictionary with contextual information provided by the client. Typical metadata entries include the current route of the client, the tenant context, the active language or additional application‑specific values. The registry acts as a compact in‑memory database and allows the server to identify exactly which clients match a given context and should receive a specific message. This enables precise routing instead of global broadcasting and ensures that server‑initiated messages reach only the intended clients.

**WebExpress** uses a structured and type‑safe addressing model to determine which clients receive a message. Addressing is performed through clearly defined address objects that describe the selection criteria for a client session. The `MessageQueueManager` evaluates these address objects centrally and determines whether a session qualifies as a valid recipient. Predefined address types cover common scenarios and can be extended at any time without modifying the core logic. This model ensures that server‑side components can target specific clients with precision and consistency.

All address types implement a shared interface:

```csharp
public interface IAddress
{
    bool Matches(IClientSession session);
}
```

Example: Addressing by URI

```csharp
public sealed class UriAddress : IAddress
{
    public string Uri { get; }

    public UriAddress(string uri)
    {
        Uri = uri;
    }

    public bool Matches(IClientSession session)
    {
        return Uri.Equals(session.Uri);
    }
}
```

This structure allows the creation of additional address types such as tenant‑based routing, user‑based routing or combined conditions. The addressing model remains consistent and predictable across all implementations and ensures that server‑side messages reach exactly the clients that match the defined criteria.
Type‑Safe Message Dispatch

Based on the addressing model, the `MessageQueueManager` provides a type‑safe method for sending messages from the server to selected clients:

```csharp
public async Task SendAsync(IEnvelope envelope, IAddress address, CancellationToken cancellationToken = default)
{
    // Serialization, selection of matching sessions and dispatch
}
```

The following overview illustrates how these components interact within the **WebExpress** architecture and how the `MessageQueueManager` integrates into the overall system structure.

```
╔WebExpress.Core═══════════════════════════════════════════════════════════════════════╗
║                                                                                      ║
║                  ┌───────────────────┐                                               ║
║                  │ <<Interface>>     │                                               ║
║                  │ IComponentManager │                                               ║
║                  ├───────────────────┤                                               ║
║                  └─────────Δ─────────┘                                               ║
║                            ¦                                                         ║
╚════════════════════════════¦═════════════════════════════════════════════════════════╝
                             ¦
╔WebExpress.WebApp═══════════¦═════════════════════════════════════════════════════════╗
║                            ¦                                                         ║
║         ┌──────────────────┴────────────────────┐    ┌────────────────────┐          ║
║         │ <<Interface>>                         │    │ <<Interface>>      │          ║
║         │ IMessageQueueManager                  │    │ IEnvelope          │          ║
║         ├───────────────────────────────────────┤    ├────────────────────┤          ║
║         │ Register(Guid,IMessageQueueSocket)    │    │ Version:Int        │          ║
║         │   IMessageQueueManager                │    │ Channel:String     │          ║
║         │ Register(String,Action<IEnvelope>)    │    │ Type:String        │          ║
║         │   IMessageQueueManager                │    │ MessageId:String   │          ║
║         │ Unregister(Guid):                     │    │ ConnectionId:Guid  │          ║
║         │   IMessageQueueManager                │    │ Sender:String      │          ║
║         │ Unregister(String,Action<IEnvelope>): │    │ Timestamp:DateTime │          ║
║         │   IMessageQueueManager                │    │ Payload:Object     │          ║
║         │ SendAsync(IAddress,IEnvelope,         │    └────────────────────┘          ║
║         │   CancellationToken):                 │                                    ║
║         │   Task<IMessageQueueManager>          │                                    ║
║         └───────────────────────────────────────┘                                    ║
║                                                                                      ║
║              ┌──────────────────────────────┐                                        ║
║              │ <<Interface>>                │                                        ║
║              │ IAddress                     │                                        ║
║              ├──────────────────────────────┤                                        ║
║              │ Matches(IClientSession):bool │                                        ║
║              └─────────────Δ────────────────┘                                        ║
║                            ¦                                                         ║
║                            ¦                                                         ║
║              ┌─────────────┴────────────────┐                                        ║
║              │ AddressDomain                │                                        ║
║              ├──────────────────────────────┤                                        ║
║              │ Matches(IClientSession):bool │                                        ║
║              └──────────────────────────────┘                                        ║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

### Message Envelope Structure

The envelope is the standardized message container used by **WebExpress** to transport all real‑time communication through the `MessageQueueManager`. It defines a uniform structure for every message exchanged between client and server, independent of its purpose or origin. By encapsulating metadata and payload in a consistent format, the envelope enables reliable routing, type‑safe processing and predictable behavior across all WebSocket‑based features.

Each envelope consists of two parts: a metadata header and a payload section. The metadata describes how the message should be interpreted and routed. It contains the protocol version, the logical communication channel, the semantic message type, a unique message identifier, a timestamp and the sender information. These fields allow the `MessageQueueManager` to classify the message, apply the appropriate addressing rules and forward it to the correct recipients. The payload contains the domain‑specific data of the message. Its structure depends on the channel and the message type, for example notification content, progress updates, chat messages or WebRTC signaling information.

A typical envelope has the following structure:

```json
{
  "version": 1,
  "channel": "notification",
  "type": "event",
  "messageId": "notif-42",
  "timestamp": "2026-01-16T07:00:00Z",
  "sender": "NotificationManager",
  "payload": {
    "title": "Import running",
    "message": "The import process is currently at 35 percent.",
    "severity": "info",
    "notificationId": "import-2026",
    "state": "open"
  }
}
```

### Description of the example scenario

A client establishes a persistent connection to the WebExpress server through a WebSocket endpoint. After the handshake is completed, the session is recorded in the internal registry of the `MessageQueueManager`. This session contains the active WebSocket instance as well as metadata such as the current route, the user context, or other application‑specific values.

When the server creates a notification, for example a status message or an indication of a running operation, the message is passed to the `MessageQueueManager` as a structured envelope object. The addressing process is performed using an appropriate address object that defines which sessions should receive the message. Since the client is actively connected and matches the selection criteria, the message is delivered to the client through the existing WebSocket connection.

On the client side, the message is displayed in the notification area of the user interface. The notification remains visible until the user closes it manually or until the server sends a completion message, for example when a task reaches 100 percent. As long as neither of these conditions occurs, the notification is considered open.

If the user navigates to another page, the existing WebSocket connection is closed and a new connection is established. The `MessageQueueManager` registers the new session as a separate entry in the registry and receives the metadata that describes the client’s current context. Since the original notification is still marked as open on the server, it is sent again when the new session is created. The mechanism is the same as before: the message is distributed through the addressing model to all sessions that match the criteria, including the newly established connection.

The client displays the notification again, regardless of the fact that the previous session has already been closed. Only when the user closes the notification window or the server marks the notification as completed is it removed from the server‑side state. From that point on, it is no longer delivered during subsequent page changes.

```
┌────────┐               ┌────────┐               ┌─────────┐           ┌──────────────┐
│ Web    │               │ Web    │               │ Message │           │ Notification │
│ Client │               │ Socket │               │ Queue   │           │ Manager      │
│        │               │        │               │ Manager │           │              │
└────┬───┘               └────┬───┘               └────┬────┘           └───────┬──────┘
     ¦                        ¦                        ¦                        ¦
    ┌┴┐     WebSocket Connect┌┴┐                      ┌┴┐                      ┌┴┐
    │ ├─────────────────────>│ │      Register Session│ │                      │ │
    │ │                      │ ├─────────────────────>│ │                      │ │
    │ │                      │ │                      │ │ Dispatch Notification│ │
    │ │                      │ │Notification          │ │<─────────────────────┤ │
    │ │Notification          │ │<─────────────────────┤ │                      │ │
    │ │<─────────────────────┤ │                      │ │                      │ │
    │ │                      │ │                      │ │                      │ │
------------ User navigates (User does NOT close notification; still active) -----------
    │ │                      │ │                      │ │                      │ │
    │ │       WebSocket Close│ │                      │ │                      │ │
    │ ├─────────────────────>│ │    Unregister Session│ │                      │ │
    │ │                      │ ├─────────────────────>│ │                      │ │
    │ │ New WebSocket Connect│ │                      │ │                      │ │
    │ ├─────────────────────>│ │      Register Session│ │                      │ │
    │ │                      │ ├─────────────────────>│Check active notifications│
    │ │                      │ │                      │ ├─────────────────────>│ │
    │ │                      │ │                      │ │                      │ │
    │ │                      │ │                      │ │ Dispatch Notification│ │
    │ │                      │ │Notification          │ │<─────────────────────┤ │
    │ │Notification          │ │<─────────────────────┤ │                      │ │
    │ │<─────────────────────┤ │                      │ │                      │ │
    │ │                      │ │                      │ │                      │ │
------------------ User closes notification OR server marks it resolved ----------------

    │ │    Close Notification│ │                      │ │                      │ │
    │ ├─────────────────────>│ │          Update state│ │                      │ │
    │ │                      │ ├─────────────────────>│ │Mark notification done│ │
    │ │                      │ │                      │ ├─────────────────────>│ │
    │ │                      │ │                      │ │                      │ │
    └─┘                      └─┘                      └─┘                      └─┘
```


## Index model

The index model provides a reverse index to enable fast and efficient searching. A reverse index can significantly speed up access to the data. However, creating and storing a reverse index requires additional storage space and Processing time. The storage requirement increases, especially with large amounts of data can be important. Therefore, it is important to weigh the pros and cons to achieve the best possible performance. The full-text search in **WebExpress** supports the following search options:

- Word search
- Wildcard search
- Phrase search (exact word sequence)
- Proximity search
- Fuzzy search

```
╔IndexManager══════════════════════════════════════════╗
║   ┌──────────┐                                       ║
║   │ WebIndex │                                       ║
║   └────┬─────┘                                       ║
║      1 │                                             ║
║        │            ┌IndexDocumentStore---------┐    ║
║      * │            ¦                           ¦    ║
║ ┌──────▼────────┐ 1 ¦ * ┌──────┐                ¦    ║
║ │ IndexDocument ├───────► Item │                ¦    ║
║ └──────┬────────┘   ¦   └──────┘                ¦    ║
║      1 │            └---------------------------┘    ║
║        │                                             ║
║      * │                                             ║
║  ┌─────▼──────┐                                      ║
║  │ IndexField │                                      ║
║  └─────┬──────┘                                      ║
║      1 │                                             ║
║ ┌------│--------IndexReverse┐                        ║
║ ¦    * │                    ¦                        ║
║ ¦  ┌───▼──┐                 ¦                        ║
║ ¦  │ Term │                 ¦                        ║
║ ¦  └───┬──┘                 ¦                        ║
║ ¦    1 │                    ¦                        ║
║ ¦      │                    ¦                        ║
║ ¦    * │                    ¦                        ║
║ ¦ ┌────▼────┐               ¦                        ║
║ ¦ │ Posting │               ¦                        ║
║ ¦ └────┬────┘               ¦                        ║
║ ¦    1 │                    ¦                        ║
║ ¦      │                    ¦                        ║
║ ¦    * │                    ¦                        ║
║ ¦ ┌────▼─────┐              ¦                        ║
║ ¦ │ Position │              ¦                        ║
║ ¦ └──────────┘              ¦                        ║
║ └---------------------------┘                        ║
╚══════════════════════════════════════════════════════╝
```

To create a reverse index, the data type to be indexed must be registered in the `IndexManager`. This ensures that the system is aware of the data type and can properly index it. The example below demonstrates how to implement a data type that adheres to the `IIndexItem` interface and register it:

```csharp
// DataType must implement the IIndexItem interface.
public class DataType : IIndexItem
{
    [IndexIgnore]
    public int Id { get; set;}
    public string Text { get; set;}
} 

WebEx.ComponentHub.GetComponent<IndexManager>().Register<DataType>();
```

The reverse index is built by using the `ReBuild` method for all objects or `Add` for an object. The following example demonstrates how to use the `ReIndex` method to rebuild the index for a collection of records:

```csharp
var records = new []
{
    new DataType(){ Id=0, Text="lorem ipsum" },
    new DataType(){ Id=1, Text="lorem scelerisque ornare" } 
};

WebEx.ComponentHub.GetComponent<IndexManager>().ReIndex(records);
```

To access the reverse index, WQL (see below) is used. The example below demonstrates how to execute a WQL query via the `IndexManager` to find entries matching specific criteria:

```csharp
var wql = WebEx.ComponentHub.GetComponent<IndexManager>().ExecuteWql("Text ~ \"lorem\"");
var res = wql?.Apply();
```

### WQL

The WebExpress Query Language (WQL) is a query language that filters and sorts a given amount of data from the reverse index. A statement of the query language is usually sent from the client to the server, which collects, filters and sorts the data in the reverse index and sends it back to the client. Example of a WQL:

```
Name ~ "WebExpress" and Create < now(-3d) orderby Create desc take 5
```

The example returns the first five elements of the dataset that contain the value **WebExpress** in the Name attribute and that were created three days ago (Create attribute) or earlier. The result is sorted in descending order by creation date.

For detailed information about `WebIndex`, see [concept](https://github.com/webexpress-framework/WebExpress.WebIndex/blob/main/doc/concept.md).

## Identity model

A large number of web applications are subject to requirements for access protection, integrity and confidentiality. These requirements can be met through identity and access management (IAM). In identity management, identities are managed. In access management, on the other hand, authorized entities are enabled to use a service (application). **WebExpress** supports the following identity management features:

- Provisioning: Provides **WebExpress** with the basic requirements for the entities to carry out their activities. Deprovisioning is the opposite path, in which the prerequisites are withdrawn (e.g. when leaving).
- Authentication: Handles the identification process of the entities.
- Authorization: Granting permission for a specific entity to use a specific service.

The provisioning service provides **WebExpress** with the basic requirements for the operation of the identities. This is realized with the help of a user account. The following illustration outlines the lifecycle of a user account. A user account can be in one of two states, `Active` and `Deactivated`. If the events `Create`, `Update`, `Disable`, `Enable` or `Delete` occur, the user account changes its state.

```
╔═══════╗                  ╔═══════════╗
║  New  ║      Update      ║  Deleted  ║
╚═══════╝       ┌──┐       ╚══▲═════▲══╝
    │           │  │          │     │
    │ Created   │  │  Delete  │     │
    │       ┌───▼──┴───┐      │     │
    └───────►  Active  ├──────┘     │
            └───┬─▲────┘            │
                │ │                 │
        Disable │ │ Enable          │
                │ │                 │
         ┌──────▼─┴──────┐  Delete  │
         │  Deactivated  ├──────────┘
         └───────────────┘
```

- **Create:** This event creates a new user account for an entity. As a rule, each entity should have exactly one user account. 
- **Update:** The update event is triggered in the event of changes (e.g. marriage or relocation). The changes are forwarded to the appropriate user accounts.
- **Disable:** This event disables the user account. However, allocated resources are retained and can no longer be used.
- **Enable:** A deactivated user account can be transferred to the activated state with the help of this event.
- **Delete:** This event is used for deprovisioning and deletes the user account of an entity.

**WebExpress** supports two methods of identity management:

- On-premises identity management: Each application has its own user management. The cost of setting up the necessary infrastructure is particularly easy here, as identity management is carried out directly by the application. Each application has its own identity domain, which is disadvantageous from a unified identity management perspective.
- Shared identity management: If the identities are outsourced to a central service and retrieved by the applications, there is shared identity management. Shared identity management allows you to reduce the number of identity domains. 

Entities (e.g., people, technical systems, services) possess one or more identities, which distinguish them from other entities. An identity is used for identification and consists of a collection of attributes (e.g., name, password) that individualize the entity. Identities can be grouped based on shared characteristics. Each group can be assigned one or more policies, which define the permissions granted to the group or its members. These policies determine what actions are allowed on specific resources. The following UML diagram illustrates the concept of identity and its relationships to groups, policies, and permissions:

```
  O   1   *  ┌────────────┐ *    * ┌─────────┐ *    * ┌──────────┐ *    * ┌────────────┐
 /░\ ────────►  Identity  ├────────►  Group  ├────────►  Policy  ├────────► Permission │
 /‾\         └─────┬──────┘        └─────────┘        └──────────┘        └────────────┘
Entity           1 │
                   │
                 * │
             ┌─────▼──────┐
             │  Attribut  │
             └────────────┘
```

Identities and groups must be loaded from a persistent data source, which may be provided by the application itself or retrieved from an external identity management system (e.g., LDAP). Policies and identity-related resources are defined and enforced by the application, typically through static configuration or hardcoded logic. The UML diagram below highlights the key relationships and structural elements:

```
╔WebExpress.Core═══════════════════════════════════════════════════════════════════════╗
║                                                                                      ║
║                                                    ┌───────────────────────────────┐ ║
║                                                    │ <<Interface>>                 │ ║
║         ┌──────────────────────────────────┐       │ IIdentityProvider             │ ║
║         │ <<Interface>>                    │       ├───────────────────────────────┤ ║
║         │ IComponentHub                    │       ├───────────────────────────────┤ ║
║         ├──────────────────────────────────┤ 1     │ GetIdentities:                │ ║
║         │ IdentityManager:IIdentityManager ├────┐  │   IEnumerable<IIdentity>      │ ║
║         │ …                                │    │  │ GetGroups:                    │ ║
║         └──────────────────────────────────┘    │  │   IEnumerable<IIdentityGroup> │ ║
║                                                 │  │ CreateForbiddenPage(          │ ║
║                                                 │  │   IRequest,IEndpointContext,  │ ║
║                         ┌───────────────────┐   │  │   IIdentity):IResponse        │ ║
║                         │ <<Interface>>     │   │  │ CreateAuthenticationPrompt(   │ ║
║                         │ IComponentManager │   │  │   IRequest,IEndpointContext,  │ ║
║                         ├───────────────────┤   │  │   IIdentity):IResponse        │ ║
║                         └────────Δ──────────┘   │  └─────────────────────────▲─────┘ ║
║                                  ¦              │                          * │       ║
║                                  ¦            1 │                            │       ║
║                         ┌────────┴──────────────▼───────────────────────┐ 1  │       ║
║                         │ <<Interface>>                                 ├────┘       ║
║ ┌-----------------------┤ IIdentityManager                              │            ║
║ ¦                       ├───────────────────────────────────────────────┤            ║
║ ¦                       │ Policies:IEnumerable<IIdentityPolicy>         │            ║
║ ¦                       │ Permission:IEnumerable<IIdentityPermission>   │            ║
║ ¦                       ├───────────────────────────────────────────────┤            ║
║ ¦                       │ AddIdentity(IIdentity)                        │            ║
║ ¦                       │ AddGroup(IIdentityGroup)                      │            ║
║ ¦                       │ RemoveIdentity(IIdentity)                     │            ║
║ ¦                       │ RemoveGroup(IIdentityGroup)                   │            ║
║ ¦                       │ CreateForbiddenPage(IRequest,                 │            ║
║ ¦                       │   IEndpointContext,Identity):IResponse        │            ║
║ ¦                       │ CreateAuthenticationPrompt(IRequest,          │            ║
║ ¦                       │   IEndpointContext,Identity):IResponse        │            ║
║ ¦                       │ Login(IRequest,IIdentity):Bool                │            ║
║ ¦                       │ Logout(IRequest)                              │            ║
║ ¦                       │ ComputeHash(SecureString):String              │            ║
║ ¦                       │ RegisterIdentityProvider(IIdentityProvider,   │            ║
║ ¦                       │   IApplicationContext)                        │            ║
║ ¦                       │ UnregisterIdentityProvider(IIdentityProvider, │            ║
║ ¦                       │   IApplicationContext)                        │            ║
║ ¦                       │ GetIdentities(IApplicationContext):           │            ║
║ ¦                       │   IEnumerable<IIdentity>                      │            ║
║ ¦                       │ GetGroups(IApplicationContext):               │            ║
║ ¦                       │   IEnumerable<IIdentityGroup>                 │            ║
║ ¦                       │ CheckAccess(IIdentity,IEndpointContext):Bool  │            ║
║ ¦                       └──────┬──────────┬───────────┬──────────┬──────┘            ║
║ ¦                            1 │        1 │         1 │        1 │                   ║
║ ¦                 ┌────────────┘          │           │          └─────┐             ║
║ ¦                 │                    ┌──┘           │                │             ║
║ ¦               * │                    │              └──┐             │             ║
║ ¦  ┌──────────────▼────────────────┐   │                 │             │             ║
║ ¦  │ <<Interface>>                 │   │                 │             │             ║
║ ¦  │ IIdentity                     │   │                 │             │             ║
║ ¦  ├───────────────────────────────┤   │                 │             │             ║
║ ¦  │ Id:Guid                       │   │                 │             │             ║
║ ¦  │ Name:String                   │   │                 │             │             ║
║ ¦  │ EMail:String                  │   │                 │             │             ║
║ ¦  │ State:IdentityState           │   │                 │             │             ║
║ ¦  │ Groups:                       │   │                 │             │             ║
║ ¦  │   IEnumerable<IIdentityGroup> │   │                 │             │             ║
║ ¦  ├───────────────────────────────┤   │                 │             │             ║
║ ¦  │ Login()                       │   │                 │             │             ║
║ ¦  │ Logout()                      │   │                 │             │             ║
║ ¦  └───────────────────────────────┘   │                 │             │             ║
║ ¦              Δ                       │                 │             │             ║
║ ¦              ¦                     * │                 │             │             ║
║ ¦              ¦    ┌──────────────────▼─────────────┐   │             │             ║
║ ¦              ¦    │ <<Interface>>                  │   │             │             ║
║ ¦              ¦    │ IIdentityGroup                 │   │             │             ║
║ ¦              ¦    ├────────────────────────────────┤   │             │             ║
║ ¦              ¦    │ Id:Guid                        │   │             │             ║
║ ¦              ¦    │ Name:String                    │   │             │             ║
║ ¦              ¦    │ Policies:                      │   │             │             ║
║ ¦              ¦    │   IEnumerable<IIdentityPolicy> │   │             │             ║
║ ¦              ¦    ├────────────────────────────────┤   │             │             ║
║ ¦              ¦    └────Δ───────────────────────────┘   │             │             ║
║ ¦              ¦         ¦                               │             │             ║
║ ¦              ¦         ¦                             * │             │             ║
║ ¦              ¦         ¦    ┌──────────────────────────▼─────────┐   │             ║
║ ¦              ¦         ¦    │ <<Interface>>                      │   │             ║
║ ¦              ¦         ¦    │ IIdentityPolicy                    │   │             ║
║ ¦              ¦         ¦    ├────────────────────────────────────┤   │             ║
║ ¦              ¦         ¦    │ Id:String                          │   │             ║
║ ¦              ¦         ¦    │ Name:String                        │   │             ║
║ ¦              ¦         ¦    │ Description:String                 │   │             ║
║ ¦              ¦         ¦    │ Permissions:                       │   │             ║
║ ¦              ¦         ¦    │   IEnumerable<IIdentityPermission> │   │             ║
║ ¦              ¦         ¦    ├────────────────────────────────────┤   │             ║
║ ¦              ¦         ¦    └─────────────────Δ──────────────────┘   │             ║
║ ¦              ¦         ¦                      ¦                    * │             ║
║ ¦              ¦         ¦                      ¦          ┌───────────▼─────────┐   ║
║ ¦              ¦         ¦                      ¦          │ <<Interface>>       │   ║
║ ¦              ¦         ¦                      ¦          │ IIdentityPermission │   ║
║ ¦              ¦         ¦                      ¦          ├─────────────────────┤   ║
║ ¦              ¦         ¦                      ¦          │ Id:String           │   ║
║ ¦              ¦         ¦                      ¦          │ Name:String         │   ║
║ ¦              ¦         ¦                      ¦          │ Description:String  │   ║
║ ¦              ¦         ¦                      ¦          ├─────────────────────┤   ║
║ ¦              ¦         └-------------┐        ¦          └─────────Δ───────────┘   ║
║ ¦              ¦                       ¦        ¦                    ¦               ║
╚═¦══════════════¦═══════════════════════¦════════¦════════════════════¦═══════════════╝
  ¦              ¦                       ¦        ¦                    ¦     
╔MyPlugin════════¦═══════════════════════¦════════¦════════════════════¦═══════════════╗
║ ¦              ¦                       ¦        ¦                    ¦               ║
║ ¦  ┌───────────┴───────────────────┐   ¦        ¦                    └-┐             ║
║ ¦  │ MyIdentity                    │   ¦        ¦                      ¦             ║
║ ¦  ├───────────────────────────────┤   ¦        └------------┐         ¦             ║
║ ¦  │ Id:Guid                       │   ¦                     ¦         ¦             ║
║ ¦  │ Name:String                   │   ¦                     ¦         ¦             ║
║ ¦  │ EMail:String                  │   ¦                     ¦         ¦             ║
║ ¦  │ State:IdentityState           │1  ¦                     ¦         ¦             ║
║ ¦  │ Groups:                       ├───¦─────┐               ¦         ¦             ║
║ ¦  │   IEnumerable<IIdentityGroup> │   ¦     │               ¦         ¦             ║
║ ¦  ├───────────────────────────────┤   ¦     │               ¦         ¦             ║
║ ¦  │ Login()                       │   ¦     │               ¦         ¦             ║
║ ¦  │ Logout()                      │   ¦     │               ¦         ¦             ║
║ ¦  └───────────────────────────────┘   ¦     │               ¦         ¦             ║
║ ¦                                      ¦     │               ¦         ¦             ║
║ ¦                                    * ¦   * │               ¦         ¦             ║
║ ¦                   ┌──────────────────┴─────▼───────┐       ¦         ¦             ║
║ ¦                   │ MyIdentityGroup                │       ¦         ¦             ║
║ ¦                   ├────────────────────────────────┤       ¦         ¦             ║
║ ¦                   │ Id:Guid                        │       ¦         ¦             ║
║ ¦                   │ Name:String                    │1      ¦         ¦             ║
║ ¦                   │ Policies:                      ├──┐    ¦         ¦             ║
║ ¦                   │   IEnumerable<IIdentityPolicy> │  │    ¦         ¦             ║
║ ¦                   ├────────────────────────────────┤  │    ¦         ¦             ║
║ ¦                   └────────────────────────────────┘  │    ¦         ¦             ║
║ ¦                                                       │    ¦         ¦             ║
║ ¦                                                     * │    ¦         ¦             ║
║ ¦                 create  ┌─────────────────────────────▼────┴─┐       ¦             ║
║ ├------------------------►│ MyIdentityPolicy                   │       ¦             ║
║ ¦                         ├────────────────────────────────────┤       ¦             ║
║ ¦                         │ Id:String                          │       ¦             ║
║ ¦                         │ Name:String                        │       ¦             ║
║ ¦                         │ Description:String                 │1      ¦             ║
║ ¦                         │ Permissions:                       ├──┐    ¦             ║
║ ¦                         │   IEnumerable<IIdentityPermission> │  │    ¦             ║
║ ¦                         ├────────────────────────────────────┤  │    ¦             ║
║ ¦                         └────────────────────────────────────┘  │    ¦             ║
║ ¦                                                                 │    ¦             ║
║ ¦                                                               * │    ¦             ║
║ ¦                                             create       ┌──────▼────┴──────────┐  ║
║ └----------------------------------------------------------► MyIdentityPermission │  ║
║                                                            ├──────────────────────┤  ║
║                                                            │ Id:String            │  ║
║                                                            │ Name:String          │  ║
║                                                            │ Description:String   │  ║
║                                                            ├──────────────────────┤  ║
║                                                            └──────────────────────┘  ║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

**WebExpress** provides the following default groups:

|Group |Description
|------|------------------
|All   | All identities are members of the group.

**WebExpress** provides the following policies:

|Policy              |Description
|--------------------|----------------------
|PublicAccess        |Grants access to public resources without authentication.
|AuthenticatedAccess |Grants general access to authenticated users.
|SystemAccess        |Allows system-level operations like installing, updating, and maintaining the application.

In addition to the predefined standard policies, custom policies can also be created by defining them in dedicated classes. The example below demonstrates how to define a custom policy using the `IIdentityPolicy` interface and associate it with a specific permission:

```csharp
[Name("myPolicy")]
[Permission<MyIdentityPermission>()]
public sealed class MyIdentityPolicy : IIdentityPolicy
{
}
```

The policy definition classes have the following attributes:

|Attribute   |Type                  |Multiplicity |Optional |Description
|------------|----------------------|-------------|---------|-------------
|Name        |String                |1            |No       |The human-readable name of the policy or an internationalization key.
|Description |String                |1            |Yes      |The description of the policy. This can be a key to internationalization.
|Permission  |`IIdentityPermission` |n            |Yes      |Inherits the characteristics of the specified permission.

Permissions define specific rights or access controls that are allocated to one or more policies within an application. The example below demonstrates how to define a permission using the `IIdentityPermission` interface and assign it to a policy:

```csharp
[Name("Write content")]
[Policy<MyIdentityPolicy>()]
public sealed class MyIdentityPermission : IIdentityPermission
{
}
```

To provide clarity about the metadata specified in the code above, the following table presents the available attributes and their corresponding details for defining permissions:

|Attribute   |Type              |Multiplicity |Optional |Description
|------------|------------------|-------------|---------|-------------
|Name        |String            |1            |No       |The human-readable name of the permission or an internationalization key.
|Description |String            |1            |Yes      |The description of the permission. This can be a key to internationalization.
|Policy      |`IIdentityPolicy` |n            |Yes      |Inherits the characteristics of the specified policy.

In the case of an authorization check (can an identity be accessed by an identity resource (e.g. page)), it must be checked whether there is at least one transition (identity -> group -> policy -> permission). This is done by the function `CheckAccess: (Identity, Permission) > Bool ` of the `IdentityManager`. A return value of `true` means that access can be made.

```
╔═══════════════════════════════════════════╗
║ Determine requested endpoint or component ║
╚═══════════════════════════════════════════╝
                     │ 
  ┌──────────────────┴──────────────────────────┐
  │      Authorization required?                │
  │                                         Yes │
  │                            ┌────────────────▼───────────────┐ Yes
  │                            │ Determine the current identity ◄───────────────┐
  │                            └────────────────┬───────────────┘               │
  │                                             │                               │
  │                          ┌──────────────────┴──────────────────────┐        │
  │                          │   Is current identity authenticated?    │        │
  │                      Yes │                                         │        │
  │ ┌────────────────────────▼─────────────────────────┐               │        │
  │ │ Determine Identity/Group/Policy/Permission paths │               │        │
  │ └─────────────────────────┬────────────────────────┘               │        │
  │                           │                                        │        │
  │                 ┌─────────┴─────────────────────────────────┐      │        │
  │                 │  Is there at least one path?              │      │        │
  │                 │                                        No │      │ No     │
  └──────────┐      │                     ┌─────────────────┬───▼──────▼───┐    │
             │      │                     │                 │    Type?     │    │
             │      │                     │            page │              │    │
             │      │                     │         ┌───────▼──────┐       │    │
             │      │                     │         │ Login dialog │       │    │
             │      │                     │         └───────┬──────┘       │    │
             │      │                     │                 │              │    │
             │      │                     │      ┌──────────┴──────────────│────┘
             │      │                     │      │  Login successful?      │
          No │      │ Yes        endpoint │   No │                         │ component
         ╔═══▼══════▼═══╗           ╔═════▼══════▼═════╗           ╔═══════▼════════╗
         ║ Grant access ║           ║ Status page 401  ║           ║ Hide component ║
         ╚══════════════╝           ╚══════════════════╝           ╚════════════════╝
```

# WebApp template

The `WebExpress.WebApp.dll` package provides a template for creating business applications.

## WebApp page

The template determines the layout of a page. The page is divided into a header, a side area, the page content, and a footer. The individual sections (areas) can be accessed via the class properties. Furthermore, components can bind to these areas and display their contents.

```
╔WebAppPage════════════════════════════════════════════════════════════════════════════╗
║┌Header──────────────────────────────────────────────────────────────────────────────┐║
║│ Icon AppTitle     Link ▼  Link ▼  Link ▼     Create ▼     Search    ?         ⚙ ▼ │║
║└────────────────────────────────────────────────────────────────────────────────────┘║
║┌ToastNotfication────────────────────────────────────────────────────────────────────┐║
║│ Notfications                                             ┌PopupNotfication──────┐ ×│║
║└──────────────────────────────────────────────────────────│ ┌Notfication───────┐ │──┘║
║┌Breadcrumb────────────────────────────────────────────────│ │ Icon Title      ×│ │──┐║
║│ / Site / ...                                             │ │      Description │ │  │║
║└──────────────────────────────────────────────────────────│ └──────────────────┘ │──┘║
║┌Prologue──────────────────────────────────────────────────│ ┌Notfication───────┐ │──┐║
║│                                                          │ │ Icon Title      ×│ │  │║
║└──────────────────────────────────────────────────────────│ │      Description │ │──┘║
║┌Sidebar──────────────┐ ┌SearchOptions─────────────────────│ └──────────────────┘ │──┐║
║│                     │░│                                  │ ┌Notfication───────┐ │ ×│║
║│                     │░└──────────────────────────────────│ │ Icon Title      ×│ │──┘║
║│                     │░┌Content───────────────────────────│ │      Description │ │──┐║
║│                     │░│                                  │ └──────────────────┘ │  │║
║│                     │░│                                  └──────────────────────┘  │║
║│                     │░│                                                            │║
║│                     │░│                                                            │║
║│                     │░│                                                            │║
║│                     │░│                                                            │║
║│                     │<│                                                            │║
║│                     │<│                                                            │║
║│                     │<│                                                            │║
║│                     │░│                                                            │║
║│                     │░│                                                            │║
║│                     │░│                                                            │║
║│                     │░│                                                            │║
║│                     │░│                                                            │║
║│                     │░│                                                            │║
║│                     │░│                                                            │║
║│                     │░│                                                            │║
║└─────────────────────┘ └────────────────────────────────────────────────────────────┘║
║┌Footer──────────────────────────────────────────────────────────────────────────────┐║
║│                                                                                    │║
║└────────────────────────────────────────────────────────────────────────────────────┘║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

### Header

The business application header contains buttons and submenus to navigate the application at the top level. The `ApplicationNavigator` refers to other (**WebExpress**) applications. The `AppTitle` contains the name of the application. This comes from the name attribute of the application (see Section 3.3). The AppNavigation links point to key features of the application. The `QuickCreate` button provides functionality for creating records. In the search field, search queries can be passed to the application. The `Help` shaft panel groups the application's help links. The `Notification` button collects all notifications from the application. In the `Avatar` button, the functions of the user account are provided. The `Setting` button contains the functions for configuring the application.

```
                         AppNavigationPreferences
                                 │
                                 │  AppNavigationPrimary
                                 │          │
                                 │          │   AppNavigationSecondary
                                 │          │           │
╔Header══════════════════════════│══════════│═══════════│════════════════════════════:
║┌AppNavigator┐┌AppTitle────┐┌───V──────────V───────────V──────┐┌QuickCreate┐┌Search─:
║│ Icon       ││ WebExpress ││ Link ▼     Link ▼      Link ▼   ││ Create ▼  ││       :
║└──┬─────────┘└────────────┘└─────────────────────────────────┘└──────────┬┘└───────:
╚═┌─┴──────────┐════════════════════════════════════════════════┌──────────┴─┐═══════:
  │ $AppTitle  │                        QuickCreatePreferences →│ Link       │
  ├────────────┤                                                ├────────────┤
  │ Link       │← AppNavigatorPreferences   QuickCreatePrimary →│ Link       │
  ├────────────┤                                                ├────────────┤
  │ Link       │← AppNavigatorPrimary     QuickCreateSecondary →│ Link       │
  ├────────────┤                                                └────────────┘
  │ Link       │← AppNavigatorSecondary
  └────────────┘
                        ┌──────────────┐
                        │ Notification │
                        ├──────────────┤
                        │ Link         │← Notification-
                        ├──────────────┤  Preferences
                        │ Link         │← Notification-
                        ├──────────────┤  Primary
                        │ Link         │← Notification-
                        └─┬────────────┘  Secondary
        :═════════════════│══════════════════════════════════════╗
        :────────┐┌Help─┐┌Notification────────┐┌Avatar────┐┌────┐║
        :        ││  ?  ││                    ││          ││  ▼ │║
        :────────┘└───┬─┘└────────────────────┘└┬─────────┘└──┬─┘║
        :═══════┌─────┴┐══════════════════════┌─┴─────────┐═┌─┴────────┐
                │ Help │                      │ $UserName │ │ Settings │
                ├──────┤                      ├───────────┤ ├──────────┤    
         Help- →│ Link │  ProfilePreferences →│ Link      │ │ Link     │← Settings-
  Preferences   ├──────┤                      ├───────────┤ ├──────────┤  Preferences
         Help- →│ Link │      ProfilePrimary →│ Link      │ │ Link     │← Settings-
      Primary   ├──────┤                      ├───────────┤ ├──────────┤  Primary
         Help- →│ Link │    ProfileSecondary →│ Link      │ │ Link     │← Settings- 
     Secondary  └──────┘                      └───────────┘ └──────────┘  Secondary
```

### Sidebar

The left side area of the application is responsible for the navigation of a thematically related area/function. Links to sub-functions or data sets can be created and displayed here.

```
╔Sidebar══════════════╗
║┌Header─────────────┐║
║│ Icon Link         │║
║└───────────────────┘║
║┌Preferences────────┐║
║│                   │║
║│                   │║
║│                   │║
║│                   │║
║│                   │║
║└───────────────────┘║
║┌Primary────────────┐║
║│                   │║
║│                   │║
║│                   │║
║│                   │║
║│                   │║
║│                   │║
║│                   │║
║│                   │║
║│                   │║
║│                   │║
║└───────────────────┘║
║┌Secondary──────────┐║
║│                   │║
║│                   │║
║│                   │║
║│                   │║
║│                   │║
║└───────────────────┘║
╚═════════════════════╝
```

### Content

The content area is used to display records (for example, as a table or list) or to display and edit a record.

```
╔Content═══════════════════════════════════════════════════════════════════════╗
║┌Toolbar─────────────────────────────────────────────────────────────────────┐║
║│                                                                            │║
║└────────────────────────────────────────────────────────────────────────────┘║
║┌Main─────────────────────────────────────────────────────┐┌Property─────────┐║
║│┌Headline───────────────────────────────────────────────┐││                 │║
║││                                                       │││                 │║
║││                                                       │││                 │║
║│└───────────────────────────────────────────────────────┘││                 │║
║│┌Preferences────────────────────────────────────────────┐││                 │║
║││                                                       │││                 │║
║││                                                       │││                 │║
║│└───────────────────────────────────────────────────────┘││                 │║
║│┌Primary────────────────────────────────────────────────┐││                 │║
║││                                                       │││                 │║
║││                                                       │││                 │║
║││                                                       │││                 │║
║││                                                       │││                 │║
║│└───────────────────────────────────────────────────────┘││                 │║
║│┌Secondary──────────────────────────────────────────────┐││                 │║
║││                                                       │││                 │║
║││                                                       │││                 │║
║│└───────────────────────────────────────────────────────┘││                 │║
║└─────────────────────────────────────────────────────────┘└─────────────────┘║
╚══════════════════════════════════════════════════════════════════════════════╝
```

### Toolbar

The toolbar contains links or buttons with data-independent functions (e.g. switching between lists and table view).

```
╔Toolbar══════════════════════════════════════════════════════════════════╗
║┌Preferences──┐┌Primary────────────────────┐┌Secondary─────────────┐┌───┐║
║│ Link ▼      ││  Link ▼       Link ▼      ││  Link ▼              ││ … │← More
║└─────────────┘└───────────────────────────┘└──────────────────────┘└─┬─┘║
╚═════════════════════════════════════════════════════════════════════┌┴───────────┐
                                                                      │ Options    │
                                                                      ├────────────┤
                                                     MorePreferences →│ Link       │
                                                                      ├────────────┤
                                                         MorePrimary →│ Link       │
                                                                      ├────────────┤
                                                       MoreSecondary →│ Link       │
                                                                      └────────────┘
```


### Headline

The headline displays the title of the displayed data. The title bar also has data-dependent functions and a display of metadata (e.g. creation date, creator).

```
╔Headline═════════════════════════════════════════════════════════════════╗
║┌Prologue┐┌Title─────────┐┌Preference───┐┌Primary──────┐┌Secondary─┐┌───┐║
║│        ││ $Headline    ││             ││             ││          ││ … │← More
║└────────┘└──────────────┘└─────────────┘└─────────────┘└──────────┘└─┬─┘║
║┌Metadata────────────────────────────────────────────────────────────┌┴───────────┐
║│                                                                    │ Options    │
║└────────────────────────────────────────────────────────────────────├────────────┤
╚═══════════════════════════════════════════════════ MorePreferences →│ Link       │
                                                                      ├────────────┤
                                                         MorePrimary →│ Link       │
                                                                      ├────────────┤
                                                       MoreSecondary →│ Link       │
                                                                      └────────────┘
```
### Property

The properties pane is used to display metadata and properties of the displayed data (for example, attachments). 

```
╔Property═══════════╗
║┌Preferences──────┐║
║│                 │║
║│                 │║
║└─────────────────┘║
║┌Primary──────────┐║
║│                 │║
║│                 │║
║│                 │║
║│                 │║
║│                 │║
║│                 │║
║│                 │║
║│                 │║
║└─────────────────┘║
║┌Secondary────────┐║
║│                 │║
║│                 │║
║└─────────────────┘║
╚═══════════════════╝
```

### Notfications

There are three ways to display notifications in web applications. The first way is to display notifications in the `Notification` section of the header. Above all, personalized notifications are displayed here (e.g. new comments on subscribed content). The second way is to display notifications in an area below the header. This is intended for application-wide notifications (e.g. scheduled maintenance windows).

```
╔ToastNotfication═══════════════════════════════════════════════════════════════╗
║┌Notfication──────────────────────────────────────────────────────────────────┐║
║│ Icon Title                                                                 ×│║
║│      Description                                                            │║
║└─────────────────────────────────────────────────────────────────────────────┘║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

The third option is to display notifications in a pop-up dialog. This is intended for the display of results (e.g. successful saving).

```
╔PopupNotfication════════════╗
║┌Notfication───────────────┐║
║│ Icon Title              ×│║
║│      Description         │║
║└──────────────────────────┘║
║┌Notfication───────────────┐║
║│ Icon Title              ×│║
║│      Description         │║
║└──────────────────────────┘║
║┌Notfication───────────────┐║
║│ Icon Title              ×│║
║│      Description         │║
║└──────────────────────────┘║
╚════════════════════════════╝
```

### SearchOptions

The search options provide a dialog for filtering records.

```
╔SearchOptions═════════════════════════════════════════════════════════════════╗
║                                                                            × ║
║┌Preferences─────────────────────────────────────────────────────────────────┐║
║│                                                                            │║
║└────────────────────────────────────────────────────────────────────────────┘║
║┌Primary─────────────────────────────────────────────────────────────────────┐║
║│                                                                            │║
║└────────────────────────────────────────────────────────────────────────────┘║
║┌Secondary───────────────────────────────────────────────────────────────────┐║
║│                                                                            │║
║└────────────────────────────────────────────────────────────────────────────┘║
╚══════════════════════════════════════════════════════════════════════════════╝
```

### Footer

The footer is located at the bottom of the web application and usually contains information about the copyright, imprint and version.

```
╔Footer════════════════════════════════════════════════════════════════════════╗
║┌Preferences───┐┌Primary───────────────────────────────────────┐┌Secondary───┐║
║│              ││                                              ││            │║
║└──────────────┘└──────────────────────────────────────────────┘└────────────┘║
╚══════════════════════════════════════════════════════════════════════════════╝
```

## Login Page

The login page is used to authenticate users. 

```
╔WebAppPageLogin═══════════════════════════════════════════════════════════════════════╗
║┌Header──────────────────────────────────────────────────────────────────────────────┐║
║│ Icon AppTitle                                                                      │║
║└────────────────────────────────────────────────────────────────────────────────────┘║
║┌ToastNotfication────────────────────────────────────────────────────────────────────┐║
║│ Notfications                                                                      ×│║
║└────────────────────────────────────────────────────────────────────────────────────┘║
║┌Content─────────────────────────────────────────────────────────────────────────────┐║
║│                                                                                    │║
║│                                                                                    │║
║│                                                                                    │║
║│           ┌LoginForm───────────────────────────────────────────────────┐           │║
║│           │ ┌Header──────────────────────────────────────────────────┐ │           │║
║│           │ │ Sign in to start your session                          │ │           │║
║│           │ └────────────────────────────────────────────────────────┘ │           │║
║│           │ ┌────────────────────────────────────────────────────────┐ │           │║
║│           │ │ Login:                                                 │ │           │║
║│           │ │ ┌────────────────────────────────────────────────────┐ │ │           │║
║│           │ │ │                                                    │ │ │           │║
║│           │ │ └────────────────────────────────────────────────────┘ │ │           │║
║│           │ │ Password:                                              │ │           │║
║│           │ │ ┌────────────────────────────────────────────────────┐ │ │           │║
║│           │ │ │ *********                                          │ │ │           │║
║│           │ │ └────────────────────────────────────────────────────┘ │ │           │║
║│           │ │ ┌───┐                                                  │ │           │║
║│           │ │ │ X │ Remember me                                      │ │           │║
║│           │ │ └───┘                                                  │ │           │║
║│           │ └────────────────────────────────────────────────────────┘ │           │║
║│           │                                                ┌─────────┐ │           │║
║│           │                                                │ Sign in │ │           │║
║│           │                                                └─────────┘ │           │║
║│           └────────────────────────────────────────────────────────────┘           │║
║│                                                                                    │║
║│                                                                                    │║
║│                                                                                    │║
║│                                                                                    │║
║│                                                                                    │║
║└────────────────────────────────────────────────────────────────────────────────────┘║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

## Status page

The status pages are displayed in case of errors. This can have different causes. For example, if a requested page was not found.

```
╔WebAppPageLogin═══════════════════════════════════════════════════════════════════════╗
║┌Header──────────────────────────────────────────────────────────────────────────────┐║
║│ Icon AppTitle                                                                      │║
║└────────────────────────────────────────────────────────────────────────────────────┘║
║┌ToastNotfication────────────────────────────────────────────────────────────────────┐║
║│ Notfications                                                                      ×│║
║└────────────────────────────────────────────────────────────────────────────────────┘║
║┌Sidebar────────────┐┌Content────────────────────────────────────────────────────────┐║
║│                   ││                                                               │║
║│  ┌StatusCode───┐  ││  ┌StatusTitle──────────────────────────────────────────────┐  │║
║│  │     404     │  ││  │ Oops! Page not found.                                   │  │║
║│  └─────────────┘  ││  └─────────────────────────────────────────────────────────┘  │║
║│                   ││  ┌StatusMessage────────────────────────────────────────────┐  │║
║│  ┌StatusIcon───┐  ││  │ We could not find the page you were looking for.        │  │║
║│  │     /\      │  ││  │ Meanwhile, you may returnto dashboard or try using      │  │║
║│  │    /  \     │  ││  │ the search form.                                        │  │║
║│  │   / ▓  \    │  ││  │                                                         │  │║
║│  │  /  o   \   │  ││  │                                                         │  │║
║│  │ /________\  │  ││  │                                                         │  │║
║│  └─────────────┘  ││  │                                                         │  │║
║│                   ││  │                                                         │  │║
║│                   ││  │                                                         │  │║
║│                   ││  │                                                         │  │║
║│                   ││  │                                                         │  │║
║│                   ││  │                                                         │  │║
║│                   ││  │                                                         │  │║
║│                   ││  │                                                         │  │║
║│                   ││  │                                                         │  │║
║│                   ││  │                                                         │  │║
║│                   ││  │                                                         │  │║
║│                   ││  │                                                         │  │║
║│                   ││  │                                                         │  │║
║│                   ││  └─────────────────────────────────────────────────────────┘  │║
║│                   ││                                                               │║
║│                   │└───────────────────────────────────────────────────────────────┘║
║│                   │┌Footer─────────────────────────────────────────────────────────┐║
║│                   ││                                                               │║
║└───────────────────┘└───────────────────────────────────────────────────────────────┘║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

## Setting page

The template is specially adapted to the settings pages. In particular, the side navigation pane and a tab element are automatically populated from the meta information.

```
╔WebAppPageSetting═════════════════════════════════════════════════════════════════════╗
║┌Header──────────────────────────────────────────────────────────────────────────────┐║
║│ Icon AppTitle     Link ▼  Link ▼  Link ▼      Create ▼      Search   ?         ⚙ ▼ │║
║└────────────────────────────────────────────────────────────────────────────────────┘║
║┌ToastNotfication────────────────────────────────────────────────────────────────────┐║
║│ Notfications                                             ┌PopupNotfication──────┐ ×│║
║└──────────────────────────────────────────────────────────│ ┌Notfication───────┐ │──┘║
║┌Breadcrumb────────────────────────────────────────────────│ │ Icon Title      ×│ │──┐║
║│ Settings: / Site / ...                                   │ │      Description │ │  │║
║└──────────────────────────────────────────────────────────│ └──────────────────┘ │──┘║
║┌Prologue──────────────────────────────────────────────────│ ┌Notfication───────┐ │──┐║
║│                                                          │ │ Icon Title      ×│ │  │║
║└──────────────────────────────────────────────────────────│ │      Description │ │──┘║
║┌SettingTab────────────────────────────────────────────────│ └──────────────────┘ │──┐║
║│ SettingCategory A  SettingCategory B  SettingCategory C  │ ┌Notfication───────┐ │  │║
║└──────────────────────────────────────────────────────────│ │ Icon Title      ×│ │──┘║
║┌SettingSidebar───────┐ ┌SearchOptions─────────────────────│ │      Description │ │──┐║
║│                     │░│                                  │ └──────────────────┘ │ ×│║
║│ SettingGroup A      │░└──────────────────────────────────└──────────────────────┘──┘║
║│   Link              │░┌Content─────────────────────────────────────────────────────┐║
║│   Link              │░│                                                            │║
║│   Link              │░│                                                            │║
║│ SettingGroup B      │░│                                                            │║
║│   Link              │░│                                                            │║
║│   Link              │░│                                                            │║
║│ SettingGroup C      │<│                                                            │║
║│   Link              │<│                                                            │║
║│                     │<│                                                            │║
║│                     │░│                                                            │║
║│                     │░│                                                            │║
║│                     │░│                                                            │║
║│                     │░│                                                            │║
║│                     │░│                                                            │║
║│                     │░│                                                            │║
║└─────────────────────┘ └────────────────────────────────────────────────────────────┘║
║┌Footer──────────────────────────────────────────────────────────────────────────────┐║
║│                                                                                    │║
║└────────────────────────────────────────────────────────────────────────────────────┘║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

### Setting tab

The contents of the `SettingTab` are fed from the `SettingCategory` attributes of the settings pages. For each defined category, a tab element is created and linked to the first element. The `SettingTab` is not displayed if no section or only one section has been defined.

```
╔SettingTab═════════════════════════════════════════════════════════════════════╗
║┌Preferences─────────┐┌Primary────────────┐┌Secondary─────────────────────────┐║
║│ SettingCategory A  ││ SettingCategory B ││SettingCategory C                 │║
║└────────────────────┘└───────────────────┘└──────────────────────────────────┘║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

### Setting sidebar

The settings sidebar groups the different settings thematically. The groups are determined from the `SettingGroup` attributes of the settings pages.

```
╔SettingSidebar═════╗
║┌Preferences──────┐║
║│ SettingGroup A  │║
║│  ┌Preferences─┐ │║
║│  │ Link       │ │║
║│  │ Link       │ │║
║│  │ Link       │ │║
║│  └────────────┘ │║
║│  ┌Primary─────┐ │║
║│  │ Link       │ │║
║│  │ Link       │ │║
║│  └────────────┘ │║
║│  ┌Secondary───┐ │║
║│  │ Link       │ │║
║│  └────────────┘ │║
║└─────────────────┘║
║┌Primary──────────┐║
║│ SettingGroup B  │║
║│  ┌Preferences─┐ │║
║│  │ Link       │ │║
║│  │ Link       │ │║
║│  └────────────┘ │║
║│  ┌Primary─────┐ │║
║│  │ Link       │ │║
║│  └────────────┘ │║
║│  ┌Secondary───┐ │║
║│  └────────────┘ │║
║└─────────────────┘║
║┌Secondary────────┐║
║│ SettingGroup C  │║
║│  ┌Preferences─┐ │║
║│  └────────────┘ │║
║│  ┌Primary─────┐ │║
║│  │ Link       │ │║
║│  └────────────┘ │║
║│  ┌Secondary───┐ │║
║│  └────────────┘ │║
║└─────────────────┘║
╚═══════════════════╝
```

## Theme model

`WebExpress.WebApp` offers a ready-made layout (e.g. color scheme, fonts, font sizes). This can be adapted to individual needs. The management of the themes is taken over by the `ThemeManager`. An individual topic can be assigned to each application. The configuration of the topics can be done via definition classes or via a settings dialog, which is provided by `WebExpress.WebApp`. The UML diagram below serves to illustrate the relationships and 
underlying structure:

```
╔WebExpress.Core═══════════════════════════════════════════════════════════════════════╗
║                                                                                      ║
║   ┌────────────────────────────┐                                                     ║
║   │ <<Interface>>              │                   ┌───────────────┐                 ║
║   │ IComponentHub              │                   │ <<Interface>> │                 ║
║   ├────────────────────────────┤ 1                 │ IContext      │                 ║
║   │ ThemeManager:IThemeManager ├───┐               ├───────────────┤                 ║
║   │ …                          │   │               └───────Δ───────┘                 ║
║   └────────────────────────────┘   │                       ¦                         ║
║                                    │                       ¦                         ║
║   ┌───────────────────┐            │    ┌──────────────────┴─────────────────────┐   ║
║   │ <<Interface>>     │            │    │ <<Interface>>                          │   ║
║   │ IComponentManager │            │    │ IThemeContext                          │   ║
║   ├───────────────────┤            │    ├────────────────────────────────────────┤   ║
║   └─────────Δ─────────┘            │    │ PluginContext:IPluginContext           │   ║
║             ¦                      │    │ ApplicationContext:IApplicationContext │   ║
║             ¦                      │    │ Image:IRoute                           │   ║
║             ¦                      │    │ Name:String                            │   ║
║             ¦                      │    │ Description:String                     │   ║
║             ¦                      │    │ ThemeMode:ThemeMode                    │   ║
║             ¦                      │    │ ThemeStyle:IRoute                      │   ║
║             ¦                      │    └──────────────────▲───────────┬─────────┘   ║
║             ¦                      │                     * │         1 │             ║
║             ¦                    1 │                       │           │             ║
║       ┌─────┴──────────────────────▼────────────┐          │           │             ║
║       │ <<Interface>>                           │          │         1 │             ║
║   ┌---┤ IThemeManager                           │          │   ┌───────▼─────────┐   ║
║   ¦   ├─────────────────────────────────────────┤          │   │ <<Enumeration>> │   ║
║   ¦   │ AddTheme:Event                          │          │   │ ThemeMode       │   ║
║   ¦   │ RemoveTheme:Event                       │          │   ├─────────────────┤   ║
║   ¦   ├─────────────────────────────────────────┤ 1        │   │ Light           │   ║
║   ¦   │ Themes:IEnumerable<IThemeContext>       ├──────────┘   │ Dark            │   ║
║   ¦   ├─────────────────────────────────────────┤              └─────────────────┘   ║
║   ¦   │ GetThemes<ITheme>(IApplicationContext): │                                    ║
║   ¦   │   IEnumerable<IEventHandlerContext>     │ 1                                  ║
║   ¦   │ GetTheme(IThemeContext):ITheme          ├────────────────────┐               ║
║   ¦   └──────────▲──────────────────────────────┘                    │               ║
║   ¦              ¦                                                   │               ║
║   ¦              ¦                     ┌───────────────┐             │               ║
║   ¦              ¦                     │ <<Interface>> │             │               ║
║   ¦              ¦                     │ IComponent    │             │               ║
║   ¦              ¦                     ├───────────────┤             │               ║
║   ¦              ¦                     └───────Δ───────┘             │               ║
║   ¦              ¦                             ¦                     │               ║
║   ¦              ¦                             ¦                     │               ║
║   ¦              ¦                     ┌───────┴───────┐             │               ║
║   ¦              ¦                     │ <<Interface>> │             │               ║
║   ¦              ¦                     │ ITheme        │             │               ║
║   ¦              ¦                     ├───────────────┤             │               ║
║   ¦              ¦                     └───────Δ───────┘             │               ║
║   ¦              ¦                             ¦                     │               ║
╚═══¦══════════════¦═════════════════════════════¦═════════════════════│═══════════════╝
    ¦              ¦                             ¦                     │ 
╔WebExpress.WebApp═¦═════════════════════════════¦═════════════════════│═══════════════╗
║   ¦              ¦                             ¦                     │               ║
║   ¦              ¦                             ¦                     │               ║
║   ¦  ┌───────────┴────────────────────┐        ¦                     │               ║
║   ¦  │ <<Utility>>                    │        ¦                     │               ║
║   ¦  │ ThemeManagerExtensions         │        ¦                     │               ║
║   ¦  ├────────────────────────────────┤        ¦                     │               ║
║   ¦  │ GetWebAppTheme(IThemeContext): │        ¦                     │               ║
║   ¦  │   IThemeWebApp                 │        ¦                     │               ║
║   ¦  └────────────────────────────────┘        ¦                     │               ║
║   ¦                                            ¦                     │               ║
║   ¦                                    ┌───────┴───────┐             │               ║
║   ¦                                    │ <<Interface>> │             │               ║
║   ¦                                    │ IThemeWebApp  │             │               ║
║   ¦                                    ├───────────────┤             │               ║
║   ¦                                    ├───────────────┤             │               ║
║   ¦                                    └───────Δ───────┘             │               ║
║   ¦                                            ¦                     │               ║
║   ¦                                            ¦                     │               ║
║   ¦                                     ┌──────┴──────┐              │               ║
║   ¦                                     │ ThemeWebApp │              │               ║
║   ¦                                     ├─────────────┤              │               ║
║   ¦                                     ├─────────────┤              │               ║
║   ¦                                     └──────Δ──────┘              │               ║
║   ¦                                            │                     │               ║
╚═══¦════════════════════════════════════════════│═════════════════════│═══════════════╝
    ¦                                            │                     │ 
╔MyPlugin════════════════════════════════════════│═════════════════════│═══════════════╗
║   ¦                                            │                     │               ║
║   ¦ create                                ┌────┴────┐ 1              │               ║
║   └---------------------------------------► MyTheme ◄────────────────┘               ║
║                                           ├─────────┤                                ║
║                                           ├─────────┤                                ║
║                                           └─────────┘                                ║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

A theme is defined in a class that implements the `ITheme` interface, allowing it to be seamlessly associated with an application. A theme encompasses not only a color scheme to define properties for various UI elements, such as backgrounds, and text, but also additional attributes that contribute to a cohesive visual and functional design.

The theme may include:

- **Typography:** Font styles, sizes, and weights used across the application.
- **Iconography:** Sets of icons or visual elements tailored to the theme.
- **Spacing and layout:** Definitions for padding, margins, and element alignment to ensure consistent spacing across components.
- **Animations and transitions:** Custom animations or transition effects that enhance the user experience while aligning with the theme's aesthetic.
- **Custom Components:** Predefined styles or templates for frequently used UI components like buttons, input fields, or modals.

If a theme is included in the application's assembly, it becomes the default theme automatically. Where more than one theme is defined, the system defaults to the first theme it finds.

The example below demonstrates how a theme can define not only color properties but also additional elements like typography and animations to create a consistent and rich user experience within the application.

```csharp
[Name("MyTheme")]
[Description("example")]
[Image("/assets/img/mytheme.png")]
[ThemeMode(ThemeMode.Dark)]
[ThemeStyle("/assets/css/mytheme.css")]]
public sealed class MyTheme : IThemeWebApp
{
    public static PropertyColorBackground HeaderBackground => 
        new(TypeColorBackground.Dark);
    public static PropertyColorText HeaderTitle => 
        new(TypeColorText.Light);
    public static PropertyColorText HeaderNavigationLink => 
        new(TypeColorText.Light);
    …
}
```

To provide clarity about the metadata specified in the code above, the following table presents the available attributes and their corresponding details:

|Attribute   |Type      |Multiplicity |Optional |Description
|------------|----------|-------------|---------|---------------------
|Name        |String    |1            |Yes      |The name of the topic that can be displayed in the interface. This can be a key to internationalization.
|Description |String    |1            |Yes      |The description of the topic. This can be a key to internationalization.
|Image       |String    |1            |Yes      |Link to an image that visually represents the topic.
|ThemeMode   |ThemeMode |1            |Yes      |Indicates the theme mode (e.g., Light or Dark).
|ThemeStyle  |String    |1            |Yes      |Link to an theme css style (e.g., material, flat, or skeuomorphic).

# Example

The classic 'Hello World' application serves as a fundamental starting point for understanding how the essential instructions and components come together to form a complete and functional application. The example below demonstrates the minimal setup required to implement an application using plugins, pages, and controls:

```csharp
using WebExpress.Core.WebAttribute;
using WebExpress.Core.WebApplication;
using WebExpress.Core.WebPlugin;
using WebExpress.Core.WebPage;
using WebExpress.WebUI.WebControl;

namespace Sample
{
    [Application<MyApplication>()]
    public sealed class MyPlugin : IPlugin
    {
        public void Run() {}
    }

    public sealed class MyApplication : IApplication
    {
        public void Run() {}
    }

    public sealed class Index : IPage<VisualTree>
    {
        public void Render(IRenderContext renderContext, VisualTree visualTree)
        {
            var control = new ControlText(){Text = "Hello World!"};

            visualTree.AddContent(control);
        }
    }
}
```
