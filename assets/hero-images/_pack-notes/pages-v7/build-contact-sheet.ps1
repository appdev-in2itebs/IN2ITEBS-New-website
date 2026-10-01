$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$assetDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$files = Get-ChildItem -LiteralPath $assetDir -Filter '*-object-hero.png' | Sort-Object Name

$validation = foreach ($file in $files) {
    $image = [System.Drawing.Bitmap]::FromFile($file.FullName)
    try {
        $cornerAlpha = @(
            $image.GetPixel(0, 0).A,
            $image.GetPixel($image.Width - 1, 0).A,
            $image.GetPixel(0, $image.Height - 1).A,
            $image.GetPixel($image.Width - 1, $image.Height - 1).A
        )
        [pscustomobject]@{
            File = $file.Name
            Width = $image.Width
            Height = $image.Height
            PixelFormat = $image.PixelFormat.ToString()
            CornerAlphaMinimum = ($cornerAlpha | Measure-Object -Minimum).Minimum
            CornerAlphaMaximum = ($cornerAlpha | Measure-Object -Maximum).Maximum
            TransparentCorners = (($cornerAlpha | Where-Object { $_ -eq 0 }).Count -eq 4)
        }
    }
    finally {
        $image.Dispose()
    }
}

$validation | Export-Csv -LiteralPath (Join-Path $assetDir 'validation-report.csv') -NoTypeInformation -Encoding UTF8

$columns = 4
$rows = [Math]::Ceiling($files.Count / $columns)
$cellWidth = 480
$cellHeight = 365
$sheet = New-Object System.Drawing.Bitmap ($columns * $cellWidth), ($rows * $cellHeight)
$graphics = [System.Drawing.Graphics]::FromImage($sheet)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$graphics.Clear([System.Drawing.Color]::FromArgb(241, 247, 250))

$titleFont = New-Object System.Drawing.Font('Segoe UI Semibold', 15)
$labelBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(15, 35, 56))
$rulePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(214, 226, 233), 1)

for ($index = 0; $index -lt $files.Count; $index++) {
    $column = $index % $columns
    $row = [Math]::Floor($index / $columns)
    $x = $column * $cellWidth
    $y = $row * $cellHeight

    $graphics.DrawRectangle($rulePen, $x + 8, $y + 8, $cellWidth - 16, $cellHeight - 16)

    $image = [System.Drawing.Image]::FromFile($files[$index].FullName)
    try {
        $maxWidth = $cellWidth - 34
        $maxHeight = $cellHeight - 70
        $scale = [Math]::Min($maxWidth / $image.Width, $maxHeight / $image.Height)
        $drawWidth = [int]($image.Width * $scale)
        $drawHeight = [int]($image.Height * $scale)
        $drawX = $x + [int](($cellWidth - $drawWidth) / 2)
        $drawY = $y + 18
        $graphics.DrawImage($image, $drawX, $drawY, $drawWidth, $drawHeight)
    }
    finally {
        $image.Dispose()
    }

    $label = $files[$index].BaseName -replace '-object-hero$', '' -replace '-', ' '
    $label = (Get-Culture).TextInfo.ToTitleCase($label)
    $labelRect = New-Object System.Drawing.RectangleF ($x + 18), ($y + $cellHeight - 47), ($cellWidth - 36), 32
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center
    $graphics.DrawString($label, $titleFont, $labelBrush, $labelRect, $format)
    $format.Dispose()
}

$contactSheetPath = Join-Path $assetDir 'contact-sheet.jpg'
$sheet.Save($contactSheetPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)

$rulePen.Dispose()
$labelBrush.Dispose()
$titleFont.Dispose()
$graphics.Dispose()
$sheet.Dispose()

[pscustomobject]@{
    ImageCount = $files.Count
    ContactSheet = $contactSheetPath
    ValidationReport = (Join-Path $assetDir 'validation-report.csv')
    FailedTransparencyChecks = ($validation | Where-Object { -not $_.TransparentCorners }).Count
    UnexpectedDimensions = ($validation | Where-Object { $_.Width -ne 1536 -or $_.Height -ne 1024 }).Count
}
