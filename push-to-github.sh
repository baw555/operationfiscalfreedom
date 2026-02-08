#!/bin/bash
git remote remove github 2>/dev/null
git remote add github https://${GITHUB_PERSONAL_ACCESS_TOKEN}@github.com/baw555/operationfiscalfreedom.git
git add -A
git commit -m "Security hardening, rate limiting, load resilience, bug fixes" 2>/dev/null || echo "Nothing new to commit"
git push github main
echo ""
echo "Done! Check https://github.com/baw555/operationfiscalfreedom"
