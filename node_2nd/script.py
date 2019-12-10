
import cv2
cnt=0
cap = cv2.VideoCapture("./uploads/Result.mp4")
while(1):
    try:
        os.remove(name)
    except: pass
    ret, video_frame = cap.read()
    cnt+=1
    name="./uploads/frames/"+str(cnt)+".jpg"
    
    if ret == True:
            cv2.imwrite(name,video_frame)
            
    else :
            break