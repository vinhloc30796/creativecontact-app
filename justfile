# Default: List the commands in the justfile
[group('default')]
default:
    @just --list

# Print diff, two choices: either staged, or main..HEAD; if diff, log to diff-staged.log; if main, log to diff-main.log
[group('git')]
diff choice="staged":
    #!/usr/bin/env bash
    if [ "{{choice}}" = "staged" ]; then
        git diff --staged > diff-staged.log
        echo "Diff logged to diff-staged.log"
    elif [ "{{choice}}" = "main" ]; then
        git diff main..HEAD > diff-main.log
        echo "Diff logged to diff-main.log"
    else
        echo "Invalid choice. Use 'staged' or 'main'."
        exit 1
    fi

# Connect to the database
[group('db')]
db:
    psql postgresql://postgres:postgres@127.0.0.1:54322/postgres

# Add the directory tree to .notes/directory_structure.md, prefixed by datetime, dynamically accounting for whatever's in .gitignore
[group('notes')]
tree directory=".":
    #!/usr/bin/env bash
    # Convert .gitignore patterns to tree exclude pattern
    ignore_patterns=$(grep -v '^#' .gitignore | \
                        grep -v '^$' | \
                        sed 's/\*\*\///' | \
                        sed 's/\/\*\*/\*/' | \
                        sed 's/^\///' | \
                        tr '\n' '|' | \
                        sed 's/|$//')

    # Add timestamp header
    echo "Generated on $(date '+%Y-%m-%d %H:%M:%S')" > .notes/directory_structure.md

    # If .gitignore exists and has patterns, run tree with exclusions
    if [ -f .gitignore ] && [ ! -z "$ignore_patterns" ]; then
        tree -I "$ignore_patterns" -- {{directory}} >> .notes/directory_structure.md
    else
        tree -- {{directory}} >> .notes/directory_structure.md
    fi