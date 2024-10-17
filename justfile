# Print diff, two choices: either staged, or main..HEAD
# if diff, log to diff-staged.log
# if main, log to diff-main.log
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