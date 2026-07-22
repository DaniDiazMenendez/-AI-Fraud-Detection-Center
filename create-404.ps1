$baseContent = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Redirect</title><script>var l=window.location;l.replace(l.protocol+"//"+l.hostname+(l.port?":"+l.port:"")+"/-AI-Fraud-Detection-Center/?"+l.pathname.slice(22).replace(/&/g,"~and~")+(l.search?"&"+l.search.slice(1).replace(/&/g,"~and~"):"")+l.hash);</script></head><body></body></html>'

$targetSize = 512
$currentSize = $baseContent.Length
$padding = ' ' * ($targetSize - $currentSize)
$finalContent = $baseContent + $padding

$encoder = New-Object System.Text.ASCIIEncoding
$bytes = $encoder.GetBytes($finalContent)

[System.IO.File]::WriteAllBytes("c:\Demos\Nueva carpeta\public\404.html", $bytes)

$actualSize = (Get-Item "c:\Demos\Nueva carpeta\public\404.html").Length
Write-Host "Final size: $actualSize bytes"
