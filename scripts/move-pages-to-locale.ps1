# PowerShell script to move pages from src/app/ to src/app/[locale]/
# This script moves all page directories and files except special Next.js files

$rootAppDir = "src\app"
$localeDir = "src\app\[locale]"

# Files and directories to keep at root level
$keepAtRoot = @(
    "layout.tsx",
    "not-found.tsx",
    "error.tsx",
    "500.tsx",
    "offline.tsx",
    "[locale]",
    "providers.tsx"
)

Write-Host "Starting migration of pages to [locale] folder..." -ForegroundColor Green

# Get all items in src/app
$items = Get-ChildItem -Path $rootAppDir -Directory

foreach ($item in $items) {
    $itemName = $item.Name
    
    # Skip if it should stay at root
    if ($keepAtRoot -contains $itemName) {
        Write-Host "Skipping $itemName (kept at root)" -ForegroundColor Yellow
        continue
    }
    
    $sourcePath = Join-Path $rootAppDir $itemName
    $destPath = Join-Path $localeDir $itemName
    
    # Check if destination already exists
    if (Test-Path $destPath) {
        Write-Host "Warning: $destPath already exists. Skipping..." -ForegroundColor Red
        continue
    }
    
    Write-Host "Moving $itemName to [locale] folder..." -ForegroundColor Cyan
    Move-Item -Path $sourcePath -Destination $destPath -Force
    Write-Host "✓ Moved $itemName" -ForegroundColor Green
}

Write-Host "`nMigration complete!" -ForegroundColor Green
Write-Host "Please review the changes and test your application." -ForegroundColor Yellow
