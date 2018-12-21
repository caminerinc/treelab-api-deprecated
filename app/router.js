'use strict';
module.exports = app => {
    const { router, ctx } = app;

    router.get('/api/health-check', ctx => {ctx.body = 'Connection establishedsadadsdsd3345345'});
};