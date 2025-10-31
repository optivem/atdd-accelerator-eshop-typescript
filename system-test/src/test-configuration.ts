import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

interface Config {
  test: {
    eshop: {
      baseUrl: string;
    };
    wait: {
      seconds: number;
    };
  };
}

export class TestConfiguration {
  private static config: Config;

  static {
    const configPath = path.join(__dirname, '../config/application.yml');
    const fileContents = fs.readFileSync(configPath, 'utf8');
    TestConfiguration.config = yaml.load(fileContents) as Config;
  }

  static getBaseUrl(): string {
    return TestConfiguration.config.test.eshop.baseUrl;
  }

  static getWaitSeconds(): number {
    return TestConfiguration.config.test.wait.seconds;
  }
}
