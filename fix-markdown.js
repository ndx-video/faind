#!/usr/bin/env node

/**
 * Markdown Linting Fix Script for fAInd Project
 * 
 * This script automatically fixes common markdown linting issues across all .md files
 * in the project. It addresses issues like missing blank lines, heading spacing,
 * list formatting, and other markdownlint violations.
 * 
 * Usage: node fix-markdown.js
 * 
 * The script will:
 * 1. Find all .md files in the project
 * 2. Apply common markdown fixes
 * 3. Report what was fixed
 * 4. Create backups of modified files
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BACKUP_SUFFIX = '.backup';
const EXCLUDED_DIRS = ['node_modules', '.git', 'dist', 'build', 'release'];

/**
 * Recursively find all .md files in the project
 */
function findMarkdownFiles(dir = '.', files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip excluded directories
      if (!EXCLUDED_DIRS.includes(entry.name)) {
        findMarkdownFiles(fullPath, files);
      }
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Apply markdown fixes to content
 */
function fixMarkdownContent(content, filename) {
  let fixed = content;
  const fixes = [];
  
  // Split into lines for processing
  let lines = fixed.split('\n');
  
  // Fix 1: MD022 - Headings should be surrounded by blank lines
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isHeading = /^#{1,6}\s/.test(line);
    
    if (isHeading) {
      // Check if previous line needs a blank line
      if (i > 0 && lines[i - 1].trim() !== '' && !lines[i - 1].startsWith('#')) {
        lines.splice(i, 0, '');
        fixes.push(`Added blank line before heading: "${line.substring(0, 50)}..."`);
        i++; // Adjust index after insertion
      }
      
      // Check if next line needs a blank line
      if (i < lines.length - 1 && lines[i + 1].trim() !== '' && !lines[i + 1].startsWith('#')) {
        lines.splice(i + 1, 0, '');
        fixes.push(`Added blank line after heading: "${line.substring(0, 50)}..."`);
      }
    }
  }
  
  // Fix 2: MD032 - Lists should be surrounded by blank lines
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isListItem = /^[\s]*[-*+]\s/.test(line) || /^[\s]*\d+\.\s/.test(line);
    
    if (isListItem) {
      // Check if this is the start of a list
      const prevLine = i > 0 ? lines[i - 1] : '';
      const isPrevListItem = /^[\s]*[-*+]\s/.test(prevLine) || /^[\s]*\d+\.\s/.test(prevLine);
      
      if (!isPrevListItem && prevLine.trim() !== '') {
        lines.splice(i, 0, '');
        fixes.push(`Added blank line before list starting with: "${line.trim().substring(0, 30)}..."`);
        i++; // Adjust index after insertion
      }
      
      // Check if this is the end of a list
      const nextLine = i < lines.length - 1 ? lines[i + 1] : '';
      const isNextListItem = /^[\s]*[-*+]\s/.test(nextLine) || /^[\s]*\d+\.\s/.test(nextLine);
      
      if (!isNextListItem && nextLine.trim() !== '' && !nextLine.startsWith('#')) {
        lines.splice(i + 1, 0, '');
        fixes.push(`Added blank line after list ending with: "${line.trim().substring(0, 30)}..."`);
      }
    }
  }
  
  // Fix 3: MD031 - Fenced code blocks should be surrounded by blank lines
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isCodeFence = /^```/.test(line);
    
    if (isCodeFence) {
      // Check if previous line needs a blank line
      if (i > 0 && lines[i - 1].trim() !== '') {
        lines.splice(i, 0, '');
        fixes.push(`Added blank line before code fence`);
        i++; // Adjust index after insertion
      }
      
      // Find the closing fence
      let closingFenceIndex = -1;
      for (let j = i + 1; j < lines.length; j++) {
        if (/^```/.test(lines[j])) {
          closingFenceIndex = j;
          break;
        }
      }
      
      // Check if next line after closing fence needs a blank line
      if (closingFenceIndex !== -1 && closingFenceIndex < lines.length - 1) {
        if (lines[closingFenceIndex + 1].trim() !== '') {
          lines.splice(closingFenceIndex + 1, 0, '');
          fixes.push(`Added blank line after code fence`);
        }
      }
    }
  }
  
  // Fix 4: MD040 - Fenced code blocks should have a language specified
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^```\s*$/.test(line)) {
      // Check if this looks like a code block that should have a language
      const nextFewLines = lines.slice(i + 1, i + 4).join('\n');
      
      // Simple heuristics to detect language
      let language = '';
      if (nextFewLines.includes('function ') || nextFewLines.includes('const ') || nextFewLines.includes('npm ')) {
        language = 'javascript';
      } else if (nextFewLines.includes('cd ') || nextFewLines.includes('git ') || nextFewLines.includes('npm ')) {
        language = 'bash';
      } else if (nextFewLines.includes('interface ') || nextFewLines.includes('type ')) {
        language = 'typescript';
      } else if (nextFewLines.includes('{') && nextFewLines.includes('}')) {
        language = 'json';
      }
      
      if (language) {
        lines[i] = `\`\`\`${language}`;
        fixes.push(`Added language '${language}' to code fence`);
      }
    }
  }
  
  // Fix 5: MD025 - Multiple top level headings
  let hasTopLevelHeading = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^#\s/.test(line)) {
      if (hasTopLevelHeading) {
        lines[i] = '#' + line; // Convert to ## heading
        fixes.push(`Converted duplicate top-level heading to second-level: "${line.substring(0, 50)}..."`);
      } else {
        hasTopLevelHeading = true;
      }
    }
  }
  
  // Fix 6: Remove trailing whitespace (MD009)
  for (let i = 0; i < lines.length; i++) {
    const originalLine = lines[i];
    const trimmedLine = originalLine.replace(/\s+$/, '');
    if (originalLine !== trimmedLine) {
      lines[i] = trimmedLine;
      fixes.push(`Removed trailing whitespace from line ${i + 1}`);
    }
  }
  
  // Fix 7: Ensure file ends with newline (MD047)
  const joinedContent = lines.join('\n');
  if (!joinedContent.endsWith('\n')) {
    fixes.push(`Added final newline to file`);
    return { content: joinedContent + '\n', fixes };
  }
  
  return { content: joinedContent, fixes };
}

