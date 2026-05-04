# CLAUDE.md - Project Context

## Git Auto Sync Workflow

### Trigger
When user inputs short commands like:
- "同步作品集" / "sync portfolio"
- "更新 Git" / "update git"
- "上传最新照片" / "upload latest photos"

### Execution Logic
1. Check local file changes in the photo-portfolio project
2. Auto-execute `git add .`
3. Generate a clean, Vogue-style or professional commit message:
   - For new photos: `chore(gallery): add new [category]`
   - For code changes: `design: update [component]` or `fix: resolve [issue]`
4. Push to remote main branch

### Interaction
Before pushing, show:
- Generated commit message
- File summary to be pushed

Wait for user confirmation, then complete the full flow.

---

## Navigation

- Local: http://localhost:4322
- Pages: `/portraits`, `/landscapes`, `/street`