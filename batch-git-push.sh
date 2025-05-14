#!/bin/bash

# Configuration
BATCH_SIZE=50  # Number of files to commit in each batch
REPO_PATH="."  # Path to your repository, default is current directory
COMMIT_MSG_PREFIX="Batch commit"  # Prefix for commit messages

# Change to repository directory
cd "$REPO_PATH" || { echo "Error: Could not change to repository directory"; exit 1; }

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo "Error: Not in a git repository"
    exit 1
fi

# Get list of all untracked and modified files
FILES_TO_ADD=$(git ls-files --others --modified --exclude-standard)

# Count total files
TOTAL_FILES=$(echo "$FILES_TO_ADD" | wc -l)
echo "Found $TOTAL_FILES files to commit"

# If no files to commit, exit
if [ "$TOTAL_FILES" -eq 0 ]; then
    echo "No files to commit. Exiting."
    exit 0
fi

# Initialize counter
COUNTER=0
BATCH_COUNTER=1
BATCH_FILES=""

# Process files in batches
echo "$FILES_TO_ADD" | while read -r FILE; do
    # Skip empty lines
    [ -z "$FILE" ] && continue
    
    # Add file to the batch
    BATCH_FILES="$BATCH_FILES \"$FILE\""
    COUNTER=$((COUNTER + 1))
    
    # If we reached batch size or it's the last file, commit the batch
    if [ $COUNTER -eq $BATCH_SIZE ] || [ $COUNTER -eq $TOTAL_FILES ]; then
        echo "Processing batch $BATCH_COUNTER ($COUNTER files)"
        
        # Add files to staging
        eval "git add $BATCH_FILES"
        
        # Commit batch
        git commit -m "$COMMIT_MSG_PREFIX $BATCH_COUNTER of $((TOTAL_FILES / BATCH_SIZE + 1))"
        
        echo "Committed batch $BATCH_COUNTER"
        
        # Push this batch if you want to push after each batch
        # Comment out if you prefer to push all batches at once
        git push
        echo "Pushed batch $BATCH_COUNTER"
        
        # Reset counters and batch files for next batch
        BATCH_COUNTER=$((BATCH_COUNTER + 1))
        COUNTER=0
        BATCH_FILES=""
    fi
done

# Final push if you commented out the per-batch push
# git push
echo "All batches processed and pushed successfully"