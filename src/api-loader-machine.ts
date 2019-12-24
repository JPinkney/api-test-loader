/* --------------------------------------------------------------------------------------------
 * Copyright (c) Red Hat, Inc. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as che from '@eclipse-che/plugin';

/**
 * This function looks through all the available containers and finds
 * the first one one that matches @param targetName
 *
 * @param targetName the name of the container you want to find
 */
export async function findTargetContainer(targetName: string): Promise<string | undefined> {
    try {
        const workspace = await che.workspace.getCurrentWorkspace();

        if (workspace.runtime && workspace.runtime.machines) {
            const machines = workspace.runtime.machines;
            for (const machineName in machines) {
                if (!machines.hasOwnProperty(machineName)) {
                    continue;
                }

                /**
                 * Since machineNames generally have random characters after them
                 * like vscode-javaxyz we just need to check that vscode-java is present in the container name
                 */
                if (machineName.indexOf(targetName) !== -1) {
                    return machineName;
                }

            }
        }
    } catch (e) {
        throw new Error('Unable to get list workspace containers. Cause: ' + e);
    }

    return undefined;
}