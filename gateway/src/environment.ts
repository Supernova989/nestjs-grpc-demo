import { bgRedBright as bgRB } from 'chalk';
import { plainToInstance, Transform } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsUrl,
  validateSync,
} from 'class-validator';

export class EnvironmentVariables {
  constructor(values: Record<string, any>) {
    for (const key in values) {
      if (!Object.hasOwn(this, key)) {
        continue;
      }
      this[key] = values[key];
    }
  }

  @IsUrl({ require_tld: false })
  @IsNotEmpty()
  readonly MS_AUTHENTICATION_URL: string;

  @IsDefined()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  readonly PORT: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: false,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });
  if (errors.length > 0) {
    const output = errors.map((e: any) => {
      let text = `Field ${e.property}:\n`;
      const keys = Object.keys(e.constraints);
      keys.forEach((key) => {
        text += `\t- ${e.constraints[key]}\n`;
      });
      return text;
    });
    throw new Error(
      [
        bgRB('Make sure all the ENV vars are provided and valid!'),
        output.join('\n'),
      ].join('\n'),
    );
  }
  return new EnvironmentVariables(validatedConfig);
}
