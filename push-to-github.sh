#!/bin/bash
git remote add github https://baw555:${GITHUB_PERSONAL_ACCESS_TOKEN}@github.com/baw555/operationfiscalfreedom.git 2>/dev/null
git push github main
echo ""
echo "Done! Check https://github.com/baw555/operationfiscalfreedom"
