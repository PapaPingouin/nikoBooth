# NikoBooth
nodeJS simply photoBooth with minimal code and dependency

#Requisity
apt-get install npm
apt-get install gphoto2

npm install onoff
npm install shell-exec
npm install socket.io


apt-get remove gvfs # to disable automount usb device
apt-get install xscreensaver # and disable screen saver to not black screen after 10min


#FAQ

# not need if removed gvfs
To kill gphoto that mount ESO cam : 
lsusb

sudo fuser /dev/bus/usb/001/004
kill ###


