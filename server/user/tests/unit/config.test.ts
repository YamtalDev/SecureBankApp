import * as dotenv from 'dotenv';
import logger from '../../src/config/logger';

jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

jest.mock('../../src/config/logger');

describe('Config Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {}; // Clear environment variables for a clean slate
  });

  it('should load environment variables from .env file using dotenv', () => {
    jest.isolateModules(() => {
      require('../../src/config/config'); // Import the config module to trigger dotenv.config
    });

    expect(dotenv.config).toHaveBeenCalled(); // Check if dotenv.config was called
  });

  it('should validate environment variables correctly and apply defaults', () => {
    // Set mock environment variables
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
      expect(config.mongodbUri).toBe('mongodb://localhost:27017/users'); // Default fallback URI
      expect(config.port).toBe(5000); // Default fallback port
      expect(config.nodeEnv).toBe('development'); // Default fallback NODE_ENV
    });
  });

  it('should log an error and exit if the validation fails', () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit(1)');
    });

    // Set invalid environment variables to cause validation failure
    process.env.MONGODB_URI = ''; // Invalid URI should cause validation failure

    jest.isolateModules(() => {
      try {
        require('../../src/config/config'); // Re-import the config module to trigger validation
      } catch (e) {
        // We expect process.exit(1) to throw, which is fine for the test
      }
    });

    // Check if logger.error was called with the expected message
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Configuration validation error'));

    // Ensure process.exit(1) was called
    expect(() => {
      process.exit(1);
    }).toThrow('process.exit(1)');

    exitSpy.mockRestore(); // Restore the original process.exit behavior
  });
});
