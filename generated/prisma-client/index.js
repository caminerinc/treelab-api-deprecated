"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "User",
    embedded: false
  },
  {
    name: "Bases",
    embedded: false
  },
  {
    name: "Tables",
    embedded: false
  },
  {
    name: "Fields",
    embedded: false
  },
  {
    name: "FieldTypes",
    embedded: false
  },
  {
    name: "Records",
    embedded: false
  },
  {
    name: "FieldValues",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `http://localhost:5432`
});
exports.prisma = new exports.Prisma();
