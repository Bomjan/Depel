import os
import platform
import time

def restart_computer():
    os_type = platform.system()

    print("Restarting your computer in 5 seconds...")
    time.sleep(5)

    if os_type == "Windows":
        os.system("shutdown /r /t 0")
        
if __name__ == "__main__":
    restart_computer() 
