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

# Test GitHub Actions workflows locally using Act
[group('github-actions')]
act workflow="db-migrations" event="workflow_dispatch" secrets=".env.local" dryrun="true" job="":
    #!/usr/bin/env bash
    echo "Testing workflow: {{workflow}}.yml with event: {{event}}"
    
    # Create event file directory if it doesn't exist
    mkdir -p .github/workflows/test-events
    
    # Create a basic event file if it doesn't exist
    if [ ! -f ".github/workflows/test-events/{{workflow}}.{{event}}.json" ]; then
        echo '{
          "action": "{{event}}",
          "inputs": {}
        }' > .github/workflows/test-events/{{workflow}}.{{event}}.json
        echo "Created event file: .github/workflows/test-events/{{workflow}}.{{event}}.json"
    fi
    
    # Build the command with optional job parameter
    CMD="act {{event}} -W .github/workflows/{{workflow}}.yml -e .github/workflows/test-events/{{workflow}}.{{event}}.json --secret-file {{secrets}}"
    
    # Add job parameter if specified
    if [ -n "{{job}}" ]; then
        CMD="$CMD -j {{job}}"
    fi
    
    # Add dryrun flag if enabled
    if [ "{{dryrun}}" = "true" ]; then
        CMD="$CMD --dryrun"
    fi
    
    # Execute the command
    echo "Running: $CMD"
    eval $CMD