PID=`ps -ef | grep ''sudo node index.js'' | awk '{print $2}'`
echo $PID
sudo kill -15 $PID
echo 'kill -15 $PID'
