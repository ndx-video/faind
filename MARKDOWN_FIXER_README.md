# Markdown Linting Fix Script

## Overview

The `fix-markdown.js` script automatically fixes common markdown linting issues across all `.md` files in the fAInd project. This ensures consistent documentation formatting and compliance with markdownlint standards.

## Quick Start

```bash

## Run the fixer

npm run fix-markdown

## Clean up backup files after reviewing changes

npm run clean-backups

```

## What Gets Fixed

### Automatically Fixed Issues

- **MD022**: Missing blank lines around headings
- **MD032**: Missing blank lines around lists
- **MD031**: Missing blank lines around fenced code blocks
- **MD040**: Missing language specifications in code fences
- **MD025**: Multiple top-level headings (converts to second-level)
- **MD009**: Trailing whitespace
- **MD047**: Missing final newline

### Example Fixes

**Before:**

```markdown

## Heading

- List item 1
- List item 2

Next paragraph without spacing

```javascript

code without language

```

```

**After:**

```markdown

## Heading

- List item 1
- List item 2

Next paragraph without spacing

```javascript

code without language

```

```

## Features

### Safety First

- **Automatic Backups**: Creates `.backup` files before making changes
- **Non-Destructive**: Original files are preserved
- **Detailed Reporting**: Shows exactly what was fixed

### Smart Detection

- **Language Detection**: Automatically detects code block languages
- **Context Awareness**: Understands markdown structure
- **Comprehensive Scanning**: Processes all `.md` files in the project

### Cross-Platform

- **Windows Compatible**: Works with PowerShell and Command Prompt
- **Unix Compatible**: Works on macOS and Linux
- **Node.js Based**: Runs anywhere Node.js is installed

## Usage Scenarios

### After Major Documentation Edits

```bash

## Make your documentation changes
## Then run the fixer

npm run fix-markdown

```

### Before Committing Changes

```bash

## Ensure clean markdown before version control

npm run fix-markdown
git add .
git commit -m "Update documentation"

```

### Regular Maintenance

```bash

## Periodic cleanup of all documentation

npm run fix-markdown
npm run clean-backups

```

## Output Example

```

🔧 fAInd Markdown Linting Fix Script
=====================================

📋 Found 7 markdown files to process:
   • README.md
   • AGENTIC_GUIDE.md
   • PROJECT_PLAN.md
   • ...

📝 Processing: README.md
   💾 Created backup: README.md.backup
   ✅ Applied 25 fixes:
      • Added blank line before heading: "## Key Features"
      • Added language 'bash' to code fence
      • Removed trailing whitespace from line 45
      • ...

📊 Summary
===========
Files processed: 7/7
Total fixes applied: 387

```

## Configuration

The script includes sensible defaults but can be customized by editing `fix-markdown.js`:

### Excluded Directories

```javascript

const EXCLUDED_DIRS = ['node_modules', '.git', 'dist', 'build', 'release'];

```

### Backup Suffix

```javascript

const BACKUP_SUFFIX = '.backup';

```

## Troubleshooting

### Common Issues

**Script not found:**

```bash

## Make sure you're in the project root

cd /path/to/faind
npm run fix-markdown

```

**Permission errors:**

```bash

## On Unix systems, you might need to make the script executable

chmod +x fix-markdown.js

```

**Backup files accumulating:**

```bash

## Clean up backup files regularly

npm run clean-backups

```

### Manual Cleanup

If you need to manually clean backup files:

```bash

## Windows

del /s *.backup

## Unix/macOS/Linux

find . -name "*.backup" -type f -delete

```

## Integration with Development Workflow

### Pre-commit Hook (Optional)

Add to `.git/hooks/pre-commit`:

```bash

#!/bin/sh
npm run fix-markdown
git add *.md

```

### VS Code Integration

Add to `.vscode/tasks.json`:

```json

{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Fix Markdown",
      "type": "shell",
      "command": "npm",
      "args": ["run", "fix-markdown"],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    }
  ]
}

```

## Best Practices

### When to Run

- After creating new markdown files
- Before committing documentation changes
- After major content edits
- During regular maintenance

### Review Changes

- Always review the backup files to understand what changed
- Check that the fixes make sense in context
- Verify that code blocks have appropriate languages

### Backup Management

- Keep backups until you're satisfied with changes
- Clean up backups regularly to avoid clutter
- Consider the backups as a safety net, not permanent storage

## Contributing

If you find markdown patterns that should be fixed automatically:

1. Add the fix logic to `fixMarkdownContent()` function
2. Test with various markdown files
3. Update this documentation
4. Submit a pull request

## Related Tools

- **markdownlint**: The linting standard this script addresses
- **prettier**: For general code formatting
- **eslint**: For JavaScript/TypeScript linting
- **VS Code markdownlint extension**: Real-time linting in editor

---

This script is part of the fAInd project's commitment to high-quality documentation and developer experience.
