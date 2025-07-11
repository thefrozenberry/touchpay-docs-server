const mongoose = require('mongoose');

const PathParameterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  required: { type: Boolean, required: true },
  description: { type: String, required: true }
}, { _id: false });

const ApiDocSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // slug identifier
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  api_title: { type: String, required: true },
  method: { type: String, required: true, enum: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'] },
  endpoint: { type: String, required: true },
  endpoint_description: { type: String, required: true },
  description: { type: String, required: true },
  request_body: { type: Object, required: false },
  request_body_schema: { type: Object, required: false },
  response_body: { type: Object, required: false },
  path_parameters: { type: [PathParameterSchema], required: false },
  accessToken: { type: String, required: true, enum: ['required', 'not required'] },
  accessRole: { type: String, required: true, enum: ['admin', 'superadmin', 'user', 'employee', 'none'] }
}, { timestamps: true });

module.exports = mongoose.model('ApiDoc', ApiDocSchema); 