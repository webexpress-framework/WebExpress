![WebExpress](https://raw.githubusercontent.com/webexpress-framework/.github/main/docs/assets/img/banner.png)

# Configuration

Before WebExpress can serve your web applications, it needs to know a few things: which address it
should listen on, where it may store its files, and which language it should use. All of this lives
in a human-readable file called `webexpress.settings.json` inside a folder named `settings`.

You do not need to be a developer to edit it. It is a plain text file in JSON format – a structure of
names and values in curly braces, for example `"Culture": "en-US"`. Open it with any text editor,
change a value, save the file and restart WebExpress for the change to take effect. Lines starting
with `//` are comments; WebExpress ignores them, so feel free to leave notes for yourself.

This guide walks you through every setting, starting with the smallest configuration that works and
building up from there. Don't worry about getting everything right – almost every setting is optional
and has a sensible default.

## Your first configuration

The only thing WebExpress truly needs is **where to listen**. The following file is enough to start a
working server that answers requests on your local machine:

```json
{
  "WebExpress": {
    "Endpoints": [
      { "Uri": "http://localhost/" }
    ]
  }
}
```

Every settings file follows the same shape:

- Everything is wrapped in one pair of curly braces.
- The settings of the server itself sit under the name `"WebExpress"`.
- The settings of installed web applications (plugins) sit under the name `"Plugins"` – more on
  that [below](#settings-of-plugins).
- Inside, you add the settings described below, in any order. Names are not case-sensitive, so
  `"culture"` and `"Culture"` mean the same thing.

## Where the files live and how WebExpress finds them

When WebExpress starts, it looks for a folder named `settings` next to the program and reads the file
`webexpress.settings.json` in it. You can point it to a different file when starting the program:
`WebExpress -config myserver.settings.json` (or `-c` for short; the name is taken relative to the
`settings` folder, and a full path works as well). If the file cannot be found, WebExpress stops and
tells you where it looked.

The `settings` folder is the **one place for every settings file** – the server's and those of the
installed web applications. WebExpress reads *every* file ending in `.json` in that folder and merges
them into one configuration, in this order:

1. All other `.json` files, in alphabetical order of their names.
2. `webexpress.settings.json` last – so a value you put in the main file always wins.
3. Environment variables that start with `WEBEXPRESS_` (see [below](#overriding-settings-from-the-environment)).

Files with any other extension (a readme, a backup named `webexpress.settings.json.bak`) are left
alone. A file that is not valid JSON stops the start-up with a message naming the file, so a typo is
noticed right away rather than silently ignored.

> **Tip:** Paths to folders (such as `PackagePath`, `AssetPath` and `DataPath`) can be written relative
> to the program's location (e.g. `./data`) or as a full path (e.g. `/var/wx/data`). Relative folders
> are created automatically if they don't exist yet.

## The settings in detail

All of the settings in this section go inside the `"WebExpress"` block. The first ones are what
almost every installation touches; the later ones are only needed for sign-in, mail, monitoring,
containers and running several instances.

### Listening for visitors – `Endpoints`

An **endpoint** is an address your server answers on: a protocol (`http` or `https`), a host name and
an optional port. Add one entry for every address you want to serve. Using `*` as the host makes
WebExpress listen on every network address of the machine, which is handy when other computers
should be able to reach it.

For development, keep the endpoint on **HTTP**. The shipped configuration does not require certificates. Configure **HTTPS only for production**, where the central `CertificateManager` supplies each listener with its validated certificate and issuer chain.

|Name               |Purpose
|-------------------|-----------------------------------------
|`Uri`              |The listening address, such as `http://localhost:8080/` for development or `https://*:443/` for production.
|`PfxFile`          |An optional inline PFX path, absolute or relative to `Certificates.Directory`.
|`Password`         |The password for an inline PFX file.
|`CertificateAlias` |An optional stable name for the inline certificate, or a reference to a shared inventory entry.

For certificate selection, the alias takes precedence. Without an alias, an inline PFX is identified by its endpoint URI; otherwise the endpoint's concrete hostname must resolve a configured inventory entry. A wildcard listener needs an alias or inline PFX.

### Production certificates – `Certificates`

This guide is the reference for the certificate settings; the [installation guide](installation_guide.md#https-for-production)
walks through preparing the files, and the [development guide](development_guide.md#certificate-management)
describes the programming interface.

For shared certificate configuration, add `Certificates` under `WebExpress`. The file store imports only configured PFX references. `Directory` defaults to the working directory. `WarningThresholdDays` defaults to `[30, 14, 7]`, accepts nonnegative day values and can be an empty array to disable expiry warnings.

```json
"Certificates": {
  "Directory": "./ssl",
  "WarningThresholdDays": [30, 14, 7],
  "Items": [
    {
      "Alias": "public-site",
      "Store": "file",
      "Reference": "site.pfx",
      "Password": "",
      "HostNames": ["site.example.com"]
    }
  ]
},
"Endpoints": [
  { "Uri": "https://*:443/", "CertificateAlias": "public-site" }
]
```

|Name                   |What it means
|-----------------------|---------------------------------------------------------------------------
|`Directory`            |The folder relative PFX paths are resolved against. Relative to the working directory unless absolute; left out, relative endpoint PFX paths keep resolving against the working directory.
|`WarningThresholdDays` |The days before expiry at which a warning is logged at start-up.
|`Items`                |The shared inventory. Each item has a unique `Alias`, optional concrete `HostNames`, a `Store` (default `file`), a store-specific `Reference` (a PFX path for the file store) and an optional `Password`.

For secrets, supply the actual password through `WEBEXPRESS_WebExpress__Certificates__Items__0__Password`, or place it in protected deployment settings. Alias and hostname keys must be unique across the inventory, ignoring case. Configured hostnames must be covered by certificate subject alternative names; a wildcard SAN may cover a concrete name, but `*.example.com` is not itself a hostname mapping.

For startup behavior, an unusable certificate referenced by an HTTPS endpoint stops startup before listeners open. This release has fixed certificates per listener, so separate certificates require separate ports or IP addresses. SNI selection, automatic renewal, file watching and periodic warning checks are future extensions.

### Language and regional formatting – `Culture`

The culture decides which language WebExpress uses and how it formats things like dates and numbers.
Use a standard culture code such as `en-US` (English, United States) or `de-DE` (German, Germany). If
you leave it out, the language of the operating system is used.

```json
"Culture": "en-US"
```

### Where files are stored – `PackagePath`, `AssetPath`, `DataPath`

WebExpress keeps different kinds of files in different folders so things stay tidy:

- **`PackagePath`** – the installable web applications (plugins) WebExpress should load.
- **`AssetPath`** – static files that are delivered as-is, such as images, stylesheets or downloads.
- **`DataPath`** – data that your applications create and need to keep, such as databases or uploads.

```json
"PackagePath": "./packages",
"AssetPath": "./assets",
"DataPath": "./data"
```

### Hosting under a sub-path – `ContextPath`

By default your applications live directly under the domain, e.g. `http://localhost/blog`. A context
path puts everything under a common prefix instead. If you set the context path to `wx`, the same
application becomes reachable at `http://localhost/wx/blog`. This is useful when WebExpress shares a
domain with other software. Leave the value empty (or omit it) for no prefix.

```json
"ContextPath": ""
```

### The public address – `ExternalUri`

Behind a reverse proxy, the address visitors type differs from the address WebExpress listens on:
the proxy answers `https://www.example.com/` and forwards to `http://0.0.0.0:8080/`. `ExternalUri`
tells WebExpress the public address, so that links and redirects it builds for the outside world
point there. Leave it out when visitors reach the server directly.

```json
"ExternalUri": "https://www.example.com/"
```

### The entry page – `Root`

When several web applications run on one server, the address of the server itself (or of the
context path) is a shared entry point. By default it forwards to the application when there is
exactly one, and shows an overview of all applications when there are several. The optional `Root`
block changes that.

|Name              |What it means
|------------------|---------------------------------------------------------------------------
|`RedirectEnabled` |Set to `false` to always show the overview, even when an application is selected. The default is `true`.
|`ApplicationId`   |The id of the application the entry point forwards to. Left out, the only application is chosen automatically; an unknown id shows the overview.

```json
"Root": {
  "ApplicationId": "webexpress.tutorial.webapp"
}
```

### Keeping a log – `Log`

WebExpress can write a log file that records what the server is doing – useful for spotting problems.
The `Mode` controls *whether and how* it writes:

- **`Off`** – no log file is written (the default when the block is left out).
- **`Append`** – keep the existing log file and add new entries to the end of it.
- **`Override`** – start a fresh log file every time the server starts.

|Name          |What it means 
|--------------|------------------------------------------------------------------
|`Mode`        |How logging behaves: `Off`, `Append` or `Override`.
|`Debug`       |Set to `true` for extra, detailed output; `false` for normal output.
|`Path`        |The folder where the log file is created.
|`Encoding`    |The text encoding of the file, normally `utf-8`.
|`FileName`    |The name of the log file.
|`TimePattern` |How timestamps are formatted, e.g. `dd.MM.yyyy HH:mm:ss`.

```json
"Log": {
  "Mode": "Append",
  "Debug": false,
  "Path": "/var/log/",
  "Encoding": "utf-8",
  "FileName": "webexpress.log",
  "TimePattern": "dd.MM.yyyy HH:mm:ss"
}
```

### Signed-in visitors – `Session`

WebExpress remembers a visitor between requests by giving the browser a session cookie. The optional
`Session` block adjusts how long that memory lasts and how the cookie is marked. Leave the block out to
keep the defaults: a 30-day sliding lifetime, and a cookie that is marked `Secure` whenever the
request came in over https.

|Name             |What it means
|-----------------|---------------------------------------------------------------------------
|`TimeoutMinutes` |How many minutes of inactivity end a session. A value of `0` or less disables expiry; the cookie then lives until the browser is closed.
|`Secure`         |Forces the `Secure` flag on (`true`) or off (`false`). Set it to `true` when WebExpress runs behind a proxy that handles https for it, so the cookie is still marked https-only towards the browser.

```json
"Session": {
  "TimeoutMinutes": 43200
}
```

### Signing in – `Authentication`

Web applications with a sign-in issue signed tokens instead of keeping the signed-in user in memory.
The `Authentication` block says who signs them, with which key, and how long they stay valid.
Without it, sign-in is refused with the message *Configure WebExpress:Authentication before signing in.*

> **Important:** The `webexpress.settings.json` shipped with WebExpress contains an `Authentication`
> block for local development: its signing key is public (it is part of the source code) and
> `RequireHttps` is `false`. Replace both before the server is reachable by anyone else.

|Name                                 |What it means
|-------------------------------------|---------------------------------------------------------------------------
|`Issuer`                             |Who issues the tokens, usually the public address, e.g. `https://app.example.org`.
|`Audience`                           |A name that keeps this installation's tokens apart from those of other services, e.g. `webexpress-production`.
|`SigningKey`                         |At least 32 random bytes in Base64 (`openssl rand -base64 32`). Every instance of one installation uses the same key; changing it signs every visitor out.
|`RequireHttps`                       |`true` (the default) accepts sign-in over https only. Set `false` for local development over plain http only.
|`TokenStorePath`                     |A folder for the markers that stop a stolen refresh token from being reused and that record revoked access tokens. Left out, they go to the shared cluster state (see [`Cluster`](#running-several-instances--cluster)); with neither, sign-in is unavailable.
|`ApplicationId`                      |The application the sign-in addresses (`/api/auth/…`) use when the request names none – needed when several applications run on the server.
|`AccessTokenLifetime`                |How long a sign-in is trusted before it is renewed in the background. Default `00:05:00` (five minutes).
|`RefreshTokenLifetime`               |How long a visitor stays signed in without signing in again. Default `7.00:00:00` (seven days).
|`MaximumPersonalAccessTokenLifetime` |The longest lifetime a personal access token for scripts and other programs may get. Default `90.00:00:00`.

Durations are written as `hours:minutes:seconds`, with the days in front and a dot: `7.00:00:00` is
seven days.

```json
"Authentication": {
  "Issuer": "https://app.example.org",
  "Audience": "webexpress-production",
  "SigningKey": "",
  "RequireHttps": true,
  "TokenStorePath": "./data/authentication"
}
```

Keep the key out of the file and pass it as the environment variable
`WEBEXPRESS_WebExpress__Authentication__SigningKey`. The [development guide](development_guide.md#authentication)
describes the token model, the sign-in addresses and the cookies.

### Sending mail – `Email`

Web applications send mail – a notification, a password link – through profiles that are configured
here, so that the applications never see the mail server's password. Sending is switched off until
`Enabled` is `true`.

|Name                 |What it means
|---------------------|---------------------------------------------------------------------------
|`Enabled`            |Set to `true` to allow applications to send mail. The default is `false`.
|`DefaultProfile`     |The profile used when an application names none. The default is `default`.
|`DeduplicationHours` |How long a message that was handed over is remembered, so that it is not sent twice. The default is `168` (one week).
|`MaxAttachmentBytes` |The largest combined size of all attachments of one message. The default is 26,214,400 bytes (25 MB).
|`Profiles`           |The named mail server configurations, see below.

Each profile has the following settings:

|Name             |What it means
|-----------------|---------------------------------------------------------------------------
|`Provider`       |How mail is delivered. The default `smtp` is built in; plugins can add others.
|`From`           |The sender used when a message names none.
|`Host`, `Port`   |The mail server and its port. The default port is `587`.
|`Security`       |`StartTls` (the default, usually port 587), `SslOnConnect` (usually port 465) or `None` (an unencrypted relay for development only; cannot be combined with a user name).
|`UserName`       |The account at the mail server, if it needs one.
|`Password`       |The password of that account – best passed as an environment variable.
|`TimeoutSeconds` |How long one delivery may take, including connecting and signing in. The default is `60`.
|`Options`        |Additional text settings for a provider supplied by a plugin.

```json
"Email": {
  "Enabled": true,
  "Profiles": {
    "default": {
      "From": "WebExpress <noreply@example.org>",
      "Host": "smtp.example.org",
      "Port": 587,
      "Security": "StartTls",
      "UserName": "noreply@example.org"
    }
  }
}
```

The password goes into `WEBEXPRESS_WebExpress__Email__Profiles__default__Password`. Changes to this
block take effect after a restart. The [Email model](development_guide.md#email-model) describes how
applications send mail and how duplicates are prevented.

### Security headers – `Security`

Every response carries protective headers: a strict content security policy, protection against
being embedded in other sites, a referrer policy and – over https – HSTS. Requests that change data
and that another web site triggers in a signed-in visitor's browser are refused. The optional
`Security` block loosens or extends these protections; leave it out to keep them all.

|Name                              |What it means
|----------------------------------|---------------------------------------------------------------------------
|`ContentSecurityPolicy`           |Replaces the built-in content security policy. `{nonce}` is replaced by the per-response value that marks the server's own inline scripts. An empty value switches the header off.
|`ContentSecurityPolicyReportOnly` |`true` only reports violations in the browser console instead of blocking – useful for trying out a new policy.
|`HstsMaxAge`                      |How many seconds browsers remember to use https only. Default one year; `0` switches HSTS off.
|`HstsIncludeSubDomains`           |`true` extends HSTS to every subdomain. Off by default.
|`CookieSameSite`                  |The `SameSite` attribute of cookies: `Lax` (the default), `Strict` or `None`.
|`Headers`                         |Further response headers by name. A value replaces a built-in header, an empty value removes it, an unknown name is added.
|`CsrfProtection`                  |`false` switches off the check against requests triggered by other sites. Only do that if you know why.
|`TrustedOrigins`                  |Further origins, e.g. `https://portal.example.org`, allowed to send requests that change data – needed when a proxy rewrites the host name.
|`TrustedProxies`                  |The addresses (`10.0.0.5`) or ranges (`172.16.0.0/12`) of your reverse proxies. Their `X-Forwarded-For` header is then trusted as the visitor's address, so per-visitor limits such as the sign-in throttle work behind a proxy.
|`DetailedErrors`                  |`true` shows the technical details of an internal error on the error page. For development only.

```json
"Security": {
  "TrustedProxies": [ "10.0.0.5" ],
  "Headers": { "Permissions-Policy": "camera=(self)" }
}
```

### Monitoring – `Metrics`

WebExpress publishes operating figures such as response times, error rates, memory use, logins and
active users at `/metrics`, in the text format that Prometheus reads. The optional `Metrics` block
controls this endpoint. The endpoint is switched off until you set `Enabled` to `true`; until then
the path `/metrics` is free for an application of your own. The figures name no user, but they do
show how busy the server is and how many logins fail, so also set a token whenever the endpoint can
be reached from outside your own network.

|Name                      |What it means
|--------------------------|---------------------------------------------------------------------------
|`Enabled`                 |Set to `true` to publish the endpoint. The default is `false`.
|`BearerToken`             |A secret the monitoring system must send as `Authorization: Bearer <token>`. Without it, every request to `/metrics` is refused with `401`. Left unset, the switched-on endpoint needs no password.
|`ActiveUserWindowMinutes` |How recently a signed-in user must have sent a request to count as active. The default is `5`.

```json
"Metrics": {
  "Enabled": true,
  "BearerToken": "a-long-random-secret"
}
```

Keep the token out of files you share by setting it as an environment variable instead (see
[Overriding settings from the environment](#overriding-settings-from-the-environment)):
`WEBEXPRESS_WebExpress__Metrics__BearerToken`.

### Container termination – `Shutdown`

When a container platform such as Docker or Kubernetes stops WebExpress, it first sends a polite
request and only later pulls the plug. With `Shutdown` set to `"graceful"`, WebExpress uses that time:
it stops accepting new requests and background work, lets the work already under way finish, and
then shuts down cleanly. `"immediate"` – the default when the setting is left out – skips the waiting.
`ShutdownTimeoutSeconds` limits how long WebExpress waits; it defaults to 30 and accepts values from
1 through 86400.

```json
"Shutdown": "graceful",
"ShutdownTimeoutSeconds": 30
```

The container platform must grant more time than WebExpress waits, so that the cleanup still fits
in. For example, use `terminationGracePeriodSeconds: 45` with a 30-second budget, and more if a
Kubernetes `preStop` hook uses up part of that time. The [Graceful shutdown](development_guide.md#graceful-shutdown)
section of the development guide describes the signals, how applications take part and how to
verify the setup.

Behind a load balancer, `ShutdownDelaySeconds` keeps the server answering for a few more seconds after the termination signal while `/health` already reports it as not ready, so the requests still routed to it during that moment are not refused. Set it a little above the readiness probe period and add it to the container timeout. It defaults to 0 and accepts values up to 3600.

```json
"ShutdownDelaySeconds": 10
```

### Running several instances – `Cluster`

Several instances of the same server can share the work behind one load balancer. They then need a folder they all can reach, for the state every instance must see (sign-in sessions, scheduled job runs, notifications), and a way to pass live messages to each other. Leave the block out for a single instance.

```json
"Cluster": {
  "StatePath": "/var/lib/webexpress/state",
  "Peers": [ "dns://webexpress-peers:8080" ],
  "Secret": "base64-encoded-32-random-bytes"
}
```

- `StatePath` – a folder on a volume every instance mounts.
- `Peers` – the other instances, as addresses (`http://10.0.0.5:8080/`) or as a name that lists all of them (`dns://name:port`).
- `Secret` – at least 32 random bytes in Base64 (`openssl rand -base64 32`); required as soon as `Peers` is set. Keep it out of the settings file and pass it as the environment variable `WEBEXPRESS_WebExpress__Cluster__Secret`.
- `NodeId` – optional name of the instance; the host name is used when it is left out.
- `Listen` – optional own address for the traffic between instances, e.g. `http://0.0.0.0:8081/`. Only the other instances need to reach it; visitors never do, so it should not be published through the load balancer.

All instances also need the same `Authentication` settings. The [Cluster model](development_guide.md#cluster-model) in the Development Guide describes what each part of the server shares and shows complete Kubernetes and Docker Compose setups.

## Advanced: tuning the server – `Kestrel`

Under the hood WebExpress uses a high-performance web server engine called
[Kestrel](https://learn.microsoft.com/aspnet/core/fundamentals/servers/kestrel). The optional
`Kestrel` block lets you fine-tune how it handles connections and how large requests may be.

**Most people never need this.** WebExpress ships with safe, sensible defaults, and you can leave the
whole block out. Reach for it only when you have a specific reason – for example to allow larger file
uploads or to limit how many visitors connect at once. Any value you don't set simply keeps its
default, so it is safe to configure just one or two options.

### How much a request may contain

These settings protect the server from oversized or excessive requests. The defaults are usually
fine; raise them if your applications need to accept large uploads.

|Name                               |Default                   |What it controls
|-----------------------------------|--------------------------|------------------------------------------
|`MaxConcurrentConnections`         |unlimited                 |How many visitors may be connected at the same time.
|`MaxRequestBodySize`               |30,000,000 bytes (~28 MB) |The largest request body (e.g. a file upload) the server accepts, in bytes.
|`MaxRequestHeadersTotalSize`       |32,768 bytes (32 KB)      |The largest combined size of all request headers, in bytes.
|`MaxConcurrentUpgradedConnections` |unlimited                 |How many long-lived connections (such as WebSockets) may be open. These are counted separately from `MaxConcurrentConnections`.
|`MaxRequestBufferSize`             |1,048,576 bytes (1 MB)    |Size of the buffer used while reading a request, in bytes.
|`MaxResponseBufferSize`            |65,536 bytes (64 KB)      |Size of the buffer used while sending a response, in bytes.
|`MaxRequestLineSize`               |8,192 bytes (8 KB)        |The largest first line of a request (method and address), in bytes.

### How long the server waits

|Name                    |Default     |What it controls 
|------------------------|------------|---------------------------------------------------------------------
|`KeepAliveTimeout`      |130 seconds |How long an idle connection is kept open before it is closed, **in seconds**.
|`RequestHeadersTimeout` |30 seconds  |How long the server waits for a request's headers to arrive before giving up, **in seconds**.

### Server behavior

|Name                             |Default |What it controls
|---------------------------------|--------|-----------------------------------------------------------------
|`AllowSynchronousIO`             |`true`  |Allows the server to read and write request data in a step-by-step manner, which WebExpress relies on. Leave as `true` unless you know you need otherwise.
|`AllowResponseHeaderCompression` |`true`  |Allows response headers to be compressed.
|`AddServerHeader`                |`true`  |Whether responses announce that they come from this server. Set to `false` to reveal a little less about your setup.

```json
"Kestrel": {
  "MaxConcurrentConnections": 300,
  "MaxRequestBodySize": 3000000000,
  "MaxRequestHeadersTotalSize": 65536,
  "AddServerHeader": false,
  "MaxConcurrentUpgradedConnections": 1000,
  "KeepAliveTimeout": 130,
  "RequestHeadersTimeout": 30
}
```

### Choosing HTTP protocol versions – `Protocols`

WebExpress speaks **HTTP/3**, **HTTP/2** and HTTP/1.1. An **HTTPS** endpoint serves HTTP/3 (QUIC
over UDP) next to HTTP/1.1 and HTTP/2 by default whenever the operating system provides QUIC
(Windows 11 / Server 2022, Linux with libmsquic). Browsers learn about HTTP/3 from the `Alt-Svc`
header and switch to it on their own, falling back to TCP wherever UDP is blocked – so open the UDP
port as well. Over TCP the version is negotiated per connection (via TLS ALPN): modern clients use
HTTP/2, older ones HTTP/1.1. Without QUIC support, an HTTPS endpoint serves HTTP/1.1 and HTTP/2 only.
Over plain **HTTP**, connections use HTTP/1.1; HTTP/3 needs TLS and is never offered there.

The optional `Protocols` value lets you pin which versions an endpoint offers. Leave it out to keep
the default, which is the recommended setting for almost everyone.

|Value                   |What it means
|------------------------|------------------------------------------------------------------------
|`Http1`                 |HTTP/1.1 only.
|`Http2`                 |HTTP/2 only. On a plain (non-TLS) endpoint this enables cleartext HTTP/2 (h2c).
|`Http1AndHttp2`         |HTTP/1.1 and HTTP/2, with HTTP/2 preferred. Keeps an HTTPS endpoint off UDP.
|`Http1AndHttp2AndHttp3` |All three. **(default for HTTPS when QUIC is available)**

HTTP/3 is dropped automatically where it cannot work – without TLS or without QUIC support – so it
never leaves an endpoint unreachable.

> **Note:** Cleartext HTTP/2 (h2c) has no automatic upgrade from HTTP/1.1, and browsers will not use
> it over plain HTTP. Setting `Http2` on a non-TLS endpoint therefore only makes sense for clients
> that speak h2c with prior knowledge (e.g. a reverse proxy or service-to-service calls). For normal
> websites, serve HTTP/2 over HTTPS and leave `Protocols` unset.

```json
"Kestrel": {
  "Protocols": "Http1AndHttp2"
}
```

## Settings of plugins

An installed web application (a *plugin*) may need settings of its own – a connection string, an
API key, a greeting. These do not go into the `"WebExpress"` block. They live under `"Plugins"`,
in a section named after the plugin, so that two plugins can never overwrite each other's values
even though all files of the `settings` folder are merged into one configuration:

```json
{
  "Plugins": {
    "webexpress.tutorial.webapp": {
      "Greeting": "Hello, world!"
    },
    "another.plugin": {
      "ConnectionString": "..."
    }
  }
}
```

The section name is the **plugin id** – the namespace of the plugin class, shown in the log and on the
plugin overview of the administration when the plugin is loaded. Names are not case-sensitive.

A plugin usually ships its defaults in a file of its own, for example
`webexpress.tutorial.webapp.settings.json`. When the plugin's package is installed, the file is placed
in the `settings` folder next to `webexpress.settings.json`. An existing file of the same name is
never overwritten – once you have edited it, it is yours, and a package update keeps your changes.
To override a plugin's value without touching its file, put the same section into
`webexpress.settings.json`; the main file is merged last and wins.

For developers: a plugin reads its own section through `PluginContext.Settings`, for example
`PluginContext.Settings["Greeting"]` or `PluginContext.Settings.Get<MyOptions>()`. The section only
contains the plugin's own values; the server's settings and those of other plugins are out of reach.
Ship the file by naming it in the package specification:

```xml
<settings>settings/webexpress.tutorial.webapp.settings.json</settings>
```

Changes to a settings file are picked up while the server runs: a plugin that reads a value on every
use sees the new one shortly after the file is saved. The settings of the server itself – endpoints,
folders, culture – are read once at start-up and need a restart.

## Overriding settings from the environment

Any value can also be set through an environment variable, which is handy in containers or when a
password should not sit in a file. The variable name is the path to the value with `__` (two
underscores) between the levels, prefixed with `WEBEXPRESS_`. Lists use the position as a level,
counting from `0`. Environment variables win over every file.

|Setting                                           |Environment variable
|--------------------------------------------------|----------------------
|`WebExpress` → `Culture`                          |`WEBEXPRESS_WebExpress__Culture`
|`WebExpress` → `Endpoints` → first → `Uri`        |`WEBEXPRESS_WebExpress__Endpoints__0__Uri`
|`WebExpress` → `Endpoints` → first → `Password`   |`WEBEXPRESS_WebExpress__Endpoints__0__Password`
|`Plugins` → `another.plugin` → `ConnectionString` |`WEBEXPRESS_Plugins__another.plugin__ConnectionString`

> **Note:** Plugin ids contain dots, and a plain shell refuses variable names with a dot
> (`export WEBEXPRESS_Plugins__another.plugin__…` fails in bash). Docker, Docker Compose, Kubernetes
> and systemd (`Environment=` in a unit file) accept such names, as does `env` on the command line:
> `env 'WEBEXPRESS_Plugins__another.plugin__ConnectionString=…' dotnet WebExpress.dll`.

## A complete example

This file shows the settings working together. It listens on both HTTP and HTTPS, writes a log,
allows large uploads, uses US English, signs visitors in and carries a setting for one plugin:

```json
{
  "WebExpress": {

    // Write a log file and keep adding to it on every start
    "Log": {
      "Mode": "Append",
      "Debug": false,
      "Path": "/var/log/",
      "Encoding": "utf-8",
      "FileName": "webexpress.log",
      "TimePattern": "dd.MM.yyyy HH:mm:ss"
    },

    // Listen on plain HTTP and on encrypted HTTPS. Keep the PFX password out of the file and
    // supply it through WEBEXPRESS_WebExpress__Endpoints__1__Password instead.
    "Endpoints": [
      { "Uri": "http://localhost/" },
      { "Uri": "https://localhost:443/", "PfxFile": "./cert/server.pfx", "Password": "" }
    ],

    // Sign-in. Supply the key through WEBEXPRESS_WebExpress__Authentication__SigningKey.
    "Authentication": {
      "Issuer": "https://localhost",
      "Audience": "webexpress-production",
      "SigningKey": "",
      "RequireHttps": true,
      "TokenStorePath": "./data/authentication"
    },

    // Advanced and optional: only needed to change the server defaults
    "Kestrel": {
      "MaxConcurrentConnections": 300,
      "MaxRequestBodySize": 3000000000,
      "MaxRequestHeadersTotalSize": 65536,
      "AddServerHeader": false
    },

    "Culture": "en-US",

    "PackagePath": "./packages",
    "AssetPath": "./assets",
    "DataPath": "./data",
    "ContextPath": ""
  },

  "Plugins": {
    "webexpress.tutorial.webapp": {
      "Greeting": "Hello, world!"
    }
  }
}
```
