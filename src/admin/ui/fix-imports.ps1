#!/usr/bin/env powershell

# Fix all admin UI components to use clsx instead of cn
$ErrorActionPreference = "Continue"

Write-Host "🔧 Fixing admin UI components..." -ForegroundColor Green

$files = Get-ChildItem -Name "*.tsx"

foreach ($file in $files) {
    try {
        Write-Host "Processing $file..." -ForegroundColor Yellow
        
        $content = Get-Content $file -Raw
        
        # Replace cn import with clsx import
        $content = $content -replace 'import \{ cn \} from ["'']\.\.\/lib\/utils["''];?', 'import clsx from "clsx";'
        $content = $content -replace 'import \{ cn \} from ["'']@\/lib\/utils["''];?', 'import clsx from "clsx";'
        
        # Replace cn usage with clsx
        $content = $content -replace '\bcn\(', 'clsx('
        
        # Write back
        $content | Set-Content $file -NoNewline
        
        Write-Host "✅ Fixed $file" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Error processing $file`: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎉 All files processed!" -ForegroundColor Green
Write-Host "📝 You can now delete the utils.js file" -ForegroundColor Cyan