import { autoUpdater, UpdateInfo } from 'electron-updater';
import { dialog } from 'electron';

export function checkForUpdatesAndNotify(): void {
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = true;

    autoUpdater.on('update-available', async () => {
        const { response } = await dialog.showMessageBox({
            type: 'info',
            buttons: ['Download', 'Later'],
            title: 'Update Available',
            message: 'A new version is available. Would you like to download it now?',
            detail: 'The update will be installed when you quit the application.'
        });

        if (response === 0) {
            autoUpdater.downloadUpdate();
        }
    });

    autoUpdater.on('update-downloaded', () => {
        dialog.showMessageBox({
            type: 'info',
            buttons: ['Restart', 'Later'],
            title: 'Update Ready',
            message: 'The update has been downloaded. Restart the application to apply the updates?'
        }).then(({ response }) => {
            if (response === 0) {
                autoUpdater.quitAndInstall();
            }
        });
    });

    autoUpdater.on('error', (error: Error) => {
        console.error('Update error:', error);
    });

    autoUpdater.checkForUpdates();
}
