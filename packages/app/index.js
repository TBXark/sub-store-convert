import { Hono } from 'hono'
import { parsers, produce } from "@sub-store-convert/core"

const app = new Hono()

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

async function convert(url, target, opts) {
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
                        const srv = {
                            ...proxy,
                            ...opts
                        }
                        if (srv.name) {
                            srv.name = srv.name.trim()
                        }
                        proxyList.push(srv)
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

app.get('/', (c) => {
    return c.redirect('https://github.com/TBXark/sub-store-convert', 302)
})

app.get('/sub', async (c) => {
    const opts = c.req.query()
    const target = opts.target
    const url = opts.url
    if (!target || !url) {
        return c.text('Missing target or url', 400)
    }
    delete opts.target
    delete opts.url
    try {
        const res = await convert(url, target, opts)
        return c.text(res, 200)
    } catch (e) {
        return c.text(e.message, 500)
    }
})

export default app
