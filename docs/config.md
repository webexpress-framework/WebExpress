![WebExpress](https://raw.githubusercontent.com/webexpress-framework/.github/main/docs/assets/img/banner.png)

# Configuration

Before WebExpress can serve your web applications, it needs to know a few things: which address it
should listen on, where it may store its files, and which language it should use. All of this lives
in a single, human-readable file called `webexpress.config.xml`.

You do not need to be a developer to edit it. It is a plain text file in XML format – a structure of
tags wrapped in angle brackets, for example `<culture>en-US</culture>`. Open it with any text editor,
change a value between the tags, save the file and restart WebExpress for the change to take effect.

This guide walks you through every setting, starting with the smallest configuration that works and
building up from there. Don't worry about getting everything right – almost every setting is optional
and has a sensible default.

## Your first configuration

The only thing WebExpress truly needs is **where to listen**. The following file is enough to start a
working server that answers requests on your local machine:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<config version="1">
    <endpoint uri="http://localhost/" />
</config>
```

Every configuration file follows the same shape:

- The first line is a standard XML header – just leave it as it is.
- Everything is wrapped in a single `<config>` element.
- The `version` tells WebExpress which configuration format this file uses. Keep it at `1`.
- Inside `<config>` you add the settings described below, in any order.

## Where the file lives and how WebExpress finds it

When WebExpress starts, it looks for its configuration in this order:

1. A file you point to explicitly when starting the program:
   `WebExpress -config myserver.config.xml`
2. Otherwise, a file named `webexpress.config.xml` in a `config` folder next to the program.

If no configuration file can be found, WebExpress stops and tells you how to provide one.

> **Tip:** Paths to folders (such as `packages`, `assets` and `data`) can be written relative to the
> program's location (e.g. `./data`) or as a full path (e.g. `/var/wx/data`). Relative folders are
> created automatically if they don't exist yet.

---

## The settings in detail

### Listening for visitors – `<endpoint>`

An **endpoint** is an address your server answers on: a protocol (`http` or `https`), a host name and
an optional port. Add one `<endpoint>` for every address you want to serve. Using `*` as the host
makes WebExpress listen on every network address of the machine, which is handy when other computers
should be able to reach it.

To serve over **HTTPS** (an encrypted, padlock-in-the-browser connection) you also need a certificate.
WebExpress reads it from a `.pfx` file together with its password.

| Attribute  | Required   | What it means |
|------------|------------|---------------|
| `uri`      | yes        | The address to listen on, e.g. `http://localhost/`, `http://*:8080/` or `https://localhost:443/`. |
| `pfx`      | for HTTPS  | Path to your certificate file (a `.pfx` file). |
| `password` | for HTTPS  | The password that unlocks the certificate file. |

```xml
<endpoint uri="http://localhost/" />
<endpoint uri="https://localhost:443/" pfx="./cert/server.pfx" password="secret" />
```

### Language and regional formatting – `<culture>`

The culture decides which language WebExpress uses and how it formats things like dates and numbers.
Use a standard culture code such as `en-US` (English, United States) or `de-DE` (German, Germany). If
you leave it out, the language of the operating system is used.

```xml
<culture>en-US</culture>
```

### Where files are stored – `<packages>`, `<assets>`, `<data>`

WebExpress keeps different kinds of files in different folders so things stay tidy:

- **`packages`** – the installable web applications (plugins) WebExpress should load.
- **`assets`** – static files that are delivered as-is, such as images, stylesheets or downloads.
- **`data`** – data that your applications create and need to keep, such as databases or uploads.

```xml
<packages>./packages</packages>
<assets>./assets</assets>
<data>./data</data>
```

### Hosting under a sub-path – `<contextpath>`

By default your applications live directly under the domain, e.g. `http://localhost/blog`. A context
path puts everything under a common prefix instead. If you set the context path to `wx`, the same
application becomes reachable at `http://localhost/wx/blog`. This is useful when WebExpress shares a
domain with other software. Leave the element empty (or omit it) for no prefix.

```xml
<contextpath></contextpath>
```

> There is also an optional `<route>` element that sets the server's base route. Most setups don't
> need it and can leave it out.

### Keeping a log – `<log>`

WebExpress can write a log file that records what the server is doing – useful for spotting problems.
The `modus` attribute controls *whether and how* it writes:

- **`Off`** – no log file is written.
- **`Append`** – keep the existing log file and add new entries to the end of it.
- **`Override`** – start a fresh log file every time the server starts.

| Attribute     | What it means |
|---------------|---------------|
| `modus`       | How logging behaves: `Off`, `Append` or `Override`. |
| `debug`       | Set to `true` for extra, detailed output; `false` for normal output. |
| `path`        | The folder where the log file is created. |
| `encoding`    | The text encoding of the file, normally `utf-8`. |
| `filename`    | The name of the log file. |
| `timepattern` | How timestamps are formatted, e.g. `dd.MM.yyyy HH:mm:ss`. |

```xml
<log modus="Append" debug="false" path="/var/log/" encoding="utf-8" filename="webexpress.log" timepattern="dd.MM.yyyy HH:mm:ss" />
```

---

## Advanced: tuning the server – `<kestrel>`

Under the hood WebExpress uses a high-performance web server engine called
[Kestrel](https://learn.microsoft.com/aspnet/core/fundamentals/servers/kestrel). The optional
`<kestrel>` block lets you fine-tune how it handles connections and how large requests may be.

**Most people never need this.** WebExpress ships with safe, sensible defaults, and you can leave the
whole block out. Reach for it only when you have a specific reason – for example to allow larger file
uploads or to limit how many visitors connect at once. Any value you don't set simply keeps its
default, so it is safe to configure just one or two options.

### How much a request may contain

These settings protect the server from oversized or excessive requests. The defaults are usually
fine; raise them if your applications need to accept large uploads.

| Element                            | Default                 | What it controls |
|------------------------------------|-------------------------|------------------|
| `maxconcurrentconnections`         | unlimited               | How many visitors may be connected at the same time. |
| `maxrequestbodysize`               | 30,000,000 bytes (~28 MB) | The largest request body (e.g. a file upload) the server accepts, in bytes. |
| `maxrequestheaderstotalsize`       | 32,768 bytes (32 KB)    | The largest combined size of all request headers, in bytes. |
| `maxconcurrentupgradedconnections` | unlimited               | How many long-lived connections (such as WebSockets) may be open. These are counted separately from `maxconcurrentconnections`. |
| `maxrequestbuffersize`             | 1,048,576 bytes (1 MB)  | Size of the buffer used while reading a request, in bytes. |
| `maxresponsebuffersize`            | 65,536 bytes (64 KB)    | Size of the buffer used while sending a response, in bytes. |
| `maxrequestlinesize`               | 8,192 bytes (8 KB)      | The largest first line of a request (method and address), in bytes. |

### How long the server waits

| Element                 | Default       | What it controls |
|-------------------------|---------------|------------------|
| `keepalivetimeout`      | 130 seconds   | How long an idle connection is kept open before it is closed, **in seconds**. |
| `requestheaderstimeout` | 30 seconds    | How long the server waits for a request's headers to arrive before giving up, **in seconds**. |

### Server behavior

| Element                          | Default | What it controls |
|----------------------------------|---------|------------------|
| `allowsynchronousio`             | `true`  | Allows the server to read and write request data in a step-by-step manner, which WebExpress relies on. Leave as `true` unless you know you need otherwise. |
| `allowresponseheadercompression` | `true`  | Allows response headers to be compressed. |
| `addserverheader`                | `true`  | Whether responses announce that they come from this server. Set to `false` to reveal a little less about your setup. |

```xml
<kestrel>
    <maxconcurrentconnections>300</maxconcurrentconnections>
    <maxrequestbodysize>3000000000</maxrequestbodysize>
    <maxrequestheaderstotalsize>65536</maxrequestheaderstotalsize>
    <addserverheader>false</addserverheader>
    <maxconcurrentupgradedconnections>1000</maxconcurrentupgradedconnections>
    <keepalivetimeout>130</keepalivetimeout>
    <requestheaderstimeout>30</requestheaderstimeout>
</kestrel>
```

### Choosing HTTP protocol versions – `<protocols>`

WebExpress speaks **HTTP/2** as well as HTTP/1.1. Over **HTTPS** the version is negotiated
automatically for each connection (via TLS ALPN): modern browsers and clients use HTTP/2, older ones
fall back to HTTP/1.1 – you do not have to configure anything. Over plain **HTTP**, connections use
HTTP/1.1.

The optional `<protocols>` element lets you pin which versions an endpoint offers. Leave it out to
keep the default, which is the recommended setting for almost everyone.

| Value           | What it means |
|-----------------|---------------|
| `Http1`         | HTTP/1.1 only. |
| `Http2`         | HTTP/2 only. On a plain (non-TLS) endpoint this enables cleartext HTTP/2 (h2c). |
| `Http1AndHttp2` | Both, with HTTP/2 preferred when the client supports it. **(default)** |

> **Note:** Cleartext HTTP/2 (h2c) has no automatic upgrade from HTTP/1.1, and browsers will not use
> it over plain HTTP. Setting `Http2` on a non-TLS endpoint therefore only makes sense for clients
> that speak h2c with prior knowledge (e.g. a reverse proxy or service-to-service calls). For normal
> websites, serve HTTP/2 over HTTPS and leave `<protocols>` unset.

```xml
<kestrel>
    <protocols>Http1AndHttp2</protocols>
</kestrel>
```

---

## A complete example

This file shows the settings working together. It listens on both HTTP and HTTPS, writes a log,
allows large uploads and uses US English:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<config version="1">

    <!-- Write a log file and keep adding to it on every start -->
    <log modus="Append" debug="false" path="/var/log/" encoding="utf-8" filename="webexpress.log" timepattern="dd.MM.yyyy HH:mm:ss" />

    <!-- Listen on plain HTTP and on encrypted HTTPS -->
    <endpoint uri="http://localhost/" />
    <endpoint uri="https://localhost:443/" pfx="./cert/server.pfx" password="secret" />

    <!-- Advanced and optional: only needed to change the server defaults -->
    <kestrel>
        <maxconcurrentconnections>300</maxconcurrentconnections>
        <maxrequestbodysize>3000000000</maxrequestbodysize>
        <maxrequestheaderstotalsize>65536</maxrequestheaderstotalsize>
        <addserverheader>false</addserverheader>
    </kestrel>

    <culture>en-US</culture>

    <packages>./packages</packages>
    <assets>./assets</assets>
    <data>./data</data>
    <contextpath></contextpath>

</config>
```
