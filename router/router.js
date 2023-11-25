const apiRoute = require('../router/main_router');

const init = (server) => {
    server.use('/api/v1', apiRoute);
}
module.exports = {
    init: init
};