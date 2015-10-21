Control your hydroponics green house using a Raspberry PI via the Browser using NodeJS, Socket.IO and pi-gpio and MongoDB.

# Requirements #

##Install mongoDB


See http://c-mobberley.com/wordpress/2013/10/14/raspberry-pi-mongodb-installation-the-working-guide/

To avoid memory leak during compilation increase swap :

`/etc/dphys-swapfile`

The content is very simple. By default my Raspbian has 100MB of swap:

`CONF_SWAPSIZE=100`

If you want to change the size, you need to modify the number and restart dphys-swapfile:

`/etc/init.d/dphys-swapfile stop`

`/etc/init.d/dphys-swapfile start`

### MongoDB requirements

sudo apt-get update

sudo apt-get upgrade

sudo apt-get install build-essential libboost-filesystem-dev libboost-program-options-dev libboost-system-dev libboost-thread-dev scons libboost-all-dev python-pymongo git

cd ~

git clone https://github.com/skrabban/mongo-nonx86

cd mongo-nonx86

sudo scons

sudo scons --prefix=/opt/mongo install

sudo adduser --firstuid 100 --ingroup nogroup --shell /etc/false --disabled-password --gecos "" --no-create-home mongodb

sudo mkdir /var/log/mongodb/

sudo chown mongodb:nogroup /var/log/mongodb/

sudo mkdir /var/lib/mongodb

sudo chown mongodb:nogroup /var/lib/mongodb

sudo cp debian/init.d /etc/init.d/mongod

sudo cp debian/mongodb.conf /etc/

sudo ln -s /opt/mongo/bin/mongod /usr/bin/mongod

sudo chmod u+x /etc/init.d/mongod

sudo update-rc.d mongod defaults

sudo /etc/init.d/mongod start

pi@raspberrypi ~ $ mongo

MongoDB shell version: 2.1.1-pre-

connecting to: test

>

REST is not enabled.  use --rest to turn on.

sudo nano /etc/init.d/mongod

Scroll down to:

DAEMONUSER=${DAEMONUSER:-mongodb}

DAEMON_OPTS=${DAEMON_OPTS:-"--dbpath $DATA --logpath $LOGFILE run"}

DAEMON_OPTS="$DAEMON_OPTS --config $CONF"


And add in –rest to give:

DAEMONUSER=${DAEMONUSER:-mongodb}

DAEMON_OPTS=${DAEMON_OPTS:-"--dbpath $DATA --logpath $LOGFILE run"}

DAEMON_OPTS="$DAEMON_OPTS --config $CONF --rest"

sudo /etc/init.d/mongod restart



#Install node.js 

Install the latest node.js on your Raspbian:

https://github.com/joyent/node/wiki/installing-node.js-via-package-manager


Install GPIO Admin, to allow users other than root to access the GPIO:

https://github.com/quick2wire/quick2wire-gpio-admin

## Install Dependencies ##

To install dependencies, issue:

npm install

## Configuration ##

To configure the application change utils/config.js.

## Start application ##

To start the application, issue:

npm start

Or:

nodejs index.js

Navigate to your Raspberry PI IP and port to view the application.

## Raspberry Devices ##

#### Enable IC2

sudo apt-get install python-smbus

sudo apt-get install i2c-tools

 sudo raspi-config 
 
 advantaced options -> I2C enable kernel module -> reboot
 
 sudo nano /etc/modules add 
 
i2c-bcm2708 
i2c-dev

sudo vi  /etc/modprobe.d/raspi-blacklist.conf

`#blacklist spi-bcm2708`

`#blacklist i2c-bcm2708`

sudo vi /boot/config.txt

`dtparam=i2c1=on`

`dtparam=i2c_arm=on`

sudo reboot

sudo i2cdetect -y 1

 

#### 

DS18B20 SENSOR

Add OneWire support
vi /boot/config.txt

dtoverlay=w1-gpio

sudo reboot

sudo modprobe w1-gpio

sudo modprobe w1-therm

cd /sys/bus/w1/devices

ls

cd 28-xxxx (change this to match what serial number pops up)

cat w1_slave


#### BH1750 Sensor


##### Enable I2C

sudo i2cdetect -y 1

vi /etc/modprobe.d/raspi-blacklist.conf

sudo vi /etc/modprobe.d/raspi-blacklist.conf

sudo reboot

nodejs integration thanks to:

https://github.com/miroRucka/bh1750

## Developer notes ##

index.js - Provides a basic NodeJS module. See documentation for details.

start.sh - Provides a basic shell script to run the application in background.

start.sh - Provides a basic shell script to gracefully stop the nodejs application.

