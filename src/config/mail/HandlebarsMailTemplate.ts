import handlebars from 'handlebars';
import fs from 'fs';

interface IParseTemplate {
  template: string;
  variables: Record<string, string | number>;
}
class HandlebarsMailTemplate {
  public async parse({ template, variables }: IParseTemplate): Promise<string> {
    const templateContent = await fs.promises.readFile(template, {
      encoding: 'utf-8',
    });
    const parseTemplate = handlebars.compile(templateContent);

    return parseTemplate(variables);
  }
}

export default HandlebarsMailTemplate;
