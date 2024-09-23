![WebExpress](https://raw.githubusercontent.com/ReneSchwarzer/WebExpress.Doc/main/assets/banner.png)

# WebExpress
WebExpress is a lightweight web server that has been optimized for use in low-performance 
environments. Even on small systems, such as the Raspberry PI, web applications can be 
operated efficiently. This is achieved through a small footprint with a low resource burden. 
Furthermore, WebExpress has a powerful and optimized plugin system, with a comprehensive API 
and application templates. This allows web applications to be easily and quickly integrated 
into a .Net language (e.g. C#).

# License
The software is freely available as open source (MIT). The software sources can be obtained 
from https://github.com/ReneSchwarzer/WebExpress. WebExpress is based on components that are 
available as open source:

- https://github.com/dotnet/core (MIT)
- https://getbootstrap.com/ (MIT)
- https://www.chartjs.org (MIT)
- https://jquery.com/ (MIT)
- https://summernote.org/ (MIT)
- https://popper.js.org/ (MIT)
- https://github.com/kurtobando/simple-tags (MIT)
- https://github.com/uxsolutions/bootstrap-datepicker (Apache 2.0)

```
The MIT License (MIT)

Copyright (c) 2023 René Schwarzer

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

# Architecture
WebExpress is deliberately kept very simple. It consists only of basic functionalities 
for processing HTTP and HTTPS requests, an API and a plugin system for extending the 
functionalities. This means that WebExpress itself is not able to generate content. 
The plugin system is required for this. Plugins are .Net assemblies, which create 
content based on the WebExpress API. The plugins are loaded and executed by WebExpress. 
WebExpress controls the plugins and distributes the http(s) requests to the responsible 
plugin. The plugins answer the requests, create the content and transfer it to WebExpress. 
Finally, the content is delivered as an HTTP response via WebExpress. WebExpress uses 
Kestrel to process http(s) requests.

```
╔WebExpress════════════════════════════════════════════════════════════════════════════╗
║┌Plugin p-----------------------------------------------┐ ┌Plugin p2-----------------┐║
║¦                                                       ¦ ¦                          ¦║
║¦┌──────────────────┐┌──────────────────────────────────────────┐┌──────────────────┐¦║
║¦│ Application X    ││ Application y                            ││ Application z    │¦║
║¦│                  ││                                          ││                  │¦║
║¦│ ┌──────────────┐ ││ ┌──────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │¦║
║¦│ │ Modul A      │ ││ │ Modul B      │ │ Modul C     │ │  Modul D                │ │¦║
║¦│ │              │ ││ │              │ │             │ │                         │ │¦║
║¦│ │ ┌──────────┐ │ ││ │ ┌──────────┐ │ │ ┌─────────┐ │ │ ┌────────┐ ┌──────────┐ │ │¦║
║¦│ │ │Resources │ │ ││ │ │Resources │ │ │ │ RestAPI │ │ │ │  Jobs  │ │Resources │ │ │¦║
║¦│ │ └──────────┘ │ ││ │ └──────────┘ │ │ └─────────┘ │ │ └────────┘ └──────────┘ │ │¦║
║¦│ │              │ ││ │              │ │             │ │                         │ │¦║
║¦│ │ ┌──────────┐ │ ││ │ ┌──────────┐ │ │ ┌─────────┐ │ │ ┌────────┐ ┌──────────┐ │ │¦║
║¦│ │ │   Jobs   │ │ ││ │ │Fragments │ │ │ │  Jobs   │ │ │ │ RestAPI│ │ Fragments│ │ │¦║
║¦│ │ └──────────┘ │ ││ │ └──────────┘ │ │ └─────────┘ │ │ └────────┘ └──────────┘ │ │¦║
║¦│ └──────────────┘ ││ └──────────────┘ └─────────────┘ └─────────────────────────┘ │¦║
║¦└──────────────────┘└──────────────────────────────────────────┘└──────────────────┘¦║
║¦                                                       ¦ ¦                          ¦║
║¦┌──────────┐ ┌──────────┐                              ¦ ¦ ┌────────┐ ┌───────────┐ ¦║
║¦│   I18N   │ │Components│                              ¦ ¦ │  I18N  │ │StatusPages│ ¦║
║¦└──────────┘ └──────────┘                              ¦ ¦ └────────┘ └───────────┘ ¦║
║└-------------------------------------------------------┘ └--------------------------┘║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

`WebExpress` consists of several program libraries, which serve as the basis for `WebExpress` projects. The 
`WebExpress.WebCore.dll` program library provides basic functions for creating content and additional functions 
such as logging. The `WebExpress.UI.dll` and `WebExpress.WebApp.dll` packages provide controls and templates 
that facilitate the development of (business) applications. `WebExpress.WebIndex.dll` provides full-text indexing 
and `WebExpress.WebIdentity` provides functions for management and access authorization. The `WebExpress.exe` 
program library represents the application that takes control of the individual functions and components. The 
`WebExpress.exe` program library is generic and can be replaced by its own program library.

```
╔WebExpress.exe══════════════════════════════════════════════════════╗
║                                                                    ║
║                                            ┌──────────────┐        ║
║                                            │ WebIndex.dll │<───┐   ║
║                                            └──────────────┘    │   ║
║                                                   ∧            │   ║
║         ┌──────────────────────────────────────┐  │            │   ║
║         V                                      │  └───┐        │   ║
║   ┌─────────────┐       ┌───────────┐       ┌──┴──────┴──┐     │   ║
║   │ WebCore.dll │<──────┤ WebUI.dll │<──────┤ WebApp.dll │     │   ║
║   └─────────────┘       └───────────┘       └────────────┘     │   ║
║         ∧                    ∧                    ∧            │   ║
║         │                    └────────────────┐   │            │   ║
║         │                                     │   └───────┐    │   ║
║         │                                  ┌──┴───────────┴──┐ │   ║
║         └──────────────────────────────────┤ WebIdentity.dll ├─┘   ║
║                                            └─────────────────┘     ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
```

In the context of WebExpress, (web) applications are deployed. An application is the logical 
combination of modules. Modules, in turn, are amalgamations of (web) elements. Elements reflect 
content (e.g. web pages). The relationships between WebExpress, packages, applications, modules, 
and elements are illustrated in the following figure: 

```
╔WebExpress════════════════════════════════════════════════════════════════════════════╗
║                                                                                      ║
║                      ┌WebPackage----------------------------------------------------┐║
║                      ¦                                                              ¦║
║ ┌────────────────┐ 1 ¦                       * ┌──────────┐  ┌────────────────────┐ ¦║
║ │ WebExpress.exe ├────────────────────────────>│  Plugin  │  │ external libraries │ ¦║
║ └────────────────┘   ¦                         └──────────┘  └────────────────────┘ ¦║
║                      ¦                            ∧    ∧                            ¦║
║                      ¦                     ┌──────┘    └──────┐                     ¦║
║                      ¦                ┌────┴─────┐      ┌─────┴─────┐               ¦║
║                      ¦                │   I18N   │      │Application│               ¦║
║                      ¦                └──────────┘      └───────────┘               ¦║
║                      ¦                                        ∧                     ¦║
║                      ¦                                        │                     ¦║
║                      ¦                                  ┌─────┴─────┐               ¦║
║                      ¦       ┌─────────────────────────>│  Module   │               ¦║
║                      ¦       │                          └───────────┘               ¦║
║                      ¦       │                            ∧   ∧   ∧                 ¦║
║                      ¦       │                   ┌────────┘   │   └────────┐        ¦║
║                      ¦  ┌────┴─────┐ *    * ┌────┴─────┐ ┌────┴─────┐ ┌────┴─────┐  ¦║
║                      ¦  │ Fragment ├────────┤ Resource │ │   Job    │ │   Event  │  ¦║
║                      ¦  └──────────┘        └──────────┘ └──────────┘ └──────────┘  ¦║
║                      ¦                       ▲    ▲   ▲                             ¦║
║                      ¦                ┌------┘    ¦   └--------┐                    ¦║
║                      ¦           ┌────┴────┐ ┌────┴─────┐ ┌────┴─────┐              ¦║
║                      ¦           │ RestAPI │ │   Page   │ │StatusPage│              ¦║
║                      ¦           └─────────┘ └──────────┘ └──────────┘              ¦║
║                      ¦                                                              ¦║
║                      └--------------------------------------------------------------┘║
║                                                                                      ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

## Component model
The components of WebExpress and its applications are centrally managed in the `ComponentManager`.
The following components are available in WebExpress:

|Component                   |Description
|----------------------------|-----------------------
|LogManager                  |Allows to create, view, and delete logs used for troubleshooting and monitoring system performance.
|PackageManager              |Management of packages that extend the functionality of WebExpress.
|PluginManager               |Management of extension modules that extend the functionality of WebExpress.
|ApplicationManager          |An application is the logical combination of functionalities into an application system.
|ModuleManager               |Modules encapsulate (web) elements and make them available for one or more applications.
|EventManager                |Manages and triggers events triggered by specific actions in the system.
|JobManager                  |Jobs can be used for cyclic processing of tasks.  
|ResponseManager             |Represent HTML pages that are returned with a StatusCode other than 200.
|ResourceManager             |Resources are contents that are delivered by WebExpress. These include, for example, websites that consist of HTML source code, arbitrary files (e.g. css, JavaScript, images) and REST interfaces, which are mainly used for communication via HTTP(S) with (other) systems.
|ThemeManager                |Provides color and layout schemes for customizing applications.
|FragmentManager             |Are program parts that are integrated into defined areas of pages. The components extend the functionality or appearance of the page.
|SitemapManager              |Manages the structure of the website, including navigation between different pages.
|InternationalizationManager |Provides language packs for the internationalization of applications.
|SessionManager              |Responsible for storing session data generated during the user session.
|TaskManager                 |Management of ad-hoc tasks.
|IdentityManager             |Users or technical objects that are used for identity and access management.

In addition, you can create your own components and register them in the `ComponentManager`.

```
┌─────────────────────────────────────────────────────────┐
│ ComponentManager                                        │
├─────────────────────────────────────────────────────────┤
│ AddComponent:Event                                      │
│ RemoveComponent:Event                                   │
├─────────────────────────────────────────────────────────┤
│ HttpServerContext:IHttpServerContext                    │ 1
│ Components:IEnumerable<IComponent>                      │──────┐
│ LogManager:LogManager                                   │      │
│ PackageManager:PackageManager                           │      │
│ PluginManager:PluginManager                             │      │
│ ApplicationManager:ApplicationManager                   │      │
│ ModuleManager:ModuleManager                             │      │
│ EventManager:EventManager                               │      │
│ JobManager:JobManager                                   │      │
│ ResponseManager:ResponseManager                         │      │
│ ResourceManager:ResourceManager                         │      │
│ ThemeManager:ThemeManager                               │      │
│ FragmentManager:FragmentManager                         │      │
│ SitemapManager:SitemapManager                           │      │
│ InternationalizationManager:InternationalizationManager │      │
│ SessionManager:SessionManager                           │      │
│ TaskManager:TaskManager                                 │      │
├─────────────────────────────────────────────────────────┤      │
│ GetComponent(id):IComponet                              │      │
│ GetComponent<T>():T                                     │      │
│ Remove(pluginContext)                                   │      │
└─────────────────────────────────────────────────────────┘      │
                                                                 │
                            ┌────────────────────────────────────┘
                            V
           ┌───────────────────────────────────┐
           │ <<Interface>>                     │
           │ IComponent                        │
           ├───────────────────────────────────┤
           │ Initialization(httpServerContext) │
           └───────────────────────────────────┘
                            ▲
                            ¦
                            ¦
               ┌────────────┴────────────┐
               │ <<Interface>>           │
               │ IComponentPlugin        │
               ├─────────────────────────┤
               │ Register(pluginContext) │
               │ Remove(pluginContext)   │
               └─────────────────────────┘
                            ▲
                            ¦
                            ¦
               ┌────────────┴────────────┐
               │ MyComponent             │
               ├─────────────────────────┤
               │ Initialization(context) │
               │ Register(pluginContext) │
               │ Remove(pluginContext)   │
               └─────────────────────────┘
```

## Package model
WebExpress is designed by its open and modular plugin system, which supports many usage scenarios. The 
distribution of the plugins and other software components (e.g. Entity Framework) takes place as 
WebExpress packages. WebExpress is able to read these packets and execute the code in them. Packages 
can contain both managed code and native libraries (e.g. for Linux) and be dependent on other packages. 
The recursive resolution of the dependencies is done by WebExpress. 
The WebExpress packages are ZIP-compressed files that can provide libraries for multiple platforms. They 
have the `wxp` file extension. A WebExpress package has the following structure:

```
   📦 <packagename>.<version>.wxp
   ├📁 lib
   │└📁 runtime
   │ └📁 <rid>
   ├📁 licences
   ├📄 readme.md
   └📄 <packagename>.spec
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
└────┬──────┘              └───────────┘
     │                           ∧
     │ activate                  │
     │       ┌───────────┐       │ disable/enable
     └──────>│  Active   │<──────┘
             └───────────┘
```

- **Available** - The package is available, but not yet loaded by the WebExpress. 
- **Active** - The package has been loaded and is ready for use. 
- **Disable** - The package has been disabled. The use of the package is not possible.

The `PackageManager` is responsible for provisioning the packages. This has the task of loading all packages and 
deactivating or removing them if desired. The following directories are used to store the packages and libraries: 

```
   📁 packages
   ├📁 <package>
   ├📄 catalog.xml
   ├📦 <package 1>.wxp
   ├📦 <package …>.wxp
   └📦 <package n>.wxp
```

|Directory/ File |Description
|----------------|-----------------------
|packages        |The home directory that contains the catalog and packages.
|package         |Each active package is unpacked in a separate directory. This directory contains the libraries of the WebExpress packages for the installed framework and platform.
|catalog.xml     |The catalog.xml file collects all metadata (including the package state) of the installed packages.
|package.wxp     |Each installed package is saved unpacked for future actions.

New packages can be installed on the fly by copying them into the packages directory by the user. The provisioning 
service cyclically scans the directory for new packets and loads them. 
If a package is to be deactivated without removing it, the `PackageManager` notes it in the catalog (state `Disable`). 
In addition package, the directory of the deactivated package is deleted and all contents (applications, modules, elements) 
are removed from the running WebExpress. When WebExpress boots up and initializes, the catalog is read and the 
disabled packages are excluded. A disabled package is activated by changing the state in the catalog and unpacking and 
loading the package into the package directory. When a package is deleted, it is removed from the package directory and 
from the catalog. The `PackageManager` manages the catalog. This can be accessed at runtime via the following classes.

```
  ┌───────────────────────────────────┐
  │ <<Interface>>                     │
  │ IComponent                        │
  ├───────────────────────────────────┤
  │ Initialization(httpServerContext) │
  └───────────────────────────────────┘
                  ▲
                  ¦                                 ┌───────────────────────────────┐
                  ¦                                 │ ComponentManager              │
┌─────────────────┴────────────────────┐ 1        1 ├───────────────────────────────┤
│ PackageManager                       │<───────────┤ PackageManager:PackageManager │
├──────────────────────────────────────┤            │ …                             │
│ AddPackage:Event                     │            └───────────────────────────────┘
│ ARemovePackage:Event                 │
├──────────────────────────────────────┤
│ HttpServerContext:IHttpServerContext │
│ Catalog:PackageCatalog               │
├──────────────────────────────────────┤
│ Initialization(IHttpServerContext)   │
└──────────────────────────────────────┘
```

## Plugin model
The plugin system can be used to extend both `WebExpress` and application functionalities. Each plugin can provide content in 
different forms. A distinction is made between the following types of content:

|Content                      |Managed by                  |Description
|-----------------------------|----------------------------|-----------------------
|Applications                 |ApplicationManager          |An application is the logical combination of functionalities into an application system.
|Internationalization schemas |InternationalizationManager |Provides language packs for the internationalization of applications.
|Module                       |ModuleManager               |Modules encapsulate (web) elements and make them available for one or more applications.
|Identities                   |IdentityManager             |Users or technical objects that are used for identity and access management.
|Resources                    |ResourceManager             |Resources are contents that are delivered by WebExpress. These include, for example, websites that consist of HTML source code, arbitrary files (e.g. css, JavaScript, images) and REST interfaces, which are mainly used for communication via HTTP(S) with (other) systems.
|Status pages                 |ResponseManager             |Represent HTML pages that are returned with a StatusCode other than 200.
|Layout schemes               |LayoutManager               |Provides color and layout schemes for customizing applications.
|Components                   |ComponentManager            |Are program parts that are integrated into defined areas of pages. The components extend the functionality or appearance of the page.
|Jobs                         |SchedulerManager            |Jobs can be used for cyclic processing of tasks. 
|Tasks                        |TaskManager                 |Management of ad-hoc tasks. 

Each plugin must have a class that implements `IPlugin`.

```csharp
[Name("myplugin")]
[Description("description")]
[Icon("/assets/img/Logo.png")]
[Dependency("webexpress.webapp")]
public sealed class MyPlugin : IPlugin
{
  public Initialization(IPluginContext) {}
  public Run() {}
  public Dispose() {}
}
```

The following attributes are available:

|Attribute   |Type   |Multiplicity |Optional |Description
|------------|-------|-------------|---------|--------------
|Id          |String |1            |Yes      |The unique identification key. If no id is specified, the class name is used. An id should only be specified in exceptional cases.
|Name        |String |1            |Yes      |The name of the plugin. This can be a key to internationalization.
|Description |String |1            |Yes      |The description of the plugin. This can be a key to internationalization.
|Icon        |String |1            |Yes      |The icon that represents the plugin graphically.
|Dependency  |String |n            |Yes      |Defines a dependency on another plugin and is specified via the PluginId.

The implemented methods from the interface cover the life cycle of the plugin. Meta information about the plugin is 
stored in the `PluginContext` and is available globally via the `PluginManager`.

```
 ┌────────────────────────────────────┐             ┌─────────────────────────────┐
 │ <<Interface>>                      │             │ ComponentManager            │
 │ IComponent                         │           1 ├─────────────────────────────┤
 ├────────────────────────────────────┤        ┌────┤ PluginManager:PluginManager │
 │ Initialization(IHttpServerContext) │        │    │ …                           │
 └────────────────────────────────────┘        │    └─────────────────────────────┘
                   ▲                           │
                   ¦                           │
                   ¦                           │
┌──────────────────┴───────────────────┐ 1     │
│ PluginManager                        │<──────┘
├──────────────────────────────────────┤
│ AddPlugin:Event                      │
│ RemovePlugin:Event                   │
├──────────────────────────────────────┤               ┌─────────────────────────┐
│ HttpServerContext:IHttpServerContext │ 1           * │ <<Interface>>           │
│ Plugins:IEnumerable<IPluginContext>  ├──────────────>│ IPluginContext          │
├──────────────────────────────────────┤               ├─────────────────────────┤
│ Initialization(IHttpServerContext)   │               │ Assembly:Assembly       │
│ Register()                           ├-----------┐   │ PluginId:String         │
│ Remove(IPluginContext)               │           ¦   │ PluginName:String       │
│ GetPlugin(PluginId):IPluginContext   │           ¦   │ Manufacturer:String     │
└──────────────────────────────────────┘           ¦   │ Description:String      │
                                                   ¦   │ Version:String          │
                                                   ¦   │ Copyright:String        │
                                                   ¦   │ License:String          │
  ┌────────────────────────────────┐               ¦   │ Icon:UriResource        │
  │ <<Interface>>                  │               ¦   │ Host:IHttpServerContext │
  │ IPlugin                        │               ¦   └─────────────────────────┘
  ├────────────────────────────────┤               ¦              ∧
  │ Initialization(IPluginContext) │               ¦              ¦
  │ Run()                          │               ¦              ¦
  │ Dispose()                      │               ¦              ¦
  └────────────────────────────────┘               ¦              ¦
                  ▲                                ¦              ¦
                  ¦                                ¦              ¦
                  ¦                                ¦              ¦
  ┌───────────────┴────────────────┐    create     ¦              ¦
  │ MyPlugin                       │<--------------┘              ¦
  ├────────────────────────────────┤               uses           ¦
  │ Initialization(IPluginContext) ├------------------------------┘
  │ Run()                          │
  │ Dispose()                      │
  └────────────────────────────────┘
```

## Application model
Each plugin can provide one or more applications. To define an application, a class must be defined that implements the 
`IApplication` interface. The application's metadata is appended as attributes of the class.

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

The following attributes are available:

|Attribute   |Type       |Multiplicity |Optional |Description
|------------|-----------|-------------|---------|------------
|Id          |String     |1            |Yes      |The unique identification key. If no id is specified, the class name is used. An id should only be specified in exceptional cases.
|Name        |String     |1            |Yes      |The name of the application. This can be a key to internationalization.
|Description |String     |1            |Yes      |The description of the application. This can be a key to internationalization.
|Icon        |String     |1            |Yes      |The icon that represents the application graphically.
|AssetPath   |String     |1            |Yes      |The path where the assets are stored. This file path is mounted in the asset path of the web server.
|DataPath    |String     |1            |Yes      |The path where the data is stored. This file path is mounted in the data path of the web server.
|ContextPath |String     |1            |Yes      |The context path where the resources are stored. This path is mounted in the context path of the web server.
|Option      |String     |n            |Yes      |Includes resources that are marked as optional and are otherwise not directly integrated into the application. The name of the option is the ModuleId and the ResourceId (e.g. webexpress.webapp.settinglog) or webexpress.webapp.* if all options of a module are to be included. A regular expression can also be used.
|            |Type       |             |         |The class of the module. All options from the module will be activated.
|            |Type, Type |             |         |The class of the module and resource to be activated.

The methods implemented from the interface cover the life cycle of the application. When the plugin is loaded, all the 
applications it contains are instantiated. These remain in place until the plugin is unloaded. Meta information about 
the application is stored in the `ApplicationContext` and managed by the `ApplicationManager`.

```
         ┌───────────────────────────────────────┐
         │ ComponentManager                      │
         ├───────────────────────────────────────┤ 1
         │ ApplicationManager:ApplicationManager │───┐
         │ …                                     │   │
         └───────────────────────────────────────┘   │
                                                     │
                                                     │
                                                     │
   ┌────────────────────────────────────┐            │
   │ <<Interface>>                      │            │
   │ IComponentPlugin                   │            │
   ├────────────────────────────────────┤            │
   │ Initialization(IHttpServerContext) │            │
   │ Register(IPluginContext)           │            │
   │ Remove(IPluginContext)             │            │
   └────────────────────────────────────┘            │
                     ▲                        ┌──────┘
           ┌---------┘                        │
           ¦                                1 V
   ┌───────┴──────────────────────────────────────────┐
   │ ApplicationManager                               │
   ├──────────────────────────────────────────────────┤
   │ AddApplication:Event                             │
   │ RemoveApplication:Event                          │
   ├──────────────────────────────────────────────────┤
   │ HttpServerContext:IHttpServerContext             │ 1
   │ Applications:IEnumerable<IApplicationContext>    ├────┐
   ├──────────────────────────────────────────────────┤    │
   │ Initialization(IHttpServerContext)               │    │
┌--┤ Register(IPluginContext)                         │    │
¦  │ Remove(IPluginContext)                           │    │
¦  │ GetApplcation(ApplicationId):IApplicationContext │    │
¦  └──────────────────────────────────────────────────┘    │
¦                                                          │
¦                         ┌────────────────────────────────┘
¦                       * V
¦           ┌──────────────────────────────┐
¦           │ <<Interface>>                │<--------------┐
¦           │ IApplicationContext          │               ¦
¦           ├──────────────────────────────┤               ¦
¦           │ PluginContext:IPluginContext │               ¦
¦           │ ApplicationId:String         │               ¦
¦           │ ApplicationName:String       │               ¦
¦           │ Description:String           │               ¦
¦           │ Options:IEnumerable<String>  │               ¦
¦           │ AssetPath:String             │               ¦
¦           │ DataPath:String              │               ¦
¦           │ ContextPath:UriResource      │               ¦
¦           │ Icon:UriResource             │               ¦
¦           └──────────────────────────────┘               ¦
¦                                                          ¦
¦                                                          ¦
¦                                                          ¦
¦       ┌────────────────────────────────────────┐         ¦
¦       │ <<Interface>>                          │         ¦
¦       │ IApplication                           │         ¦
¦       ├────────────────────────────────────────┤         ¦
¦       │ Initialization(IApplicationContext)    │         ¦
¦       │ Run()                                  │         ¦
¦       │ Dispose()                              │         ¦
¦       └────────────────────────────────────────┘         ¦
¦                           ▲                              ¦
¦                           ¦                              ¦
¦                           ¦                              ¦
¦ create ┌──────────────────┴──────────────────┐           ¦
└------->│ MyApplication                       │           ¦
         ├─────────────────────────────────────┤      uses ¦
         │ Initialization(IApplicationContext) ├-----------┘
         │ Run()                               │
         │ Dispose()                           │
         └─────────────────────────────────────┘
```

## Module model
Each application can consist of one or more modules. To define a module, a class must be defined that implements the `Module` 
interface. The module's metadata is appended as attributes of the class. A module has the task of organizing (web) elements 
for the application and making them accessible.

```csharp
[Name("MyModule")]
[Description("example")]
[Icon("/mod.svg")]
[ContextPath("/mod")]
[Application<MyApplication>]
public sealed class MyModule : Module
{
}
```

The following attributes are available:

|Attribute      |Type               |Multiplicity |Optional |Description
|---------------|-------------------|-------------|---------|----------------
|Id             |String             |1            |Yes      |The unique identification key. If no id is specified, the class name is used. An id should only be specified in exceptional cases.
|Name           |String             |1            |Yes      |The name of the module. This can be a key to internationalization.
|Description    |String             |1            |Yes      |The description of the module. This can be a key to internationalization.
|Icon           |String             |1            |Yes      |The icon that represents the module graphically.
|AssetPath      |String             |1            |Yes      |The path where the assets are stored. This path is mounted in the application's asset path.
|DataPath       |String             |1            |Yes      |The path where the data is stored. This file path is mounted in the data path of the application.
|ContextPath    |String             |1            |Yes      |The context path where the resources are stored. This path is mounted in the context path of the application.
|IdentityDomain |None, Local, Share |1            |Yes      |Determines the identity domain of the application. `None` - The application does not provide an identity domain. `Local` - The application has its own identity domain. `Share` - The application shares the identity domain with other applications.
|Application    |String             |n            |No       |A specific `ApplicationId`, regular expression, or * for any application. 
|               |Type               |             |         |The class of the application.

The instance of the module is created when the plugin is loaded and persists until the application is unloaded. The methods 
implemented from the interface cover the life cycle of the module. Meta information about the module is stored in the 
`ModuleContext` and is available globally. The `ModuleManager` manages the modules. 

```
            ┌─────────────────────────────┐
            │ ComponentManager            │
            ├─────────────────────────────┤ 1
            │ ModuleManager:ModuleManager │─────┐
            │ …                           │     │
            └─────────────────────────────┘     │
                                                │
┌────────────────────────────────────┐          │
│ <<Interface>>                      │          │
│ IComponentPlugin                   │          │
├────────────────────────────────────┤          │
│ Initialization(IHttpServerContext) │          │
│ Register(IPluginContext)           │          │
│ Remove(IPluginContext)             │          │
└────────────────────────────────────┘          │
            ▲                                   │
            ¦                                   │
            ¦                                 1 V
   ┌────────┴───────────────────────────────────────────────┐
   │ ModuleManager                                          │
   ├────────────────────────────────────────────────────────┤
   │ AddModule:Event                                        │
   │ RemoveModule:Event                                     │
   ├────────────────────────────────────────────────────────┤
   │ HttpServerContext:IHttpServerContext                   │ 1
   │ Modules:IEnumerable<IModuleContext>                    ├───┐
   ├────────────────────────────────────────────────────────┤   │
   │ Initialization(IHttpServerContext)                     │   │
┌--┤ Register(IPluginContext)                               │   │
¦  │ Remove(IPluginContext)                                 │   │
¦  │ GetModule(IApplicationContext,ModuleId):IModuleContext │   │
¦  └────────────────────────────────────────────────────────┘   │
¦                                                               │
¦                                                               │
¦                                                               │
¦        ┌────────────────────────────────────────┐             │ 
¦        │ <<Interface>>                          │ *           │
¦        │ IModuleContext                         │<────────────┘
¦        ├────────────────────────────────────────┤
¦        │ PluginContext:IPluginContext           │
¦        │ ApplicationContext:IApplicationContext │
¦        │ ModuleId:String                        │
¦        │ ModuleName:String                      │
¦        │ Description:String                     │
¦        │ AssetPath:String                       │
¦        │ DataPath:String                        │
¦        │ ContextPath:UriResource                │
¦        │ Icon:UriResource                       │
¦        └────────────────────────────────────────┘
¦                           ∧
¦                           └-----------------------┐
¦                                                   ¦
¦          ┌────────────────────────────────┐       ¦
¦          │ <<Interface>>                  │       ¦
¦          │ IModule                        │       ¦
¦          ├────────────────────────────────┤       ¦
¦          │ Initialization(IModuleContext) │       ¦
¦          │ Run()                          │       ¦
¦          │ Dispose()                      │       ¦
¦          └────────────────────────────────┘       ¦
¦                          ▲                        ¦
¦                          ¦                        ¦
¦                          ¦                        ¦
¦  create  ┌───────────────┴────────────────┐       ¦
└--------->│ MyModule                       │       ¦
           ├────────────────────────────────┤  uses ¦
           │ Initialization(IModuleContext) ├-------┘
           │ Run()                          │
           │ Dispose()                      │
           └────────────────────────────────┘
```

## Resource model
Resources are (web) elements that can be accessed with a URI (Uniform Resource Identifier). When a plugin is loaded, all 
classes marked as resources are automatically determined from the assembly and included in a sitemap. For this purpose, 
the affected classes are provided with attributes.

```csharp
[Segment("E")]
[ContextPath("/C/D")]
[Module<MyModule>]
[Scope<ScopeGeneral>]
[Authorization(Permission.RWX, IdentityRoleDefault.SystemAdministrator)]
[Authorization(Permission.R, IdentityRoleDefault.Everyone)]
public sealed class MyPage : ResourcePage
{
}
```

The following attributes are available:

|Attribute       |Type              |Multiplicity |Optional |Description
|----------------|------------------|-------------|---------|----------------
|Id              |String            |1            |Yes      |The unique identification key. If no id is specified, the class name is used. An id should only be specified in exceptional cases.
|Title           |String            |1            |Yes      |The name of the page. This can be an internationalization key.
|Segment         |String, String    |1            |Yes      |The path segment of the resource. The first argument is the path segment. The second argument is the display string.
|SegmentInt      |Parameter, String |1            |Yes      |A variable path segment of type `Int`.
|SegmentGuid     |Parameter, String |1            |Yes      |A variable path segment of type `Guid`.
|ContextPath     |String            |1            |Yes      |The URI path from the module to the resource. The URI of the resource is composed of the `ContextPath` of the web server, the application, the module, the resource, and the segment.
|Parent          |`IResource`       |1            |Yes      |The resource is included below a parent resource. The context path is derived from that of the parent and the resource.
|IncludeSubPaths |Bool              |1            |Yes      |Determines whether all resources below the specified path (including segment) are processed.
|Scope           |`IScope`          |n            |Yes      |The scope of the resource
|Module          |`IModule`         |1            |No       |The class of the module. The module must be defined in the same plugin as the resource.
|Authorization   |Int, String       |n            |Yes      |Grants authority to a role (specifying the id) (see section notification model).
|Condition       |`ICondition`      |n            |Yes      |Condition that must be met for the resource to be available.
|Cache           |-                 |1            |Yes      |Determines whether the resource is created once and reused each time it is called.
|Optional        |-                 |1            |Yes      |Marks a resource as optional. It only becomes active if the option has been activated in the application.

Resources that are not identified by attributes can be registered manually in the sitemap.

```csharp
ResourceManager.Register<T>(id: "G", path: "/B/E") where T : IResource;
```

A cached resource is created on the first call and persists until the associated module is unloaded. The `Initialize` 
method is called once at instantiation, while the `Process` method is called each time the resource is requested. For 
non-cached resources, a new instance is created each time they are called.

```
┌────────┐ ┌────────┐ ┌─────────┐ ┌─────────┐
│ Web    │ │ HTTP   │ │ Package │ │ Plugin  │
│ Client │ │ Server │ │ Manager │ │ Manager │              ┌──────────┐
└────┬───┘ └────┬───┘ └────┬────┘ └────┬────┘              │ MyPlugin │
     ¦          ¦          ¦           ¦                   │          │
    ┌─┐        ┌─┐        ┌─┐ Register┌─┐                  └────┬─────┘
    │ │        │ │        │ ├────────>│ │      Create Instacnce ¦
    │ │        │ │        │ │         │ ├─────────────────────>┌─┐
    │ │        │ │        │ │         │ │<---------------------│ │
    │ │        │ │        │ │         │ │        Initialization│ │
    │ │        │ │        │ │         │ ├─────────────────────>│ │
    │ │        │ │        │ │         │ │<---------------------│ │
    │ │        │ │        │ │         │ │                      └─┘
    │ │        │ │        │ │         │ │     ┌─────────┐
    │ │        │ │        │ │         │ │     │ App.    │
    │ │        │ │        │ │         │ │     │ Manager │               ┌───────┐
    │ │        │ │        │ │         │ │     └────┬────┘               │ MyApp │
    │ │        │ │        │ │         │ │          ¦                    │       │
    │ │        │ │        │ │         │ │AddPlugin┌─┐                   └───┬───┘
    │ │        │ │        │ │         │ ├────────>│ │      Create Instacnce ¦
    │ │        │ │        │ │         │ │         │ ├─────────────────────>┌─┐
    │ │        │ │        │ │         │ │         │ │<---------------------│ │
    │ │        │ │        │ │         │ │         │ │        Initialization│ │
    │ │        │ │        │ │         │ │         │ ├─────────────────────>│ │
    │ │        │ │        │ │         │ │         │ │<---------------------│ │
    │ │        │ │        │ │         │ │<--------│ │                      └─┘
    │ │        │ │        │ │         │ │         └─┘
    │ │        │ │        │ │         │ │     ┌─────────┐
    │ │        │ │        │ │         │ │     │ Module  │
    │ │        │ │        │ │         │ │     │ Manager │
    │ │        │ │        │ │         │ │     └────┬────┘             ┌──────────┐
    │ │        │ │        │ │         │ │          ¦                  │ MyModule │
    │ │        │ │        │ │         │ │         ┌─┐                 │          │
    │ │        │ │        │ │         │ │AddPlugin│ │                 └─────┬────┘
    │ │        │ │        │ │         │ ├────────>│ │      Create Instacnce ¦
    │ │        │ │        │ │         │ │         │ ├─────────────────────>┌─┐
    │ │        │ │        │ │         │ │         │ │<---------------------│ │
    │ │        │ │        │ │         │ │         │ │        Initialization│ │
    │ │        │ │        │ │         │ │         │ ├─────────────────────>│ │
    │ │        │ │        │ │         │ │         │ │<---------------------│ │
    │ │        │ │        │ │         │ │<--------│ │                      └─┘
    │ │        │ │        │ │         │ │         └─┘
    │ │        │ │        │ │         │ │
    │ │        │ │        │ │         │ │     ┌──────────┐ ┌─────────┐
    │ │        │ │        │ │         │ │     │ Resource │ │ Sitemap │
    │ │        │ │        │ │         │ │     │ Manager  │ │ Manager │
    │ │        │ │        │ │         │ │     └────┬─────┘ └────┬────┘ ┌────────┐
    │ │        │ │        │ │         │ │          ¦            ¦      │ MyPage │
    │ │        │ │        │ │         │ │         ┌─┐          ┌─┐     │        │
    │ │        │ │        │ │         │ │AddPlugin│ │          │ │     └────┬───┘
    │ │        │ │        │ │         │ ├────────>│ │      Create Instacnce ¦
    │ │        │ │        │ │         │ │         │ ├─────────────────────>┌─┐
    │ │        │ │        │ │         │ │         │ │<---------------------│ │
    │ │        │ │        │ │         │ │         │ │        Initialization│ │
    │ │        │ │        │ │         │ │         │ ├─────────────────────>│ │
    │ │        │ │        │ │         │ │         │ │<---------------------│ │
    │ │        │ │        │ │         │ │         │ │   Refresh│ │         │ │
    │ │        │ │        │ │         │ │         │ ├─────────>│ │         │ │
    │ │        │ │        │ │         │ │         │ │<---------│ │         │ │
    │ │        │ │        │ │         │ │<--------│ │          │ │         │ │
    │ │        │ │        │ │<--------│ │         │ │          │ │         │ │
    │ │ Request│ │        │ │         │ │         │ │          │ │         │ │
    │ ├───────>│ │        │ │         │ │       Search Resource│ │         │ │
    │ │        │ ├────────────────────────────────────────────>│ │         │ │
    │ │        │ │<--------------------------------------------│ │         │ │
    │ │        │ │        │ │         │ │         │ │          │ │  Process│ │
    │ │        │ ├────────────────────────────────────────────────────────>│ │
    │ │Response│ │<--------------------------------------------------------│ │
    │ │<-------│ │        │ │         │ │         │ │          │ │         │ │
    └─┘        └─┘        └─┘         └─┘         └─┘          └─┘         └─┘
```

The `ResourceManager` manages all resources. However, these are only accessible through the `SitemapManager`. The 
interaction of the classes involved is illustrated in the following figure:

```
┌────────────────────────────────────┐
│ <<Interface>>                      │
│ IComponent                         │
├────────────────────────────────────┤
│ Initialization(IHttpServerContext) │
└────────────────────────────────────┘
      ▲                       ▲
      ¦                       ¦
      ¦                       └-------------------------┐
      ¦                                                 ¦
      ¦                        * ┌──────────────────────┴────────────────────────┐
      ¦                    ┌────>│ SitemapManager                                │
      ¦                    │     ├───────────────────────────────────────────────┤ 1
      ¦                    │     │ SiteMap:IEnumerable<IResourceContext>         ├───┐
      ¦                    │     ├───────────────────────────────────────────────┤   │
      ¦                    │     │ Initialization(IHttpServerContext)            │   │
      ¦                    │     │ Refresh()                                     │   │
      ¦                    │     │ SearchResource(Uri,SearchContex):SearchResult │   │
      ¦                    │     └───────────────────────────────────────────────┘   │
      ¦                    │                                                         │
      ¦                    └───────────────┐                                         │
      ¦                                    │                                         │
┌─────┴──────────────────────────────┐     │                                         │
│ <<Interface>>                      │     │   ┌─────────────────────────────────┐   │
│ IComponentPlugin                   │     │   │ ComponentManager                │   │
├────────────────────────────────────┤     │ 1 ├─────────────────────────────────┤   │
│ Initialization(IHttpServerContext) │     └───┤ SitemapManager:SitemapManager   │   │
│ Register(IPluginContext)           │     ┌───┤ ResourceManager:ResourceManager │   │
│ Remove(IPluginContext)             │     │ 1 │ …                               │   │
└────────────────────────────────────┘     │   └─────────────────────────────────┘   │
             ▲                             └─────────────────┐                       │
             ¦                                               │                       │
             ¦                                             1 V                       │
   ┌─────────┴─────────────────────────────────────────────────────────────┐         │
   │ ResourceManager                                                       │         │
   ├───────────────────────────────────────────────────────────────────────┤         │
   │ AddResource:Event                                                     │         │
   │ RemoveResource:Event                                                  │         │
   ├───────────────────────────────────────────────────────────────────────┤         │
 1 │ HttpServerContext:IHttpServerContext                                  │         │
┌──┤ Resources:IEnumerable<IResourceContext>                               │         │
│  ├───────────────────────────────────────────────────────────────────────┤         │
│  │ Initialization(IHttpServerContext)                                    │         │
│  │ Register(IPluginContext)                                              ├---┐     │
│  │ Remove(IPluginContext)                                                │   ¦     │
│  │ GetResorces(IApplicationContext,ModuleId,ResourceId):IResourceContext │   ¦     │
│  └───────────────────────────────────────────────────────────────────────┘   ¦     │
│                                                                              ¦     │
│                                                                              ¦     │
│                                                                              ¦     │
│             * ┌────────────────────────────────────┐                         ¦     │
└──────────────>│ <<Interface>>                      │ *                       ¦     │
   ┌----------->│ IResourceContext                   │<──────────────────────────────┘
   ¦            ├────────────────────────────────────┤                         ¦
   ¦            │ PluginContext:IPluginContext       │                         ¦
   ¦            │ ModuleContext:IModuleContext       │                         ¦
   ¦            │ Scopes:IEnumerable<String>         │                         ¦
   ¦            │ Conditions:IEnumerable<ICondition> │                         ¦
   ¦            │ ResourceId:String                  │                         ¦
   ¦            │ ResourceTitle:String               │                         ¦
   ¦            │ ParentContext:IResourceContext     │                         ¦
   ¦            │ Cache:Bool                         │                         ¦
   ¦            │ ContextPath:UriResource            │                         ¦
   ¦            │ Uri:UriResource                    │                         ¦
   ¦            └────────────────────────────────────┘                         ¦
   ¦                                                                           ¦
   ¦                                                                           ¦
   ¦                                                                           ¦
   ¦          ┌────────────────────────────────────────┐                       ¦
   ¦          │ <<Interface>>                          │                       ¦
   ¦          │ IResource                              │                       ¦
   ¦          ├────────────────────────────────────────┤                       ¦
   ¦          │ Initialization(IResourceContext)       │                       ¦
   ¦          │ PreProcess(Request)                    │                       ¦
   ¦          │ Process(Request):Response              │                       ¦
   ¦          │ PostProcess(Request,Response):Response │                       ¦
   ¦          └────────────────────────────────────────┘                       ¦
   ¦                              ▲                                            ¦
   ¦                              ¦                                            ¦
   ¦                              ¦                                            ¦
   ¦          ┌───────────────────┴────────────────────┐                create ¦
   ¦          │ MyResource                             │<----------------------┘
   ¦     uses ├────────────────────────────────────────┤
   └----------┤ Initialization(IResourceContext)       │
              │ PreProcess(Request)                    │
              │ Process(Request):Response              │
              │ PostProcess(Request,Response):Response │
              └────────────────────────────────────────┘
```

Resources, such as pages or assets, can be uniquely addressed with the help of URIs. The following resource types are supported:

|Resource type |Description
|--------------|-------------------------
|Page          |Dynamic web pages that consist of HTML.
|File          |Files from the file system.
|Asset         |Files from the assembly.

## Sitemap model
In a sitemap, all resources are listed with their URI. When a WebClient calls a resource, the associated resource is determined 
from the sitemap and returned to the caller. Only one resource can be associated with a URI. Multiple URIs, on the other hand, 
can point to a common resource. This comes into play, among other things, when the segment is variable (e.g. described by 
regular expressions). Furthermore, a partial URI can refer to a resource.

The sitemap is implemented as a tree. Multiple paths to the same resource are resolved by creating a copy of the affected 
resource. For example, the URIs `/B/E/G`, `/B/X/G`, and `/C/D/G` point to the same resource `G`.

Context paths can be specified in the configuration of WebExpress, the applications and the modules. The context paths are 
prefixed to the URIs. The following possible combinations exist:

|WebExpress |Application |Module | Resource | URI
|-----------|------------|-------|----------|----
|-          |-           |-      |/         |/
|-          |-           |-      |/a/b/c    |/a/b/c
|-          |-           |/      |/         |/
|-          |-           |/z     |/         |/z
|-          |-           |/z     |/a/b/c    |/z/a/b/c
|-          |/           |/      |/         |/
|-          |/           |/z     |/         |/z
|-          |/y          |/      |/         |/y
|-          |/y          |/z     |/         |/y/z
|-          |/y          |/      |/a/b/c    |/y/a/b/c
|-          |/y          |/z     |/a/b/c    |/y/z/a/b/c
|/          |/           |/      |/         |/
|/          |/           |/z     |/         |/z
|/          |/y          |/      |/         |/y
|/          |/y          |/z     |/         |/y/z
|/          |/           |/      |/a/b/c    |/a/b/c
|/          |/           |/z     |/a/b/c    |/z/a/b/c
|/          |/y          |/      |/a/b/c    |/y/a/b/c
|/          |/y          |/z     |/a/b/c    |/y/z/a/b/c
|/x         |/           |/      |/         |/x
|/x         |/           |/z     |/         |/x/z
|/x         |/y          |/      |/         |/x/y
|/x         |/y          |/z     |/         |/x/y/z
|/x         |/           |/      |/a/b/c    |/x/a/b/c
|/x         |/           |/z     |/a/b/c    |/x/z/a/b/c
|/x         |/y          |/      |/a/b/c    |/x/y/a/b/c
|/x         |/y          |/z     |/a/b/c    |/x/y/z/a/b/c

The insertion into the sitemap is done by sorting the number of URI segments in ascending order. Only one resource can 
be assigned per sitemap node. In a competing situation, the first resource is used. All other resources are not 
processed. This is indicated in the log by a warning message. 

Finding a resource starts at the root of the sitemap tree and follows the path of the URI. If no resource can be 
found, a 404 jam page is returned.

Parameters can be transferred to the resource to be executed in a URI or through form inputs. Furthermore, it is possible 
to store parameters in the session environment in order to make values available across pages. The parameters in the session 
are valid until the web server is restarted or the session is destroyed. The following parameters are supported:

|Origin       |Scope     |Description
|-------------|----------|-------------------------
|GET, DELETE  |Parameter |Parameter from the URI. Example: http://www.example.com?id=d9869404-6628-464b-8286-9685d4c4ff8b
|POST, PATCH  |Parameter |Parameter from the content part of the request. 
|Path segment |URI       |Parameters that are part of the URI path. Example: http://www.example.com/d9869404-6628-464b-8286-9685d4c4ff8b/edit
|Session      |Session   |Parameters, which are stored in the session. 

## Page modell
Web pages are resources that are rendered in an HTML tree before delivery. The `ViualTree` class, which is available 
in the `RenderContext`, is responsible for the display of the page.

```
┌─────────────────────────────────────────┐
│ <<Interface>>                           │
│ IResource                               │
├─────────────────────────────────────────┤
│ Initialization(IResourceContext)        │
│ PreProcess(Request)                     │
│ Process(Request):Response               │
│ PostProcess(Request, Response):Response │
└─────────────────────────────────────────┘
            ▲              ▲
            ¦              └--------------------------------┐
            ¦                                               ¦
┌───────────┴────────────────────────────┐        ┌─────────┴────────┐
│ Resource                               │        │ <<Interface>>    │
├────────────────────────────────────────┤        │ IPage            │
│ ResourceContext:IResourceContext       │        ├──────────────────┤
├────────────────────────────────────────┤        │ Title:String     │
│ Initialization(IResourceContext)       │        ├──────────────────┤
│ PreProcess(Request)                    │        │ Redirecting(Uri) │
│ Process(Request):Response              │        └──────────────────┘
│ Process(RenderContextControl)          │                  ▲
│ PostProcess(Request,Response):Response │                  ¦
└────────────────────────────────────────┘                  ¦
            ▲                                               ¦
            ¦               ┌-------------------------------┘
            ¦               ¦
┌───────────┴───────────────┴────────────┐
│ Page                                   │
├────────────────────────────────────────┤
│ Title:String                           │
├────────────────────────────────────────┤
│ Initialization(IResourceContext)       │
│ Redirecting(Uri)                       │
│ PreProcess(Request)                    │
│ Process(Request):Response              │
│ Process(RenderContext)                 │
│ PostProcess(Request,Response):Response │
└────────────────────────────────────────┘
                    ▲
                    ¦
                    ¦
    ┌───────────────┴───────────────┐
    │ PageControl                   │
    ├───────────────────────────────┤
    │ Process(RenderContextControl) │
    └───────────────────────────────┘
                    ▲
                    ¦
                    ¦
    ┌───────────────┴──────────────┐
    │ PageWebApp                   │
    ├──────────────────────────────┤
    │ Process(RenderContextWebApp) │
    └──────────────────────────────┘
                    ▲
                    ¦
                    ¦
    ┌───────────────┴──────────────┐
    │ MyPage                       │
    ├──────────────────────────────┤
    │ Process(RenderContextWebApp) │
    └──────────────────────────────┘
```

## Response modell
Web queries can be answered with different status responses (see RFC 2616). If successful, a status code of `200` is 
returned with the invoked resource. In the `StatusPageManager`, generally valid status pages for the various status 
codes can be stored. When returning a response that differs from `200`, the stored status page is used. 

Status pages are primarily used from the plugin in which the associated application is implemented. Status pages 
implement the `IStatusPage` interface and derive from `Page`. 

```csharp
[WebExStatusCode(500)]
public sealed class MyStatusPage : StatusPage<Page>
{
}
```

The following attributes are available:

|Attribute  |Type   |Multiplicity |Optional |Description
|-----------|-------|-------------|---------|-------------
|Id         |String |1            |Yes      |The unique identification key. If no id is specified, the class name is used. An id should only be specified in exceptional cases.
|Title      |String |1            |Yes      |The name of the page. This can be an internationalization key.
|StatusCode |int    |1            |No       |The status code (see RFC 2616 para. 6). 
|Icon       |String |1            |Yes      |The icon that represents the statuscode graphically.

When creating a response that differs from status 200, the corresponding status page is determined from the 
StatusPageManager and an instance is created. To do this, the following order is used to determine the status page:

- Search in the plugin of the called resource.
- Search in the plugin of the module of the called resource.
- Search in the plugin of the application of the called resource.
- Use the status pages from the plugin "webexpress.webapp".
- Use the system status pages.

```
┌────────────────────────────────────┐        ┌─────────────────────────────────────┐
│ <<Interface>>                      │        │ ComponentManager                    │
│ IComponentPlugin                   │      1 ├─────────────────────────────────────┤
├────────────────────────────────────┤    ┌───┤ StatusPageManager:StatusPageManager │
│ Initialization(IHttpServerContext) │    │   │ …                                   │
│ Register(IPluginContext)           │    │   └─────────────────────────────────────┘
│ Remove(IPluginContext)             │    │
└────────────────────────────────────┘    │
                 ▲                        │
           ┌-----┘                        │
           ¦                            1 V
    ┌──────┴──────────────────────────────────────┐
    │ StatusPageManager                           │
    ├─────────────────────────────────────────────┤
    │ AddStatusPage:Event                         │
    │ RemoveStatusPage:Event                      │
    ├─────────────────────────────────────────────┤
  1 │ HttpServerContext:IHttpServerContext        │
┌───┤ StatusPages:IEnumerable<IStatusPageContext> │
│   ├─────────────────────────────────────────────┤
│   │ Initialization(IHttpServerContext)          │
│   │ Register(IPluginContext)                    ├-------------------┐
│   │ Remove(IPluginContext)                      │                   ¦
│   └─────────────────────────────────────────────┘                   ¦
│                                                                     ¦
└────────────────────┐                                                ¦
                   * V                                                ¦
    ┌──────────────────────────────────┐                              ¦
    │ <<Interface>>                    │                              ¦
┌-->│ IStatusPageContext               │                              ¦
¦   ├──────────────────────────────────┤                              ¦
¦   │ PluginContext:IPluginContext     │                              ¦
¦   │ Code:Int                         │                              ¦
¦   │ Title:String                     │                              ¦
¦   │ Icon:UriResource                 │                              ¦
¦   ├──────────────────────────────────┤                              ¦
¦   │ Initialization(IResourceContext) │                              ¦
¦   │ Process(Request):Response        │                              ¦
¦   │ Dispose()                        │                              ¦
¦   └──────────────────────────────────┘                              ¦
¦          ▲                                                          ¦
¦          ¦                  ┌──────────────────────────────────┐    ¦
¦          ¦                  │ <<Interface>>                    │    ¦
¦          ¦                  │ IStatusPage                      │    ¦
¦          ¦                  ├──────────────────────────────────┤    ¦
¦          ¦                  │ ResourceContext:IResourceContext │    ¦
¦          ¦                  │ StatusCode:Int                   │    ¦
¦          ¦                  │ StatusTitle:String               │    ¦
¦          ¦                  │ StatusMessage:String             │    ¦
¦          ¦                  │ StatusIcon:UriResource           │    ¦
¦          ¦                  ├──────────────────────────────────┤    ¦
¦          ¦                  │ Initialization(IResourceContext) │    ¦
¦          ¦                  │ Process(Request):Response        │    ¦
¦          ¦                  │ Dispose()                        │    ¦
¦          ¦                  └──────────────────────────────────┘    ¦
¦          ¦                                   ▲                      ¦
¦          ¦                                   ¦                      ¦
¦          ¦                                   ¦                      ¦
¦ ┌────────────────────────────────────────┐   ¦                      ¦
¦ │ Page                                   │   ¦                      ¦
¦ ├────────────────────────────────────────┤   ¦                      ¦
¦ │ Title:String                           │   ¦                      ¦
¦ ├────────────────────────────────────────┤   ¦                      ¦
¦ │ Initialization(IResourceContext)       │   ¦                      ¦
¦ │ Redirecting(Uri)                       │   ¦                      ¦
¦ │ PreProcess(Request)                    │   ¦                      ¦
¦ │ Process(Request):Response              │   ¦                      ¦
¦ │ Process(RenderContext)                 │   ¦                      ¦
¦ │ PostProcess(Request,Response):Response │   ¦                      ¦
¦ └────────────────────────────────────────┘   ¦                      ¦
¦                     ▲                        ¦                      ¦
¦                     ¦                        ¦                      ¦
¦             ┌-------┘                        ¦                      ¦
¦             ¦                    ┌-----------┘                      ¦
¦             ¦                    ¦                                  ¦
¦    ┌────────┴────────────────────┴────────┐                         ¦
¦    │ StatusPage                           │                         ¦
¦    ├──────────────────────────────────────┤                         ¦
¦    │ StatusPageContext:IStatusPageContext │                         ¦
¦    │ StatusMessage:String                 │                         ¦
¦    ├──────────────────────────────────────┤                         ¦
¦    │ Initialization(IResourceContext)     │                         ¦
¦    │ Process(Request):Response            │                         ¦
¦    │ Dispose()                            │                         ¦
¦    └──────────────────────────────────────┘                         ¦
¦                      ▲                                              ¦
¦                      ¦                                              ¦
¦                      ¦                                              ¦
¦     ┌────────────────────────────────────┐                  create  ¦
¦     │ MyStatusPage                       │<-------------------------┘
¦uses ├────────────────────────────────────┤
└-----┤ Initialization(IStatusPageContext) │
      │ Process(Request):Response          │
      │ Dispose()                          │
      └────────────────────────────────────┘
```

If no status page is found in the current application, a default page is created and delivered by WebExpress.

## Internationalization model
The provision of multilingual applications for different cultures is supported by WebExpress. In addition, the 
following text formatting is also adapted to the corresponding culture:

|Text formatting |Description
|---------------|-----------------
|Date formats   |Use of the calendar format of the selected culture.
|Time formats   |Support between 24 and 12 hour counting.
|Time zones     |Support for time zones when displaying times.
|Number formats |Support the different representation of decimal and thousands separators, as well as different currencies, weights and measurements.

For the translation of texts, language translation files are used, which are stored in the packages under `Internationalization`. 

```
   📁 Internationalization
   ├📄 de
   └📄 en
```

The data must be stored as embedded resources in the project file.

```xml
<ItemGroup>
    <EmbeddedResource Include="Internationalization/de" />
    <EmbeddedResource Include="Internationalization/en" />
</ItemGroup>
```

The name of the language translation file must match the country code from ISO 3166 ALPHA-2. Each language 
translation file is structured as follows:

```csharp
# Comment
key=text fragment

e.g.
inventoryexpress.inventory.name.discription=The name of the inventory item
```

The translation of a text is done with the help of the InternationalizationManager, which provides the I18N function. 

```csharp
using static WebExpress.Internationalization.InternationalizationManager;

var text = I18N("de", "example", "name.discription"); Language, PluginId, Key
var text = I18N(culture, "PlginId:name.discription"); culture, pluginId:key
```

## Fragment model
Fragments are components that can be integrated into pages to extend functionalities. Fragments can come from 
different sources (plugins). When a resource is loaded, the fragments stored in the sections are determined, 
instantiated and integrated into the resource. A section is a named area within a page (e.g. `Property.Primary`).

```
   ┌────────────────────────────────────┐         ┌───────────────────────────────────┐
   │ <<Interface>>                      │         │ ComponentManager                  │
   │ IComponentPlugin                   │       1 ├───────────────────────────────────┤
   ├────────────────────────────────────┤     ┌───┤ StatusPageManager:FragmentManager │
   │ Initialization(IHttpServerContext) │     │   │ …                                 │
   │ Register(IPluginContext)           │     │   └───────────────────────────────────┘
   │ Remove(IPluginContext)             │     │
   └────────────────────────────────────┘     │
                     ▲                        │
           ┌---------┘                ┌───────┘
           ¦                        1 V
   ┌───────┴─────────────────────────────────────┐
   │ FragmentManager                             │
   ├─────────────────────────────────────────────┤
   │ AddFragment:Event                           │
   │ RemoveFragment:Event                        │
   ├─────────────────────────────────────────────┤
   │ HttpServerContext:IHttpServerContext        │ 1
   │ Fragments:IEnumerable<IFragmentContext>     ├─────────┐
   ├─────────────────────────────────────────────┤         │
   │ Initialization(IHttpServerContext)          │         │
   │ Register(IPluginContext)                    ├----┐    │
   │ Remove(IPluginContext)                      │    ¦    │
   └─────────────────────────────────────────────┘    ¦    │
                                                      ¦    │
                                                      ¦    │
                                                      ¦    │
     ┌────────────────────────────────────────┐       ¦    │
     │ <<Interface>>                          │ *     ¦    │
┌--->│ IFragmentContext                       │<───────────┘
¦    ├────────────────────────────────────────┤       ¦
¦    │ PluginContext:IPluginContext           │       ¦
¦    │ ApplicationContext:IApplicationContext │       ¦
¦    │ ModuleContext:IModuleContext           │       ¦
¦    │ Conditions:IEnumerable<ICondition>     │       ¦
¦    │ Cache:Bool                             │       ¦
¦    └────────────────────────────────────────┘       ¦
¦                                                     ¦
¦                                                     ¦
¦                                                     ¦
¦    ┌─────────────────────────────────────────┐      ¦
¦    │ <<Interface>>                           │      ¦
¦    │ IFragment                               │      ¦
¦    ├─────────────────────────────────────────┤      ¦
¦    │ Initialization(IFragmentContext, IPage) │      ¦
¦    │ Render(RenderContext):IHtmlNode         │      ¦
¦    └─────────────────────────────────────────┘      ¦
¦                         ▲                           ¦
¦                         ¦                           ¦
¦                         ¦                           ¦
¦        ┌────────────────┴────────────────┐   create ¦
¦        │ MyFragment                      │<---------┘
¦ uses   ├─────────────────────────────────┤
└------->│ Initialization(IResourceContext)│
         │ Process(Request):Response       │
         │ Dispose()                       │
         └─────────────────────────────────┘
```

Fragments are derived from the `IFragment` interface and are identified by attributes:

```csharp
[Section("Sektionsname")]
[Order(0)]
[Module<MyModule>]
[Scope<ScopeGeneral>]
[Authorization(Permission.RW, IdentityRoleDefault.Authenticated)]
[Authorization(Permission.R, IdentityRoleDefault.Everyone)]
public sealed class MyFragment : IFragment
{
}
```

The following attributes are available:

|Attribute     |Type         |Multiplicity |Optional |Description
|--------------|-------------|-------------|---------|-----------------
|Id            |String       |1            |No       |The unique identification key. If no id is specified, the class name is used. An id should only be specified in exceptional cases.
|Section       |String       |1            |No       |The section of the Web page where the fragment is rendered.
|Order         |Int          |1            |Yes      |The order within the section. If no value is specified, the order "0" is set as the default.
|Module        |`IModule`    |1            |No       |The class of the module. The module must be defined in the same plugin as the resource.
|Scope         |`IScope`     |n            |Yes      |The scope in which the fragment is valid.
|Authorization |Int, String  |n            |Yes      |Grants authority to a role (specifying the id).       
|Condition     |`ICondition` |1            |Yes      |Condition that must be met for the fragment to be available.
|Cache         |-            |1            |Yes      |Determines whether the fragment is created once and reused each time it is called. This attribute is active only if the associated page also has the cache attribute. 

If the fragments are to be created dynamically at runtime, it is necessary to create a class that implements `IFragmentDynamic`.

```csharp
[Section("section name")]
[Module<MyModule>]
[Scope<ScopeGeneral>]
public sealed class MyFragment : IFragmentDynamic
{
    public IEnumerable<T> Create<T>() where T : IControl
    {
        return …;
    }
}
```

In the `Create` method, the fragments are instantiated.

## Controls
Controls are units of the web page that are translated into HTML source code by rendering. A Web page consists 
of nested controls.

```
  ┌─────────────────────────────────────────┐
  │ <<Interface>>                           │
  │ IControl                                │
  ├─────────────────────────────────────────┤
  │ Id:String                               │
  ├─────────────────────────────────────────┤
  │ Render(RenderContext):IHtmlNode         │
  └─────────────────────────────────────────┘
                     ▲
                     ¦
                     ¦
┌────────────────────┴────────────────────────┐
│ Control                                     │
├─────────────────────────────────────────────┤
│ Id:String                                   │
│ Classes:List<String>                        │
│ Styles:List<String>                         │
│ HorizontalAlignment:TypeHorizontalAlignment │
│ TextColor:PropertyColorText                 │
│ BackgroundColor:PropertyColorBackground     │
│ BorderColor:PropertyColorBorder             │
│ Padding:PropertySpacingPadding              │
│ Margin:PropertySpacingMargin                │
│ Border:PropertyBorder                       │
│ GridColumn:PropertyGrid                     │
│ Width:TypeWidth                             │
│ Height:TypeHeight                           │
│ Role:String                                 │
│ OnClick:PropertyOnClick                     │
│ Enable:Bool                                 │
├─────────────────────────────────────────────┤
│ Render(RenderContext):IHtmlNode             │
└─────────────────────────────────────────────┘
                     ▲
                     ¦
                     ¦
  ┌──────────────────┴──────────────────────┐
  │ MyControl                               │
  ├─────────────────────────────────────────┤
  │ Render(RenderContext):IHtmlNode         │
  └─────────────────────────────────────────┘
```

A control provides the following properties:

|Property            |Type                    |Description
|--------------------|------------------------|-----------------
|Id                  |String                  |Unique identifier for the element.
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
A form in HTML is an interactive element that allows users to enter data and send it to the WebExpress server. Forms consist 
of various input elements such as text boxes, checkboxes, radio buttons, drop-down menus, and buttons. These form elements 
are organized into tabs and groups for better structure and usability. By grouping related elements together and using 
tabs to separate different sections, users can navigate and complete the form more efficiently.

```
┌─────────────────────────────────────────┐
│ Control                                 │
└─────────────────────────────────────────┘
                   ▲
                   ¦
                   ¦
┌──────────────────┴──────────────────────┐
│ ControlForm                             │
├─────────────────────────────────────────┤
│ Name:String                             │
├─────────────────────────────────────────┤
│ OnValidation():Bool                     │
│ Render(RenderFormContext):IHtmlNode     │
└─────────────────────────────────────────┘
                 1 ∧
                   │
                 * │
┌──────────────────┴──────────────────────┐
│ ControlFormTab                          │
├─────────────────────────────────────────┤
│ Name:String                             │
├─────────────────────────────────────────┤
│ Render(RenderFormContext):IHtmlNode     │
└─────────────────────────────────────────┘
                 1 ∧
                   │
                 * │
┌──────────────────┴──────────────────────┐
│ ControlFormGroup                        │
├─────────────────────────────────────────┤
│ Name:String                             │
├─────────────────────────────────────────┤
│ Render(RenderFormContext):IHtmlNode     │
└─────────────────────────────────────────┘
                 1 ∧
                   │
                 * │
┌──────────────────┴──────────────────────┐
│ ControlFormItem                         │
├─────────────────────────────────────────┤
│ Label:String                            │
│ Name:String                             │
│ Description:String                      │
├─────────────────────────────────────────┤
│ OnValidation():Bool                     │
│ Render(RenderFormContext):IHtmlNode     │
└─────────────────────────────────────────┘
```

A form takes user input and forwards it to the web server for processing:

```
     ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
     │ Web     │ │ HTTP    │ │ MyPage  │ │ Form    │ │ FormTab │ │FormGroup│ │ FormItem│
     │ Client  │ │ Server  │ │         │ │         │ │         │ │         │ │         │
     └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘
          ¦           ¦           ¦           ¦           ¦           ¦           ¦
         ┌─┐  Request┌─┐         ┌─┐         ┌─┐         ┌─┐         ┌─┐         ┌─┐
new/reset│ ├────────>│ │  Process│ │         │ │         │ │         │ │         │ │
         │ │         │ ├────────>│ │         │ │         │ │         │ │         │ │
         │ │         │ │       ┌─┤ │         │ │         │ │         │ │         │ │
         │ │         │ │ Render│ │ │         │ │         │ │         │ │         │ │
         │ │         │ │       └>│ │   Render│ │         │ │         │ │         │ │
         │ │         │ │         │ ├────────>│ │         │ │         │ │         │ │
         │ │         │ │         │ │       ┌─┤ Initialize│ Initialize│ Initialize│ │
         │ │         │ │         Initialize│ │ ├────────>│ ├────────>│ ├────────>│ │
         │ │         │ │         │ │       └>│ │<--------│ │<--------│ │<--------│ │
         │ │         │ │         │ │       ┌─┤ │     Set │ │     Set │ │      Set│ │
         │ │         │ │         │ │   Fill│ │ ├────────>│ ├────────>│ ├────────>│ │
         │ │         │ │         │ │       └>│ │<--------│ │<--------│ │<--------│ │
         │ │         │ │         │ │         │ │   Render│ │   Render│ │   Render│ │
         │ │         │ │         │ │         │ ├────────>│ ├────────>│ ├────────>│ │
         │ │         │ │         │ │         │ │<--------│ │<--------│ │<--------│ │
         │ │         │ │         │ │<--------│ │         │ │         │ │         │ │
         │ │Response │ │<--------│ │         │ │         │ │         │ │         │ │
         │ │<--------│ │         │ │         │ │         │ │         │ │         │ │
         └─┘         └─┘         └─┘         └─┘         └─┘         └─┘         └─┘
          ¦           ¦           ¦           ¦           ¦           ¦           ¦
         ┌─┐  Request┌─┐         ┌─┐         ┌─┐         ┌─┐         ┌─┐         ┌─┐
  refresh│ ├────────>│ │  Process│ │         │ │         │ │         │ │         │ │
         │ │         │ ├────────>│ │         │ │         │ │         │ │         │ │
         │ │         │ │       ┌─┤ │         │ │         │ │         │ │         │ │
         │ │         │ │ Render│ │ │         │ │         │ │         │ │         │ │
         │ │         │ │       └>│ │   Render│ │         │ │         │ │         │ │
         │ │         │ │         │ ├────────>│ │         │ │         │ │         │ │
         │ │         │ │         │ │       ┌─┤ Initialize│ Initialize│ Initialize│ │
         │ │         │ │         Initialize│ │ ├────────>│ ├────────>│ ├────────>│ │
         │ │         │ │         │ │       └>│ │<--------│ │<--------│ │<--------│ │
         │ │         │ │         │ │         │ │   Render│ │   Render│ │   Render│ │
         │ │         │ │         │ │         │ ├────────>│ ├────────>│ ├────────>│ │
         │ │         │ │         │ │         │ │<--------│ │<--------│ │<--------│ │
         │ │         │ │         │ │<--------│ │         │ │         │ │         │ │
         │ │Response │ │<--------│ │         │ │         │ │         │ │         │ │
         │ │<--------│ │         │ │         │ │         │ │         │ │         │ │
         └─┘         └─┘         └─┘         └─┘         └─┘         └─┘         └─┘
          ¦           ¦           ¦           ¦           ¦           ¦           ¦
         ┌─┐  Request┌─┐         ┌─┐         ┌─┐         ┌─┐         ┌─┐         ┌─┐
   submit│ ├────────>│ │  Process│ │         │ │         │ │         │ │         │ │
         │ │         │ ├────────>│ │         │ │         │ │         │ │         │ │
         │ │         │ │       ┌─┤ │         │ │         │ │         │ │         │ │
         │ │         │ │ Render│ │ │         │ │         │ │         │ │         │ │
         │ │         │ │       └>│ │   Render│ │         │ │         │ │         │ │
         │ │         │ │         │ ├────────>│ │         │ │         │ │         │ │
         │ │         │ │         │ │       ┌─┤ Initialize│ Initialize│ Initialize│ │
         │ │         │ │         Initialize│ │ ├────────>│ ├────────>│ ├────────>│ │
         │ │         │ │         │ │       └>│ │<--------│ │<--------│ │<--------│ │
         │ │         │ │         │ │         │ │         │ │         │ │         │ │
         │ │         │ │         │ │       ┌─┤ │ Validate│ │ Validate│ │ Validate│ │
         │ │         │ │         Validation│ │ ├────────>│ ├────────>│ ├────────>│ │
         │ │         │ │         │ │       └>│ │<--------│ │<--------│ │<--------│ │
         │ │         │ │         │ │         │ │         │ │         │ │         │ │
         │ │         │ │         │ │       ┌─┤ │         │ │         │ │         │ │
         │ │         │ │         │  Process│ │ │         │ │         │ │         │ │
         │ │         │ │         │ │       └>│ │         │ │         │ │         │ │
         │ │         │ │         │ │         │ │   Render│ │   Render│ │   Render│ │
         │ │         │ │         │ │         │ ├────────>│ ├────────>│ ├────────>│ │
         │ │         │ │         │ │         │ │<--------│ │<--------│ │<--------│ │
         │ │         │ │         │ │<--------│ │         │ │         │ │         │ │
         │ │Response │ │<--------│ │         │ │         │ │         │ │         │ │
         │ │<--------│ │         │ │         │ │         │ │         │ │         │ │
         └─┘         └─┘         └─┘         └─┘         └─┘         └─┘         └─┘
```

Form classes and associated form controls are available for entering data, ensuring a consistent and user-friendly 
experience. The user interface of the form is structured as follows to ensure a variable display of the controls:

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
A session establishes a state-based connection between the client and WebExpress using the otherwise stateless HTTP(S) 
protocol. The session is assigned to a cookie and is personalized. The cookie consists of a guid. Further data is not 
stored in the cookie, but on the server side in the `session` object. 

```
     ┌────────────────────────────────────┐
     │ <<Interface>>                      │          ┌───────────────────────────────┐
     │ IComponent                         │          │ ComponentManager              │
     ├────────────────────────────────────┤        1 ├───────────────────────────────┤
     │ Initialization(IHttpServerContext) │      ┌───┤ SessionManager:SessionManager │
     └────────────────────────────────────┘      │   │ …                             │
                       ▲                         │   └───────────────────────────────┘
                       ¦                         │
                       ¦                         │
    ┌──────────────────┴───────────────────┐ 1   │
    │ SessionManager                       │<────┘
    ├──────────────────────────────────────┤
    │ HttpServerContext:IHttpServerContext │ 1    
    │ Sessions:IEnumerable<Session>        ├────┐
    ├──────────────────────────────────────┤    │   
    │ Initialization(IHttpServerContext)   │    │   
    │ GetSession(Request):Session          │    │   
    │ Remove(Session)                      │    │
    └──────────────────────────────────────┘    │
                                                │
                       ┌────────────────────────┘
                     * V
┌────────────────────────────────────────────────┐
│ Session                                        │
├────────────────────────────────────────────────┤
│ Id:Guid                                        │
│ Created:DateTime                               │
│ Updated:DateTime                               │
│ Properties:IEnumerable<ISessionProperty>       ├────┐
├────────────────────────────────────────────────┤    │
│ GetProperty():ISessionProperty                 │    │
│ GetOrCreateProperty():ISessionProperty         │    │
│ SetProperty(ISessionProperty):IResourceContext │    │
│ RemoveProperty(ISessionProperty)               │    │
└────────────────────────────────────────────────┘    │
                                                      │
                     ┌────────────────────────────────┘
                   * V
┌─────────────────────────────────────────┐
│ <<Interface>>                           │
│ ISessionProperty                        │
├─────────────────────────────────────────┤
└─────────────────────────────────────────┘
                     ▲
                     ¦
                     ¦
┌────────────────────┴────────────────────┐
│ MySessionProperty                       │
├─────────────────────────────────────────┤
└─────────────────────────────────────────┘
```

The session manager delivers the currently used session based on the cookie stored in the request. The session, in 
turn, stores instances of the `ISessionProperty` interface in which the information (e.g. parameters) is stored. 

## Event modell
Events are notifications from the WebExpress API or web applications that can be subscribed to and evaluated.

```
     ┌────────────────────────────────────┐               ┌───────────────────────────┐
     │ <<Interface>>                      │               │ ComponentManager          │
     │ IComponentPlugin                   │             1 ├───────────────────────────┤
     ├────────────────────────────────────┤        ┌──────┤ EventManager:EventManager │
     │ Initialization(IHttpServerContext) │        │      │ …                         │
     │ Register(IPluginContext)           │        │      └───────────────────────────┘
     │ Remove(IPluginContext)             │        │
     └────────────────────────────────────┘        │
                       ▲                           │
                       ¦                           │
                       ¦                           │
┌──────────────────────┴──────────────────────┐ 1  │
│ EventManager                                │<───┘
├─────────────────────────────────────────────┤        ┌──────────────────────────────┐
│ AddEvent:Event                              │      * │ <<Interface>>                │
│ RemoveEvent:Event                           │   ┌───>│ IEventContext                │
├─────────────────────────────────────────────┤   │    ├──────────────────────────────┤
│ HttpServerContext:IHttpServerContext        │ 1 │    │ PluginContext:IPluginContext │
│ Events:IEnumerable<IEventContext>           ├───┘    │ ModuleContext:IModuleContext │
├─────────────────────────────────────────────┤        └──────────────────────────────┘
│ Initialization(IHttpServerContext)          │                       ∧
│ Register(IPluginContext)                    ├--------┐              ¦
│ Remove(IPluginContext)                      │        ¦              ¦
└─────────────────────────────────────────────┘        ¦              ¦
                                                       ¦              ¦
                                                       ¦              ¦
                                                       ¦              ¦
       ┌───────────────────────────────┐               ¦              ¦
       │ <<Interface>>                 │               ¦              ¦
       │ IEventHandler                 │               ¦              ¦
       ├───────────────────────────────┤               ¦              ¦
       │ Initialization(IEventContext) │               ¦              ¦
       │ Process()                     │               ¦              ¦
       └───────────────────────────────┘               ¦              ¦
                       ▲                               ¦              ¦
                       ¦                               ¦              ¦
                       ¦                               ¦              ¦
      ┌────────────────┴──────────────┐     create     ¦              ¦
      │ MyEventHandler                │<---------------┘              ¦
      ├───────────────────────────────┤                         uses  ¦
      │ Initialization(IEventContext) ├-------------------------------┘
      │ Process()                     │
      │ Dispose()                     │
      └───────────────────────────────┘
```

A eventhandler is created by creating a class that inherits from `IEventHandler`.

```csharp
[Event<Event>] 
[Module<MyModule>]
public sealed class MyEventHandler : IEventHandler
{
  public override void Process(object sender)
  {
    base Process();
  }
}
```

The following attributes are available:

|Attribute |Type      |Multiplicity |Optional |Description
|----------|----------|-------------|---------|------------
|Event     |`IEvent`  |1            |No       |The event at which you want to listen.
|Module    |`IModule` |1            |No       |The class of the module. The module must be defined in the same plugin as the resource.

## Job modell
Jobs are tasks that are executed in a time-controlled and repetitive manner. When a plugin is loaded, all jobs containing 
it are determined by the ScheduleManager and instantiated and started at the specified execution time.

```
        ┌────────────────────────────────────┐           ┌───────────────────────┐
        │ <<Interface>>                      │           │ ComponentManager      │
        │ IComponentPlugin                   │         1 ├───────────────────────┤
        ├────────────────────────────────────┤        ┌──┤ JobManager:JobManager │
        │ Initialization(IHttpServerContext) │        │  │ …                     │
        │ Register(IPluginContext)           │        │  └───────────────────────┘
        │ Remove(IPluginContext)             │        │
        └────────────────────────────────────┘        │
                          ▲                           │
                          ¦                           │
                          ¦                           │
   ┌──────────────────────┴──────────────────────┐ 1  │
   │ JobManager                                  │<───┘
   ├─────────────────────────────────────────────┤     ┌──────────────────────────────┐
   │ AddJob:Event                                │   * │ <<Interface>>                │
   │ RemoveJob:Event                             │   ┌>│ IJobContext                  │
   ├─────────────────────────────────────────────┤   │ ├──────────────────────────────┤
   │ HttpServerContext:IHttpServerContext        │ 1 │ │ PluginContext:IPluginContext │
 1 │ Jobs:IEnumerable<JobContext>                ├───┘ │ ModuleContext:IModuleContext │
┌──┤ Clock:Clock                                 │     │ JobId:String                 │
│  ├─────────────────────────────────────────────┤     │ Cron:Cron                    │
│  │ Initialization(IHttpServerContext)          │     └──────────────────────────────┘
│  │ Register(IPluginContext)                    ├------┐        ∧          1 │
│  │ Remove(IPluginContext)                      │      ¦        ¦            │
│  └─────────────────────────────────────────────┘      ¦        ¦            │
│                                                       ¦        ¦            │
│                                                       ¦        ¦            │
│                                                       ¦        ¦            │
│         ┌───────────────────────────────┐             ¦        ¦            │
│         │ <<Interface>>                 │             ¦        ¦            │
│         │ IJob                          │             ¦        ¦            │
│         ├───────────────────────────────┤             ¦        ¦            │
│         │ Initialization(IJobContext)   │             ¦        ¦            │
│         │ Process()                     │             ¦        ¦            │
│         └───────────────────────────────┘             ¦        ¦            │
│                         ▲                             ¦        ¦            │
│                         ¦                             ¦        ¦            │
│                         ¦                             ¦        ¦            │
│        ┌────────────────┴──────────────┐     create   ¦        ¦            │
│        │ MyJob                         │<-------------┘        ¦            │
│        ├───────────────────────────────┤                  uses ¦            │
│        │ Initialization(IJobContext)   ├-----------------------┘            │
│        │ Process()                     │                                    │
│        │ Dispose()                     │                                  1 V
│        └───────────────────────────────┘    ┌──────────────────────────────────────┐
│                                             │ Cron                                 │
│                                             ├──────────────────────────────────────┤
│                                             │ HttpServerContext:IHttpServerContext │
│    1 ┌──────────────────────────────────┐   │ Minute:IEnumerable<Int>              │
└─────>│ Clock                            │   │ Hour:IEnumerable<Int>                │
       ├──────────────────────────────────┤   │ Day:IEnumerable<Int>                 │
       │ Minute:Int                       │   │ Month:IEnumerable<Int>               │
       │ Hour:Int                         │   │ Weekday:IEnumerable<Int>             │
       │ Day:Int                          │   ├──────────────────────────────────────┤
       │ Month:Int                        │   │ Matching(Clock):Bool                 │
       │ Weekday:Int                      │   └──────────────────────────────────────┘
       ├──────────────────────────────────┤
       │ Synchronize():IEnumerable<Clock> │
       │ Equals(Object):Bool              │
       └──────────────────────────────────┘
```

A job is created by a class that inherits from `Job`.

```csharp
// The job starts at 0:30 a.m. on the first day of each month
[Job("30", "0", "1", "*", "*")] 
[Module<MyModule>]
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

The following attributes are available:

|Attribute |Type      |Multiplicity |Optional |Description
|----------|----------|-------------|---------|------------
|Job       |String    |1            |No       |Time information about when the job should be executed. The parameters have the following meanings: Minute (0 - 59), Hour (0 - 23), Day of the month (1 - 31), Month (1 - 12), Weekday (0 - 6) for (Sunday - Saturday). The parameters can consist of single values, comma-separated lists (1, 3, 6, 9, ...), range (from-to) or * for all.
|Module    |`IModule` |1            |No       |The class of the module. The module must be defined in the same plugin as the job.

## Task model
Tasks are another form of concurrent code execution. In contrast to jobs, tasks are executed ad-hoc (e.g. an export task 
that was triggered by the user). The result may not be available until a later date. However, the web application can still 
be fully used. If the result is available, information is usually provided (e.g. by means of a notification).

```
         ┌────────────────────────────────────┐             ┌─────────────────────────┐
         │ <<Interface>>                      │             │ ComponentManager        │
         │ IComponent                         │           1 ├─────────────────────────┤
         ├────────────────────────────────────┤          ┌──┤ TaskManager:TaskManager │
         │ Initialization(IHttpServerContext) │          │  │ …                       │
         └────────────────────────────────────┘          │  └─────────────────────────┘
                            ▲                            │
                            ¦                            │
                            ¦                            │
┌───────────────────────────┴────────────────────────┐ 1 │
│ TaskManager                                        │<──┘
├────────────────────────────────────────────────────┤
│ AddTask:Event                                      │
│ RemoveTask:Event                                   │
├────────────────────────────────────────────────────┤
│ HttpServerContext:IHttpServerContext               │ 1
│ ActiveTasks:IEnumerable<ITask>                     ├───┐
├────────────────────────────────────────────────────┤   │
│ Initialization(IHttpServerContext)                 │   │
│ CreateTask(Id):ITask                               │   │
│ CreateTask(Id,Arguments):ITask                     │   │
│ CreateTask(Id,EventHandler,Arguments):ITask        │   │
│ CreateTask<ITask>(Id,EventHandler,Arguments):ITask │   │
│ RemoveTask(ITask)                                  │   │
│ GetTask(Id):ITask                                  │   │
│ ContainsTask(Id):Bool                              │   │
└────────────────────────────────────────────────────┘   │
                                                         │
                                                         │
                                                         │
         ┌───────────────────────────────┐               │
         │ <<Interface>>                 │ *             │
         │ ITask                         │<──────────────┘
         ├───────────────────────────────┤
         │ Start:Event                   │
         │ Finish:Event                  │
         ├───────────────────────────────┤
         │ Id:String                     │
    ┌────┤ State:TaskState               │
    │    │ Progress:Int                  │
    │    │ Message:String                │
    │    │ Arguments:IEnumerable<Object> │
    │    ├───────────────────────────────┤
    │    │ Initialization()              │
    │    │ Process()                     │
    │    │ Cancel()                      │
    │    └───────────────────────────────┘
    │                   ▲
    └───┐               └--------------┐
      1 V                              ¦
┌─────────────────┐     ┌──────────────┴────────────────┐
│ <<Enumeration>> │     │ MyTask                        │
│ TaskState       │     ├───────────────────────────────┤
├─────────────────┤     │ Start:Event                   │
│ Created         │     │ Finish:Event                  │
│ Run             │     ├───────────────────────────────┤
│ Canceled        │     │ Id:String                     │
│ Finish          │     │ State:TaskState               │
└─────────────────┘     │ Progress:Int                  │
                        │ Message:String                │
                        │ Arguments:IEnumerable<Object> │
                        ├───────────────────────────────┤
                        │ Initialization()              │
                        │ Process()                     │
                        │ Cancel()                      │
                        └───────────────────────────────┘
```

Tasks are created dynamically by instantiating a class derived from `Task` and starting it from the `TaskManager`.

The tasks can take the following states:

```
╔══════════╗           ╔═══════════╗
║ Created  ║           ║  Canceld  ║
╚══════════╝           ╚═══════════╝
     │                       ∧
     │                       │
     │       ┌───────┐       │ 
     └──────>│  Run  ├───────┘
             └───┬───┘
                 │
                 │
                 V
           ╔══════════╗ 
           ║  Finish  ║
           ╚══════════╝
```


## Notification model
Notifications are messages that are displayed to users as pop-up windows. The notifications are globally (visible to 
all), linked to a session (visible to current users) or to specific roles (visible to selected users). The notifications 
are displayed in the upper right corner and are retained when a page is changed. Notifications are closed by the user or 
at the end of the display period. Notifications that are visible to multiple users are removed by closing a user.

```
┌────────────────────────────────────┐      ┌─────────────────────────────────────────┐
│ <<Interface>>                      │      │ ComponentManager                        │
│ IComponent                         │    1 ├─────────────────────────────────────────┤
├────────────────────────────────────┤   ┌──┤ NotificationManager:NotificationManager │
│ Initialization(IHttpServerContext) │   │  │ …                                       │
└────────────────────────────────────┘   │  └─────────────────────────────────────────┘
              ▲                          │
              ¦                          └──────────────────────────┐
              ¦                                                   1 V
┌─────────────┴───────────────────────────────────────────────────────────────────┐
│ NotificationManager                                                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│ CreateNotification:Event                                                        │
│ DestroyNotification:Event                                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│ HttpServerContext:IHttpServerContext                                            │ 1
│ GlobalNotifications:IEnumerable<INotification>                                  ├──┐
├─────────────────────────────────────────────────────────────────────────────────┤  │
│ Initialization(IHttpServerContext)                                              │  │
│ AddNotification(Message,Durability,Heading,Icon,TypeNotification):INotification │  │
│ AddNotification(Request,Message,Durability,Heading,Icon,TypeNotification)       │  │
│   :INotification                                                                │  │
│ GetNotifications(Request):IEnumerable<INotification>                            │  │
│ RemoveNotification(Id)                                                          │  │
│ RemoveNotification(Request)                                                     │  │
└─────────────────────────────────────────────────────────────────────────────────┘  │
                                                                                     │
                                                                         ┌───────────┘
                                                                       * V
                                             ┌───────────────────────────────────┐
                                             │ <<Interface>>                     │
                                             │ INotification                     │
                                             ├───────────────────────────────────┤
                                             │ Id:Guid                           │
                                             │ Heading:String                    │
                                             │ Message:String                    │
                                             │ Durability:Int                    │
                                             │ Icon:String                       │
          ┌──────────────────┐               │ Created:DateTime                  │
          │ <<Enumeration>>  │ 1           1 │ Progress:Int                      │
          │ TypeNotification │<──────────────┤ TypeNotification:TypeNotification │
          ├──────────────────┤               └───────────────────────────────────┘
          │ Default          │
          │ Primary          │
          │ Secondary        │
          │ Success          │
          │ Info             │
          │ Warning          │
          │ Danger           │
          │ Dark             │
          │ Light            │
          │ White            │
          │ Transparent      │
          └──────────────────┘
```

The `NotificationManager` is the central class for notifications. The `AddNotification` method is used to create notifications.

The following properties can be assigned to notifications:

|Property   |Optional |Description
|-----------|---------|-----------------
|Id         |No       |Is assigned internally. A change is not possible.
|Heading    |Yes      |The heading, or null if you don't want it to be displayed.
|Message    |No       |The body of the message.
|Durability |Yes      |The display time in milliseconds. If the number is less than 0, the notification remains active until it is closed by the user.
|Progress   |Yes      |Instead of the display duration, a progress value from 0 to 100 can be specified. A value less than zero means that no progress is calculated.
|Icon       |Yes      |A URI that contains an icon.
|Type       |Yes      |Is the notification type. The following values are supported: Primary, Secondary, Success, Info, Warning, Danger, Dark, Light, White

The following example illustrates how the NotificationManager works:

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

The NotificationManager must be enabled in the application. For this purpose, webexpress.webapp with the ResourceId or 
all webexpress.webapp.* must be included.

```csharp
[Option<WebExpress.WebApp.ApiPopupNotificationV1>]
public sealed class MyApplication : IApplication
{
}
```

The functions of the `NotificationManager` can also be accessed via the REST API interface `{base path}/wxapp/api/v1/popupnotifications`
can be accessed. The following methods are available:

|Method |Parameter             |Description
|-------|----------------------|----------------
|Get    |None                  |Detects all notifications for the current user.
|Post   |A notification object |Stores a notification.
|Delete |The id                |Deletes an existing notification.

## Index model
The index model provides a reverse index to enable fast and efficient searching. A reverse 
index can significantly speed up access to the data. However, creating and storing a 
reverse index requires additional storage space and Processing time. The storage requirement 
increases, especially with large amounts of data can be important. Therefore, it is important 
to weigh the pros and cons to achieve the best possible performance. The full-text search in WebExpress 
supports the following search options:

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
║      * V            ¦                           ¦    ║
║ ┌───────────────┐ 1 ¦ * ┌──────┐                ¦    ║
║ │ IndexDocument ├──────>│ Item │                ¦    ║
║ └──────┬────────┘   ¦   └──────┘                ¦    ║
║      1 │            └---------------------------┘    ║
║        │                                             ║
║      * V                                             ║
║  ┌────────────┐                                      ║
║  │ IndexField │                                      ║
║  └─────┬──────┘                                      ║
║      1 │                                             ║
║ ┌------│--------IndexReverse┐                        ║
║ ¦    * V                    ¦                        ║
║ ¦  ┌──────┐                 ¦                        ║
║ ¦  │ Term │                 ¦                        ║
║ ¦  └───┬──┘                 ¦                        ║
║ ¦    1 │                    ¦                        ║
║ ¦      │                    ¦                        ║
║ ¦    * V                    ¦                        ║
║ ¦ ┌─────────┐               ¦                        ║
║ ¦ │ Posting │               ¦                        ║
║ ¦ └────┬────┘               ¦                        ║
║ ¦    1 │                    ¦                        ║
║ ¦      │                    ¦                        ║
║ ¦    * V                    ¦                        ║
║ ¦ ┌──────────┐              ¦                        ║
║ ¦ │ Position │              ¦                        ║
║ ¦ └──────────┘              ¦                        ║
║ └---------------------------┘                        ║
╚══════════════════════════════════════════════════════╝
```

To create a reverse index, the data type to be indexed must be registered in 
the `IndexManager`.

```csharp
/// DataType must implement the IIndexItem interface.
public class DataType : IIndexItem
{
    [IndexIgnore]
    public int Id { get; set;}
    public string Text { get; set;}
} 

ComponentManager.GetComponent<IndexManager>().Register<DataType>();
```

The reverse index is built by using the `ReBuild` method for all objects or `Add` for an object.

```csharp
var records = new []
{
    new DataType(){ Id=0, Text="lorem ipsum" },
    new DataType(){ Id=1, Text="lorem scelerisque ornare" } 
};

ComponentManager.GetComponent<IndexManager>().ReIndex(records);
```

To access the reverse index, WQL (see below) is used.

```csharp
var wql = ComponentManager.GetComponent<IndexManager>().ExecuteWql("Text ~ "lorem"");
var res = wql?.Apply();
```

### WQL
The WebExpress Query Language (WQL) is a query language that filters and sorts a given amount of data from the 
reverse index. A statement of the query language is usually sent from the client to the server, which collects, 
filters and sorts the data in the reverse index and sends it back to the client.
Example of a WQL:

```
Name ~ "WebExpress" and Create < now(-3d) orderby Create desc take 5
```

The example returns the first five elements of the dataset that contain the value "WebExpress" in the Name 
attribute and that were created three days ago (Create attribute) or earlier. The result is sorted in 
descending order by creation date.

For detailed information about `WebIndex`, see [concept](https://github.com/ReneSchwarzer/WebExpress.WebIndex/blob/main/doc/concept.md).

## Identity model
A large number of web applications are subject to requirements for access protection, integrity and 
confidentiality. These requirements can be met through identity and access management (IAM). In identity 
management, identities are managed. In access management, on the other hand, authorized entities are 
enabled to use a service (application). `WebExpress` supports the following identity management features:

- Provisioning: Provides `WebExpress` with the basic requirements for the entities to carry out their activities. Deprovisioning is the opposite path, in which the prerequisites are withdrawn (e.g. when leaving).
- Authentication: Handles the identification process of the entities.
- Authorization: Granting permission for a specific entity to use a specific service.

The provisioning service provides `WebExpress` with the basic requirements for the operation of the identities. This 
is realized with the help of a user account. The following illustration outlines the lifecycle of a user account. A 
user account can be in one of two states, `Active` and `Deactivated`. If the events `Create`, `Update`, `Disable`, 
`Enable` or `Delete` occur, the user account changes its state.

```
╔═══════╗                  ╔═══════════╗
║  New  ║       Update     ║  Deleted  ║
╚═══════╝        ┌─┐       ╚═══════════╝
    │            │ │          ∧     ∧
    │ Created    V │  Delete  │     │
    │       ┌──────┴───┐      │     │
    └──────>│  Active  ├──────┘     │
            └───┬──────┘            │
                │ ∧                 │
        Disable │ │ Enable          │
                V │                 │
         ┌────────┴──────┐  Delete  │
         │  Deactivated  ├──────────┘
         └───────────────┘
```

- Create: This event creates a new user account for an entity. As a rule, each entity should have exactly one user account. 
- Update: The update event is triggered in the event of changes (e.g. marriage or relocation). The changes are forwarded to the appropriate user accounts.
- Disable: This event disables the user account. However, allocated resources are retained and can no longer be used.
- Enable: A deactivated user account can be transferred to the activated state with the help of this event.
- Delete: This event is used for deprovisioning and deletes the user account of an entity.

`WebExpress` supports two methods of identity management:

- On-premises identity management: Each application has its own user management. The cost of setting up the necessary infrastructure is particularly easy here, as identity management is carried out directly by the application. Each application has its own identity domain, which is disadvantageous from a unified identity management perspective.
- Shared identity management: If the identities are outsourced to a central service and retrieved by the applications, there is shared identity management. Shared identity management allows you to reduce the number of identity domains. 

Entities (people, technical objects, etc.) have one or more identities, which distinguishes them from other entities. 
An identity is used for identification and consists of a collection of attributes (properties e.g. name, password), which 
individualizes an entity. Identities can be grouped according to certain characteristics. Furthermore, each group can be 
assigned one or more roles (e.g. administrator, programmer). The roles determine access to identity resources. In the 
following figure, the concept of identity is defined in terms of a UML model.

```
  O   1   *  ┌────────────┐ *    * ┌─────────┐ *    * ┌────────┐ *    * ┌────────────┐
 /░\ ───────>│  Identity  ├───────>│  Group  ├───────>│  Role  ├───────>│  Resource  │
 /‾\         └─────┬──────┘        └─────────┘        └────────┘        └────────────┘
Entity           1 │
                   │
                 * V
             ┌────────────┐
             │  Attribut  │
             └────────────┘
```

The identities and groups must be loaded from a persistent data storage. These can be provided by the application or come 
from external identity management (e.g. LDAP). The roles and identity resources are dictated by the application by 
hard-implementing them.

```
       ┌────────────────────────────────────┐
       │ <<Interface>>                      │
       │ IComponentPlugin                   │
       ├────────────────────────────────────┤
       │ Initialization(IHttpServerContext) │
       │ Register(IPluginContext)           │
       │ Remove(IPluginContext)             │
       └────────────────────────────────────┘
                         ▲
               ┌---------┘                          ┌─────────────────────────────────┐
               ¦                                    │ ComponentManager                │
               ¦                                  1 ├─────────────────────────────────┤
               ¦                               ┌────┤ IdentityManager:IdentityManager │
               ¦                               │    │ …                               │
               ¦                               │    └─────────────────────────────────┘
               ¦                               │
               ¦                               │
               ¦                             1 V
       ┌───────┴───────────────────────────────────────────┐
       │ IdentityManager                                   │
       ├───────────────────────────────────────────────────┤
       │ AddDomain:Event                                   │
       │ RemoveDomain:Event                                │
       ├───────────────────────────────────────────────────┤
       │ HttpServerContext:IHttpServerContext              │ 1
       │ Jobs:IEnumerable<IIdentityDomain>                 ├───┐
       ├───────────────────────────────────────────────────┤   │
       │ Initialization(IHttpServerContext)                │   │
┌------┤ Register(IPluginContext)                          │   │
¦      │ Remove(IPluginContext)                            │   │
¦      │ GetIdentityDomain(IPluginContext):IIdentityDomain │   │
¦      └───────────────────────────────────────────────────┘   │
¦                                                              │
¦                                                              │
¦          ┌──────────────────────────────────────────┐        │
¦          │ <<Interface>>                            │ *      │
¦          │ IIdentityDomain                          │<───────┘
¦          ├──────────────────────────────────────────┤
¦          │ PluginContext:IPluginContext             │
¦          │ ModuleContext:IModuleContext             │
¦          │ Identities:IEnumerable<IIdentity>        │
¦          │ Groups:IEnumerable<IIdentityGroup>       │
¦          │ Roles:IEnumerable<IIdentityRole>         │
¦          │ Resources:IEnumerable<IIdentityResource> │
¦          ├──────────────────────────────────────────┤
¦          │ AddIdentity(IIdentity)                   │
¦          │ AddGroup(IIdentityGroup)                 │
¦          │ RemoveIdentity(IIdentity)                │
¦          │ RemoveGroup(IIdentityGroup)              │
¦          └───┬──────────┬───────────┬──────────┬────┘
¦            1 │        1 │         1 │        1 │
¦           ┌──┘          │           │          └──────────────────────────┐
¦           │             │           └────────────────┐                    │
¦           │             └───────┐                    │                    │
¦         * V                   * V                  * V                  * V
¦ ┌────────────────────┐  ┌────────────────┐    ┌───────────────┐  ┌───────────────────┐
¦ │ <<Interface>>      │  │ <<Interface>>  │    │ <<Interface>> │  │ <<Interface>>     │
¦ │ IIdentity          │  │ IIdentityGroup │    │ IIdentityRole │  │ IIdentityResource │
¦ ├────────────────────┤  ├────────────────┤    ├───────────────┤  ├───────────────────┤
¦ │ Id:Guid            │  │ Id:Guid        │    │ Id:Guid       │  │ Id:Guid           │
¦ │ Name:String        │  │ Name:String    │  1 │ Name:String   │  │ Name:String       │
¦ │ State:AccountState │  ├────────────────┤ ┌──┤ Access:Access │  ├───────────────────┤
¦ ├────────────────────┤  └────────────────┘ │  ├───────────────┤  └───────────────────┘
¦ │ Login()            │         ▲           │  └───────────────┘           ▲
¦ │ Logout()           │         ¦         1 V         ▲                    ¦
¦ └────────────────────┘         ¦ ┌─────────────────┐ ¦                    ¦
¦           ▲                    ¦ │ <<Enumeration>> │ ¦                    ¦
¦           ¦                    ¦ │ Access          │ ¦                    ¦
¦           ¦                    ¦ ├─────────────────┤ ¦                    ¦
¦           ¦                    ¦ │ Read            │ ¦                    ¦
¦           ¦                    ¦ │ Write           │ ¦                    ¦
¦           ¦                    ¦ │ Execute         │ ¦                    ¦
¦           ¦                    ¦ └─────────────────┘ ¦                    ¦
¦           ¦                    ¦                     ¦                    ¦
¦  create   ¦                    ¦                     ¦                    ¦
└-----------¦--------------------¦-----------------┬---¦---------------┐    ¦
            ¦                    ¦                 V   ¦               V    ¦
  ┌─────────┴──────────┐ ┌───────┴─────────┐  ┌────────┴───────┐ ┌──────────┴─────────┐
  │ MyIdentity         │ │ MyIdentityGroup │  │ MyIdentityRole │ │ MyIdentityResource │
  ├────────────────────┤ ├─────────────────┤  ├────────────────┤ ├────────────────────┤
  │ Id:Guid            │ │ Id:Guid         │  │ Id:Guid        │ │ Id:Guid            │
  │ Name:String        │ │ Name:String     │  │ Name:String    │ │ Name:String        │
  │ Password:String    │ ├─────────────────┤  │ Access:Access  │ ├────────────────────┤
  │ State:AccountState │ └─────────────────┘  ├────────────────┤ └────────────────────┘
  ├────────────────────┤                      └────────────────┘
  │ Login()            │
  │ Logout()           │
  └────────────────────┘
```

WebExpress provides the following default groups:

|Group |Description
|------|------------------
|All   | All identities are members of the group.

WebExpress provides the following roles:

|Role                   |Description
|-----------------------|----------------------
|Anonymous              |Without authenticating the entity.
|Authenticates          |All authenticated entities.
|Business administrator |Business configuration of the application. For example, the business administrator can define access rights (except system administration) of the entities.
|System administrator   |Technical configuration of the system. For example, the system administrator can install or update a new application.

In addition to the listed standard roles, self-defined roles from definition classes can be provided. 

```csharp
[Module<MyModule>]
[Name("myRole")]
[Role(IdentityRoleDefault.Authenticated)]
public sealed class MyIdentityRole : IIdentityRole
{
}
````

The role definition classes have the following attributes:

|Attribute   |Type    |Multiplicity |Optional |Description
|------------|--------|-------------|---------|-------------
|Id          |String  |1            |No       |The unique identification key. If no id is specified, the class name is used. An id should only be specified in exceptional cases.
|Module      |IModule |1            |No       |The class of the module. The module must be defined in the same plugin as the resource.
|Name        |String  |1            |No       |The human-readable name of the role or an internationalization key.
|Description |String  |1            |Yes      |The description of the role. This can be a key to internationalization.
|Role        |String  |1            |Yes      |Inherits the characteristics of the specified role.

Identity resources are usually automatically discovered from the metadata of the web resources and web components and 
assigned to roles. In addition, identity resources can also be created from definition classes.

```csharp
[Module<MyModule>]
[Name("Reset password")]
[Authorization(Permission.RW, IdentityRoleDefault.Authenticated)]
[Authorization(Permission.R, IdentityRoleDefault.Everyone)]
public sealed class MyIdentityResource : IIdentityResource
{
}
```

The identity resource definition classes have the following attributes:

|Attribute     |Type        |Multiplicity |Optional |Description
|--------------|------------|-------------|---------|-------------
|Id            |String      |1            |No       |The unique identification key. If no id is specified, the class name is used. An id should only be specified in exceptional cases.
|Module        |IModule     |1            |No       |The class of the module. The module must be defined in the same plugin as the resource.
|Name          |String      |1            |No       |The human-readable name of the role or an internationalization key.
|Description   |String      |1            |Yes      |The description of the role. This can be a key to internationalization.
|Authorization |Int, String |1            |Yes      |Grants authority for a role (specifying the id).

In the case of an authorization check (can an identity be accessed by an identity resource (e.g. page)), it must be 
checked whether there is at least one transition (identity -> group -> role -> identity resource). This is done by the 
function `CheckAccess: (Identity, Identity Resource, Right) > Bool ` of the `IdentityManager`. A return value 
of `true` means that access can be made.

```
╔═══════════════════════════════════════════╗
║ Determine requested resource or component ║
╚═══════════════════════════════════════════╝
                     │ 
  ┌──────────────────┴──────────────────────────┐
  │      Authorization required?                │
  │                                         Yes │
  │                                             V
  │                            ┌────────────────────────────────┐ Yes
  │                            │ Determine the current identity │<──────────────┐
  │                            └────────────────┬───────────────┘               │
  │                                             │                               │
  │                          ┌──────────────────┴──────────────────────┐        │
  │                          │   Is current identity authenticated?    │        │
  │                      Yes │                                         │        │
  │                          V                                         │        │
  │  ┌──────────────────────────────────────────────┐                  │        │
  │  │ Determine Identity/Group/Role/Resource paths │                  │        │
  │  └───────────────────────┬──────────────────────┘                  │        │
  │                          │                                         │        │
  │                 ┌────────┴──────────────────────────────────┐      │        │
  │                 │  Is there at least one path?              │      │        │
  │                 │                                        No │      │ No     │
  │                 │                                           V      V        │
  └──────────┐      │                                       ┌──────────────┐    │
             │      │                                       │    Type?     │    │
             │      │                              resource │              │    │
             │      │                                       V              │    │
             │      │                               ┌──────────────┐       │    │
             │      │                               │ Login dialog │       │    │
             │      │                               └───────┬──────┘       │    │
             │      │                                       │              │    │
             │      │                        ┌──────────────┴──────────────│────┘
             │      │                        │     Login successful?       │
          No │      │ Yes                 No │                             │ component
             V      V                        V                             V
         ╔══════════════╗           ╔══════════════════╗           ╔════════════════╗
         ║ Grant access ║           ║ Stautus page 403 ║           ║ Hide component ║
         ╚══════════════╝           ╚══════════════════╝           ╚════════════════╝
```

During the authorization check, a distinction is made between the following types of access:

|Value |Rights |Description
|------|-------|------------------
|7     |RWX    |Read, Write, Delete and Execute (Full Control)
|6     |RW     |Reading and Writing
|5     |RX     |Read and Execute
|4     |R      |Read only
|3     |WX     |Write, Delete and Run
|2     |W      |Write only
|1     |X      |Run only
|0     |None   |None

The rights have the following meanings:

- read - The "read" right means that an identity resource can be opened for reading. The user who has this right can read the content, but cannot modify or delete it.
- write - The "write" right allows the user to modify the content. As a result, he does not have the right to delete.
- execute - The "execute" privilege allows a user to perform an action (e.g. start a process). In combination with the "write" right, the user is allowed to delete elements.

# WebApp template
The `WebExpress.WebApp.dll` package provides a template for creating business applications.

## WebApp page
The template determines the layout of a page. The page is divided into a header, a side area, the page content, and 
a footer. The individual sections (areas) can be accessed via the class properties. Furthermore, components can bind 
to these areas and display their contents.

```
╔WebAppPage════════════════════════════════════════════════════════════════════════════╗
║┌Header──────────────────────────────────────────────────────────────────────────────┐║
║│ Icon AppTitle     Link ▼  Link ▼  Link ▼     Create ▼     Search    ?          ⚙ ▼ │║
║└────────────────────────────────────────────────────────────────────────────────────┘║
║┌ToastNotfication────────────────────────────────────────────────────────────────────┐║
║│ Notfications                                             ┌PopupNotfication──────┐ ×│║
║└──────────────────────────────────────────────────────────│ ┌Notfication───────┐ │──┘║
║┌Breadcrumb────────────────────────────────────────────────│ │ Icon Title      ×│ │──┐║
║│ Dashboard / Site / ...                                   │ │      Description │ │  │║
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
║│                     │░└────────────────────────────────────────────────────────────┘║
║│                     │░┌Footer──────────────────────────────────────────────────────┐║
║│                     │░│                                                            │║
║└─────────────────────┘ └────────────────────────────────────────────────────────────┘║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

### Header
The business application header contains buttons and submenus to navigate the application at the top level. The 
`ApplicationNavigator` refers to other (WebExpress) applications. The `AppTitle` contains the name of the 
application. This comes from the name attribute of the application (see Section 3.3). The AppNavigation links 
point to key features of the application. The `QuickCreate` button provides functionality for creating records. In 
the search field, search queries can be passed to the application. The `Help` shaft panel groups the application's 
help links. The `Notification` button collects all notifications from the application. In the `Avatar` button, the 
functions of the user account are provided. The `Setting` button contains the functions for configuring the application.

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

        :════════════════════════════════════════════════════════╗
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
The left side area of the application is responsible for the navigation of a thematically related area/function. Links 
to sub-functions or data sets can be created and displayed here.

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
║┌Main────────────────────────────────────────────────────────────────────────┐║
║│┌Headline───────────────────────────────────────────────┐┌Property─────────┐│║
║││                                                       ││                 ││║
║││                                                       ││                 ││║
║│└───────────────────────────────────────────────────────┘│                 ││║
║│┌Preferences────────────────────────────────────────────┐│                 ││║
║││                                                       ││                 ││║
║││                                                       ││                 ││║
║│└───────────────────────────────────────────────────────┘│                 ││║
║│┌Primary────────────────────────────────────────────────┐│                 ││║
║││                                                       ││                 ││║
║││                                                       ││                 ││║
║││                                                       ││                 ││║
║││                                                       ││                 ││║
║│└───────────────────────────────────────────────────────┘│                 ││║
║│┌Secondary──────────────────────────────────────────────┐│                 ││║
║││                                                       ││                 ││║
║││                                                       ││                 ││║
║│└───────────────────────────────────────────────────────┘└─────────────────┘│║
║└────────────────────────────────────────────────────────────────────────────┘║
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
                                                    MorePreferences ─>│ Link       │
                                                                      ├────────────┤
                                                        MorePrimary ─>│ Link       │
                                                                      ├────────────┤
                                                      MoreSecondary ─>│ Link       │
                                                                      └────────────┘
```


### Headline
The headline displays the title of the displayed data. The title bar also has data-dependent functions and a 
display of metadata (e.g. creation date, creator).

```
╔Headline═══════════════════════════════════════════════════════════════════════╗
║┌Prologue┐┌Title───────────────────┐┌Preference─┐┌Primary─────────┐┌Secondary─┐║
║│        ││ $Headline              ││           ││                ││          │║
║└────────┘└────────────────────────┘└───────────┘└────────────────┘└──────────┘║
║┌Metadata─────────────────────────────────────────────────────────────────────┐║
║│                                                                             │║
║└─────────────────────────────────────────────────────────────────────────────┘║
╚═══════════════════════════════════════════════════════════════════════════════╝
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
There are three ways to display notifications in web applications. The first way is to display notifications in 
the `Notification` section of the header. Above all, personalized notifications are displayed here (e.g. new comments 
on subscribed content). The second way is to display notifications in an area below the header. This is intended for 
application-wide notifications (e.g. scheduled maintenance windows).

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
The footer is located at the bottom of the web application and usually contains information about the 
copyright, imprint and version.

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
The status pages are displayed in case of errors. This can have different causes. For example, if a 
requested page was not found.

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
Setting page templates are used to administer the web applications. Settings pages must implement 
the `IPageSetting` interface.

```
┌────────────────────────────────────┐      ┌───────────────────────────────────────┐
│ <<Interface>>                      │      │ ComponentManager                      │
│ IComponentPlugin                   │    1 ├───────────────────────────────────────┤
├────────────────────────────────────┤   ┌──┤ SettingPageManager:SettingPageManager │
│ Initialization(IHttpServerContext) │   │  │ …                                     │
│ Register(IPluginContext)           │   │  └───────────────────────────────────────┘
│ Remove(IPluginContext)             │   │
└────────────────────────────────────┘   │
                 ▲                       │
              ┌--┘                       └─┐
              ¦                          1 V
     ┌────────┴──────────────────────────────────────┐
     │ SettingPageManager                            │
     ├───────────────────────────────────────────────┤
     │ AddSettingPage:Event                          │
     │ RemoveSettingPage:Event                       │
     ├───────────────────────────────────────────────┤
     │ HttpServerContext:IHttpServerContext          │ 1
     │ SettingPages:IEnumerable<ISettingPageContext> ├───┐
     ├───────────────────────────────────────────────┤   │
     │ Initialization(IHttpServerContext)            │   │
┌----┤ Register(IPluginContext)                      │   │
¦    │ Remove(IPluginContext)                        │   │
¦    └───────────────────────────────────────────────┘   │
¦                                                        │
¦                          ┌─────────────────────────────┘
¦                        * V                              
¦          ┌──────────────────────────────────┐              
¦          │ <<Interface>>                    │              
¦          │ ISettingPageContext              │<----------------------------------┐
¦          ├──────────────────────────────────┤                                   ¦
¦          │ PluginContext:IPluginContext     │                                   ¦
¦          │ ResourceContext:IResourceContext │                                   ¦
¦          │ Id:String                        │                                   ¦
¦          │ Hide:Bool                        │                                   ¦
¦          │ Icon:PropertyIcon                │             ┌──────────────────┐  ¦
¦          │ Context:String                   │ 1         1 │ <<Enumeration>>  │  ¦
¦          │ Section:SettingSection           ├────────────>│ SettingSection   │  ¦
¦          │ Group:Group                      │             ├──────────────────┤  ¦
¦          └──────────────────────────────────┘             │ Preferences      │  ¦
¦                                                           │ Primary          │  ¦
¦                                                           │ Secondary        │  ¦
¦                                                           └──────────────────┘  ¦
¦                                                                                 ¦
¦                                                                                 ¦
¦  ┌───────────────────────────────┐   ┌───────────────────────────────┐          ¦
¦  │ PageWebApp                    │   │ <<Interface>>                 │          ¦
¦  ├───────────────────────────────┤   │ ISettingPage                  │          ¦
¦  │ Initialization(IEventContext) │   └───────────────────────────────┘          ¦
¦  │ Process(RenderContext)        │                  ▲                           ¦
¦  │ Dispose()                     │                  ¦                           ¦
¦  └───────────────────────────────┘                  ¦                           ¦
¦                  ▲                                  ¦                           ¦
¦                  ¦                                  ¦                           ¦
¦            ┌-----┘                       ┌----------┘                           ¦
¦            ¦                             ¦                                      ¦
¦        ┌───┴─────────────────────────────┴───┐                                  ¦
¦        │ WebAppPageSetting                   │                                  ¦
¦        ├─────────────────────────────────────┤                                  ¦
¦        │ Initialization(ISettingPageContext) │                                  ¦
¦        │ Process(RenderContext)              │                                  ¦
¦        │ Dispose()                           │                                  ¦
¦        └─────────────────────────────────────┘                                  ¦
¦                           ▲                                                     ¦
¦                           ¦                                                     ¦
¦                           ¦                                                     ¦
¦                           ¦                                                     ¦
¦ create ┌──────────────────┴──────────────────┐                                  ¦
└------->│ MyWebAppPageSetting                 │                                  ¦
         ├─────────────────────────────────────┤                             uses ¦
         │ Initialization(ISettingPageContext) ├----------------------------------┘
         │ Process(RenderContext)              │
         │ Dispose()                           │
         └─────────────────────────────────────┘
```

When the settings page is generated, the class is enriched with meta information by attributes.

```csharp
[SettingContext("admin")]
[SettingSection(SettingSection.Primary)]
[SettingGroup("Setting")]
[SettingIcon(TypeIcon.InfoCircle)]
public sealed class MyWebAppPageSetting : WebAppPageSetting
{
}
```

The following attributes are available for a settings page:

|Attribute      |Type           |Multiplicity |Optional |Description
|---------------|---------------|-------------|---------|--------------
|SettingContext |String         |1            |Yes      |Sets the context. Only settings pages that use the same context are included in the Setting menu. In the ```SettingTab```, all contexts are listed and referred to the first settings page.
|SettingSection |SettingSection |1            |Yes      |Determines the section by displaying the entry in the Setting menu.
|SettingGroup   |String         |1            |Yes      |Groups the settings entries within a section.
|SettingIcon    |String         |1            |Yes      |An icon to be displayed in the SettigMenu along with the link to the settings page.
|               |TypeIcon       |             |         |   
|SettingHide    |-              |1            |Yes      |Not displaying the page in the settings

The template is specially adapted to the settings pages. In particular, the side navigation pane and a tab element 
are automatically populated from the meta information.

```
╔WebAppPageSetting═════════════════════════════════════════════════════════════════════╗
║┌Header──────────────────────────────────────────────────────────────────────────────┐║
║│ Icon AppTitle     Link ▼  Link ▼  Link ▼      Create ▼      Search   ?         ⚙ ▼ │║
║└────────────────────────────────────────────────────────────────────────────────────┘║
║┌ToastNotfication────────────────────────────────────────────────────────────────────┐║
║│ Notfications                                             ┌PopupNotfication──────┐ ×│║
║└──────────────────────────────────────────────────────────│ ┌Notfication───────┐ │──┘║
║┌Breadcrumb────────────────────────────────────────────────│ │ Icon Title      ×│ │──┐║
║│ Dashboard / Site / ...                                   │ │      Description │ │  │║
║└──────────────────────────────────────────────────────────│ └──────────────────┘ │──┘║
║┌Prologue──────────────────────────────────────────────────│ ┌Notfication───────┐ │──┐║
║│ ┌SettingTab──────────────────────────────────────────────│ │ Icon Title      ×│ │┐ │║
║│ │  SettingContext A   SettingContext B   SettingContext C│ │      Description │ ││ │║
║│ └────────────────────────────────────────────────────────│ └──────────────────┘ │┘ │║
║└──────────────────────────────────────────────────────────│ ┌Notfication───────┐ │──┘║
║┌Sidebar──────────────┐ ┌SearchOptions─────────────────────│ │ Icon Title      ×│ │──┐║
║│                     │░│                                  │ │      Description │ │ ×│║
║│ ┌SettingMenu──────┐ │░└──────────────────────────────────│ └──────────────────┘ │──┘║
║│ │                 │ │░┌Content───────────────────────────└──────────────────────┘──┐║
║│ │ Group A         │ │░│                                                            │║
║│ │   Link          │ │░│                                                            │║
║│ │   Link          │ │░│                                                            │║
║│ │   Link          │ │░│                                                            │║
║│ │ Group B         │ │░│                                                            │║
║│ │   Link          │ │<│                                                            │║
║│ │   Link          │ │<│                                                            │║
║│ │ Group C         │ │<│                                                            │║
║│ │   Link          │ │░│                                                            │║
║│ │                 │ │░│                                                            │║
║│ │                 │ │░│                                                            │║
║│ │                 │ │░│                                                            │║
║│ │                 │ │░│                                                            │║
║│ │                 │ │░│                                                            │║
║│ │                 │ │░└────────────────────────────────────────────────────────────┘║
║│ │                 │ │░┌Footer──────────────────────────────────────────────────────┐║
║│ └─────────────────┘ │░│                                                            │║
║└─────────────────────┘ └────────────────────────────────────────────────────────────┘║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

### Setting menu
The settings menu groups the different settings thematically. The groups are determined from the `SettingGroup` 
attributes of the settings pages.

```
╔SettingMenu════════╗
║┌Preferences──────┐║
║│ Group A         │║
║│   Link          │║
║│   Link          │║
║│   Link          │║
║└─────────────────┘║
║┌Primary──────────┐║
║│ Group B         │║
║│   Link          │║
║│   Link          │║
║│                 │║
║│                 │║
║│                 │║
║│                 │║
║│                 │║
║└─────────────────┘║
║┌Secondary────────┐║
║│ Group C         │║
║│   Link          │║
║│                 │║
║│                 │║
║│                 │║
║└─────────────────┘║
╚═══════════════════╝
```

### Setting tab
The contents of the `SettingTab` are fed from the `SettingSection` attributes of the settings pages. For each defined section, a tab element 
is created and linked to the first element of the section. The `SettingTab` is not displayed if no section or only one section has been defined.

```
╔SettingTab═════════════════════════════════════════════════════════════════════╗
║┌─────────────────────────────────────────────────────────────────────────────┐║
║│  SettingContext A         SettingContext B         SettingContext C         │║
║└─────────────────────────────────────────────────────────────────────────────┘║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

## REST API
A REST API (Representational State Transfer Application Programming Interface) is an interface that allows resources to be 
accessed and manipulated via the HTTP protocol. REST APIs are designed to be simple and scalable by following the principles 
of REST, such as stateless communication, use of HTTP methods, and resource orientation. By using REST APIs, applications 
can exchange and integrate data between different systems, facilitating the development of distributed and modular applications.

The integration of REST APIs into `WebExpress` offers several advantages that make the application more dynamic and reactive:

- **Flexibility and scalability**: REST APIs make it possible to develop and scale different frontend and backend components independently of each other. This means that changes can be made to one component without affecting the others, making it easier to maintain and evolve the application.

- **Real-time data refresh**: By using REST APIs, data can be exchanged in real time between the client and the server. This allows `WebExpress` to respond instantly to user actions and dynamically update the interface without having to reload the entire page.

- **Interoperability**: REST APIs are platform-independent and can be used by various programming languages and frameworks. This makes it easier to integrate `WebExpress` with other systems and services, which expands the functionality and reach of the application.

- **Reusability**: The modular and standardized interfaces of REST APIs make it possible to reuse functions once developed in different parts of the application or even in other projects. This saves development time and resources.

- **Improved user experience**: By leveraging REST APIs, WebExpress can provide a more responsive and interactive user interface. Users can seamlessly navigate through the application and receive instant feedback on their actions, increasing user satisfaction and engagement.

One of the main uses of REST APIs is to implement CRUD (Create, Read, Update, Delete) operations. These basic operations allow 
data to be created, retrieved, updated, and deleted, and form the backbone of many web applications. In WebExpress, CRUD operations 
are supported by a framework that provides HTML and REST API templates to enable a generic view and processing.

```
  ┌─────────┐         ┌─────────┐         ┌─────────┐         ┌─────────┐
  │ Web     │         │ HTTP    │         │ Resource│         │ REST-   │
  │ Client  │         │ Server  │         │ Rest    │         │ API     │
  └────┬────┘         └────┬────┘         └────┬────┘         └────┬────┘
       ¦                   ¦                   ¦                   ¦
      ┌─┐     POST Request┌─┐                 ┌─┐                 ┌─┐
create│ ├────────────────>│ │          Process│ │                 │ │
      │ │                 │ ├────────────────>│ │       CreateData│ │
      │ │                 │ │                 │ ├────────────────>│ │
      │ │                 │ │                 │ │                 │ │
      │ │                 │ │                 │ │                 │ │
      │ │                 │ │                 │ │<----------------│ │
      │ │Response (201)   │ │<----------------│ │                 │ │
      │ │<----------------│ │                 │ │                 │ │
      └─┘                 └─┘                 └─┘                 └─┘
       ¦                   ¦                   ¦                   ¦ 
      ┌─┐      GET Request┌─┐                 ┌─┐                 ┌─┐
  read│ ├────────────────>│ │          Process│ │                 │ │
      │ │                 │ ├────────────────>│ │          GetData│ │
      │ │                 │ │                 │ ├────────────────>│ │
      │ │                 │ │                 │ │                 │ │
      │ │                 │ │                 │ │                 │ │
      │ │                 │ │                 │ │<----------------│ │
      │ │Response (200)   │ │<----------------│ │                 │ │
      │ │<----------------│ │                 │ │                 │ │
      └─┘                 └─┘                 └─┘                 └─┘
       ¦                   ¦                   ¦                   ¦ 
      ┌─┐    PATCH Request┌─┐                 ┌─┐                 ┌─┐
update│ ├────────────────>│ │          Process│ │                 │ │
      │ │                 │ ├────────────────>│ │       UpdateData│ │
      │ │                 │ │                 │ ├────────────────>│ │
      │ │                 │ │                 │ │                 │ │
      │ │                 │ │                 │ │                 │ │
      │ │                 │ │                 │ │<----------------│ │
      │ │Response (200)   │ │<----------------│ │                 │ │
      │ │<----------------│ │                 │ │                 │ │
      └─┘                 └─┘                 └─┘                 └─┘
       ¦                   ¦                   ¦                   ¦ 
      ┌─┐   DELETE Request┌─┐                 ┌─┐                 ┌─┐
delete│ ├────────────────>│ │          Process│ │                 │ │
      │ │                 │ ├────────────────>│ │       DeleteData│ │
      │ │                 │ │                 │ ├────────────────>│ │
      │ │                 │ │                 │ │                 │ │
      │ │                 │ │                 │ │                 │ │
      │ │                 │ │                 │ │<----------------│ │
      │ │Response (200)   │ │<----------------│ │                 │ │
      │ │<----------------│ │                 │ │                 │ │
      └─┘                 └─┘                 └─┘                 └─┘           
```

CRUD operations are mapped by the REST API by the following operations (RFC 7231 and RFC 5789):

|CRUD operation   |HTML              |REST API  |Description
|-----------------|------------------|----------------------------
|Create           |Form              |POST      |create record
|Read (Retrieve)  |List or Table     |GET       |read record(s)
|Update           |Form              |PATCH     |update record
|Delete (Destroy) |Confirmation form |DELETE    |delete record

```
   ┌───────────────────────────────────────────────────────────────────────┐
   │ ResourceManager                                                       │
   ├───────────────────────────────────────────────────────────────────────┤
   │ AddResource:Event                                                     │
   │ RemoveResource:Event                                                  │
   ├───────────────────────────────────────────────────────────────────────┤
   │ HttpServerContext:IHttpServerContext                                  │
   │ Resources:IEnumerable<IResourceContext>                               │
   ├───────────────────────────────────────────────────────────────────────┤
   │ Initialization(IHttpServerContext)                                    │
┌--┤ Register(IPluginContext)                                              │
¦  │ Remove(IPluginContext)                                                │
¦  │ GetResorces(IApplicationContext,ModuleId,ResourceId):IResourceContext │
¦  └─────────────────┬─────────────────────────────────────────────────────┘
¦                    ¦                       1 ∧
¦                    ¦                         │
¦                    ▼                         │   ┌─────────────────────────────────┐
¦  ┌────────────────────────────────────┐      │   │ ComponentManager                │
¦  │ <<Interface>>                      │      │ 1 ├─────────────────────────────────┤
¦  │ IComponentPlugin                   │      └───┤ ResourceManager:ResourceManager │
¦  ├────────────────────────────────────┤      ┌───┤ RestApiManager:RestApiManager   │
¦  │ Initialization(IHttpServerContext) │      │ 1 │ …                               │
¦  │ Register(IPluginContext)           │      │   └─────────────────────────────────┘
¦  │ Remove(IPluginContext)             │      │
¦  └────────────────────────────────────┘      │
¦                    ▲                         │
¦                    ¦                         │
¦                    ¦                       1 V
¦       ┌────────────┴──────────────────────────────────┐
¦       │ RestApiManager                                │
¦       ├───────────────────────────────────────────────┤
¦       │ AddRest:Event                                 │
¦       │ RemoveRest:Event                              │
¦       ├───────────────────────────────────────────────┤
¦       │ HttpServerContext:IHttpServerContext          │ 1
¦       │ Resources:IEnumerable<IRestApiContext>        ├───┐
¦       ├───────────────────────────────────────────────┤   │
¦       │ Initialization(IHttpServerContext)            │   │
¦       │ Register(IPluginContext)                      │   │
¦       │ Remove(IPluginContext)                        │   │
¦       └───────────────────────────────────────────────┘   │
¦                                                           │
¦                               ┌───────────────────────────┘
¦                             * V
¦             ┌──────────────────────────────────┐
¦             │ <<Interface>>                    │
¦             │ IRestApiContext                  │<----------------------------------┐
¦             ├──────────────────────────────────┤                                   ¦
¦             │ PluginContext:IPluginContext     │                                   ¦
¦             │ ResourceContext:IResourceContext │       ┌──────────────────┐        ¦
¦             │ Version:String                   │ 1   1 │ <<Enumeration>>  │        ¦
¦             │ Methode:CrudMethode              ├──────>│ CrudMethode      │        ¦
¦             └──────────────────────────────────┘       ├──────────────────┤        ¦
¦                                                        │ POST             │        ¦
¦                                                        │ GET              │        ¦
¦                                                        │ PATCH            │        ¦
¦  ┌─────────────────────────────────────────┐           │ DELETE           │        ¦
¦  │ Resource                                │           └──────────────────┘        ¦
¦  ├─────────────────────────────────────────┤    ┌───────────────────────────────┐  ¦
¦  │ ResourceContext:IResourceContext        │    │ <<Interface>>                 │  ¦
¦  ├─────────────────────────────────────────┤    │ IRestApi                      │  ¦
¦  │ Initialization(IResourceContext)        │    ├───────────────────────────────┤  ¦
¦  │ PreProcess(Request)                     │    │ CreateData(Object, Request)   │  ¦
¦  │ Process(Request):Response               │    │ GetData():Object              │  ¦
¦  │ Process(RenderContextControl)           │    │ UpdateData(Id, Request)       │  ¦
¦  │ PostProcess(Request, Response):Response │    │ DeleteData(Id, Request)       │  ¦
¦  └─────────────────────────────────────────┘    └───────────────────────────────┘  ¦
¦                  ▲                                            ▲                    ¦
¦                  ¦                                            ¦                    ¦
¦            ┌-----┘                       ┌--------------------┘                    ¦
¦            ¦                             ¦                                         ¦
¦        ┌───┴─────────────────────────────┴───┐                                     ¦
¦        │ ResourceRestApi                     │                                     ¦
¦        ├─────────────────────────────────────┤                                     ¦
¦        │ Initialization(IResourceContext)    │                                     ¦
¦        │ CreateData(Object, Request)         │                                     ¦
¦        │ GetData():Object                    │                                     ¦
¦        │ UpdateData(Id, Request)             │                                     ¦
¦        │ DeleteData(Id, Request)             │                                     ¦
¦        │ Process(RenderContextControl)       │                                     ¦
¦        └─────────────────────────────────────┘                                     ¦
¦                           ▲                                                        ¦
¦                           ¦                                                        ¦
¦                           ¦                                                        ¦
¦                           ¦                                                        ¦
¦ create ┌──────────────────┴──────────────────┐                                     ¦
└------->│ MyRestApi                           │                                     ¦
         ├─────────────────────────────────────┤                                uses ¦
         │ Initialization(ISettingPageContext) ├-------------------------------------┘
         │ Process(RenderContext)              │
         │ Dispose()                           │
         └─────────────────────────────────────┘
```

## Theme model
WebExpress.WebApp offers a ready-made layout (e.g. color scheme, fonts, font sizes). This can be adapted to individual needs by 
the web applications. The management of the themes is taken over by the `ThemeManager`. An individual topic can be assigned to each 
application. The configuration of the topics can be done via definition classes or via a settings dialog, which is provided by 
`WebExpress.WebApp`.

```
┌────────────────────────────────────┐      ┌───────────────────────────┐
│ <<Interface>>                      │      │ ComponentManager          │
│ IComponentPlugin                   │    1 ├───────────────────────────┤
├────────────────────────────────────┤ ┌────┤ ThemeManager:ThemeManager │
│ Initialization(IHttpServerContext) │ │    │ …                         │
│ Register(IPluginContext)           │ │    └───────────────────────────┘
│ Remove(IPluginContext)             │ │
└────────────────────────────────────┘ │
                  ▲                    │
      ┌-----------┘                    │
      ¦                              1 V
┌─────┴───────────────────────────────────────┐
│ ThemeManager                                │
├─────────────────────────────────────────────┤        ┌──────────────────────────────┐
│ AddTheme:Event                              │      * │ <<Interface>>                │
│ RemoveTheme:Event                           │   ┌───>│ IThemeContext                │
├─────────────────────────────────────────────┤   │    ├──────────────────────────────┤
│ HttpServerContext:IHttpServerContext        │ 1 │    │ PluginContext:IPluginContext │
│ Themes:IEnumerable<IThemeContext>           ├───┘    │ ModuleContext:IModuleContext │
├─────────────────────────────────────────────┤        └──────────────────────────────┘
│ Initialization(IHttpServerContext)          │                        ∧
│ Register(IPluginContext)                    ├--------┐               ¦
│ Remove(IPluginContext)                      │        ¦               ¦
└─────────────────────────────────────────────┘        ¦               ¦
                                                       ¦               ¦
                                                       ¦               ¦
 ┌──────────────────────────────────────────┐          ¦               ¦
 │ <<Interface>>                            │          ¦               ¦
 │ ITheme                                   │          ¦               ¦
 ├──────────────────────────────────────────┤          ¦               ¦
 │ HeaderBackground:PropertyColorBackground │          ¦               ¦
 │ HeaderTitle:PropertyColorText            │          ¦               ¦
 │ HeaderNavigationLink:PropertyColorText   │          ¦               ¦
 │ …                                        │          ¦               ¦
 ├──────────────────────────────────────────┤          ¦               ¦
 │ Initialization(IThemeContext)            │          ¦               ¦
 └──────────────────────────────────────────┘          ¦               ¦
                       ▲                               ¦               ¦
                       ¦                               ¦               ¦
                       ¦                               ¦               ¦
 ┌─────────────────────┴────────────────────┐   create ¦               ¦
 │ MyTheme                                  │<---------┘               ¦
 ├──────────────────────────────────────────┤                          ¦
 │ HeaderBackground:PropertyColorBackground │                          ¦
 │ HeaderTitle:PropertyColorText            │                          ¦
 │ HeaderNavigationLink:PropertyColorText   │                          ¦
 │ …                                        │                          ¦
 ├──────────────────────────────────────────┤                   uses   ¦
 │ Initialization(IThemeContext)            ├--------------------------┘
 └──────────────────────────────────────────┘
```

A color scheme is defined in a class that implements the ITheme interface and is associated with an application.

```csharp
[Name("MyLayout")]
[Description("example")]
[Image("/assets/img/mytheme.png")]
[Application<MyApplication>]
public sealed class MyTheme : ITheme
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

The following attributes are available:

|Attribute   |Type   |Multiplicity |Optional |Description
|------------|-------|-------------|---------|---------------------
|Id          |String |1            |No       |The unique identification key. If no id is specified, the class name is used. An id should only be specified in exceptional cases.
|Name        |String |1            |No       |The name of the topic that can be displayed in the interface. This can be a key to internationalization.
|Description |String |1            |Yes      |The description of the topic. This can be a key to internationalization.
|Image       |String |1            |Yes      |Link to an image that visually represents the topic.
|Application |String |n            |No       |A specific ApplicationId, regular expression, or * for any application.
|            |Type   |             |         |The class of the application.

# Example
The classic example of the Hello World application is intended to show in the simplest possible way which instructions and components are needed for a complete program.

```csharp
using WebExpress.Core.WebAttribute;
using WebExpress.Core.WebApplication;
using WebExpress.Core.WebModule;
using WebExpress.Core.WebPlugin;
using WebExpress.Core.WebResource;

namespace Sample
{
    public sealed class MyPlugin : Plugin
    {
    }

    public sealed class MyApplication : Application
    {
    }

    [Application<MyApplication>]
    public sealed class MyModule : Module
    {
    }

    [Module<MyModule>]
    public sealed class Home : ResourcePage
    {
        public Home (UriRessource uri, IModuleContext context)
            : base(uri, context)
        {
        }
        
        public override IHtmlNode Render()
        {
            var control = new ControlText(){Text = "Hello World!"};
            return control.Render(new RenderContext(this));
        }
    }
}
```
