The idea

Control your hydroponics green house using a Raspberry PI via the Browser using NodeJS, Socket.IO and pi-gpio MongoDB.

USE AT YOUR OWN RISK wrong connection can cause damage to your PI.

# Working in progress

Add support for:

nodejs modules:
*node-dht-sensor (GPIO17)
*pi-gpio
*bh1750 
*ds18x20 ( sensor of type /sys/bus/w1/devices/28-00000xxxxxxx)
*2 channel relay(GPIO27,GPIO22)


# Requirements

## Install Raspbian Jessie

`wget https://downloads.raspberrypi.org/raspbian_latest`

unzip the archive then:

`sudo dd bs=4M if=2015-09-24-raspbian-jessie.img of=/dev/sdb`

## Preliminary setup ##
 
after boot change password:

 `passwd`
 
check connectivity:

 `ping 8.8.8.8`

update and upgrade:

 `sudo apt-get update`
 
 `sudo apt-get upgrade`


## Install Additional Packages ##

`sudo apt-get install -y build-essential python-dev python-smbus i2c-tools`
 
##I2C SETUP

Installing Kernel Support (with Raspi-Config)
`raspi-config -> advanced -> enable i2c`


sudo vi /etc/modules
add these two lines to the end of the file:

`i2c-bcm2708`

`i2c-dev`

sudo vi /etc/modprobe.d/raspi-blacklist.conf
add these two lines to the end of the file:

`#blacklist spi-bcm2708`

`#blacklist i2c-bcm2708`

sudo vi /boot/config.txt
add these two lines to the end of the file:

`dtparam=i2c1=on`

`dtparam=i2c_arm=on`

`sudo reboot`

check i2c installation:

`sudo i2cdetect -y 1`

`     0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f`

`00:          -- -- -- -- -- -- -- -- -- -- -- -- -- `

`10: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- `

`20: -- -- -- 23 -- -- -- -- -- -- -- -- -- -- -- -- `

`30: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- `

`40: 40 -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- `

`50: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- `

`60: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --`
 
`70: 70 -- -- -- -- -- -- --`                         

other diag commands:

`lsmod | grep i2c_`

`dmesg | grep i2c`

`sudo i2cdump -y 1 0x40`

`i2cdetect -F 0x40`


##Install WiringPI

`git clone git://git.drogon.net/wiringPi`

`cd wiringPi`

`./build`

## Install OneWire support

`sudo vi /boot/config.txt`

add:

`dtoverlay=w1-gpio`

then:

`sudo reboot`

`sudo modprobe -v w1_gpio`

`sudo modprobe w1-gpio`

`sudo modprobe w1-therm`

`cat /sys/bus/w1/devices/w1_bus_master1/28-xxxx/w1_slave`
 
`5f 01 4b 46 7f ff 01 x0 9x : crc=9b YES`

`5f 01 4b 46 7f ff 01 x0 9x t=21937`


## Install TL-WN725N V2 Driver

@see <https://www.raspberrypi.org/forums/viewtopic.php?p=462982> 

@see <https://www.raspberrypi.org/documentation/configuration/wireless/wireless-cli.md>

@see <http://omarriott.com/aux/raspberry-pi-wifi/>

`wget https://dl.dropboxusercontent.com/u/80256631/install-8188eu.tgz`

`tar xvzf install-8188eu.tgz`
 
`chmod 755 install-8188eu.sh`
 
`sudo ./install-8188eu.sh`

`sudo cat /etc/network/interfaces`

add:

`allow-hotplug wlan0`

`iface wlan0 inet manual`

`wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf`

## Wifi setup

To scan for WiFi networks, use the command:

`sudo iwlist wlan0 scan`


generate encrypted password:

`wpa_passphrase WIRELESS_SID password`


`network={`

	`ssid="WIRELESS_SID"`
	
	`#psk="password"`
	
	`psk=b5611eda6bdb45c1b9f58d9c79331c12725942c46085954f0b0652fc26985ac2`
	
`}`

edit:

`sudo vi /etc/wpa_supplicant/wpa_supplicant.conf`

add:

`network={`

	`ssid="WIRELESS_SID"`
	
	`#psk="password"`
	
	`psk=b5611eda6bdb45c1b9f58d9c79331c12725942c46085954f0b0652fc26985ac2`
	
`}`

`sudo ifdown wlan0`
 
`sudo ifup wlan0`

#Install mongoDB

`sudo apt-get install mongodb-server`

#Install node.js 

`curl -sLS https://apt.adafruit.com/add | sudo bash`
`sudo apt-get install node`
`pi@raspberrypi ~ $ node -v`
`v4.2.1`

needed??

`sudo apt-get install npm`

##NODEJS I2C

@see <https://github.com/kelly/node-i2c/issues/69>

change from: "i2c": "0.2.0"
to 	   : "i2c": "https://github.com/polaris/node-i2c"

`npm install polaris/node-i2c`


# GPIO ADMIN

Install GPIO Admin, to allow users other than root to access the GPIO:

@see <https://github.com/quick2wire/quick2wire-gpio-admin>

`gpio-admin export 22`

gpio-admin: failed to change group ownership of /sys/devices/virtual/gpio/gpio22/direction: No such file or directory

@see https://github.com/nickfloyd/raspberry-beacons

Open and modify the gpio-admin.c file:

Change this:

`int size = snprintf(path, PATH_MAX, "/sys/devices/virtual/gpio/gpio%u/%s", pin, filename);`

To this:

`int size = snprintf(path, PATH_MAX, "/sys/class/gpio/gpio%u/%s", pin, filename);`

`make`

`sudo make install` 

Open and modify the pi-gpio.js file:

Change this:

`sysFsPath = "/sys/devices/virtual/gpio";`

To this:

`sysFsPath = "/sys/class/gpio";`


# BCM2835

@see <http://www.airspayce.com/mikem/bcm2835/>

`wget http://www.airspayce.com/mikem/bcm2835/bcm2835-1.46.tar.gz`

`tar zxvf bcm2835-1.46.tar.gz`
 
`cd bcm2835-1.46/`

`./configure`
 
`make`

`sudo make check`

`sudo make install`


## Install Dependencies ##

To install dependencies, issue:



## Configuration ##

To configure the application change `utils/config.js`

## Start application ##

To start the application, issue:

`sudo npm start`

Or:

`sudo nodejs index.js`

Navigate to your Raspberry PI IP and port to view the application.

# Increase swap space

`/etc/dphys-swapfile`
 
The content is very simple. By default my Raspbian has 100MB of swap:

`CONF_SWAPSIZE=100`

If you want to change the size, you need to modify the number and restart dphys-swapfile:

`/etc/init.d/dphys-swapfile stop`

`/etc/init.d/dphys-swapfile start`




## Developer notes ##

index.js - Provides a basic NodeJS module. See documentation for details.

start.sh - Provides a basic shell script to run the application in background.

start.sh - Provides a basic shell script to gracefully stop the nodejs application.

