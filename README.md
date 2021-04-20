# Guide to Puls Arcade on AMD 64 with Ubuntu

This guide is made to help install all the software and configure the Ubuntu 20.04 LTS for the Puls Arcade.

## Install the OS

Download Ubunutu LTS from [https://www.ubuntu-fr.org/download/](https://www.ubuntu-fr.org/download/)

Download an imager for your OS (Windows, Linux, Mac) and format a USB stick with the Ubunutu boot image

Install Ubuntu :
- allow session to open without password
- allow third party PPA
- use entire disk

When installation is over, go in BIOS and :
- allow Ubuntu to boot
- under the chipset config allow boot on power

Configure Ubuntu :
- share one ethernet port with other devices (for EMV)
- empêcher l'écran de se mettre en veille

## Install Software

`$ sudo apt-get update`

`$ sudo apt-get upgrade`

arp-scan is a tool for EMV detection
xserver-xorg-input-joystick allows mouse control with the gamepad

`$ sudo apt-get --fix-broken install`

`$ sudo apt-get install arp-scan xserver-xorg-input-joystick`

Install AnyDesk from website https://anydesk.com/en/downloads/linux

> arp-scan needs to have root permissions.
> `# visudo`
> add this permission : %sudo ALL = (ALL) NOPASSWD: /usr/sbin/arp-scan
> test with `$ sudo arp-scan --localnet`

## Download & Install Retroarch

Add the PPA and install retroarch for Ubuntu : https://www.retroarch.com/index.php?page=linux-instructions

Open Retroarch and go to **Online Updater** :
- Download Assets (optional)
- Download Joypad Profiles
- esc to exit
- Reexecute retroarch and configure joypads

Go To **Notifications** and turn all off

## Install Mono for EMV's exectuable

Install mono-complete : https://www.mono-project.com/download/stable/#download-lin-raspbian

`git clone https://github.com/pulssolidarite/PayterPay.git`

Go to PayterPay repository and compile:

`msbuild /p:Configuration=Release`

Move PayterPay/bin/Release/ to home/ and rename it Payter/

## PULS-ARCADE.AppImage

Add these two lines at the end of `/etc/environment` :

> Warning : Make sure to create a new terminal (and activate it) in the Admin Panel and use the logins for following step.

`export PULS_LOGIN=???`

`export PULS_MDP=???`

> Add this for free mode:

`export PULS_SKIPPAYMENT=TRUE`

Download latest AppImage release of Hera and place it in home directory. Grant permissions.

`$ chmod a+x PULS-ARCADE.AppImage`

Test the GUI

`$ ./PULS-ARCADE.AppImage`

> Tip : If the first screen stays white, restart the AppImage.

## Autostart AppImage 

Use the meta screen of Ubuntu to find the "application" manager and add a application to the board.
Write "~/PULS-ARCADE.AppImage" in the Command field and save with a name like "Puls-Arcade".
On next boot the 

## Local Net & Internet

Le Wifi se configure simplement à l'installation de l'OS ou directement chez l'usager avec le gestionnaire réseau d'Ubuntu.
Si ce n'est pas déjà fait, il faut partager un port ethernet aux autres ordinat
Sur le barebone AsRock il y a deux ports Ethernet ce qui permet de partage le premier au réseau interne de la borne et le deuxième comme connexion directe. Ceci permêt des usages plus polyvalents pour l'usager (wifi + ethernet).

Magie ça marche ! si tout est branché...

