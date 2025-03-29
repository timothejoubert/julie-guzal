export default defineEventHandler((event) => {
    console.log('api route', event)

    return {
        hello: 'world',
    }
})
