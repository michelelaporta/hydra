PID=`ps -ef | grep 'sudo node bin/www' | awk '{print $2}'`
echo $PID
sudo kill -15 $PID
echo 'kill -15' $PID
