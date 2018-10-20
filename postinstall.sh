#!/bin/sh

DIRECTORY=.git/hooks

if [ -d "$DIRECTORY" ]; then
  # Control will enter here if $DIRECTORY exists.
  ln -Fs ../../git-hooks/pre-commit.sh $DIRECTORY/pre-commit && chmod +x $DIRECTORY/pre-commit
fi
