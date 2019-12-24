/* --------------------------------------------------------------------------------------------
 * Copyright (c) Red Hat, Inc. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as vscode from 'vscode';
import * as theia from '@theia/plugin';
import { findTargetContainer } from './api-loader-machine';

/**
 * This extension should be manually activated via
 *  vscode.extensions.getExtension('api-test-loader')
 * when all the projects in the workspace have been cloned
 *
 * From there it will pick up all tests in the workspace, run them,
 * and the print the results to the console
 */
export function activate(context: vscode.ExtensionContext): void {


    /**
     * We are going to need to look in the target container and then once we are in the
     * target container we need to grab all the tests and then run them in the correct
     * terminal
     */
    findTargetContainer('vscode-java').then(targetContainerName => {
        if (targetContainerName) {
            const tests = `./test/*.test.ts`;
            const mochaArgs = `mocha --require ts-node/register --colors --ui tdd ${tests}`;

            const terminalOptions: theia.TerminalOptions = {
                cwd: '/projectRoot',
                name: 'Che Tests',
                shellPath: 'sh',
                shellArgs: ['-c', mochaArgs],

                attributes: {
                    CHE_MACHINE_NAME: targetContainerName,
                    closeWidgetExitOrError: 'false',
                    interruptProcessOnClose: 'true'
                }
            };
            const terminal = theia.window.createTerminal(terminalOptions);
            terminal.show();
        }
    });

}
