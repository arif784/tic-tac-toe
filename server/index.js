const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema } = require('graphql');
const {
    RootQueryType,
    RootMutationType,
} = require('./graphQl');
const app = express();

app.use(bodyParser.json());
app.use(express.static(`${process.cwd()}/dist/tic-tac-toe/`));

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}))

app.get('*', (req, res) => {
    res.sendFile(`${process.cwd()}/dist/tic-tac-toe/index.html`);
});

app.listen(3000, () => console.log('server running on port 3000'));