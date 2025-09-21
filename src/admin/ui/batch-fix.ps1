$files = @(
    "alert-dialog.tsx", "alert.tsx", "avatar.tsx", "badge.tsx", "calendar.tsx",
    "card.tsx", "carousel.tsx", "chart.tsx", "checkbox.tsx", "command.tsx",
    "context-menu.tsx", "dialog.tsx", "drawer.tsx", "dropdown-menu.tsx",
    "form.tsx", "hover-card.tsx", "input-otp.tsx", "input.tsx", "label.tsx",
    "menubar.tsx", "navigation-menu.tsx", "pagination.tsx", "popover.tsx",
    "progress.tsx", "radio-group.tsx", "resizable.tsx", "scroll-area.tsx",
    "select.tsx", "separator.tsx", "sheet.tsx", "sidebar.tsx", "skeleton.tsx",
    "slider.tsx", "switch.tsx", "table.tsx", "tabs.tsx", "textarea.tsx",
    "toast.tsx", "toggle-group.tsx", "toggle.tsx", "tooltip.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Processing $file..."
        $content = Get-Content $file -Raw
        $content = $content -replace 'import \{ cn \} from [\"'']\.\.\/lib\/utils[\"''];?', 'import clsx from "clsx";'
        $content = $content -replace '\bcn\(', 'clsx('
        $content | Set-Content $file -NoNewline
        Write-Host "✓ Fixed $file"
    }
}