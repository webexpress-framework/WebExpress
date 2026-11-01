# WebExpress package

The server is shipped as a zip archive created by the PackageBuilder. Packages are only created by a
Release build; like the NuGet packages of the modules, the archive lands in the build output of the
project (`PackageOutputPath`):

```
src/WebExpress/bin/
└── Release/
    ├── WebExpress.<version>.zip     # e.g. WebExpress.2.0.1-alpha.zip
    ├── webexpress.spdx.json         # SBOM of the archive (SPDX 2.2), also inside it
    └── webexpress.spdx.json.sha256
```

The archive is rewritten on every Release build. An archive of the same version is overwritten without
asking; older versions stay until they are deleted by hand.

---

## 1. Package contents

The server package is a plain zip archive. It runs on every platform with .NET (Windows, Linux,
Raspberry Pi), so there is no separate archive per operating system.

```
WebExpress.<version>.zip
├── _manifest/spdx_2.2/               # SBOM: every file with its hash, every NuGet dependency
├── readme.md                         # README.md of the repository
├── icon.png
├── licenses/                         # every *.lic of the repository, as *.txt
│   └── ...
└── bin/                              # the executable program
    ├── WebExpress.dll / WebExpress.exe
    ├── WebExpress.deps.json
    ├── WebExpress.runtimeconfig.json
    ├── WebExpress.WebCore.dll, .WebUI.dll, .WebIndex.dll, .WebApp.dll
    ├── Microsoft.IdentityModel.*.dll, System.IdentityModel.Tokens.Jwt.dll, Microsoft.Bcl.Cryptography.dll
    └── settings/
        └── webexpress.settings.json  # base settings of the server
```

