PID=`ps -ef | grep start.sh | awk '{print $2}'`
echo $PID
sudo kill -15 $PID
