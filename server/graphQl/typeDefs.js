const { v4: uuidv4 } = require('uuid');

const games = [];
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql');

const CellType = new GraphQLObjectType({
    name: 'Cell',
    description: 'This represents a board cell',
    fields: () => ({
        player: { type: GraphQLString },
        row: { type: GraphQLInt },
        column: { type: GraphQLInt },
    }),
});

const GameType = new GraphQLObjectType({
    name: 'Game',
    description: 'This represents a game',
    fields: () => ({
        id: { type: GraphQLString },
        gameType: { type: GraphQLString },
        cells: {
            type: new GraphQLList(CellType),
        },
    }),
});

const GameIdType = new GraphQLObjectType({
    name: 'GameId',
    description: 'This will fetch all game Ids',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLString) },
    }),
});

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        message: {
            type: GraphQLString,
            resolve: () => 'Hello Graphql',
        },
        allGames: {
            type: new GraphQLList(GameType),
            description: 'Get all games',
            resolve: () => games,
        },
        game: {
            type: GameType,
            description: 'A Single game',
            args: {
                id: { type: GraphQLString }
            },
            resolve: (parent, args) => games.find(game => game.id === args.id)
        },
        gameIds: {
            type: new GraphQLList(GameType),
            description: 'List of All Game ids',
            args: {
                gameType: { type: GraphQLString },
            },
            resolve: (parent, args) => {
                const selectedGames = games.filter(game => game.gameType === args.gameType);
                return selectedGames;
            },
        },
    })
})

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addGame: {
            type: GameType,
            description: 'Add a Game',
            args: {
                gameType: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {
                const game = { id: uuidv4(), gameType: args.gameType, cells: [] }
                games.push(game)
                return game
            }
        },
        resetGame: {
            type: GameType,
            description: 'Reset game',
            args: {
                id: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {
                const gameIndex = games.findIndex(game => game.id === args.id);
                if (gameIndex !== -1) {
                    games[gameIndex].cells = [];
                }
                return gameIndex;
            },
        },
        addMove: {
            type: CellType,
            description: 'Add a move',
            args: {
                player: { type: GraphQLNonNull(GraphQLString) },
                row: { type: GraphQLNonNull(GraphQLInt) },
                column: { type: GraphQLNonNull(GraphQLInt) },
                id: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {
                const gameIndex = games.findIndex(game => game.id === args.id);
                if (gameIndex !== -1) {
                    games[gameIndex].cells.push({
                        player: args.player,
                        row: args.row,
                        column: args.column,
                    });
                }
                return gameIndex;
            }
        },
    })
});

module.exports = {
    RootQueryType,
    RootMutationType,
}