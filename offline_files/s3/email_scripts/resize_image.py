import os, sys
from PIL import Image
import glob
import shutil
import pdb

def resize_images(infile,size,uncompressed_directory_location,base_dir):
    
    #backup original image
    outfile = uncompressed_directory_location + os.path.relpath(infile,base_dir).split(".")[0] + ".uncompressed.jpg"
    #pdb.set_trace()
    
    #if infile != outfile: #means don't overwrite original
    if os.path.exists(outfile):
        print outfile, " exist"
    else:    
        shutil.copyfile(infile, outfile)
    
            
    #        
    outfile = os.path.splitext(infile)[0] + ".jpg"
    #if infile != outfile:
    #try:
    im = Image.open(infile)
    im.thumbnail(size, Image.ANTIALIAS)
    im.save(outfile, "JPEG")            
            
size = 2400, 2400
file_names = glob.glob("/Library/WebServer/Documents/mltoolkit/CrowdFood/upload/*.jpg")


#resize_images("/Library/WebServer/Documents/mltoolkit/CrowdFood/upload/" + "1416325024321_352584063179730_57.jpg",size)

for file_name in file_names:
    print file_name
    resize_images(file_name,size,"/Library/WebServer/Documents/mltoolkit/CrowdFood/upload/uncompressed/","/Library/WebServer/Documents/mltoolkit/CrowdFood/upload/")
    #break          