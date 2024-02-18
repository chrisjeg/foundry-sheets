# 📗 Foundry Sheets

> Google Sheets Addon for Palantir Foundry Sync

This Google Apps Script enables automated data transfer from Google Sheets to Palantir Foundry upon editing any row in a Sheet using Foundry's [CDC capabilities](https://www.palantir.com/docs/foundry/data-integration/change-data-capture/). It uses Foundry's API to send updated rows directly to a specified dataset in Foundry.

## Features

- **Automatic Synchronization**: Edits made in the Google Sheet are automatically sent to the specified Palantir Foundry dataset.
- **Easy Configuration**: A sidebar in Google Sheets for easy configuration of the Foundry instance, dataset RID, and user token.

## Prerequisites

Before you start, ensure you have:

- Access to Google Sheets.
- A Palantir Foundry account with access to the dataset you want to connect.
- The dataset RID of the Foundry dataset you want to connect.
- An API token from Palantir Foundry for authentication.

## Setup Instructions

1. **Open your Google Sheet**: The sheet you want to connect to Palantir Foundry.

2. **Open the Script Editor**: From the Google Sheets menu, navigate to `Extensions > Apps Script`.

3. **Paste the Script**: Copy the provided Apps Script code into the Script Editor and save.

4. **Configure Script Properties**:

   - Go back to your Google Sheet, and you should see a new menu item named "Foundry" in the menu bar.
   - Click on `Foundry > Configure connection` to open the sidebar.
   - Enter your Foundry instance URL, dataset RID, and API token in the respective fields.
   - Click the save button for each field to store your configuration.

5. **Deploy as Web App**:

   - In the Apps Script editor, click on `Deploy > New deployment`.
   - Select `Web app`, fill in the details, and set `Who has access` to `Anyone`.
   - Click `Deploy` to finalize the setup.

6. **Installable Triggers**:

   - In the Apps Script editor, under `Triggers`, add new triggers for `onEditInstallableTrigger` and `onOpenInstallableTrigger` to run `From spreadsheet` and `On edit` or `On open` respectively.

7. **Configure dataset**:
   - Create a streaming dataset with the following configuration:
   ```yaml
   inputSchema:
     fields:
       - name: row_number
         nullable: false
         type: integer
       - name: value
         nullable: false
         type: string
       - name: isDeleted
         nullable: false
         type: boolean
       - name: timestamp
         nullable: false
         type: long
   ```

## Usage

Once setup, any edit to a row in your Google Sheet will automatically send the updated row to the specified Palantir Foundry dataset. The first row in your sheet should contain headers that match the fields expected by your Foundry dataset.

## Security

Your API token is stored securely and is only used to authenticate requests to Palantir Foundry. Ensure you have proper permissions set in Foundry to accept data from external sources.

## Troubleshooting

- **Data Not Syncing**: Ensure your API token, instance URL, and dataset RID are correctly configured.
- **Permissions Issues**: Verify that your Foundry API token has the necessary permissions for the dataset you are trying to update.
