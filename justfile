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

# Print out the tree of the project, ignoring files mentioned in .gitignore
[group('tree')]
tree:
    tree -I 'node_modules|dist|build|out|target|target-*'
