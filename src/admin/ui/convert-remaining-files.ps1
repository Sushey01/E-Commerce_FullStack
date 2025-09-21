# PowerShell script to convert remaining admin UI files from Next.js to React
# Run this from the src/admin/ui directory

$files = @(
    "input-otp.tsx",
    "menubar.tsx", 
    "popover.tsx",
    "progress.tsx",
    "radio-group.tsx",
    "resizable.tsx",
    "scroll-area.tsx",
    "select.tsx",
    "separator.tsx",
    "sheet.tsx",
    "sidebar.tsx",
    "slider.tsx",
    "sonner.tsx",
    "switch.tsx",
    "table.tsx",
    "tabs.tsx",
    "toast.tsx",
    "toaster.tsx",
    "toggle-group.tsx",
    "toggle.tsx",
    "tooltip.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Processing $file..."
        
        # Read the file content
        $content = Get-Content $file -Raw
        
        # Remove 'use client' directive
        $content = $content -replace "'use client'\r?\n\r?\n", ""
        
        # Replace Next.js import paths with relative paths
        $content = $content -replace "@/lib/utils", "../lib/utils"
        $content = $content -replace "@/components/ui/([^'""]+)", "./$1"
        
        # Write back to file
        Set-Content $file $content -NoNewline
        
        Write-Host "✓ Converted $file"
    } else {
        Write-Host "⚠ File $file not found"
    }
}

Write-Host "Conversion complete!"