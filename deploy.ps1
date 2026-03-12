# Quick Deploy Script for Hustle Planner
# This pushes your changes to GitHub and triggers automatic deployment

Write-Host "🚀 Hustle Planner - Quick Deploy" -ForegroundColor Magenta
Write-Host "=================================" -ForegroundColor Magenta
Write-Host ""

# Check if there are changes
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "✅ No changes to deploy. Everything is up to date!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your site is live at:" -ForegroundColor Cyan
    Write-Host "https://wettentllc.github.io/Hustle-Planner/" -ForegroundColor Yellow
    exit
}

Write-Host "📝 Changes detected:" -ForegroundColor Yellow
git status --short
Write-Host ""

# Ask for commit message
$message = Read-Host "Enter a commit message (or press Enter for default)"
if ([string]::IsNullOrWhiteSpace($message)) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
    $message = "Update: $timestamp"
}

Write-Host ""
Write-Host "📦 Adding all changes..." -ForegroundColor Cyan
git add .

Write-Host "💾 Committing with message: $message" -ForegroundColor Cyan
git commit -m $message

Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Cyan
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Successfully deployed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "⏱️  Your changes will be live in about 5 minutes at:" -ForegroundColor Cyan
    Write-Host "   https://wettentllc.github.io/Hustle-Planner/" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📊 Check deployment status:" -ForegroundColor Cyan
    Write-Host "   https://github.com/WETTENTLLC/Hustle-Planner/actions" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Push failed! Check the error above." -ForegroundColor Red
    Write-Host ""
}

Write-Host "Press any key to close..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
