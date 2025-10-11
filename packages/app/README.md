# sub-workers
 
This is a subscription conversion service driven by [sub-store-convert](https://github.com/TBXark/sub-store-convert) and compatible with the [subconverter](https://github.com/tindy2013/subconverter) API, running on Cloudflare Worker.

## Deploy
```shell
yarn && yarn run deploy
```

## Example
```python
requests.get(
    url="https://sub-workers.tbxark.workers.dev/sub",
    params={
        "target": "surge",
        "url": "https://raw.githubusercontent.com/freefq/free/master/v2",
        # Other parameters will be directly passed to the converter.
    },
)
```

## LICENSE
**sub-workers** is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.