module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Templates',
      [
        {
          id: '1',
          name: 'Extraction',
          data: `[{"name": "Rules", "fields": [{"name": "page_nums", "type": "text", "values": ["", "", ""], "typeOptions": null}, {"name": "Field 12", "type": "progress", "values": [], "typeOptions": null}, {"name": "url", "type": "multipleAttachment", "values": [], "typeOptions": null}, {"name": "file_type", "type": "select", "values": [], "typeOptions": {"choices": {"2993bba0-3387-11e9-8689-7916ec4f87b9": {"id": "2993bba0-3387-11e9-8689-7916ec4f87b9", "name": "img", "color": "blue"}, "2c0ea6b0-3387-11e9-8689-7916ec4f87b9": {"id": "2c0ea6b0-3387-11e9-8689-7916ec4f87b9", "name": "pdf", "color": "cyan"}, "2cad0990-3387-11e9-8689-7916ec4f87b9": {"id": "2cad0990-3387-11e9-8689-7916ec4f87b9", "name": "excel", "color": "teal"}}, "choiceOrder": ["2993bba0-3387-11e9-8689-7916ec4f87b9", "2c0ea6b0-3387-11e9-8689-7916ec4f87b9", "2cad0990-3387-11e9-8689-7916ec4f87b9"]}}, {"name": "sheet", "type": "text", "values": [], "typeOptions": null}, {"name": "key", "type": "text", "values": [], "typeOptions": null}, {"name": "function_type", "type": "select", "values": [], "typeOptions": {"choices": {"1e4af060-3387-11e9-8689-7916ec4f87b9": {"id": "1e4af060-3387-11e9-8689-7916ec4f87b9", "name": "table_function", "color": "blue"}, "1fad8da0-3387-11e9-8689-7916ec4f87b9": {"id": "1fad8da0-3387-11e9-8689-7916ec4f87b9", "name": "kv_function", "color": "cyan"}, "234b74e0-3387-11e9-8689-7916ec4f87b9": {"id": "234b74e0-3387-11e9-8689-7916ec4f87b9", "name": "table_kv_function", "color": "teal"}}, "choiceOrder": ["1e4af060-3387-11e9-8689-7916ec4f87b9", "1fad8da0-3387-11e9-8689-7916ec4f87b9", "234b74e0-3387-11e9-8689-7916ec4f87b9"]}}, {"name": "location", "type": "select", "values": [], "typeOptions": {"choices": {"2083ace0-3388-11e9-be4a-09149006311e": {"id": "2083ace0-3388-11e9-be4a-09149006311e", "name": "top", "color": "blue"}, "22e2f9a0-3388-11e9-be4a-09149006311e": {"id": "22e2f9a0-3388-11e9-be4a-09149006311e", "name": "right", "color": "cyan"}, "23c28430-3388-11e9-be4a-09149006311e": {"id": "23c28430-3388-11e9-be4a-09149006311e", "name": "left", "color": "teal"}, "24c3eea0-3388-11e9-be4a-09149006311e": {"id": "24c3eea0-3388-11e9-be4a-09149006311e", "name": "bottom", "color": "green"}}, "choiceOrder": ["2083ace0-3388-11e9-be4a-09149006311e", "22e2f9a0-3388-11e9-be4a-09149006311e", "23c28430-3388-11e9-be4a-09149006311e", "24c3eea0-3388-11e9-be4a-09149006311e"]}}, {"name": "engine_type", "type": "select", "values": [], "typeOptions": {"choices": {"2cac9ef0-3388-11e9-be4a-09149006311e": {"id": "2cac9ef0-3388-11e9-be4a-09149006311e", "name": "clt", "color": "blue"}, "2d9c7d30-3388-11e9-be4a-09149006311e": {"id": "2d9c7d30-3388-11e9-be4a-09149006311e", "name": "ocr", "color": "cyan"}}, "choiceOrder": ["2cac9ef0-3388-11e9-be4a-09149006311e", "2d9c7d30-3388-11e9-be4a-09149006311e"]}}, {"name": "head_key", "type": "text", "values": [], "typeOptions": null}, {"name": "execute", "type": "execute", "values": [], "typeOptions": null}, {"name": "service_type", "type": "select", "values": [], "typeOptions": {"choices": {"3785fc00-3387-11e9-8689-7916ec4f87b9": {"id": "3785fc00-3387-11e9-8689-7916ec4f87b9", "name": "semantic_match", "color": "blue"}, "3a41e7b0-3387-11e9-8689-7916ec4f87b9": {"id": "3a41e7b0-3387-11e9-8689-7916ec4f87b9", "name": "similarity_match", "color": "cyan"}, "411a3970-3387-11e9-8689-7916ec4f87b9": {"id": "411a3970-3387-11e9-8689-7916ec4f87b9", "name": "complete_match", "color": "teal"}}, "choiceOrder": ["3785fc00-3387-11e9-8689-7916ec4f87b9", "3a41e7b0-3387-11e9-8689-7916ec4f87b9", "411a3970-3387-11e9-8689-7916ec4f87b9"]}}]}]`,
          createdAt: '2018-12-24T04:09:06.024Z',
          updatedAt: '2018-12-24T04:09:06.024Z',
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Templates', {
      where: { id: { $in: [1] } },
    });
  },
};
