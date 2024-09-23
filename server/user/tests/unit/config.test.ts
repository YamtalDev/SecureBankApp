import * as dotenv from 'dotenv';

import logger from '../../src/config/logger';

jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

jest.mock('../../src/config/logger');

describe('Config Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {};
  });

  it('should load environment variables from .env file using dotenv', () => {
    jest.isolateModules(() => {
      require('../../src/config/config');
    });

    expect(dotenv.config).toHaveBeenCalled();
  });

  it('should validate environment variables correctly and apply defaults', () => {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/testdb';
    process.env.PORT = '3000';
    process.env.NODE_ENV = 'development';

    jest.isolateModules(() => {
      const { config } = require('../../src/config/config');
      expect(config.mongodbUri).toBe('mongodb://localhost:27017/testdb');
      expect(config.port).toBe(3000);
      expect(config.nodeEnv).toBe('development');
    });
  });

  it('should use default values when environment variables are not provided', () => {
    delete process.env.MONGODB_URI;
    delete process.env.PORT;
    delete process.env.NODE_ENV;

    jest.isolateModules(() => {
      const { config } = require('../../src/config/config');
      expect(config.mongodbUri).toBe('mongodb://localhost:27017/users');
      expect(config.port).toBe(5000);
      expect(config.nodeEnv).toBe('development');
    });
  });

  it('should log an error and exit if the validation fails', () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit(1)');
    });

    process.env.MONGODB_URI = '';

    jest.isolateModules(() => {
      try {
        require('../../src/config/config');
      } catch (e) {
      }
    });

    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Configuration validation error'));

    expect(() => {
      process.exit(1);
    }).toThrow('process.exit(1)');

    exitSpy.mockRestore();
  });
});
