# sub-workers
 
This is a subscription conversion service driven by [sub-store-convert](https://github.com/TBXark/sub-store-convert) and compatible with the [subconverter](https://github.com/tindy2013/subconverter) API, running on Cloudflare Worker or other serverless platforms.

## Deploy
```shell
pnpm deploy
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