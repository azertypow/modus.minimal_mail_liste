import {Router, Application} from 'jsr:@oak/oak'
import openKv = Deno.openKv;
import {isAPIMailListPost} from "./types.validation.ts";

// options
const PORT = 8000

const app = new Application()
const router = new Router()

const kv = await openKv()

router
    .post('/api/mail_list/add', async (ctx) => {
        try {

            if( !ctx.request.hasBody ) {

                ctx.response.status = 400
                ctx.response.body = {
                    success: false,
                    error: 'No body provided',
                } satisfies APIResponse

                return
            }

            const body = ctx.request.body

            if( body.type() !== 'json' ) {
                ctx.response.status = 400
                ctx.response.body = {
                    error: 'Body is not json',
                    success: false,
                } satisfies APIResponse

                return
            }

            const data: unknown = await body.json()

            if( !isAPIMailListPost(data) ) {

                ctx.response.status = 400
                ctx.response.body = {
                    success: false,
                    error: 'Invalid body type',
                } satisfies APIResponse

                return
            }

            const userId = crypto.randomUUID()

            await kv.set(["mail_list", userId], {
                data,
                createdAt: new Date().toISOString()
            })

            ctx.response.status = 200
            ctx.response.body = {
                error: null,
                success: true,
                data: {
                    message: `Nous vous enverons une notification sur ${data.email}&nbsp;!`
                }
            } satisfies APIResponse

            return
        }
        catch (e) {
            console.error('Error: ', e)
            ctx.response.status = 500
            ctx.response.body = {
                error: 'Internal Server Error',
                success: false,
            } satisfies APIResponse
            return
        }
    })
    .get("/api/mail_list/list", async (context) => {
        const mail_list: unknown[] = [];
        for await (const entry of kv.list({ prefix: ["mail_list"] })) {
            mail_list.push({
                id: entry.key[1],
                ...(entry.value as Record<string, unknown>)
            });
        }
        context.response.body = mail_list;
    })
    .get("/", (context) => {
        context.response.body = "Service ready to receive emails on /api/mail_list/add";
    })

app.use(router.routes())
app.use(router.allowedMethods())

console.log(`Listening on port ${PORT}`)
await app.listen({port: PORT})
