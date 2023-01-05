
```shell
npm i --save-dev arc-plugin-lightningcss
```

```bash
#...

@plugins
arc-plugin-lightningcss

# optional config
@lightningcss
targets '>= 0.25%' # default
input src/css/style.css # default
output public/style.css # default
```

```bash
# add output to your .gitignore
public/style.css
```
