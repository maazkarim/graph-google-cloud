import fs from 'fs';

class ErrorLogger {
  private static instance: ErrorLogger;

  private constructor() {}

  private errors: { [service: string]: Set<string> } = {};

  public static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  public logError(service: string, error: string): void {
    if (!this.errors[service]) {
      this.errors[service] = new Set<string>();
      // If it's the first error for this service, write the entire object to the file
      this.exportErrorsToFile();
    }

    // Add the error to the set if it is not already present
    if (!this.errors[service].has(error)) {
      this.errors[service].add(error);
      this.appendErrorToFile(service, error);
    }
  }

  public getErrors(service: string): string[] {
    return Array.from(this.errors[service] || []);
  }

  public getAllErrors(): { [service: string]: string[] } {
    const allErrors: { [service: string]: string[] } = {};
    for (const service in this.errors) {
      allErrors[service] = Array.from(this.errors[service]);
    }
    return allErrors;
  }

  public exportErrorsToFile(filePath: string = 'src/errors.json'): void {
    const allErrors = this.getAllErrors();
    fs.writeFileSync(filePath, JSON.stringify(allErrors, null, 2));
  }

  private appendErrorToFile(service: string, error: string, filePath: string = 'src/errors.json'): void {
    // Read the current file content
    let fileContent = {};
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }

    // Add the new error to the file content
    if (!fileContent[service]) {
      fileContent[service] = [];
    }
    fileContent[service].push(error);

    // Write the updated content back to the file
    fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2));
  }
}

export default ErrorLogger;
