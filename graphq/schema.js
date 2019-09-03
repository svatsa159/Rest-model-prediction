const { makeExecutableSchema } = require('graphql-tools')
const { GraphQLUpload } = require('graphql-upload')

const typeDefs = `
  scalar Upload
`

const resolvers = {
  Upload: GraphQLUpload
}

export const schema = makeExecutableSchema({ typeDefs, resolvers })
