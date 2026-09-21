![WebExpress-Framework](https://raw.githubusercontent.com/webexpress-framework/.github/main/docs/assets/img/banner.png)

# General
WebExpress is a lightweight web server that has been optimized for use in low-performance environments. Even on 
small systems, such as the Raspberry Pi, web applications can be operated efficiently. This is achieved through a 
small footprint with a low resource burden. Furthermore, WebExpress has a powerful and optimized plugin system, with a 
comprehensive API and application templates. This allows web applications to be easily and quickly integrated into a .NET language 
(e.g. C#). WebExpress is based on Kestrel, a cross-platform web server for ASP.NET core. With this, WebExpress also supports:

- https
- HTTP/2 (currently not macOS)

# License
The software is freely available as open source (MIT). The software sources can be obtained 
from https://github.com/webexpress-framework/WebExpress. WebExpress is based on components that are 
available as open source:

- https://github.com/dotnet/core (MIT)
- https://www.chartjs.org (MIT)

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

# Installation
The installation is described using the Raspberry Pi. However, the general procedure can also be applied to 
other operating systems.

## Installing the operating system
The first step is to write the operating system to an SD card. For this purpose, there is https://downloads.raspberrypi.org/imager/imager.exe 
a free program (Windows), with the help of which the image is copied to the SD card.

![imager](https://raw.githubusercontent.com/webexpress-framework/WebExpress/main/assets/ig/imager.png)

## Setting up the operating system

In the second step, the SD card is inserted into the Raspberry Pi and the Raspberry Pi is started. Since SSH is not 
yet active, a keyboard and a monitor must be connected. When the Raspberry Pi has been booted, logging in can be done 
with the following data:

```
User: pi 
Password: raspberry
```

After successful login, the ```raspi-config``` utility is called, with the help of which the basic configuration of the 
Raspberry Pi is carried out.

```
pi@raspberrypi:~ $ sudo raspi-config
```

It is recommended to change the password, as well as to set up the Wi-Fi, change the time zone and the host name if necessary. In the 
remainder of the application guide, the host name ```wx``` is used. In addition, SSH must be activated (to be found under Interface Options).

![raspiconfig](https://raw.githubusercontent.com/webexpress-framework/WebExpress/main/assets/ig/raspiconfig.png)

All subsequent steps can now be done via SSH and the Raspberry Pi can be disconnected from the keyboard and screen.

## Installing the .NET SDK
After SSH has been activated, a connection to the Raspberry Pi can be established with the help of an SSH client (e.g. Putty, OpenSSH).

![piconnect](https://raw.githubusercontent.com/webexpress-framework/WebExpress/main/assets/ig/piconnect.png)

First, the .NET SDK must be installed (it includes the .NET Runtime and the ASP.NET Core Runtime). Help for this is offered under [1]. The current versions 
can be obtained free of charge from Microsoft at https://dotnet.microsoft.com/download/dotnet-core.

![downloadnet1](https://raw.githubusercontent.com/webexpress-framework/WebExpress/main/assets/ig/downloadnet1.png)

For the Raspberry Pi, the binaries for Linux-Arm32 are to be used. The direct link to the Linux-Arm32 binaries must be copied.

![downloadnet2](https://raw.githubusercontent.com/webexpress-framework/WebExpress/main/assets/ig/downloadnet2.png)

The Linux Arm32 archive for the .NET SDK is downloaded to the Raspberry using wget.

``` bash
pi@wx:~ $ wget https://builds.dotnet.microsoft.com/dotnet/Sdk/10.0.100/dotnet-sdk-10.0.100-linux-arm.tar.gz 
```

In preparation for the installation of .NET, a directory must be created at ```/usr/share/dotnet-sdk``` by then unpacking the .NET archive.

``` bash
pi@wx:~ $ sudo mkdir /usr/share/dotnet-sdk 
```

After creating the directory ```/usr/share/dotnet-sdk```, the binaries can be unpacked.

``` bash
pi@wx:~ $ sudo tar zxf dotnet-sdk-10.0.100-linux-arm.tar.gz -C /usr/share/dotnet-sdk/
```

## Installing utilities
In the following step, further (service) programs are installed, which are helpful for the execution of WebExpress or for the administration 
of the Raspberry Pi.

As an optional application, the Midnight Commander (MC) can be installed and the profile can be customized.

```
pi@wx:~ $ sudo apt-get install mc -y
```

If necessary, the profile can be extended by ```alias ll='ls -l'```.

![profile](https://raw.githubusercontent.com/webexpress-framework/WebExpress/main/assets/ig/profile.png)

## Set static IP
It is recommended to configure a static IP address for the Raspberry under ```/etc/dhcpcd.conf``` (see [2]).

![dhcpcd](https://raw.githubusercontent.com/webexpress-framework/WebExpress/main/assets/ig/dhcpcd.png)

## Multicast Domain Name Service (mDNS)
For example, Avahi can be used as mDNS. Avahi is an open-source mDNS implementation. At the command prompt, type the following command to install Avahi:

```
pi@wx:~ $ sudo apt install avahi-daemon -y
```

Once the installation process is complete, local network queries are accepted and answered at ```wx.local```.

## Installing WebExpress
WebExpress is provided in packaged form for the Raspberry Pi in the GitHub repository https://github.com/webexpress-framework/WebExpress/releases 
free of charge.

![downloadwebexpress](https://raw.githubusercontent.com/webexpress-framework/WebExpress/main/assets/ig/downloadwebexpress.png)

The binaries of WebExpress can be obtained from GitHub via wget.

``` bash
pi@wx:~ $ wget https://github.com/webexpress-framework/WebExpress/releases/download/2.0.0.0/WebExpress_2.0.0.0_LinuxArm32.zip
```

In preparation for the installation of WebExpress, a directory must be created under ```/opt/wx``` by unpacking the binaries.

``` bash
pi@wx:~ $ sudo mkdir /opt/wx 
```

The archive must then be unpacked.

``` bash
pi@wx:~ $ sudo unzip WebExpress_2.0.0.0_LinuxArm32.zip -d /opt/wx 
```

After WebExpress has been successfully unpacked, the execution rights must be granted.

``` bash
pi@wx:~ $ sudo chmod +x /opt/wx/webexpress.sh /opt/wx/WebExpress.App
```

To start the WebExpress application automatically, the supplied SystemCtl unit must be installed.

``` bash
pi@wx:~ $ sudo cp /opt/wx/webexpress.service /etc/systemd/system
```

Finally, the SystemCtl unit must be activated.

``` bash
pi@wx:~ $ sudo systemctl enable webexpress.service
```

# Setting up WebExpress
Before WebExpress can be started, it must be configured. Furthermore, the desired web applications must be installed. 

## Basic configuration

For environment separation, use **HTTP for local development** and **HTTPS for production**. The shipped settings remain HTTP only. Development requires no PFX file, local certificate authority, trusted development certificate or HTTPS redirect. Configure production certificates only in deployment settings.

The settings file ```/opt/wx/settings/webexpress.settings.json``` stores the general settings of WebExpress. It is a JSON file; every setting of the server sits under the name `WebExpress`. All other `.json` files in the `settings` directory are read as well – that is where the installed plugins keep their own settings, each under `Plugins` in a section of its own. See the [configuration guide](config.md) for every setting.

|Property         |Description                                                                                            |Example
|-----------------|-------------------------------------------------------------------------------------------------------|---
|Endpoints        |Defines listeners. Development uses HTTP. Production HTTPS resolves a certificate.                     |`"Endpoints": [{ "Uri": "http://localhost:8080/" }]`
|Certificates     |Configures the PFX base directory, shared certificate inventory and expiry warning thresholds in days. |`"Certificates": { "Directory": "./ssl", "WarningThresholdDays": [30, 14, 7] }`
|Kestrel          |Configures the underlying Kestrel server and all request limits. MaxConcurrentConnections: Number of concurrently active connections. MaxRequestBodySize: The maximum number of bytes that may be transferred to the web server in the body. |```"Kestrel": { "MaxConcurrentConnections": 300, "MaxRequestBodySize": 30000000 }```
|Culture          |Specifies the language, calendar used, and formatting for dates and numbers for expenses.              |```"Culture": "de-DE"```
|Assets directory |Contains static files that are to be served by the web server.                                         |```"AssetPath": "./"```
|Context path     |The context path is the prefix path of a Uri (e.g. http://localhost/contextpath/pathToResource).       |```"ContextPath": "wx"```
|Plugin directory |Directory where the plugins are executed.                                                              |```"PackagePath": "./"```

## HTTP for development

For local development, keep an HTTP endpoint in `settings/webexpress.settings.json`. No certificate configuration is necessary, and the certificate manager does not read any certificate files when no certificates are configured.

```json
{
  "WebExpress": {
    "Endpoints": [
      { "Uri": "http://localhost:8080/" }
    ]
  }
}
```

## HTTPS for production

For production deployment, obtain a certificate for the public hostname from your certificate authority or existing certificate management process. This release loads existing local PFX files. It does not request certificates through ACME, answer DNS or HTTP challenges, or renew certificates automatically.

### Prepare the certificate directory

For certificate storage, create a directory outside `AssetPath` and outside publicly served application content. The example installation uses `/opt/wx/ssl`. Grant the account running WebExpress read access to the PFX files, and restrict access to their private keys and passwords to the deployment operator and that service account.

```bash
pi@wx:~ $ sudo mkdir -p /opt/wx/ssl
pi@wx:~ $ sudo cp site.pfx /opt/wx/ssl/site.pfx
```

For PFX creation from an existing issued PEM certificate, include the private key and intermediate certificates. The export command prompts for a password, avoiding a password in the shell command line. Replace the file names with your issued certificate material.

```bash
pi@wx:~ $ openssl pkcs12 -export -out site.pfx -inkey site.key -in site.crt -certfile intermediates.pem
```

For certificate identity, the leaf certificate must include subject alternative names covering its configured DNS names or IP addresses. A common name alone is insufficient. The leaf must be within its validity period, have a private key, and allow TLS server authentication and digital signatures when the corresponding usage extensions are present. A CA certificate cannot be used as a server leaf.

### Configure production endpoints

For a single HTTPS endpoint, the existing `PfxFile` and `Password` fields remain available. `CertificateAlias` optionally gives the certificate a stable name. Relative PFX paths are resolved against `Certificates.Directory`; this directory is relative to the process working directory unless it is absolute. If the directory setting is omitted, relative PFX paths retain their existing working directory semantics. Absolute PFX paths are also supported.

```json
{
  "WebExpress": {
    "Certificates": {
      "Directory": "/opt/wx/ssl",
      "WarningThresholdDays": [30, 14, 7]
    },
    "Endpoints": [
      {
        "Uri": "https://*:443/",
        "PfxFile": "site.pfx",
        "Password": "",
        "CertificateAlias": "public-site"
      }
    ]
  }
}
```

For password configuration, set `WEBEXPRESS_WebExpress__Endpoints__0__Password` in the service environment to the actual PFX password. The existing configuration loader applies environment variables after JSON settings. Passwords may also be specified directly in protected deployment settings. The empty string in this example is a placeholder, not an automatically generated password.

For several certificates, define a shared inventory under `Certificates.Items`. Each item has a unique `Alias`, a `Reference` interpreted as a PFX path by the default `file` store, an optional `Password`, and optional concrete `HostNames`. Endpoints select a certificate through `CertificateAlias` or, when the alias and inline PFX are omitted, through their hostname. No unconfigured files in the directory are imported.

```json
{
  "WebExpress": {
    "Certificates": {
      "Directory": "/opt/wx/ssl",
      "WarningThresholdDays": [30, 14, 7],
      "Items": [
        {
          "Alias": "public-site",
          "Reference": "site.pfx",
          "Password": "",
          "HostNames": ["site.example.com"]
        },
        {
          "Alias": "admin-site",
          "Reference": "admin.pfx",
          "Password": "",
          "HostNames": ["admin.example.com"]
        }
      ]
    },
    "Endpoints": [
      { "Uri": "https://*:443/", "CertificateAlias": "public-site" },
      { "Uri": "https://*:8443/", "CertificateAlias": "admin-site" }
    ]
  }
}
```

For passwords, use `WEBEXPRESS_WebExpress__Certificates__Items__0__Password` and `WEBEXPRESS_WebExpress__Certificates__Items__1__Password`. Alias and hostname lookup is case insensitive. Host mappings contain concrete names; a wildcard SAN in the certificate may cover a concrete name, but `*.example.com` is not itself a hostname mapping. Every lookup key must identify one certificate unambiguously.

For listener allocation, the example uses separate ports because this release assigns one fixed certificate to each listener. Distinct IP addresses can also separate listeners. Several hostnames on the same IP and port do not yet select certificates through SNI. A wildcard listener host `*` requires an explicit alias or an inline PFX definition because it does not identify a certificate hostname.

### Startup validation and operation

During startup, `CertificateManager` loads every configured inventory and inline endpoint certificate, validates the leaf material and records its metadata. Applications and hosting components resolve certificates through this service instead of opening certificate files. Kestrel receives the managed leaf and supplied certificate chain. If any HTTPS endpoint cannot resolve usable material, startup fails before any HTTP or HTTPS listener opens. A failed inventory entry that is not used by a listener remains visible through status metadata and logs.

For expiry monitoring, `WarningThresholdDays` defaults to `[30, 14, 7]`. At startup, a certificate within a threshold produces a warning showing its alias, UTC expiry time and the nearest applicable threshold. An empty array disables expiry warnings, while negative thresholds are rejected. Expired, not yet valid, keyless or unsuitable certificates remain inspectable but cannot be resolved for HTTPS. Logs exclude certificate passwords and provider exception details that could contain credentials.

For validation scope, this release checks the leaf validity period, private key presence, CA and usage restrictions, and subject alternative name coverage of configured hostnames. It does not establish client trust or perform online revocation checks. Deploy a complete and valid issuer chain and ensure clients trust the issuing authority. On Windows, the service account must be able to create temporary private key containers required by Schannel. Other platforms use ephemeral imports.

For updates, replace the certificate through your deployment process and restart WebExpress. File watching, periodic warning checks, automatic listener certificate replacement and renewal are not implemented in this release. Metadata reads and manager resolutions recheck the current validity period. Certificate handles remain alive until their hosting consumers stop.

For administrative diagnostics in WebApp, open **Settings > System > Certificates** with an identity carrying `WebExpress.WebCore.WebPolicies.SystemAccessPolicy`. The page shows aliases, configured hostnames, store names, subjects, issuers, thumbprints, UTC validity periods and current validation status through `ICertificateManager`. It includes summary counts and an empty state for HTTP development. Reload the page to refresh status. This first version provides an overview without editing configuration or exposing passwords, file references or private keys. Continue to use **HTTP for development** and **HTTPS only for production**.

For future modules, the core exposes `ICertificateStore` and `ICertificateManager` as the integration boundaries. ACME acquisition, renewal scheduling, DNS or HTTP challenges, Azure Key Vault and other providers can be implemented separately. The application-facing manager API remains independent of those technologies. See [Certificate management](development_guide.md#certificate-management) for ownership and provider contracts.

## Installing WebExpress applications
WebExpress has a powerful plugin system. The plugins to be installed and, if applicable, dependencies are copied to the ```/opt/wx/packages``` 
directory (see section Basic configuration). The plugin may need to be configured. For the installation and setup of the plugins, the 
instructions of the plugins are to be used.

# Start WebExpress
For the first start-up or after a change in the configuration, WebExpress must be restarted.

``` bash
pi@wx:~ $ sudo systemctl restart webexpress
```

WebExpress will start automatically after each restart of the Raspberry Pi.

# Client trust for private production certificate authorities

For production clients using a private certificate authority, install only that authority's public root certificate in the client's trusted root certificate store according to your organization's deployment policy. Do not distribute the server PFX or its private key to clients. Publicly trusted certificates normally require no manual client trust installation. Local development continues to use HTTP and does not require this step.

# Update
To ensure security, the Raspberry Pi, its applications and WebExpress must be updated regularly.

``` bash
pi@wx:~ $ sudo raspi-config
pi@wx:~ $ sudo apt-get update
pi@wx:~ $ sudo apt-get upgrade
```

The WebExpress binaries are also to be updated. For this purpose, the current binaries from https://github.com/webexpress-framework/WebExpress/releases must be used (see section Installing WebExpress).

# Shopping list
The following hardware is required:
- A Raspberry Pi 4 Model B with 8GB
- One plug-in power supply 5V/3A USB Type-C
- A 16GB or 32GB MicroSD card
- Optional housing

# Sources
- [1] https://dotnet.microsoft.com/download/linux-package-manager/debian10/runtime-current
- [2] https://www.ionos.de/digitalguide/server/konfiguration/raspberry-pi-mit-fester-ip-adresse-versehen/#:~:text=Den%20Raspberry%20Pi%20mit%20einer%20festen%20IP-Adresse%20ausstatten.,Zeitraum%20mit%20anderen%20Ger%C3%A4ten%20auf%20ihn%20zugreifen%20will
