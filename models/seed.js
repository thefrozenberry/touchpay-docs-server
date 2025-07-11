const mongoose = require('mongoose');
const ApiDoc = require('./ApiDoc');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/apidocs';

const seedData = [
  {
    _id: 'update-batch-job',
    title: 'Speech API',
    subtitle: 'Batch Processing',
    api_title: 'Update Batch Job',
    method: 'PATCH',
    endpoint: '/v1/speech/batch/{batchId}',
    endpoint_description: 'Update a batch job by ID',
    description: 'Allows updating the parameters or status of a batch speech job.',
    request_body: {
      status: 'string',
      parameters: {
        type: 'object',
        properties: {
          language: { type: 'string' },
          priority: { type: 'string' }
        }
      }
    },
    response_body: {
      success: true,
      data: {
        batch_id: 'batch_123456',
        status: 'paused',
        updated_at: '2024-01-01T12:00:00Z',
        config: {
          language: 'en-US',
          priority: 'high'
        }
      },
      message: 'Batch job updated successfully'
    },
    path_parameters: [
      { name: 'batchId', type: 'string', required: true, description: 'The ID of the batch job' }
    ],
    accessToken: 'required',
    accessRole: 'admin'
  },
  {
    _id: 'create-batch-job',
    title: 'Speech API',
    subtitle: 'Batch Processing',
    api_title: 'Create Batch Job',
    method: 'POST',
    endpoint: '/v1/speech/batch',
    endpoint_description: 'Create a new batch job',
    description: 'Creates a new batch speech processing job.',
    request_body: {
      files: ['string'],
      config: {
        type: 'object',
        properties: {
          language: { type: 'string' }
        }
      }
    },
    response_body: {
      success: true,
      data: {
        batch_id: 'batch_789012',
        status: 'created',
        created_at: '2024-01-01T12:00:00Z',
        files_count: 5,
        estimated_duration: '2 hours'
      },
      message: 'Batch job created successfully'
    },
    path_parameters: [],
    accessToken: 'required',
    accessRole: 'admin'
  },
  {
    _id: 'get-batch-job',
    title: 'Speech API',
    subtitle: 'Batch Processing',
    api_title: 'Get Batch Job',
    method: 'GET',
    endpoint: '/v1/speech/batch/{batchId}',
    endpoint_description: 'Retrieve a batch job by ID',
    description: 'Fetches the details of a specific batch speech job.',
    request_body: {},
    response_body: {
      success: true,
      data: {
        batch_id: 'batch_123456',
        status: 'processing',
        created_at: '2024-01-01T10:00:00Z',
        updated_at: '2024-01-01T11:30:00Z',
        progress: 75,
        files: [
          {
            file_id: 'file_001',
            name: 'audio1.wav',
            status: 'completed',
            transcript: 'Hello world...'
          }
        ],
        config: {
          language: 'en-US',
          enhanced_model: true,
          speaker_detection: true
        }
      }
    },
    path_parameters: [
      { name: 'batchId', type: 'string', required: true, description: 'The ID of the batch job' }
    ],
    accessToken: 'required',
    accessRole: 'user'
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await ApiDoc.deleteMany({});
    await ApiDoc.insertMany(seedData);
    console.log('Seeded ApiDoc collection.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed(); 