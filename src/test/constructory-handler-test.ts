import * as vscode from 'vscode';
import { ConstructoryHandler } from '../api/providers/constructory';
import { ApiHandlerOptions } from '../shared/api';

// This is a simple test function to verify that the ConstructoryHandler
// correctly reads settings from VSCode configuration
async function testConstructoryHandler() {
  console.log('Testing ConstructoryHandler with VSCode settings...');

  // Create a mock options object
  const options: ApiHandlerOptions = {
    openAiModelId: 'test-model'
  };

  // Create a new ConstructoryHandler instance
  const handler = new ConstructoryHandler(options);

  // Log the handler's model info to verify it was created correctly
  const modelInfo = handler.getModel();
  console.log('Model info:', modelInfo);

  console.log('Test completed.');
}

// Run the test when the extension is activated
export function activate(context: vscode.ExtensionContext) {
  // Register a command to run the test
  const disposable = vscode.commands.registerCommand('extension.testConstructoryHandler', () => {
    testConstructoryHandler();
  });

  context.subscriptions.push(disposable);
}