/**
 * Create a backup of the original file
 */
function createBackup(filePath) {
  const backupPath = filePath + BACKUP_SUFFIX;
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(filePath, backupPath);
    return true;
  }
  return false;
}

/**
 * Process a single markdown file
 */
function processMarkdownFile(filePath) {
  console.log(`\n📝 Processing: ${filePath}`);
  
  try {
    const originalContent = fs.readFileSync(filePath, 'utf8');
    const { content: fixedContent, fixes } = fixMarkdownContent(originalContent, filePath);
    
    if (fixes.length > 0) {
      // Create backup before modifying
      const backupCreated = createBackup(filePath);
      if (backupCreated) {
        console.log(`   💾 Created backup: ${filePath}${BACKUP_SUFFIX}`);
      }
      
      // Write fixed content
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      
      console.log(`   ✅ Applied ${fixes.length} fixes:`);
      fixes.forEach(fix => console.log(`      • ${fix}`));
    } else {
      console.log(`   ✨ No fixes needed - file is already compliant`);
    }
    
    return { processed: true, fixes: fixes.length };
  } catch (error) {
    console.error(`   ❌ Error processing file: ${error.message}`);
    return { processed: false, fixes: 0 };
  }
}

/**
 * Main function
 */
function main() {
  console.log('🔧 fAInd Markdown Linting Fix Script');
  console.log('=====================================\n');
  
  // Find all markdown files
  const markdownFiles = findMarkdownFiles();
  console.log(`📋 Found ${markdownFiles.length} markdown files to process:`);
  markdownFiles.forEach(file => console.log(`   • ${file}`));
  
  if (markdownFiles.length === 0) {
    console.log('❌ No markdown files found!');
    return;
  }
  
  // Process each file
  let totalProcessed = 0;
  let totalFixes = 0;
  
  for (const file of markdownFiles) {
    const result = processMarkdownFile(file);
    if (result.processed) {
      totalProcessed++;
      totalFixes += result.fixes;
    }
  }
  
  // Summary
  console.log('\n📊 Summary');
  console.log('===========');
  console.log(`Files processed: ${totalProcessed}/${markdownFiles.length}`);
  console.log(`Total fixes applied: ${totalFixes}`);
  
  if (totalFixes > 0) {
    console.log('\n💡 Tips:');
    console.log('   • Backup files were created with .backup extension');
    console.log('   • Review changes before committing');
    console.log('   • Run this script after major markdown edits');
    console.log('   • Consider setting up markdownlint in your editor');
  }
  
  console.log('\n✅ Markdown linting fixes complete!');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { findMarkdownFiles, fixMarkdownContent, processMarkdownFile };