Plugin packages (`*.wxp`) are made with the same tool but are laid out differently, see
[section 4](#4-difference-to-plugin-packages-wxp).

---

## 2. Usage

### Requirements

- **ASP.NET Core Runtime 10** (includes the .NET Runtime). The SDK is only needed to build plugins.
  Check with `dotnet --list-runtimes`.

### Install and start

```bash
unzip WebExpress.<version>.zip -d /opt/wx
cd /opt/wx/bin
dotnet WebExpress.dll
```

On Windows, `WebExpress.exe` can be started instead of `dotnet WebExpress.dll`.

Relative paths in the settings (`./packages`, `./assets`, `./data`, ...) are resolved against the
**working directory**. Always start the server from inside `bin/` (or set `WorkingDirectory=.../bin`
when running it as a service).

### Command line

| Parameter           | Meaning                                                                                      |
|---------------------|----------------------------------------------------------------------------------------------|
| `-config <file>`    | A different main settings file in the `settings/` folder (default: `webexpress.settings.json`). |
| `-help`             | Print a short help and the version number.                                                   |
| `-spec ...`         | Create a package instead of starting the server, see [section 3](#3-creating-the-package).   |

Exit code `0` means a regular shutdown, `1` means the server could not start; the reason is written to
the console and the log.

### Configuration

- `bin/settings/webexpress.settings.json` holds every server setting under the `WebExpress` section.
  Every other `*.json` in the `settings/` folder is read as well; that is where plugins keep their
  settings.
- Environment variables prefixed with `WEBEXPRESS_` override any setting, with `__` separating the
  levels. They take precedence over all files and are the right place for secrets (signing key, PFX
  passwords):

  ```bash
  WEBEXPRESS_WebExpress__Endpoints__0__Uri=http://*:80/
  WEBEXPRESS_WebExpress__Authentication__SigningKey=<base64, 32 bytes>
  ```

- The shipped file is meant for local development: endpoint `http://localhost/`, a publicly known
  signing key, `RequireHttps: false`. **Before going to production**, adjust the endpoint,
  `Authentication` (own key, `Issuer`, `Audience`) and `Culture`.

Every setting is described in [`config.md`](config.md).

### Installing plugins

Copy plugin packages (`*.wxp`) and their dependencies to `bin/packages/` (setting `PackagePath`).
WebExpress picks them up while it runs.

### Updating

The archive ships a `settings/webexpress.settings.json` of its own. When unpacking over an existing
installation, back up the settings first and restore them afterwards:

```bash
cp -a /opt/wx/bin/settings ~/wx-settings-backup
unzip -o WebExpress.<version>.zip -d /opt/wx
cp -a ~/wx-settings-backup/. /opt/wx/bin/settings/
```

The complete installation as a service (own user account, systemd unit, HTTPS) is described in
[`installation_guide.md`](installation_guide.md).

---

## 3. Creating the package

### Automatically on a Release build

After every build in the **Release** configuration, the project `src/WebExpress/WebExpress.csproj` calls
itself as the PackageBuilder (target `PostBuild`):

```bash
dotnet build src/WebExpress/WebExpress.csproj -c Release
```

This works the same from `WebExpress.slnx` and from `WebExpress.Develop.slnx`: every path is derived
from the project, not from the solution. The result lands in `src/WebExpress/bin/Release/`.

Afterwards the target `GenerateServerSbom` unpacks the archive, creates the SBOM over its contents with
Microsoft.Sbom.Targets, and packs it again (under Visual Studio it hands this step to `dotnet msbuild`,
because the SBOM tool needs the .NET runtime). The dependencies come from the restore graph
(`obj/project.assets.json`); `Microsoft.Sbom.Targets` itself is fetched as a `PackageDownload` so it does
not appear as a dependency.

In the Release configuration the project references `WebExpress.WebApp` (and with it WebCore, WebUI,
WebIndex) as a **NuGet package** in the version given in the csproj. The package therefore contains the
published state of these libraries, not the local sources. The `DebugLocal` configuration uses the local
projects but does not create a package.

### Manual call

```bash
WebExpress.exe -s <spec file> -c <configuration> -t <tfm> -o <output folder>
```

| Parameter         | Meaning                                                                          | Example                  |
|-------------------|----------------------------------------------------------------------------------|--------------------------|
| `-s`, `-spec`     | Path to the spec file. Its folder is the search scope for every file of the package. | `..\..\WebExpress.spec`  |
| `-c`, `-config`   | Build configuration whose output is packed (only relevant for `<plugin>`).       | `Release`                |
| `-t`, `-target`   | Target framework(s), several separated by `;` (only relevant for `<plugin>`).    | `net10.0`                |
| `-o`, `-output`   | Output folder, created if necessary.                                             | `bin\Release`            |

If a parameter is missing, the call ends with exit code `1` and a message `*** PackageBuilder: ...`.

### The spec file (`WebExpress.spec`)

```xml
<?xml version="1.0" encoding="utf-8"?>
<package>
    <id>WebExpress</id>
    <version>2.0.1-alpha</version>
    <title>WebExpress</title>
    <authors>webexpress-framework@outlook.com</authors>
    <license>MIT</license>
    <icon>icon.png</icon>
    <readme>README.md</readme>
    <description>...</description>
    <tags>webexpress</tags>
    <artifact>WebExpress.dll</artifact>
    <artifact>settings/webexpress.settings.json</artifact>
    ...
</package>
```

| Element           | Effect in the package                                                                               |
|-------------------|------------------------------------------------------------------------------------------------------|
| `id`              | Package name. The id `WebExpress` marks the server package (`.zip`, folder `bin/`), any other id a plugin (`.wxp`, folder `lib/`). |
| `version`         | Part of the file name `<id>.<version>.zip`.                                                          |
| `readme`          | Stored as `readme.md`.                                                                               |
| `icon`            | Stored as `icon.<extension>`.                                                                        |
| `privacypolicy`   | Optional, stored as `privacypolicy.md`.                                                              |
| `artifact`        | A single file, stored as `bin/<artifact>`. A sub path (`settings/...`) is kept.                      |
| `plugin`          | Project folder whose complete output `bin/<config>/<tfm>/` is packed (plugins only).                 |
| `dependency`      | Dependency on another package (plugins only).                                                        |
| `settings`        | Settings file of a plugin, stored under `settings/` (plugins only).                                  |
| `title`, `authors`, `license`, `licenseUrl`, `description`, `tags` | Metadata.                                          |

In addition, **every `*.lic` file** below the spec folder ends up in the package as `licenses/<name>.txt`,
so a new third-party library gets its license as `licenses/<Name>.lic`.

### How files are found

`readme`, `privacypolicy`, `icon`, every `artifact` and every `settings` entry are looked up by their file
name or trailing path (e.g. `settings/webexpress.settings.json`, `Assets/img/favicon.png`) in the spec
folder and all of its subfolders - never above it. A match must end on a path boundary, so
`icon.png` does not match `favicon.png`. If the name occurs several times, the candidates are ranked:

1. build output of the requested configuration and target: `.../bin/<config>/<tfm>/...`
2. build output of the requested configuration: `.../bin/<config>/...`
3. files outside of any build output (sources, `README.md`, `licenses/`, ...)

Output of another configuration (e.g. a stale `bin/Debug` in a Release build), output of another target
framework (e.g. `bin/Release/net8.0` when building for `net10.0`) and anything below `obj/` never
qualifies. Within a rank, the shallowest path wins, so the `README.md` next to the spec beats one
in a subfolder. The builder's output shows the path actually used for each file
(`*** PackageBuilder: Create the artifact file '...'`).

A `<plugin>` path is resolved relative to the spec folder and must stay inside it; an absolute path or
`../` leading to another project stops the builder, so no foreign build output can end up in the package.

**Every file named by the spec must exist.** A missing file, or a `<plugin>` whose build output for a
requested target is missing or empty, stops the builder before the archive is written: it lists every missing item
(`*** PackageBuilder: Not found: ...`), ends with exit code `1`, and the build fails. No incomplete package
is left behind.

The `*.lic` files are taken from outside of any build output only; copies in `bin/` are ignored.

This behaviour comes from `PackageBuilder` in WebExpress.WebCore. In a Release build the packager runs
with the WebCore from the NuGet package, so it applies from the WebCore package that contains it on.

### Checklist for a new version

1. Raise the version in `WebExpress.spec` (`<version>`) and in `src/WebExpress/WebExpress.csproj`
   (`Version`, `AssemblyVersion`).
2. Set the version of the `WebExpress.WebApp` package reference in the csproj to the published release.
3. If a new runtime dependency appears (a new dll in `bin/Release/net10.0/`), add it to the spec as an
   `<artifact>`. The `runtime` section of `WebExpress.deps.json` is authoritative: every dll listed there
   must be in the package, otherwise the server aborts on start with a `FileNotFoundException`.
4. Build Release. A `*** PackageBuilder: Not found: ...` line names a spec entry without a file.
5. **Test the package:** unpack the archive into an empty folder and start the server from there:

   ```bash
   unzip WebExpress.<version>.zip -d /tmp/wx-test
   cd /tmp/wx-test/bin
   dotnet WebExpress.dll
   ```

   If port 80 is already taken locally, `WEBEXPRESS_WebExpress__Endpoints__0__Uri=http://127.0.0.2/`
   binds the server to another loopback address.

### Troubleshooting

| Message                                                       | Cause                                                                                           |
|---------------------------------------------------------------|-------------------------------------------------------------------------------------------------|
| `The command "...WebExpress.exe -s ..." exited with code 3.`  | `cmd` cannot find the path to the exe (error 3 = path not found). Happens when the call is built from `$(SolutionDir)` and the project is built from a different solution. |
| `... exited with code 1.`                                     | A parameter is missing or the package could not be created; the preceding `*** PackageBuilder: ...` messages name the reason. |
| `*** PackageBuilder: Not found: <artifact>X.dll</artifact>`   | The file is neither in `bin/<config>/` nor outside of the build output. Build the configuration first, or fix the name in the spec. |
| `*** PackageBuilder: Not found: <plugin>src/X</plugin> (no build output in '...')` | The plugin project has no output for the requested configuration and target; check the `<plugin>` path (relative to the spec) and `-t`. |
| `*** PackageBuilder: Not found: <plugin>src/X</plugin> (build output in '...' is empty)` | The plugin project was not built for the configuration and target, or its output was cleaned. |
| `*** PackageBuilder: <plugin>...</plugin> points to '...', outside of the spec folder` | The `<plugin>` path is absolute or leads out of the spec folder with `../`; give it relative to the spec. |
| `*** PackageBuilder: The specified spec file does not exist.` | Wrong path for `-s`.                                                                            |
| The server does not start from the package, `Could not load file or assembly '...'` | The named dll is missing as an `<artifact>` in the spec (see checklist, step 3). |

---

## 4. Difference to plugin packages (`.wxp`)

Plugins (e.g. the tutorials) have a spec of their own in the root folder of their repository and are
also packed on a Release build. Compared to the server package:

- Extension `.wxp` instead of `.zip`, binaries under `lib/` instead of `bin/`.
- The spec is put into the package as `<id>.spec` (with its paths rewritten to the package layout); the
  server's PackageManager reads dependencies and settings from it.
- Instead of single `<artifact>` files, `<plugin>` usually packs the complete build output of a project
  (`lib/<plugin>/<tfm>/...`). This is where `-c` and `-t` apply.
- A `.wxp` is not installed by unpacking it but by placing it in the server's `packages/` folder.
