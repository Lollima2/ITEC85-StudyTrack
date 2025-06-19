# Task Encryption Implementation

This document explains how sensitive task data is encrypted in the IskoTasks application.

## Overview

The following task fields are encrypted:
- Title
- Description
- Priority
- Subject

## How It Works

1. **Encryption Utility**: A utility module (`server/utils/encryption.js`) provides `encrypt` and `decrypt` functions using AES-256-CBC encryption.

2. **Mongoose Schema**: The AcadTask schema uses Mongoose getters and setters to automatically encrypt data when saving to the database and decrypt when retrieving.

3. **API Routes**: The API routes also handle encryption/decryption for direct MongoDB operations.

## Security Details

- **Encryption Algorithm**: AES-256-CBC with random initialization vectors (IV)
- **Key Storage**: The encryption key is stored in the `.env` file
- **IV Handling**: A unique IV is generated for each encrypted field and stored with the encrypted data

## Implementation Notes

- The encryption key should be kept secure and not committed to version control
- In production, consider using a key management service
- The IV is prepended to the encrypted data with a separator (':') for decryption

## Technical Implementation

1. Data is encrypted before storage:
   ```javascript
   // When saving a task
   title: encrypt(title)
   ```

2. Data is decrypted when retrieved:
   ```javascript
   // When retrieving a task
   title: decrypt(task.title)
   ```

3. The Mongoose schema handles this automatically:
   ```javascript
   title: {
     type: String,
     required: true,
     trim: true,
     set: encrypt,
     get: decrypt
   }
   ```