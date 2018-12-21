'use strict';

module.exports = router => {
    router.get('/api/health-check', ctx => {ctx.body = 'Connection established'});
};