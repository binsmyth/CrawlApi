#from website https://panjeh.medium.com/makefile-git-add-commit-push-github-all-in-one-command-9dcf76220f48
git:
	git add .
	git commit -m "$m"
	git push -u origin main