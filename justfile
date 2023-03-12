#set shell := ["zsh"]
#
#set positional-arguments := true
#
##@p:
##  npm version patch -m $1
#foo:
#  echo $0
#  echo $1

set positional-arguments

@p bar:
  npm version patch -m $1

@c bar:
  git commit -am $1
  git push