import { parsers, produce } from "sub-store-convert"

function loadProducer(target) {
    const t = target.toLowerCase()
    for (const key of Object.keys(produce)) {
        if (key.toLowerCase() === t) {
            return produce[key]
        }
    }
    return null
}

function decodeIfNeed(raw) {
    try {
        return { text: atob(raw), decoded: true }
    } catch {
        return { text: raw, decoded: false }
    }
}

async function loadRemoteData(url) {
    try {
        const { text, decoded } = decodeIfNeed(await (await fetch(url)).text())
        const urls = decoded ? text.split('\n').filter(Boolean) : [text]
        return urls
    } catch (e) {
        console.error(e)
        return []
    }
}



export async function convert(url, target, opts) {
    const producer = loadProducer(target)
    if (!producer) {
        throw new Error(`Unknown target: ${target}`)
    }
    const lines = (await Promise.all(url.split('|').map(loadRemoteData))).flat()
    const proxyList = []
    LINELOOP: for (const line of lines) {
        for (const p of parsers) {
            try {
                if (p.test(line)) {
                    try {
                        const proxy = p.parse(line)
                        proxyList.push({
                            ...proxy,
                            ...opts
                        })
                    } catch (e) {
                        console.error(e)
                    }
                    continue LINELOOP
                }
            } catch (e) {
                console.error(e)
            }
        }
    }

    if (producer.type === 'ALL') {
        return producer.produce(proxyList)
    } else {
        let res = ''
        for (const proxy of proxyList) {
            try {
                res += producer.produce(proxy, proxy.type) + '\n'
            } catch (e) {
                console.error(e)
            }
        }
        return res
    }
}


export default {
    async fetch(request) {
        const uri = new URL(request.url)
        switch (uri.pathname) {
            case "/":
                return new Response(null, {
                    status: 302,
                    headers: {
                        "Location": "https://github.com/TBXark/sub-workers"
                    }
                })
            case "/sub":
                const opts = {}
                uri.searchParams.forEach((value, key) => {
                    opts[key] = value
                })
                const target = opts.target
                const url = opts.url
                if (!target || !url) {
                    return new Response('Missing target or url', { status: 400 })
                }
                delete opts.target
                delete opts.url
                try {
                    const res = await convert(url, target, opts)
                    return new Response(res, { status: 200 })
                } catch (e) {
                    return new Response(e.message, { status: 500 })
                }
            default:
                return new Response('Not Found', { status: 404 })
        }
    }
}