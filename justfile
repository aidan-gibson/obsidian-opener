# note: shell won't yell at me if commit msg too long.
set positional-arguments

@p bar:
  npm version patch -m "$1"

@c bar:
  git commit -am "$1"
  git push