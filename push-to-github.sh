#!/bin/bash
git remote remove github 2>/dev/null
git remote add github https://${GITHUB_PERSONAL_ACCESS_TOKEN}@github.com/baw555/operationfiscalfreedom.git
git rm --cached client/public/videos/soldiers-marching-new.mp4 2>/dev/null
git add -A
git commit -m "Security hardening, rate limiting, load resilience, bug fixes" 2>/dev/null || echo "Nothing new to commit"
git push --force github main
echo ""
echo "Done! Check https://github.com/baw555/operationfiscalfreedom"
