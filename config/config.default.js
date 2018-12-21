module.exports = {
    port: 9000,
    postgres: {
        username: "node_user",
        password: "node_password",
        database: "intelligarm_db",
        host: "127.0.0.1",
        dialect: "postgres"
    },
    middleware: ['errHandle']
};