#zenstorecli

zenstorecli is the CLI for [zenstore](https://github.com/johannesboyne/zenstore). And it is very easy to use:

```
usage:

    zenstorecli --store [json string] --at [zenstore url + ID-Hash]

        Store the json string at the specified zenstore url

    zenstorecli --follow [zenlink name] --at [zenstore url]

        Follow a named zenstore

    cat my.json | zenstorecli --pipe true --at [zenstore url + ID-Hash]

        Pipe a data stream to zenstore
```
