![WebExpress-Framework](https://raw.githubusercontent.com/webexpress-framework/.github/main/docs/assets/img/banner.png)

# General
WebExpress is a lightweight web server that has been optimized for use in low-performance environments. Even on 
small systems, such as the Raspberry Pi, web applications can be operated efficiently. This is achieved through a 
small footprint with a low resource burden. Furthermore, WebExpress has a powerful and optimized plugin system, with a 
comprehensive API and application templates. This allows web applications to be easily and quickly integrated into a .NET language 
(e.g. C#). WebExpress is based on Kestrel, a cross-platform web server for ASP.NET Core. With this, WebExpress also supports:

- HTTPS
- HTTP/2 and, where the operating system provides QUIC, HTTP/3 (see [Choosing HTTP protocol versions](config.md#choosing-http-protocol-versions--protocols))

# License
The software is freely available as open source (MIT). The software sources can be obtained 
from https://github.com/webexpress-framework/WebExpress. WebExpress is based on components that are 
available as open source:

- https://github.com/dotnet/core (MIT)
- [Microsoft.IdentityModel.JsonWebTokens](https://www.nuget.org/packages/Microsoft.IdentityModel.JsonWebTokens/) ([MIT](../licenses/Microsoft.IdentityModel.JsonWebTokens.lic))
- [Microsoft.IdentityModel.Protocols.OpenIdConnect](https://www.nuget.org/packages/Microsoft.IdentityModel.Protocols.OpenIdConnect/) ([MIT](../licenses/Microsoft.IdentityModel.Protocols.OpenIdConnect.lic))

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
The installation is described using the Raspberry Pi with Raspberry Pi OS. The general procedure can also be applied to 
other Linux distributions; only the operating system steps differ.

## Installing the operating system
The first step is to write the operating system to an SD card. The free Raspberry Pi Imager (Windows, macOS and Linux) 
from https://www.raspberrypi.com/software/ copies the image to the SD card. Choose **Raspberry Pi OS Lite (64-bit)**; 
a server needs no desktop.

![imager](https://raw.githubusercontent.com/webexpress-framework/WebExpress/main/assets/ig/imager.png)

Before writing, open the OS customisation settings of the Imager and

- set the host name – the remainder of this guide uses ```wx```,
- create a user account with a password of your own – the examples use the user ```pi```; there is no default user any more,
- configure the Wi-Fi, if the Raspberry Pi is not connected by cable,
- set the time zone and keyboard layout,
- enable SSH.

With these settings, the Raspberry Pi needs neither a keyboard nor a monitor.

## Connecting to the Raspberry Pi
Insert the SD card and start the Raspberry Pi. After the first boot, which takes a little longer, a connection can be 
established with an SSH client (e.g. OpenSSH, which is part of Windows, macOS and Linux, or PuTTY). Raspberry Pi OS 
ships the mDNS service Avahi, so the Raspberry Pi answers under its host name followed by ```.local```:

```
ssh pi@wx.local
```

![piconnect](https://raw.githubusercontent.com/webexpress-framework/WebExpress/main/assets/ig/piconnect.png)

All further settings of the operating system can be changed later with ```sudo raspi-config```. On other distributions, 
mDNS is installed with ```sudo apt install avahi-daemon -y```.

## Set static IP
It is recommended to give the Raspberry Pi a fixed IP address, either as a DHCP reservation in the router or on the 
Raspberry Pi itself. Raspberry Pi OS manages the network with NetworkManager; the name of the connection is shown by the 
first command (see [2]):

```bash
pi@wx:~ $ nmcli connection show
pi@wx:~ $ sudo nmcli connection modify "<connection name>" ipv4.method manual ipv4.addresses 192.168.1.50/24 ipv4.gateway 192.168.1.1 ipv4.dns 192.168.1.1
pi@wx:~ $ sudo nmcli connection up "<connection name>"
```

Replace the addresses with those of your network.

## Installing .NET
WebExpress needs the ASP.NET Core Runtime 10 (it includes the .NET Runtime); the SDK is only needed to build plugins. 
Microsoft's install script selects the right build for the processor - `linux-arm64` on a 64-bit system - and installs it 
into a directory shared by all users (see [1]):

```bash
pi@wx:~ $ wget https://dot.net/v1/dotnet-install.sh -O dotnet-install.sh
pi@wx:~ $ chmod +x dotnet-install.sh
pi@wx:~ $ sudo ./dotnet-install.sh --channel 10.0 --runtime aspnetcore --install-dir /usr/share/dotnet
pi@wx:~ $ sudo ln -s /usr/share/dotnet/dotnet /usr/local/bin/dotnet
```

The last command makes ```dotnet``` available on the search path. The installation can be checked with:

```bash
pi@wx:~ $ dotnet --list-runtimes
```

## Installing utilities
In the following step, further programs are installed: ```unzip``` is needed to unpack WebExpress, and the Midnight 
Commander (MC) is an optional help for the administration of the Raspberry Pi:

```bash
pi@wx:~ $ sudo apt install mc unzip -y
```

If necessary, the profile can be extended by ```alias ll='ls -l'```.

![profile](https://raw.githubusercontent.com/webexpress-framework/WebExpress/main/assets/ig/profile.png)

## Installing WebExpress
WebExpress is provided free of charge on the release page of the GitHub repository 
https://github.com/webexpress-framework/WebExpress/releases. The release archive ```WebExpress.<version>.zip``` runs on 
every platform with .NET, so the same archive serves Windows, Linux and the Raspberry Pi. Copy the link of the archive 
from the release page and download it:

![downloadwebexpress](https://raw.githubusercontent.com/webexpress-framework/WebExpress/main/assets/ig/downloadwebexpress.png)

```bash
pi@wx:~ $ wget -O webexpress.zip "<link to the WebExpress zip archive of the release>"
```

WebExpress runs under an account of its own, which owns the installation directory ```/opt/wx```:

```bash
pi@wx:~ $ sudo useradd --system --home-dir /opt/wx --shell /usr/sbin/nologin webexpress
pi@wx:~ $ sudo mkdir -p /opt/wx
pi@wx:~ $ sudo unzip webexpress.zip -d /opt/wx
pi@wx:~ $ sudo chown -R webexpress:webexpress /opt/wx
```

The program and its ```settings``` directory are now in ```/opt/wx/bin```. To start WebExpress automatically, create a 
systemd unit with ```sudo nano /etc/systemd/system/webexpress.service```:

```ini
[Unit]
Description=WebExpress
After=network-online.target
Wants=network-online.target

[Service]
User=webexpress
WorkingDirectory=/opt/wx/bin
ExecStart=/usr/local/bin/dotnet /opt/wx/bin/WebExpress.dll
Environment=DOTNET_ROOT=/usr/share/dotnet
EnvironmentFile=-/etc/webexpress.env
# allows the ports 80 and 443 without running as root
AmbientCapabilities=CAP_NET_BIND_SERVICE
# must exceed ShutdownDelaySeconds + ShutdownTimeoutSeconds (see the configuration guide)
TimeoutStopSec=45
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Secrets such as the signing key are kept out of the settings file in ```/etc/webexpress.env```, which only root can read:

```bash
pi@wx:~ $ sudo touch /etc/webexpress.env
pi@wx:~ $ sudo chmod 600 /etc/webexpress.env
```

Finally, the unit is activated:

```bash
pi@wx:~ $ sudo systemctl daemon-reload
pi@wx:~ $ sudo systemctl enable webexpress.service
```

# Setting up WebExpress
Before WebExpress is started for the first time, it must be configured. Furthermore, the desired web applications must be installed. 

## Basic configuration

The settings file ```/opt/wx/bin/settings/webexpress.settings.json``` stores the general settings of WebExpress. It is a JSON file; every setting of the server sits under the name `WebExpress`. All other `.json` files in the `settings` directory are read as well – that is where the installed plugins keep their own settings, each under `Plugins` in a section of its own. The [configuration guide](config.md) describes every setting; relative paths are resolved against the working directory ```/opt/wx/bin```. Three settings need attention on every installation:

1. **Where to listen.** The shipped endpoint `http://localhost/` is only reachable from the Raspberry Pi itself. Change it to `http://*:80/` (or another port) so that other computers can reach the server.
2. **Signing in.** The shipped `Authentication` block is meant for local development: its signing key is public and `RequireHttps` is `false`. Create a key of your own, set `Issuer` and `Audience` to values of your installation, and set `RequireHttps` to `true` as soon as HTTPS is configured (see [Signing in](config.md#signing-in--authentication)). Put the key into the environment file rather than the settings file:

   ```bash
   pi@wx:~ $ echo "WEBEXPRESS_WebExpress__Authentication__SigningKey=$(openssl rand -base64 32)" | sudo tee -a /etc/webexpress.env > /dev/null
   ```

3. **Language.** `Culture` sets the language and the formats of dates and numbers, e.g. `de-DE`.

|Property         |Description                                                                                            |Example
|-----------------|-------------------------------------------------------------------------------------------------------|---
|Endpoints        |Defines listeners. Development uses HTTP. Production HTTPS resolves a certificate.                     |`"Endpoints": [{ "Uri": "http://*:80/" }]`
|Authentication   |Defines who signs the sign-in tokens, with which key, and how long they stay valid.                    |`"Authentication": { "Issuer": "http://wx.local", "Audience": "wx", "RequireHttps": false }`
|Certificates     |Configures the PFX base directory, shared certificate inventory and expiry warning thresholds in days. |`"Certificates": { "Directory": "/opt/wx/ssl", "WarningThresholdDays": [30, 14, 7] }`
|Kestrel          |Configures the underlying Kestrel server and its request limits, e.g. the number of concurrently active connections and the largest request body in bytes. |```"Kestrel": { "MaxConcurrentConnections": 300, "MaxRequestBodySize": 30000000 }```
|Culture          |Specifies the language, the calendar and the formatting of dates and numbers for the output.          |```"Culture": "de-DE"```
|AssetPath        |Contains static files that are to be served by the web server.                                         |```"AssetPath": "./assets"```
|ContextPath      |The context path is the prefix path of a Uri (e.g. http://localhost/contextpath/pathToResource).       |```"ContextPath": "wx"```
|PackagePath      |Directory from which the plugin packages are installed and loaded.                                     |```"PackagePath": "./packages"```

## HTTP for development

For local development, keep an HTTP endpoint in `settings/webexpress.settings.json`. No certificate configuration is necessary, and the certificate manager does not read any certificate files when no certificates are configured. Development requires no PFX file, local certificate authority, trusted development certificate or HTTPS redirect.

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

For production deployment, obtain a certificate for the public hostname from your certificate authority or existing certificate management process. This release loads existing local PFX files. It does not request certificates through ACME, answer DNS or HTTP challenges, or renew certificates automatically. The [configuration guide](config.md#production-certificates--certificates) describes every certificate setting and the selection rules.

### Prepare the certificate directory

For certificate storage, create a directory outside `AssetPath` and outside publicly served application content. The example installation uses `/opt/wx/ssl`. Grant the account running WebExpress read access to the PFX files, and restrict access to their private keys and passwords to the deployment operator and that service account.

```bash
pi@wx:~ $ sudo mkdir -p /opt/wx/ssl
pi@wx:~ $ sudo cp site.pfx /opt/wx/ssl/site.pfx
pi@wx:~ $ sudo chown -R webexpress:webexpress /opt/wx/ssl
pi@wx:~ $ sudo chmod 600 /opt/wx/ssl/site.pfx
```

For PFX creation from an existing issued PEM certificate, include the private key and intermediate certificates. The export command prompts for a password, avoiding a password in the shell command line. Replace the file names with your issued certificate material.

```bash
pi@wx:~ $ openssl pkcs12 -export -out site.pfx -inkey site.key -in site.crt -certfile intermediates.pem
```

The leaf certificate must include subject alternative names covering its configured DNS names or IP addresses; a common name alone is insufficient. It must be within its validity period, have a private key, and allow TLS server authentication. A CA certificate cannot be used as a server leaf.

### Configure the production endpoint

For a single HTTPS endpoint, name the PFX file directly at the endpoint. Relative PFX paths are resolved against `Certificates.Directory`.

```json
{
  "WebExpress": {
    "Certificates": {
      "Directory": "/opt/wx/ssl"
    },
    "Endpoints": [
      {
        "Uri": "https://*:443/",
        "PfxFile": "site.pfx",
        "CertificateAlias": "public-site"
      }
    ]
  }
}
```

Supply the PFX password through the environment file, never through the settings file:

```bash
pi@wx:~ $ echo "WEBEXPRESS_WebExpress__Endpoints__0__Password=<pfx password>" | sudo tee -a /etc/webexpress.env > /dev/null
```

Several certificates are defined as a shared inventory under `Certificates.Items` and selected per endpoint through `CertificateAlias`; because this release assigns one fixed certificate to each listener, they need separate ports or IP addresses. The [configuration guide](config.md#production-certificates--certificates) shows the inventory format.

### Checking the certificates

- If an HTTPS endpoint cannot resolve a usable certificate, WebExpress stops at startup before any listener opens, and the log names the reason.
- A certificate within a warning threshold (by default 30, 14 and 7 days before expiry) is reported in the log at startup.
- WebApp shows every configured certificate with its validity and status under **Settings > System > Certificates** for identities with the system access policy.
- To replace a certificate, copy the new PFX file and restart WebExpress; changed files are not picked up while the server runs.

### Client trust for private certificate authorities

For production clients using a private certificate authority, install only that authority's public root certificate in the client's trusted root certificate store according to your organization's deployment policy. Do not distribute the server PFX or its private key to clients. Publicly trusted certificates normally require no manual client trust installation. Local development continues to use HTTP and does not require this step.

## Installing WebExpress applications
WebExpress has a powerful plugin system. The plugin packages (```.wxp```) to be installed and, if applicable, their 
dependencies are copied to the ```/opt/wx/bin/packages``` directory (`PackagePath`, see section Basic configuration); 
WebExpress picks them up while it runs. A plugin may need to be configured – follow the instructions of the plugin.

# Start WebExpress
For the first start-up or after a change in the configuration, WebExpress must be restarted.

```bash
pi@wx:~ $ sudo systemctl restart webexpress
```

The output of the server can be followed with ```journalctl -u webexpress -f```. WebExpress starts automatically after each restart of the Raspberry Pi.

# Update
To ensure security, the Raspberry Pi, its applications and WebExpress must be updated regularly.

```bash
pi@wx:~ $ sudo apt update
pi@wx:~ $ sudo apt full-upgrade
```

The .NET runtime is updated by running the install script from section Installing .NET again. The WebExpress binaries are updated from the current release on https://github.com/webexpress-framework/WebExpress/releases (see section Installing WebExpress). The archive contains a ```settings/webexpress.settings.json``` of its own, so keep a copy of your settings and put it back afterwards:

```bash
pi@wx:~ $ sudo systemctl stop webexpress
pi@wx:~ $ sudo cp -a /opt/wx/bin/settings ~/wx-settings-backup
pi@wx:~ $ sudo unzip -o webexpress.zip -d /opt/wx
pi@wx:~ $ sudo cp -a ~/wx-settings-backup/. /opt/wx/bin/settings/
pi@wx:~ $ sudo chown -R webexpress:webexpress /opt/wx
pi@wx:~ $ sudo systemctl start webexpress
```

# Shopping list
The following hardware is required:
- A Raspberry Pi 4 Model B or Raspberry Pi 5 with at least 4 GB
- The matching official power supply (USB Type-C, 5V/3A for the Raspberry Pi 4, 5V/5A for the Raspberry Pi 5)
- A MicroSD card with at least 32 GB
- Optional housing

# Sources
- [1] https://learn.microsoft.com/dotnet/core/install/linux-scripted-manual
- [2] https://www.raspberrypi.com/documentation/computers/configuration.html
