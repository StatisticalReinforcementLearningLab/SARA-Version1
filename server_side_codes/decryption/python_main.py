import subprocess
#subprocess.check_output(['ls','-l']) #all that is technically needed...
print(subprocess.check_output(['javac','java_decrypt.java']))
print(subprocess.check_output(['java','java_decrypt']))
print(subprocess.check_output(['node','js_decrypt.js']))