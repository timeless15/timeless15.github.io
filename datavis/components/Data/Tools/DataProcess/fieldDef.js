/**
 * 判断每个字段的数据类型
 * @param {Object} schema 统计的数据
 */
function buildDataField(schema) {
  const keys = Object.keys(schema);
  const fieldDefs = [];
  keys.forEach((key) => {
    const fieldSchema = schema[key];
    const { type } = fieldSchema;
    fieldDefs.push({
      field: key,
      type
    });
  });
  return fieldDefs;
}

export default buildDataField;
