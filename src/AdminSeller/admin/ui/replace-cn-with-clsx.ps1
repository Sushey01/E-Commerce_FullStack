# PowerShell script to replace cn with clsx in all admin UI files
# Run this from the src/admin/ui directory

Write-Host "Converting all UI components to use clsx instead of cn function..."

$files = Get-ChildItem -Name "*.tsx"

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Processing $file..."
        
        # Read the file content
        $content = Get-Content $file -Raw
        
        # Replace import statement
        $content = $content -replace 'import { cn } from "\.\./lib/utils";', 'import clsx from "clsx";'
        $content = $content -replace "import { cn } from '\.\./lib/utils';", "import clsx from 'clsx';"
        $content = $content -replace 'import { cn } from "@/lib/utils";', 'import clsx from "clsx";'
        $content = $content -replace "import { cn } from '@/lib/utils';", "import clsx from 'clsx';"
        
        # Replace cn( with clsx(
        $content = $content -replace '\bcn\(', 'clsx('
        
        # Write back to file
        Set-Content $file $content -NoNewline
        
        Write-Host "✓ Converted $file"
    }
}

Write-Host "✅ All files converted to use clsx instead of cn!"
Write-Host ""
Write-Host "📝 You can now delete the utils.js file as it's no longer needed."