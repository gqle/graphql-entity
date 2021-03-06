import { server } from './server'

const main = async () => {
  const { data, errors } = await server.run({ query: 'query { randomPost { author { name } } }' })

  console.log({ data, errors })
}

main().catch((err) => {
  console.log(err)
})
