module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Templates', [
      {
        id: '1',
        name: 'Extraction',
        data: `[{"name": "Rules", "fields": [{"name": "page_nums", "type": "text", "values": ["", "", ""], "typeOptions": null}, {"name": "Field 12", "type": "progress", "values": [], "typeOptions": null}, {"name": "url", "type": "multipleAttachment", "values": [], "typeOptions": null}, {"name": "file_type", "type": "select", "values": [], "typeOptions": {"choices": {"2993bba0-3387-11e9-8689-7916ec4f87b9": {"id": "2993bba0-3387-11e9-8689-7916ec4f87b9", "name": "img", "color": "blue"}, "2c0ea6b0-3387-11e9-8689-7916ec4f87b9": {"id": "2c0ea6b0-3387-11e9-8689-7916ec4f87b9", "name": "pdf", "color": "cyan"}, "2cad0990-3387-11e9-8689-7916ec4f87b9": {"id": "2cad0990-3387-11e9-8689-7916ec4f87b9", "name": "excel", "color": "teal"}}, "choiceOrder": ["2993bba0-3387-11e9-8689-7916ec4f87b9", "2c0ea6b0-3387-11e9-8689-7916ec4f87b9", "2cad0990-3387-11e9-8689-7916ec4f87b9"]}}, {"name": "sheet", "type": "text", "values": [], "typeOptions": null}, {"name": "key", "type": "text", "values": [], "typeOptions": null}, {"name": "function_type", "type": "select", "values": [], "typeOptions": {"choices": {"1e4af060-3387-11e9-8689-7916ec4f87b9": {"id": "1e4af060-3387-11e9-8689-7916ec4f87b9", "name": "table_function", "color": "blue"}, "1fad8da0-3387-11e9-8689-7916ec4f87b9": {"id": "1fad8da0-3387-11e9-8689-7916ec4f87b9", "name": "kv_function", "color": "cyan"}, "234b74e0-3387-11e9-8689-7916ec4f87b9": {"id": "234b74e0-3387-11e9-8689-7916ec4f87b9", "name": "table_kv_function", "color": "teal"}}, "choiceOrder": ["1e4af060-3387-11e9-8689-7916ec4f87b9", "1fad8da0-3387-11e9-8689-7916ec4f87b9", "234b74e0-3387-11e9-8689-7916ec4f87b9"]}}, {"name": "location", "type": "select", "values": [], "typeOptions": {"choices": {"2083ace0-3388-11e9-be4a-09149006311e": {"id": "2083ace0-3388-11e9-be4a-09149006311e", "name": "top", "color": "blue"}, "22e2f9a0-3388-11e9-be4a-09149006311e": {"id": "22e2f9a0-3388-11e9-be4a-09149006311e", "name": "right", "color": "cyan"}, "23c28430-3388-11e9-be4a-09149006311e": {"id": "23c28430-3388-11e9-be4a-09149006311e", "name": "left", "color": "teal"}, "24c3eea0-3388-11e9-be4a-09149006311e": {"id": "24c3eea0-3388-11e9-be4a-09149006311e", "name": "bottom", "color": "green"}}, "choiceOrder": ["2083ace0-3388-11e9-be4a-09149006311e", "22e2f9a0-3388-11e9-be4a-09149006311e", "23c28430-3388-11e9-be4a-09149006311e", "24c3eea0-3388-11e9-be4a-09149006311e"]}}, {"name": "engine_type", "type": "select", "values": [], "typeOptions": {"choices": {"2cac9ef0-3388-11e9-be4a-09149006311e": {"id": "2cac9ef0-3388-11e9-be4a-09149006311e", "name": "clt", "color": "blue"}, "2d9c7d30-3388-11e9-be4a-09149006311e": {"id": "2d9c7d30-3388-11e9-be4a-09149006311e", "name": "ocr", "color": "cyan"}}, "choiceOrder": ["2cac9ef0-3388-11e9-be4a-09149006311e", "2d9c7d30-3388-11e9-be4a-09149006311e"]}}, {"name": "head_key", "type": "text", "values": [], "typeOptions": null}, {"name": "execute", "type": "execute", "values": [], "typeOptions": null}, {"name": "service_type", "type": "select", "values": [], "typeOptions": {"choices": {"3785fc00-3387-11e9-8689-7916ec4f87b9": {"id": "3785fc00-3387-11e9-8689-7916ec4f87b9", "name": "semantic_match", "color": "blue"}, "3a41e7b0-3387-11e9-8689-7916ec4f87b9": {"id": "3a41e7b0-3387-11e9-8689-7916ec4f87b9", "name": "similarity_match", "color": "cyan"}, "411a3970-3387-11e9-8689-7916ec4f87b9": {"id": "411a3970-3387-11e9-8689-7916ec4f87b9", "name": "complete_match", "color": "teal"}}, "choiceOrder": ["3785fc00-3387-11e9-8689-7916ec4f87b9", "3a41e7b0-3387-11e9-8689-7916ec4f87b9", "411a3970-3387-11e9-8689-7916ec4f87b9"]}}]}]`,
        createdAt: '2018-12-24T04:09:06.024Z',
        updatedAt: '2018-12-24T04:09:06.024Z',
      },
    ]);
    return await queryInterface.bulkInsert('Apps', [
      {
        id: '1',
        name: 'Extraction',
        templateId: 1,
        properties: `{ action: data-extraction }`,
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur mattis tellus non ornare ullamcorper. Duis ultrices, nisi quis maximus laoreet, eros velit sollicitudin enim, quis tincidunt risus sem id elit. Fusce eget lacus vitae dolor aliquet tristique ac ut mi. Duis sed nibh velit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec convallis, ligula sit amet semper varius, risus arcu rutrum urna, accumsan malesuada mi libero in nisi. Phasellus sed nulla mollis urna varius dictum. Phasellus convallis dui ut eros semper, non volutpat eros pretium. Ut leo quam, vulputate nec leo nec, vulputate iaculis orci.

Pellentesque quis mauris tellus. In vulputate gravida mi, non vestibulum quam consequat id. Aenean dictum felis non auctor fringilla. Maecenas elit lacus, iaculis ut odio id, egestas consectetur augue. Nulla iaculis augue ultricies, interdum magna nec, mollis nisi. Sed malesuada porta sagittis. Pellentesque eu vulputate lectus. Pellentesque augue est, laoreet vel condimentum at, laoreet sed dolor. Pellentesque eros velit, dictum sed fermentum ut, varius id turpis. Donec vestibulum ligula ac massa consectetur cursus. Pellentesque venenatis quam velit, id volutpat leo accumsan vel. Praesent ligula ante, volutpat molestie sapien at, aliquam tristique tortor. Vivamus ut nunc justo. Aliquam erat volutpat. Phasellus risus sapien, gravida id molestie nec, accumsan varius purus.`,
        createdAt: '2018-12-24T04:09:06.024Z',
        updatedAt: '2018-12-24T04:09:06.024Z',
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Templates', {
      where: { id: 1 },
    });
    return await queryInterface.bulkDelete('Apps', {
      where: { id: 1 },
    });
  },
};
