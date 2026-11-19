$total = 360; $ok = 0   # 360 cek x 10 detik = 1 jam
for ($i = 1; $i -le $total; $i++) {
  try {
    $code = (Invoke-WebRequest "http://localhost:3000/api/katalog" -UseBasicParsing -TimeoutSec 10).StatusCode
  } catch { $code = "GAGAL" }
  if ($code -eq 200) { $ok++ }
  "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') $code" | Add-Content uptime.log
  Start-Sleep -Seconds 10
}
$persen = [math]::Round($ok * 100 / $total, 2)
"Uptime: $ok/$total = $persen%" | Tee-Object -FilePath uptime.log -Append