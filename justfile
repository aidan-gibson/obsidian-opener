# note: shell won't yell at me if commit msg too long.

set positional-arguments

# publish
@p bar:
  npm version patch -m "$1"
  git push origin --tags
# also need to modify manifest.json to reflect version. TODO fig out automating
# commit
@c bar:
  git commit -am "$1"
  git push

# build (other plugins won't need the app reboot, but ones with monkeypatch should
@b:
  npm run build
  osascript -e 'quit app "Obsidian"'
  sleep 1
  open -a Obsidian