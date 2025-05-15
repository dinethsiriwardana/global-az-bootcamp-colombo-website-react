@echo off
setlocal enabledelayedexpansion

rem Step 1: Create a temporary list of files
dir /b /a:-d *.jpg *.jpeg *.png *.JPG *.JPEG *.PNG > filelist.txt

set count=1
for /f "delims=" %%f in (filelist.txt) do (
    ren "%%f" "!count!.jpg"
    set /a count+=1
)

del filelist.txt
