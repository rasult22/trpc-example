import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import { createTRPCProxyClient, createWSClient, httpBatchLink, loggerLink, wsLink } from '@trpc/client'
import {AppRouter} from '../../server/index.ts'

const wsClient = createWSClient({
  url: 'ws://localhost:3000/trpc'
})

const client = createTRPCProxyClient<AppRouter>({
  links: [
    loggerLink(),
    wsLink({
      client: wsClient
    }),
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
      headers: {
        Authorization: "TOKEN"
      }
    })
]
})

async function main() {
  const result = await client.secretData.query()
  console.log(result)
  client.onUpdate.subscribe(undefined, {
    onData(id) {
      console.log('UPDATED', id)
    },
  })
}
main()


document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)


