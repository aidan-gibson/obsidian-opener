# note: shell won't yell at me if commit msg too long.

set positional-arguments

# publish
@p bar:
  npm version patch -m "$1"
  git push origin --tags

# commit
@c bar:
  git commit -am "$1"
  git push