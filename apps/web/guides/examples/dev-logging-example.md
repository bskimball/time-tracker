# Development Logging Example

In development mode, logs are now written to **both console and file** for the best debugging experience.

## What You Get

### Console Output (Pretty Print)

When you run `npm run dev`, you'll see colored, formatted logs in your terminal:

```
[15:30:45] INFO  (req-id: abc123): Loading dashboard
[15:30:45] DEBUG (req-id: abc123): Users loaded
  count: 42
  duration: 23.45ms
```

### File Output (JSON)

Simultaneously, all logs are written to `logs/dev.log` in JSON format:

```json
{"level":"info","time":"2025-01-16T15:30:45.123Z","requestId":"abc123","method":"GET","path":"/dashboard","msg":"Loading dashboard"}
{"level":"debug","time":"2025-01-16T15:30:45.167Z","requestId":"abc123","count":42,"duration":"23.45ms","msg":"Users loaded"}
```

## Why Both?

### Console (Pretty Print)

- **Quick scanning** - Easy to read during development
- **Color coding** - Error = red, warn = yellow, info = green
- **Formatted output** - Human-friendly timestamps and structure

### File (JSON)

- **Persistence** - Logs survive server restarts
- **Searchability** - Easy to grep/search for specific requests
- **Debugging** - Review logs from earlier in your dev session
- **Analysis** - Can be imported into log viewers or analyzed with tools

## Common Use Cases

### 1. Debug an Issue After the Fact

You encountered an error 10 minutes ago but didn't note the details:

```bash
# Search the dev.log for the error
cat logs/dev.log | grep '"level":"error"' | tail -5
```

### 2. Track a Specific Request Flow

You want to see all logs for a specific request:

```bash
# First, get the requestId from console or log
# Then search for all logs with that ID
cat logs/dev.log | grep '"requestId":"abc-123-def"'
```

### 3. Compare Performance Across Sessions

You made a change and want to compare performance:

```bash
# Before changes
cat logs/dev.log | grep '"operation":"fetch-analytics"'

# Make your changes, restart server

# After changes - compare durations
cat logs/dev.log | grep '"operation":"fetch-analytics"' | tail -1
```

### 4. Share Debug Info

You need to share logs with a team member:

```bash
# Extract last 100 lines
tail -100 logs/dev.log > debug-info.json

# Or filter to specific operation
cat logs/dev.log | grep '"path":"/employees"' > employee-debug.json
```

## Managing Development Logs

### Clear Old Logs

Development logs don't auto-rotate, so clear them periodically:

```bash
# Clear the log file
rm logs/dev.log

# Or truncate it (keeps the file but empties it)
> logs/dev.log
```

### Watch Logs in Real-Time

If you prefer file-based log viewing:

```bash
# In another terminal, watch logs as they come in
tail -f logs/dev.log

# Pretty-print JSON logs with jq (if installed)
tail -f logs/dev.log | jq '.'
```

### Filter Specific Log Levels

```bash
# Only errors
cat logs/dev.log | grep '"level":"error"'

# Only info and above (exclude debug)
cat logs/dev.log | grep -E '"level":"(info|warn|error)"'

# Specific component
cat logs/dev.log | grep '"component":"prisma"'
```

## Example Session

Start your dev server:

```bash
npm run dev
```

**Console shows:**

```
[10:15:23] INFO  (req-id: a1b2): Server running on http://localhost:5173
[10:15:30] INFO  (req-id: c3d4): Loading dashboard
[10:15:30] DEBUG (req-id: c3d4): Database query
  query: "SELECT * FROM Employee"
  duration: 12.34ms
[10:15:31] ERROR (req-id: c3d4): Failed to load employee 999
  error: "Employee not found"
```

**Meanwhile, `logs/dev.log` contains:**

```json
{"level":"info","time":"2025-01-16T10:15:23.000Z","app":"shift-pulse","msg":"Server running on http://localhost:5173"}
{"level":"info","time":"2025-01-16T10:15:30.000Z","requestId":"c3d4","method":"GET","path":"/dashboard","msg":"Loading dashboard"}
{"level":"debug","time":"2025-01-16T10:15:30.234Z","requestId":"c3d4","component":"prisma","query":"SELECT * FROM Employee","duration":"12.34ms","msg":"Database query"}
{"level":"error","time":"2025-01-16T10:15:31.000Z","requestId":"c3d4","err":{"type":"NotFoundError","message":"Employee not found"},"msg":"Failed to load employee 999"}
```

Now you can search, analyze, or share these logs as needed!

## Tips

1. **Git ignore** - `logs/` is already in `.gitignore`, so dev logs won't be committed
2. **Disk space** - If `dev.log` gets large, just delete it: `rm logs/dev.log`
3. **JSON tools** - Use `jq` for pretty JSON viewing: `cat logs/dev.log | jq '.'`
4. **Search patterns** - Save useful grep patterns as bash aliases or scripts

## Comparison: Development vs Production

| Feature | Development                  | Production               |
| ------- | ---------------------------- | ------------------------ |
| Console | Pretty print (colored)       | Warnings only            |
| File    | `logs/dev.log` (no rotation) | `logs/app.log` (rotated) |
| Format  | Console: Pretty, File: JSON  | JSON only                |
| Level   | Debug (all logs)             | Info (filtered)          |
| Queries | Logged by default            | Disabled by default      |

This gives you the best of both worlds in development! 🎉
