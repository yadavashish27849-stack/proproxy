Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Bitmap]::FromFile('c:\keysite\icon.png')
$width = $src.Width
$height = $src.Height
$rect = [System.Drawing.Rectangle]::new(0, 0, $width, $height)
$bmp = $src.Clone($rect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$src.Dispose()

$bmpData = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadWrite, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$ptr = $bmpData.Scan0
$stride = [Math]::Abs($bmpData.Stride)
$bytes = $stride * $height
$rgbValues = [byte[]]::new($bytes)
[System.Runtime.InteropServices.Marshal]::Copy($ptr, $rgbValues, 0, $bytes)

# Visited array for BFS flood fill: 0 = unvisited, 1 = background (transparent), 2 = feather edge
$visited = [byte[]]::new($width * $height)
$queue = [System.Collections.Generic.Queue[int]]::new()

# Function to get max RGB channel at (x, y)
function Get-Max-Channel($x, $y) {
    $idx = $y * $stride + $x * 4
    $b = $rgbValues[$idx]
    $g = $rgbValues[$idx + 1]
    $r = $rgbValues[$idx + 2]
    return [Math]::Max($r, [Math]::Max($g, $b))
}

# Seed the queue with all border pixels that are dark
for ($x = 0; $x -lt $width; $x++) {
    # Top border
    if ((Get-Max-Channel $x 0) -lt 45) {
        $queue.Enqueue(0 * $width + $x)
        $visited[0 * $width + $x] = 1
    }
    # Bottom border
    if ((Get-Max-Channel $x ($height - 1)) -lt 45) {
        $queue.Enqueue(($height - 1) * $width + $x)
        $visited[($height - 1) * $width + $x] = 1
    }
}
for ($y = 0; $y -lt $height; $y++) {
    # Left border
    if ((Get-Max-Channel 0 $y) -lt 45) {
        $queue.Enqueue($y * $width + 0)
        $visited[$y * $width + 0] = 1
    }
    # Right border
    if ((Get-Max-Channel ($width - 1) $y) -lt 45) {
        $queue.Enqueue($y * $width + ($width - 1))
        $visited[$y * $width + ($width - 1)] = 1
    }
}

$dx = @(1, -1, 0, 0, 1, -1, 1, -1)
$dy = @(0, 0, 1, -1, 1, 1, -1, -1)

# BFS flood fill from borders to only remove background black
while ($queue.Count -gt 0) {
    $curr = $queue.Dequeue()
    $cx = $curr % $width
    $cy = [Math]::Floor($curr / $width)
    
    for ($i = 0; $i -lt 8; $i++) {
        $nx = $cx + $dx[$i]
        $ny = $cy + $dy[$i]
        
        if ($nx -ge 0 -and $nx -lt $width -and $ny -ge 0 -and $ny -lt $height) {
            $nPos = $ny * $width + $nx
            if ($visited[$nPos] -eq 0) {
                $maxVal = Get-Max-Channel $nx $ny
                if ($maxVal -lt 30) {
                    $visited[$nPos] = 1 # Pure background
                    $queue.Enqueue($nPos)
                } elseif ($maxVal -lt 65) {
                    $visited[$nPos] = 2 # Edge feather
                    # Don't expand further from edge
                }
            }
        }
    }
}

# Apply transparency based on flood-fill mask
for ($y = 0; $y -lt $height; $y++) {
    for ($x = 0; $x -lt $width; $x++) {
        $pos = $y * $width + $x
        $idx = $y * $stride + $x * 4
        $state = $visited[$pos]
        
        if ($state -eq 1) {
            $rgbValues[$idx + 3] = 0 # 100% transparent
        } elseif ($state -eq 2) {
            $maxVal = Get-Max-Channel $x $y
            $alpha = [byte]((($maxVal - 30) / 35.0) * 255)
            $rgbValues[$idx + 3] = $alpha
        } else {
            # Inside the tiger face: keep 100% solid!
            $rgbValues[$idx + 3] = 255
        }
    }
}

[System.Runtime.InteropServices.Marshal]::Copy($rgbValues, 0, $ptr, $bytes)
$bmp.UnlockBits($bmpData)
$bmp.Save('c:\keysite\icon_transparent.png', [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Host "Refined flood-fill icon_transparent.png created successfully!"
