param(
  [string]$TranscriptRoot = (Join-Path (Split-Path $PSScriptRoot -Parent) '..\course-transcripts'),
  [int]$StartAt = 1
)

$ErrorActionPreference = 'Stop'
$TranscriptRoot = [System.IO.Path]::GetFullPath($TranscriptRoot)
$manifestPath = Join-Path $TranscriptRoot 'manifest.json'
$statusPath = Join-Path $TranscriptRoot 'status.json'
$failurePath = Join-Path $TranscriptRoot 'failures.json'

if (-not (Test-Path -LiteralPath $manifestPath)) {
  throw "Transcript manifest not found: $manifestPath"
}

$manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
$completed = [System.Collections.Generic.List[object]]::new()
$skipped = [System.Collections.Generic.List[object]]::new()
$failures = [System.Collections.Generic.List[object]]::new()

function Get-SafeFileName([string]$Value) {
  $safe = $Value -replace '[<>:"/\\|?*\x00-\x1F]', '-'
  $safe = ($safe -replace '\s+', ' ').Trim()
  if ($safe.Length -gt 120) { $safe = $safe.Substring(0, 120).Trim() }
  return $safe
}

function Format-Timestamp([double]$Seconds) {
  $span = [TimeSpan]::FromSeconds([Math]::Max(0, $Seconds))
  if ($span.TotalHours -ge 1) { return $span.ToString('hh\:mm\:ss') }
  return $span.ToString('mm\:ss')
}

function Get-YTtoTranscript([string]$Url) {
  $payload = @{ url = $Url; turnstileToken = '' } | ConvertTo-Json
  $response = Invoke-RestMethod -Method Post -Uri 'https://yttotranscript.com/api/transcribe' -ContentType 'application/json' -Body $payload -TimeoutSec 45
  if (-not $response.segments -or $response.segments.Count -eq 0) { throw 'YTtoTranscript returned no segments.' }
  return [pscustomobject]@{
    Provider = 'YTtoTranscript'
    Language = $response.lang
    Title = $response.title
    Lines = @($response.segments | ForEach-Object {
      "[$(Format-Timestamp ([double]$_.start))] $($_.text.Trim())"
    })
  }
}

function Get-YTTools([string]$Url) {
  $encoded = [uri]::EscapeDataString($Url)
  $response = Invoke-RestMethod -Method Get -Uri "https://yttools.co/api/transcript?url=$encoded" -TimeoutSec 45
  if (-not $response.transcript -or $response.transcript.Count -eq 0) { throw 'YTTools returned no caption track.' }
  return [pscustomobject]@{
    Provider = 'YTTools'
    Language = $response.transcript[0].lang
    Title = $null
    Lines = @($response.transcript | ForEach-Object {
      "[$(Format-Timestamp ([double]$_.offset / 1000))] $($_.text.Trim())"
    })
  }
}

function Write-Status {
  $status = [ordered]@{
    updatedAt = (Get-Date).ToString('o')
    totalVideos = [int]$manifest.totalVideos
    completed = $completed.Count
    skipped = $skipped.Count
    failed = $failures.Count
    lastSequence = if ($completed.Count) { $completed[$completed.Count - 1].sequence } else { $null }
  }
  $status | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $statusPath -Encoding utf8
  $failureJson = if ($failures.Count) {
    ConvertTo-Json -InputObject @($failures) -Depth 6
  } else {
    '[]'
  }
  Set-Content -LiteralPath $failurePath -Value $failureJson -Encoding utf8
}

New-Item -ItemType Directory -Force -Path $TranscriptRoot | Out-Null

foreach ($video in $manifest.videos) {
  if ([int]$video.sequence -lt $StartAt) { continue }

  $moduleDirectory = Join-Path $TranscriptRoot $video.moduleId
  New-Item -ItemType Directory -Force -Path $moduleDirectory | Out-Null
  $fileName = '{0:D3} - {1} - {2}.txt' -f [int]$video.sequence, $video.lessonId, (Get-SafeFileName $video.lessonTitle)
  $outputPath = Join-Path $moduleDirectory $fileName

  if ((Test-Path -LiteralPath $outputPath) -and (Get-Item -LiteralPath $outputPath).Length -gt 500) {
    $skipped.Add([pscustomobject]@{ sequence = [int]$video.sequence; lessonId = $video.lessonId })
    continue
  }

  $result = $null
  $attemptErrors = [System.Collections.Generic.List[string]]::new()

  foreach ($provider in @('YTtoTranscript', 'YTTools')) {
    try {
      $result = if ($provider -eq 'YTtoTranscript') { Get-YTtoTranscript $video.url } else { Get-YTTools $video.url }
      break
    } catch {
      $attemptErrors.Add("${provider}: $($_.Exception.Message)")
      Start-Sleep -Milliseconds 350
    }
  }

  if ($null -eq $result) {
    $failures.Add([pscustomobject]@{
      sequence = [int]$video.sequence
      moduleId = $video.moduleId
      lessonId = $video.lessonId
      lessonTitle = $video.lessonTitle
      url = $video.url
      errors = @($attemptErrors)
    })
    Write-Host ("FAILED {0:D3} {1}" -f [int]$video.sequence, $video.lessonId)
    Write-Status
    continue
  }

  $header = @(
    "Lesson: $($video.lessonTitle)"
    "Module: $($video.moduleTitle)"
    "Lesson ID: $($video.lessonId)"
    "Video: $($video.url)"
    "Transcript source: $($result.Provider)"
    "Language: $($result.Language)"
    ''
  )
  @($header + $result.Lines + '') | Set-Content -LiteralPath $outputPath -Encoding utf8
  $completed.Add([pscustomobject]@{
    sequence = [int]$video.sequence
    moduleId = $video.moduleId
    lessonId = $video.lessonId
    provider = $result.Provider
    lines = $result.Lines.Count
    path = $outputPath
  })
  Write-Host ("SAVED {0:D3} {1} via {2} ({3} lines)" -f [int]$video.sequence, $video.lessonId, $result.Provider, $result.Lines.Count)
  Write-Status
  Start-Sleep -Milliseconds 250
}

Write-Status
Write-Host "COMPLETE: $($completed.Count) captured, $($skipped.Count) already present, $($failures.Count) failed."
