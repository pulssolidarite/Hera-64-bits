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
- deactivate screensaver

## Install Software

`$ sudo apt-get update`

`$ sudo apt-get upgrade`

### Autoupdate
https://blog.behrouze.com/debian-auto-update-upgrade/

### Softwares
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

The EMV binary can be found in the Payter repository under releases as a zip file.

Install mono-xsp4 : https://www.mono-project.com/download/stable/#download-lin-ubuntu

If for some obscure reason you need to recompile the Payter project, here is how is done using mono-complete:
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
On next boot Hera will auto start.

## Local Net & Internet

On the AsRock barebone there are two ethernet plugs allowing for a shared connection for the payment terminal and the second can be used as internet acces for when someone changes connection type (wifi/etheret).
This configuration is done in the internet settings, where you can set eth0 to be shared with other computers. This interface now can be plugged to the local network inside the arcade and be used as a internet sharing.

## Enjoy!


