export class Validation {
  static validate(schema, data) {
    return schema.parse(data)
  }
}
