roomtemp=$(cat /sys/bus/w1/devices/28-000005cff2dd/w1_slave | grep  -E -o ".{0,0}t=.{0,5}" | cut -c 3-)
echo "Temperature: $roomtemp"