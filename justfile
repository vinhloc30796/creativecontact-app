# Print diff, two choices: either staged, or main..HEAD; if diff, log to diff-staged.log; if main, log to diff-main.log
# List all commands
default:
    just --list

# Generate git diff logs - either for staged changes or against main branch
[group('git')]
diff choice="staged":
    #!/usr/bin/env bash
    if [ "{{choice}}" = "staged" ]; then
        git diff --staged --output=diff-staged.diff
        echo "Diff logged to diff-staged.diff"
    elif [ "{{choice}}" = "main" ]; then
        git diff main..HEAD --output=diff-main.diff
        echo "Diff logged to diff-main.diff"
    else
        echo "Invalid choice. Use 'staged' or 'main'."
        exit 1
    fi

# Add the directory tree to .notes/directory_structure.md, prefixed by datetime, dynamically accounting for whatever's in .gitignore
[group('notes')]
tree directory=".":
    #!/usr/bin/env bash
    # Add timestamp header
    echo "Generated on $(date '+%Y-%m-%d %H:%M:%S')" > .notes/directory_structure.tree
    git ls-files {{directory}} | tree --fromfile >> .notes/directory_structure.tree
    echo "Exported to .notes/directory_structure.tree"

# Connect to the database
[group('db')]
db:
    psql postgresql://postgres:postgres@127.0.0.1:54322/postgres
