$ErrorActionPreference = 'Stop'

$courseAppDirectory = $PSScriptRoot
$courseUrl = 'http://localhost:3000/'
$serverReady = $false

try {
  $response = Invoke-WebRequest -UseBasicParsing -Uri $courseUrl -TimeoutSec 2
  $serverReady = $response.StatusCode -eq 200
} catch {
  $serverReady = $false
}

if (-not $serverReady) {
  $npmCommand = (Get-Command 'npm.cmd' -ErrorAction SilentlyContinue).Source
  if (-not $npmCommand) {
    throw 'Node.js is required to open the course, but npm.cmd could not be found.'
  }

  $standardLog = Join-Path $courseAppDirectory '.course-server.log'
  $errorLog = Join-Path $courseAppDirectory '.course-server-error.log'
  Start-Process -FilePath $npmCommand `
    -ArgumentList 'start' `
    -WorkingDirectory $courseAppDirectory `
    -WindowStyle Hidden `
    -RedirectStandardOutput $standardLog `
    -RedirectStandardError $errorLog

  for ($attempt = 0; $attempt -lt 40; $attempt += 1) {
    Start-Sleep -Milliseconds 500
    try {
      $response = Invoke-WebRequest -UseBasicParsing -Uri $courseUrl -TimeoutSec 2
      if ($response.StatusCode -eq 200) {
        $serverReady = $true
        break
      }
    } catch {
      $serverReady = $false
    }
  }
}

if (-not $serverReady) {
  throw 'The local course server did not start. See .course-server-error.log in the electrical-course-app folder.'
}

$chromeCandidates = @(
  (Join-Path $env:ProgramFiles 'Google\Chrome\Application\chrome.exe'),
  (Join-Path ${env:ProgramFiles(x86)} 'Google\Chrome\Application\chrome.exe'),
  (Join-Path $env:LOCALAPPDATA 'Google\Chrome\Application\chrome.exe')
)
$chromePath = $chromeCandidates | Where-Object { $_ -and (Test-Path -LiteralPath $_) } | Select-Object -First 1

if (-not $chromePath) {
  throw 'Google Chrome could not be found. The launcher will not open another browser.'
}

Start-Process -FilePath $chromePath -ArgumentList '--new-tab', $courseUrl
